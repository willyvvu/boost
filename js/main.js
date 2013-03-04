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

//Cam follow purposes
front=new THREE.Vector3(0,0,-5)
behind=new THREE.Vector3(0,3,10).normalize()

function step(){
	
	//Make the exhaust look like it's alive
	thrust.material.map.offset.y=Math.random()*0.2-0.1
	boost.material.map.offset.y=Math.random()*0.2-0.1
	//Boost ripple
	if(coolPass.uniforms.phase.value>0&&coolPass.uniforms.phase.value<1){
		coolPass.uniforms.phase.value+=d*3
	}
	else{
		if(!boosting){
			coolPass.uniforms.phase.value=0
		}
	}
	if(boosting){
		if(coolPass.uniforms.phase.value==0){
			coolPass.uniforms.phase.value=0.1
		}
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
	//Movement
	var length=velocity.length()
	var morelength=0
	if(boosting||pedal>0){//Going forwards
		if(boosting){//Going FAAAAAAST!
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
		ship.position,
		ship.matrix.rotateAxis(new THREE.Vector3(0,-1,0))
		,0,10-fall
	)
	intersections=bottomray.intersectObject(track)
	ship.updateMatrix()
	var to=false
	if(intersections.length){
		//velocity.y+=Math.max(2*(float-intersections[0].distance),(float-intersections[0].distance))
		//Bob a bit
		from=ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
		to=intersections[0].face.normal
		if(from.dot(to)>=1-climb){//Shallow enough
			ship.matrix.translate(new THREE.Vector3(0,-intersections[0].distance,0))
			var inv=new THREE.Matrix4().getInverse(ship.matrix)
			ship.matrix.rotateByAxis(
				inv.rotateAxis(from.clone().cross(to)),
				Math.acos(Math.round(from.dot(to)*100)/100)//*(1-1/(velocity.length()*0.002+1.01))
			)
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			velocity.sub(intersections[0].face.normal.clone().multiplyScalar(
				velocity.dot(intersections[0].face.normal)
			))
			//rotateAxis takes a vector and rotates it using the matrix.
			ship.matrix.translate(new THREE.Vector3(0,intersections[0].distance<=float?float:intersections[0].distance,0))
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			ship.position.getPositionFromMatrix(ship.matrix)
			//Turn to match the road normal
			if(intersections[0].distance<=float){
				fall=0
			}
		}
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
		.add(ship.matrix.rotateAxis(new THREE.Vector3(0,0,-5)).multiplyScalar(5*(1-camfollow)))
	camera.up.multiplyScalar(camfollow)
		.add(ship.matrix.rotateAxis(new THREE.Vector3(0,1,0)).multiplyScalar(1-camfollow))
	behind.multiplyScalar(camfollow)
		.add(ship.matrix.rotateAxis(new THREE.Vector3(0,3,10)).multiplyScalar(1-camfollow))
	camera.position.addVectors(ship.position,behind.clone().multiplyScalar(13-12*(camera.fov-minfov)/(180-minfov)))
	camera.lookAt(front.clone().add(ship.position))
	//camera.rotation.copy(ship.rotation)
	
	//Adjust the camera fov
	camera.fov=minfov+(maxfov-minfov)*(velocity.length()/maxspeed)
	camera.updateProjectionMatrix()
	
}
resize()
document.body.onresize=resize
document.body.onload=render
//Somehow, event listeners don't work on body :(
//Maybe it's not initialized yet?
