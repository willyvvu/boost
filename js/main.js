velocity=new THREE.Vector3()//Sum of velocities
thrust=new THREE.Vector3()//Internal thrust
external=new THREE.Vector3()//External forces
fall=0
recover=0
respawnpoint=new THREE.Matrix4()
respawning=0
savingPlace=-1
$camboost=0
boosting=0//Similar to the var pushing
flangerphase=0
alreadysaved=true
startTime=0
deltatime=1/45//0.017
ships=[]
function resize(){
	width=window.innerWidth
	height=window.innerHeight
	camera.aspect=(width)/height
	camera.updateProjectionMatrix()
	camera2.aspect=(width)/height
	camera2.updateProjectionMatrix()
	renderer.setSize(width,height)//Split Screen
	composer.setSize(width,height)//Split Screen
	coolPass.uniforms.aspect.value=camera.aspect
}
function respawn(){
	if(respawning==0){
		respawning=0.01
	}
}
//time=new Date().valueOf()
function render(){
	step()
	/*renderer.enableScissorTest(true)
	renderer.setViewport(width/4,0,width/2,height)//Split Screen
	renderer.setScissor(width/4,0,width/2,height)
	renderer.render(scene,camera,composer.renderTarget2,true)
	renderer.setViewport(-width/4,0,width,height)//Split Screen
	renderer.setScissor(0,0,width/2,height)
	composer.render()
	
	camera2.lookAt(ship.position)
	camera2.fov=2000/ship.position.distanceTo(camera2.position)
	camera2.updateProjectionMatrix()
	
	renderer.setViewport(width/4,0,width/2,height)//Split Screen
	renderer.setScissor(width/4,0,width/2,height)
	renderer.render(scene,camera2,composer.renderTarget2,true)
	renderer.setViewport(width/4,0,width,height)//Split Screen
	renderer.setScissor(width/2,0,width,height)*/
	renderer.render(scene,camera,composer.renderTarget2,true)
	//renderer.render(scene,camera)
	composer.render()
	
	//setTimeout(render,1000/2)
	window.webkitRequestAnimationFrame(render)
}
function smooth(value,target,friction){
	return value+friction*(target-value)
}
function savePlace(){
	respawnpoint.copy(ship.matrix)
	//console.log('saving place')
	return savingPlace=setTimeout(savePlace,1000)
}
function step(){
	//Lap timing
	var nowsaved=ship.position.length()<30
	if(nowsaved==true){//Energy refill
		$energy=1-energy
		if(alreadysaved==false&&startTime!=0){
			//Record the time
			addTime(new Date().valueOf()-startTime)
		}
		alreadysaved=true
	}
	else if(alreadysaved==true&&nowsaved==false){//Start the timer
		alreadysaved=false
		startTime=new Date().valueOf()
	}
	var $modelz=0
	if(!track){return}//No track? No race.
	
	gamepad()//For gamepad support
	collideStep()
	flangerphase+=0.02//For the flanger
	
	
	//Handle speedy stuff
	pushing=Math.max(0,pushing-deltatime)
	//Energy business
	if(energy>1){
		energy=1
		$energy=0
	}
	else if(energy<=0){
		respawn()
	}
	else if($energy>0){
		var deduct=Math.min($energy,$$energy)
		energy+=deduct
		$energy-=deduct
	}
	
	if(coolPass.uniforms.phase.value==0){//Ready to boost!
		if(boost>0){
			coolPass.uniforms.phase.value=0.01
			flangerphase=0//Resets the flanger
			playBoostSound()
			$camboost=0.5
			energy-=initialboostusage
		}
		if(pushing>0){
			coolPass.uniforms.phase.value=0.01
			$camboost=1
		}
	}
	else if(coolPass.uniforms.phase.value<1){//In progress
		coolPass.uniforms.phase.value+=deltatime*2
	}
	else{//Wait to stop
		coolPass.uniforms.phase.value=1
		if(boosting==0&&pushing==0){//Stop if not boosting or pushing
			coolPass.uniforms.phase.value=0
		}
	}
	fxStep()//Do cool FX related stuff
	audioStep()//Do cool auido related stuff
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
	var length=thrust.length()
	var morelength=0
	if(boost||boosting>0){//Going FAAAAAAST!
		//grip=1//Strong grip
		boosting-=Math.min(0.2,boosting)
		if(boost){
			boosting=1
		}
		if(length<boostspeed){
			morelength=0.10*(boostspeed-length)//Speed of sound is 340 m/s
		}
		energy-=boostusage
	}
	else{
		//grip=drift
		if(pushing>0){//Being pushed along
			if(length<pushspeed){
				morelength+=Math.min(0.04*(pushspeed-length),pushspeed-length)
			}
		}
		else if(accel>0){//Normal acceleration
			if(length<accelspeed){
				morelength+=Math.min(accelconst*accel,accelspeed-length)
			}
		}
	}
	if(Math.min(lbrake,rbrake)>0){//Braking?
		if(length>0){
			morelength-=Math.min(brakeconst*Math.min(lbrake,rbrake),length)
		}
	}
	if(steer!=0){//Steering
		var speedsteer=(inair?airturnratio:1)*turnspeed*(velocity.length()*0.001+1)
		ship.matrix.rotateY(-steer*speedsteer)
		ship.rotation.setEulerFromRotationMatrix(ship.matrix)
		$modelz+=-steer*speedsteer*20
		$steer-=(-steer*speedsteer*0.75)
	}
	var newvel=new THREE.Vector3(0,0,-length-morelength*(1/drift))
	thrust.copy(
		ship.matrix.rotateAxis(newvel.clone()).multiplyScalar(newvel.length()*drift)
		.add(thrust.clone().multiplyScalar(1-drift))
	)//Adjustable skid
	
	if(Math.min(lbrake,rbrake)>0){//Brake friction
		thrust.multiplyScalar(Math.pow(1-Math.min(lbrake,rbrake)*(1-brakeconst),deltatime))
	}
	thrust.multiplyScalar(Math.pow(friction,deltatime))//Thrust friction
	external.multiplyScalar(extfriction)//External friction
	
	//Left/right shift
	var left=ship.matrixWorld.rotateAxis(new THREE.Vector3(1,0,0))
	$shift=smooth($shift,-(rbrake-lbrake)*(inair?airshiftratio:1)*shiftconst,$$shift)
	velocity.addVectors(thrust.clone().applyAxisAngle(ship.matrixWorld.rotateAxis(new THREE.Vector3(0,1,0)),$shift),external)
	external.add(left.clone().multiplyScalar(-$shift*shiftconst2*(inair?airshiftratio:1)))
	$modelz+=$shift
	$steer+=$shift*0.05
	
	//Move the ship
	applyCollideStep()
	ship.position.add(velocity.clone().multiplyScalar(deltatime))
	model.updateMatrix()
	
	//Camera magic
	$steer*=0.95
	var camfollow=0.7
	front.multiplyScalar(camfollow)
		.add(model.matrixWorld.rotateAxis(new THREE.Vector3(0,0,-1)).multiplyScalar(1-camfollow))
	camera.up.multiplyScalar(camfollow)
		.add(ship.matrixWorld.rotateAxis(new THREE.Vector3(0,1,0)).multiplyScalar(1-camfollow))
	var behindplace=camera.up.clone().multiplyScalar(0.7).sub(front.clone().multiplyScalar(1+$camboost)).add(left.multiplyScalar($steer))
	behind.multiplyScalar(camfollow/2)
		.add(behindplace.multiplyScalar(1-camfollow/2))
		
	
	//Adjust the camera fov
	var speedfraction=0.75*thrust.length()/maxspeed
	$camboost=Math.floor($camboost*0.9*1000)/1000
	camera.fov=speedfraction*(addfov)+minfov+20*$camboost
	camera.updateProjectionMatrix()
	camera.position.addVectors(ship.position,behind.clone().multiplyScalar(5-2*speedfraction+2*$camboost))
	camera.lookAt(front.clone().multiplyScalar(10).add(ship.position))
	var shipfollow=0.9
	model.rotation.z=smooth(model.rotation.z,$modelz,0.2)
	model.position.multiplyScalar(0.9)
	if(Math.abs(rolling)<=0.1){//To start rolling, see collide.js
		if(rolling!=0){
			rolling=0
			roll=0
			rollboost++
		}
		model.rotation.multiplyScalar(shipfollow)
		if(roll!=0&&savingPlace==-1){
			rolling=roll>0?1:-1
			roll=0
		}
	}
	else{
		model.rotation.x*=shipfollow
		model.rotation.y*=shipfollow
		model.rotation.z=(rolling>0?1:-1)*Math.PI*(1-Math.cos(Math.PI*Math.abs(rolling)))//smooth(model.rotation.z,,0.2)
		rolling*=rollspeed
	}
	if(respawning>=1){//Back on track
		if(energy==0){
			energy=1//Fully healed
			ship.position.set(0,0,0)
			ship.rotation.set(0,0,0)
			startTime=0
			alreadySaved=true
		}
		else{
			ship.position.getPositionFromMatrix(respawnpoint)
			ship.rotation.setEulerFromRotationMatrix(respawnpoint)
		}
		thrust.set(0,0,0)
		external.set(0,0,0)
		if(fall<0){
			model.position.y=model.position.y+fall
		}
		fall=0
		respawning=0
	}
	
	else if(respawning>0){//Respawn animation
		respawning+=2*deltatime
		coolPass.uniforms.cover.value=respawning
	}
	else if(ship.position.distanceTo(track.geometry.boundingSphere.center)>track.geometry.boundingSphere.radius){//Outside
		respawning=0.01//Auto-respawn
	}
	else{//Normal
		coolPass.uniforms.cover.value=smooth(coolPass.uniforms.cover.value,0,0.05)
	}
	hudStep()
}
//Cam follow purposes
front=new THREE.Vector3(0,0,-1)
behind=camchase.clone().normalize()

resize()
window.addEventListener('resize',resize,false)
window.addEventListener('load',function(){
	document.getElementById('hudcontainer').style.display=''
	document.getElementById('loading').style.display='none'
	render()
},false)
//Somehow, event listeners don't work on body :(
//Maybe it's not initialized yet?
