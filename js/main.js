function resize(){
	width=window.innerWidth
	height=window.innerHeight
	camera.aspect=width/height
	camera.updateProjectionMatrix()
	renderer.setSize(width,height)
	composer.setSize(width,height)
	coolPass.uniforms.aspect.value=camera.aspect
}
d=0.017
//time=new Date().valueOf()
function render(){
	//d=(new Date().valueOf()-time)/1000
	//renderer.render(scene,camera)
	step()
	composer.render()
	//time+=d*1000
	//setTimeout(render,1000/2)
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
recover=0
respawnpoint=new THREE.Matrix4()
respawning=false
savingPlace=-1
function savePlace(){
	respawnpoint.copy(ship.matrix)
	//console.log('saving place')
	return savingPlace=setTimeout(savePlace,1000)
}
t=0
function step(){
	t+=0.02
	if(!track){return}
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
			t=0//Resets the flanger
			playBoost()
		}
	}
	coolPass.uniforms.damage.value=
		smooth(coolPass.uniforms.damage.value,0,0.05)
	//Exhaust behavior and other smoothing things
	thrust.material.map.offset.x=
		smooth(thrust.material.map.offset.x,boosting||pedal>0?0:-1,0.1)
	boost.material.map.offset.x=
		smooth(boost.material.map.offset.x,boosting?0:-1,0.1)
	coolPass.uniforms.boost.value=
		smooth(coolPass.uniforms.boost.value,boosting?1:0,0.1)
	audioStep()
	if(savingPlace<0){//Floating
		recover=0
		model.position.y=smooth(model.position.y,float,0.05)
	}
	else{
		model.position.y=Math.max(0,model.position.y+recover)
		recover=smooth(recover,float-model.position.y,0.05)*0.9
		recover=model.position.y==0?Math.max(0,recover):recover
	}
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
			morelength=Math.min(accel,Math.abs(maxspeed-length))//accel*(maxspeed-length)//accel*d
		}
		turnspeed=turn[0]//Fastest speed turns slower
	}
	else{//Not going at all.
		turnspeed=turn[1]//No thrust turns fastest
		grip=drift[1]//Normal grip
	}
	if(brake>0){
		if(pedal>0||boosting){//Gas and brake? Drift time!
			//morelength*=0.5//Slightly reduce gas
		}
		else{//Just brake? Friction!
			velocity.multiplyScalar(Math.pow(0.1,d))
		}
		grip=drift[2]//Drift
		turnspeed=turn[2]//Braking turns moderate, drifts
	}
	if(steer!=0){
		ship.matrix.rotateY(-steer*turnspeed*(velocity.length()*0.001+1))
		model.rotation.z+=1.5*(-steer*turnspeed)
		ship.rotation.setEulerFromRotationMatrix(ship.matrix)
	}
	model.updateMatrix()
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
	collide()
	ship.position.add(velocity.clone().multiplyScalar(d))
	
	//Have the camera follow the ship
	var camfollow=0.7//Math.pow(0.01,d)
	/*camera.position.x+=steer*turnspeed*10
	camera.position.x*=camfollow*/
	front.multiplyScalar(camfollow)
		.add(model.matrixWorld.rotateAxis(new THREE.Vector3(0,0,-1)).multiplyScalar(10*(1-camfollow)))
	camera.up.multiplyScalar(camfollow)
		.add(ship.matrixWorld.rotateAxis(new THREE.Vector3(0,1,0)).multiplyScalar(1-camfollow))
	behind.multiplyScalar(camfollow)
		.add(model.matrixWorld.rotateAxis(camchase.clone()).multiplyScalar(1-camfollow))
	camera.position.addVectors(ship.position,behind.clone().multiplyScalar(6-3*(Math.min(180,camera.fov)-minfov)/(180-minfov)))
	camera.lookAt(front.clone().add(ship.position))
	//camera.rotation.copy(ship.rotation)
	var shipfollow=0.9//Math.pow(0.01,d)
	model.rotation.multiplyScalar(shipfollow)
	//Adjust the camera fov
	camera.fov=Math.min(180,minfov+(maxfov-minfov)*(velocity.length()/maxspeed))
	camera.updateProjectionMatrix()
	if(respawning>=1){//Back on track
		ship.position.getPositionFromMatrix(respawnpoint)
		ship.rotation.setEulerFromRotationMatrix(respawnpoint)
		velocity.set(0,0,0)
		if(fall<0){
			model.position.y=model.position.y+fall
		}
		fall=0
		respawning=0
	}
	else if(respawning>0){//Respawn animation
		respawning+=2*d
		coolPass.uniforms.cover.value=respawning
	}
	else if(ship.position.distanceTo(track.geometry.boundingSphere.center)>track.geometry.boundingSphere.radius){//Outside
		respawning=0.01
	}
	else{//Normal
		coolPass.uniforms.cover.value=smooth(coolPass.uniforms.cover.value,0,0.05)
	}
	updateHud()
}
//Cam follow purposes
front=new THREE.Vector3(0,0,-1)
behind=camchase.clone().normalize()

resize()
window.addEventListener('resize',resize,false)
window.addEventListener('load',function(){
	document.getElementById('lowerright').style.display=''
	document.getElementById('loading').style.display='none'
	render()
},false)
//Somehow, event listeners don't work on body :(
//Maybe it's not initialized yet?
