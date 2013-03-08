function resize(){
	width=window.innerWidth
	height=window.innerHeight
	camera.aspect=width/height
	camera.updateProjectionMatrix()
	renderer.setSize(width,height)
	composer.setSize(width,height)
	coolPass.uniforms.aspect.value=camera.aspect
}
time=new Date().valueOf()
function render(){
	d=(new Date().valueOf()-time)/1000
	//renderer.render(scene,camera)
	step()
	document.getElementById('speed').innerHTML=Math.round(velocity.length()*speedunit)
	composer.render()
	time+=d*1000
	//setTimeout(render,1000/10)
	window.webkitRequestAnimationFrame(render)
}
function smooth(value,target,friction){
	return value+friction*(target-value)
}
function restrict(a,b){//Restricts a into the plane of b
	return a.clone().sub(b.clone().multiplyScalar(b.clone().normalize().dot(a)))
}
velocity=new THREE.Vector3()
fall=0
respawnpoint=new THREE.Matrix4()
respawning=false
savingPlace=-1
function savePlace(){
	respawnpoint.copy(ship.matrix)
	//console.log('saving place')
	return savingPlace=setTimeout(savePlace,1000)
}
function step(){
	//Make the exhaust look like it's alive
	thrust.material.map.offset.y=Math.random()*0.2-0.1
	boost.material.map.offset.y=Math.random()*0.2-0.1
	//Boost ripple
	var stillboost=coolPass.uniforms.phase.value>0&&coolPass.uniforms.phase.value<1
	if(stillboost){
		coolPass.uniforms.phase.value+=d*2
	}
	else{
		if(!boosting){
			coolPass.uniforms.phase.value=0
		}
	}
	if(boosting){
		if(coolPass.uniforms.phase.value==0){
			coolPass.uniforms.phase.value=0.1
			boostaudio.currentTime=boostaudio.startTime//Restart the boost sound and play it
			//boostaudio.play()
		}
		boostgain.gain.value=1
	}
	else{
		boostgain.gain.value=Math.round(smooth(boostgain.gain.value,boosting?1:0,0.1)*1000)/1000
		if(boostgain.gain.value<=0.1){boostaudio.pause()}
	}
	
	coolPass.uniforms.damage.value=
		smooth(coolPass.uniforms.damage.value,0,0.05)
	//Exhaust behavior
	thrust.material.map.offset.x=
		smooth(thrust.material.map.offset.x,boosting||pedal>0?0:-1,0.1)
	boost.material.map.offset.x=
		smooth(boost.material.map.offset.x,boosting?0:-1,0.1)
	coolPass.uniforms.boost.value=
		smooth(coolPass.uniforms.boost.value,boosting?1:0,0.1)
	backgroundfilter.frequency.value=Math.round(smooth(backgroundfilter.frequency.value,boosting?800:0,0.1))
	//Movement
	var length=velocity.length()
	var morelength=0
	if(boosting||pedal>0||stillboost){//Going forwards
		if(boosting||stillboost){//Going FAAAAAAST!
			grip=1//Strong grip
			morelength=0.10*(maxspeed-length)//Speed of sound is 340 m/s
		}
		else{//Normal acceleration
			grip=drift[0]
			morelength=accel*(maxspeed-length)//accel*d
		}
		turnspeed=turn[0]//Fastest speed turns slower
	}
	else{//Not going at all.
		turnspeed=turn[1]//No thrust turns fastest
		grip=drift[1]//Normal grip
	}
	if(brake>0){
		if(pedal>0||boosting){//Gas and brake? Drift time!
			morelength*=0.5//Slightly reduce gas
		}
		else{//Just brake? Friction!
			velocity.multiplyScalar(Math.pow(0.1,d))
		}
		grip=drift[2]//Drift
		turnspeed=turn[2]//Braking turns moderate, drifts
	}
	if(steer!=0){
		ship.matrix.rotateY(-steer*turnspeed*(velocity.length()*0.001+1))
		ship.rotation.setEulerFromRotationMatrix(ship.matrix)
	}
	velocity.copy(
		new THREE.Vector3(0,0,-length-morelength*(1/grip))
		.applyProjection(ship.matrix)
		.sub(ship.position)
		.multiplyScalar(grip)
		.add(velocity.clone().multiplyScalar(1-grip))
	)//Adjustable skid
	if(!(boosting||pedal>0)){//Now handle friction
		velocity.multiplyScalar(Math.pow(friction,d))
	}
	
	//Move the ship
	bottomray=new THREE.Raycaster(
		new THREE.Vector3(0,2,0).applyProjection(ship.matrix),
		ship.matrix.rotateAxis(new THREE.Vector3(0,-1,0))
		,0,10-fall
	)
	intersections=bottomray.intersectObject(track)
	ship.updateMatrix()
	var to=false
	if(intersections.length){
		//velocity.y+=Math.max(2*(float-intersections[0].distance),(float-intersections[0].distance))
		//Bob a bit
		var dist=intersections[0].distance-2
		from=ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
		to=intersections[0].face.normal
		if(from.dot(to)>=1-climb){//Shallow enough
			ship.matrix.translate(new THREE.Vector3(0,-dist,0))
			var inv=new THREE.Matrix4().getInverse(ship.matrix)
			var rotation=new THREE.Matrix4().rotateByAxis(
				inv.rotateAxis(from.clone().cross(to)),
				Math.acos(Math.round(from.dot(to)*100)/100)
			)
			ship.matrix.multiply(rotation)
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			model.matrix.multiply(new THREE.Matrix4().getInverse(rotation))
			model.rotation.setEulerFromRotationMatrix(model.matrix)
			/*velocity.sub(intersections[0].face.normal.clone().multiplyScalar(
				velocity.dot(intersections[0].face.normal)
			))*/
			//rotateAxis takes a vector and rotates it using the matrix.
			ship.matrix.translate(new THREE.Vector3(0,dist<=float?float:dist,0))
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			ship.position.getPositionFromMatrix(ship.matrix)
			velocity.copy(restrict(velocity,to))
			//Turn to match the road normal
			if(dist<=float){//On the road
				fall=0
			}
			if(dist<=float+2){
				if(savingPlace<0){
					clearTimeout(savingPlace)
					savingPlace=savePlace()
				}
			}
			else{//Off road
				//console.log('off')
				clearTimeout(savingPlace)
				savingPlace=-1
			}
		}
	}
	else{//Off road
		//console.log('off')
		clearTimeout(savingPlace)
		savingPlace=-1
	}
	ship.matrix.translate(new THREE.Vector3(0,fall,0))
	ship.position.getPositionFromMatrix(ship.matrix)
	fall+=-9.8*d*0.1
	to=to||ship.matrix.rotateAxis(new THREE.Vector3(0,-1,0))
	//Check for front collisions
	frontray=new THREE.Raycaster(
		ship.matrix.rotateAxis(new THREE.Vector3(0,0,1)).add(ship.position),
		ship.matrix.rotateAxis(new THREE.Vector3(0,0.1,-2))
		,0,10+velocity.length()*d
	)
	rightrearray=new THREE.Raycaster(
		ship.position,
		ship.matrix.rotateAxis(new THREE.Vector3(2,0.1,1))
		,0,4
	)
	leftrearray=new THREE.Raycaster(
		ship.position,
		ship.matrix.rotateAxis(new THREE.Vector3(-2,0.1,1))
		,0,4
	)
	intersections=frontray.intersectObject(track)
		.concat(leftrearray.intersectObject(track))
		.concat(rightrearray.intersectObject(track))
	intersections.sort(function(a,b){return a.distance-b.distance})
	if(intersections.length&&!intersections[0].face.normal.equals(to)){
		if(intersections[0].distance<2.5+velocity.length()*d){
			if(intersections[0].face.normal.dot(to)<climb&&intersections[0].face.normal.dot(velocity)<=0){//Wall is steep enough
				ship.position.add(restrict(intersections[0].face.normal,to).normalize()
					.multiplyScalar(2.5-intersections[0].distance))
					//Keep away
				velocity=restrict(velocity,intersections[0].face.normal)
				coolPass.uniforms.damage.value=Math.min(coolPass.uniforms.damage.value+velocity.length()*0.0005,1)
				//.add(restrict(intersections[0].face.normal,to).multiplyScalar(1))
			}
		}
	}
	ship.position.add(velocity.clone().multiplyScalar(d))
	
	//Have the camera follow the ship
	var camfollow=0.95//Math.pow(0.01,d)
	/*camera.position.x+=steer*turnspeed*10
	camera.position.x*=camfollow*/
	front.multiplyScalar(camfollow)
		.add(ship.matrixWorld.rotateAxis(new THREE.Vector3(0,0,-1)).multiplyScalar(50*(1-camfollow)))
	camera.up.multiplyScalar(camfollow)
		.add(ship.matrix.rotateAxis(new THREE.Vector3(0,1,0)).multiplyScalar(1-camfollow))
	behind.multiplyScalar(camfollow)
		.add(ship.matrix.rotateAxis(camchase.clone()).multiplyScalar(1-camfollow))
	camera.position.addVectors(ship.position,behind.clone().multiplyScalar(8-5*(Math.min(180,camera.fov)-minfov)/(180-minfov)))
	camera.lookAt(front.clone().add(ship.position))
	//camera.rotation.copy(ship.rotation)
	model.rotation.multiplyScalar(camfollow)
	//Adjust the camera fov
	camera.fov=Math.min(180,minfov+(maxfov-minfov)*(velocity.length()/maxspeed))
	camera.updateProjectionMatrix()
	if(respawning>=1){//Back on track
		ship.position.getPositionFromMatrix(respawnpoint)
		ship.rotation.setEulerFromRotationMatrix(respawnpoint)
		velocity.set(0,0,0)
		fall=0
		respawning=0
	}
	else if(respawning>0){//Respawn animation
		respawning+=1.25*d
		coolPass.uniforms.cover.value=respawning
	}
	else if(ship.position.distanceTo(track.geometry.boundingSphere.center)>track.geometry.boundingSphere.radius){//Outside
		respawning=0.01
	}
	else{//Normal
		coolPass.uniforms.cover.value=smooth(coolPass.uniforms.cover.value,0,0.05)
	}
	
}
//Cam follow purposes
front=new THREE.Vector3(0,0,-1)
behind=camchase.clone().normalize()

resize()
window.addEventListener('resize',resize,false)
window.addEventListener('load',render,false)
//Somehow, event listeners don't work on body :(
//Maybe it's not initialized yet?
