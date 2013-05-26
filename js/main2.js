window.addEventListener('load',init)
window.addEventListener('resize',resize)
mehud=document.getElementById('hudcontainer')
parseHUD(mehud)
infoelem=document.getElementById('info')
counter=document.getElementById('countdown')
/*mouse={lookx:0,looky:0,down:false}
window.onmousedown=function(ev){
	mouse.down=true
	mouse.lookx=2*ev.pageX/window.innerWidth-1
	mouse.looky=2*ev.pageY/window.innerHeight-1
	keyboard.lookx=mouse.lookx
	keyboard.looky=mouse.looky
}
window.onmouseup=function(ev){
	mouse.down=false
	mouse.lookx=0
	mouse.looky=0
	keyboard.lookx=mouse.lookx
	keyboard.looky=mouse.looky
}
window.onmousemove=function(ev){
	if(mouse.down){
		mouse.lookx=2*ev.pageX/window.innerWidth-1
		mouse.looky=2*ev.pageY/window.innerHeight-1
	}
	else{
		mouse.lookx=0
		mouse.looky=0
	}
	keyboard.lookx=mouse.lookx
	keyboard.looky=mouse.looky
}*/
clock=0
function init(){//Sets up everything, provided that we are all loaded and ready to go
	time=0
	zone=false
	hold=true//Holds in place before a race
	paused=false//Paused
	racing=false//Cinematics
	lapTarget=3
	emphit=[]
	empwave=emprange
	emppos=new THREE.Vector3()
	empowner=null
	
	shipcolliders=[]
	padcolliders=[]
	rescolliders=[]
	residuals=[]
	exported=[]
	emitters=[]
	missiles=[]
	initCore()//Camera, renderer, scene
	initAudio()
	initTrack()//Track
	initPads()//Boost pads
	initLights()//Let there be light!
	initSky()//And a sky
	initFlare()//Lensflare
	initParticles()
	initBeforeRace()
	initShips()
	initShadow()
	countdown=4
	document.getElementById('loading').style.display='none'
	render()
}
function initBeforeRace(){
	flyover=new THREE.Object3D()
	flyphase=330
	flyover.eulerOrder='YXZ'
	scene.add(flyover)
	flyover.add(camera)
}
function startRace(){
	camera.position.set(0,0,0)
	camera.rotation.set(0,Math.PI,0)
	me.camera.add(camera)
	
	racing=true
	paused=false
	//All set and ready to go. Wait to start.
}
function initCore(){
	container=document.getElementById('container')
	try{
		renderer=new THREE.WebGLRenderer({antialias:true})
	}
	catch(e){
		alert(':( Uh oh. We have a problem that could be any of the below.\n\n1. You are not using a supported browser. Chrome is preferred.\n2. If you are using Chrome, WebGL could be disabled due to unknown or insufficient hardware.\n3. Your graphics card does not support WebGL. Can\'t help you there.')
	}
	renderer.autoClear=false
	var maxaniso=renderer.getMaxAnisotropy()
	for(var c in resource){
		resource[c].anisotropy=maxaniso
	}
	composer=new THREE.EffectComposer(renderer)
	//composer.addPass(scalePass)
	//composer.addPass(savePass)
	composer.addPass(coolPass)
	coolPass.renderToScreen=true
	
	composer.renderTarget1.format=THREE.RGBAFormat
	composer.renderTarget2.format=THREE.RGBAFormat
	
	container.appendChild(renderer.domElement)
	camera=new THREE.PerspectiveCamera(minfov,0,near,far)
	//camera.position.copy(camchase)
	camera2=new THREE.PerspectiveCamera(minfov,0,near,far)
	//camera2.position.set(50,100,0)
	scene=new THREE.Scene()
	//scene.add(camera)
	//scene.add(camera2)
	projector=new THREE.Projector()
	
	resize()
}
function resize(){
	width=window.innerWidth
	height=window.innerHeight
	camera.aspect=width/height
	camera.updateProjectionMatrix()
	camera2.aspect=width/height
	camera2.updateProjectionMatrix()
	renderer.setSize(width,height)//Split Screen
	composer.setSize(width,height)//Split Screen
	coolPass.uniforms.resolution.value.set(width,height)
	//savePass.renderTarget.width=width
	//savePass.renderTarget.height=height
}
function initTrack(){
	trackcollide=resource.trackcollide
	trackcollide.material=new THREE.MeshBasicMaterial()
	trackcollide.geometry.boundingBox={"min":{"x":-1118.22,"y":-852.637,"z":-650.0680232095956},"max":{"x":1118.008102511154,"y":696.233,"z":896.6183242978626}}
	trackcollide.visible=false
	scene.add(trackcollide)
	trackclosecollide=resource.trackclosecollide
	trackclosecollide.material=new THREE.MeshBasicMaterial()
	trackclosecollide.visible=false
	scene.add(trackclosecollide)
	autonav=resource.autonav
	autonav.material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide})
	autonav.visible=false
	scene.add(autonav)
	centernav=resource.centernav
	centernav.material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide})
	centernav.visible=false
	scene.add(centernav)
	currenttrack.init()
}
function initPads(){
	boostpads=[]
	for(var p=0;p<currenttrack.pads.length;p++){
		var place=currenttrack.pads[p]
		addBoostPad(place.position,place.rotation,place.powerup)
	}
}
function initLights(){
	lightSource=new THREE.Vector3(-6452.946084495651,2955.202170343886,7044.591326896616)
	
	//Lights, camera, action!
	ambient=new THREE.AmbientLight(0x555555)
	scene.add(ambient)
	directional=new THREE.DirectionalLight(0xFFFFFF,1.0)
	scene.add(directional)
}
function initShadow(){
	renderer.shadowMapEnabled=true
	
	//track.castShadow=true
	track.receiveShadow=true
	//structure.castShadow=true
	//structure.receiveShadow=true
	me.hull.castShadow=true
	//me.hull.receiveShadow=true
	//you.hull.castShadow=true
	//you.hull.receiveShadow=true
	
	directional.castShadow=true
	directional.shadowDarkness = 0.8
	directional.shadowMapSoft = true;
	//directional.shadowCameraVisible = true;
	directional.shadowCameraRight     =  5;
	directional.shadowCameraLeft      = -5;
	directional.shadowCameraTop       =  5;
	directional.shadowCameraBottom    = -5;
}
function initSky(){
	if(!zone){
		resource.skyMat.uniforms.tCube.value=resource.skyTex
		skyBox=new THREE.Mesh(new THREE.CubeGeometry(-100000,-100000,-100000,1,1,1),resource.skyMat)
		scene.add(skyBox)
	}
}
function initFlare(){
	var flareColor=new THREE.Color(0xFFFF66)

	flare = new THREE.LensFlare( resource.flareTex, 700, 0.0, THREE.AdditiveBlending);
	flare.position.copy(lightSource)

	flare.add( resource.flareTex1, 40, 0.2, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 50, 0.4, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 20, 0.45, THREE.AdditiveBlending, flareColor);

	flare.add( resource.flareTex1, 60, 0.6, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 70, 0.7, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 120, 0.9, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 70, 1.0, THREE.AdditiveBlending, flareColor);
	flare.customUpdateCallback=flareCallback
	scene.add(flare);
}
function initParticles(){
	//Sparks
	currentspark=0
	sparks=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.sparkMat
	)
	for(var c=0;c<256;c++){
		var vertex=new THREE.Vector3(0,0,0)
		vertex.velocity=new THREE.Vector3(0,0,0)
		vertex.opacity=0
		vertex.color=0
		sparks.geometry.vertices.push(vertex)
		sparks.geometry.colors.push(new THREE.Color(0x000000))
	}
	scene.add(sparks)
	
	//Fragments
	currentfragment=0
	fragments=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.fragmentMat
	)
	for(var c=0;c<256;c++){
		var vertex=new THREE.Vector3(0,0,0)
		vertex.velocity=new THREE.Vector3(0,0,0)
		fragments.geometry.vertices.push(vertex)
		resource.fragmentMat.attributes.phase.value.push(Math.floor(Math.random()*16))
		resource.fragmentMat.attributes.opacity.value.push(0)
	}
	resource.fragmentMat.attributes.phase.needsUpdate=true
	resource.fragmentMat.attributes.opacity.needsUpdate=true
	scene.add(fragments)
	
	//Smoke
	currentsmoke=0
	smoke=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.smokeMat
	)
	for(var c=0;c<1024;c++){
		var vertex=new THREE.Vector3(0,-1000000,0)
		vertex.velocity=new THREE.Vector3(0,0,0)
		smoke.geometry.vertices.push(vertex)
		resource.smokeMat.attributes.opacity.value.push(0)
	}
	resource.smokeMat.attributes.opacity.needsUpdate=true
	scene.add(smoke)
	
	currentresidue=0
	residualsystem=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.residueMat
	)
	for(var c=0;c<100;c++){
		var vertex=new THREE.Vector3(0,0,0)
		residualsystem.geometry.vertices.push(vertex)
		resource.residueMat.attributes.exploding.value.push(0)
		resource.residueMat.attributes.phase.value.push(Math.random())
	}
	resource.residueMat.attributes.exploding.needsUpdate=true
	resource.residueMat.attributes.phase.needsUpdate=true
	scene.add(residualsystem)
}
function initShips(){
	ships=[]
	
	me=new Ship()
	ships.push(me)
	scene.add(me.main)
	me.main.position.set(3,5,200)
	
	you=new Ship()
	ships.push(you)
	scene.add(you.main)
	you.main.position.set(-3,5,180)
	for(var s=1;s<=0;s++){
		u=new Ship()
		ships.push(u)
		scene.add(u.main)
		u.main.position.set(s%2==0?-3:3,5,180-20*s)
	}
	//camera.rotation.y=Math.PI
	//me.camera.add(camera)
	//camera2.rotation.y=Math.PI
	//you.camera.add(camera2)
}
function render(){
	if(!paused){
		clock++
		if(!hold){
			time++
		}
	}
	gamepad()
	me.controller=controllers[0]||keyboard
	/*if(me.controller===controllers[0]&&mouse.down){
		me.controller.lookx=mouse.lookx//Be able to look
		me.controller.looky=mouse.looky
	}*/
	//you.controller=controllers[1]||keyboard2
	for(var s=0;s<ships.length;s++){
		ships[s].simulate()
	}
	me.updateHUD(mehud,camera)
	if(!racing){
		if(flyphase%20>10){
			flyover.position.set(0,0,0)
			camera.position.set(0,0,1200+200*Math.sin(flyphase*0.1/Math.SQRT2))
			flyover.rotation.set(Math.sin(flyphase*0.1)*0.4-0.6,flyphase*0.1,0)
		}else{
			flyover.position.set(0,0,25)
			camera.position.set(0,0,20)
			flyover.rotation.set(Math.sin((flyphase+233248)*0.1)*0.1-0.2,(flyphase+2348)*0.1,0)
		}
		flyphase+=deltatime
		var control=controllers[0]||keyboard
		if(control.accel!=0){
			startRace()
		}
	}
	if(!paused){
		fxStep()
		simulateParticles()
	}
	if(false){
		renderer.enableScissorTest(true)
		renderer.setViewport(width/4,0,width/2,height)//Split Screen
		renderer.setScissor(width/4,0,width/2,height)
		renderer.render(scene,camera,composer.renderTarget2,true)
		renderer.setViewport(-width/4,0,width,height)//Split Screen
		renderer.setScissor(0,0,width/2,height)
		coolPass.uniforms.motionblur.value=me.uniforms.motionblur
		me.copyUniforms(coolPass.uniforms)
		composer.render()
		
		renderer.setViewport(width/4,0,width/2,height)//Split Screen
		renderer.setScissor(width/4,0,width/2,height)
		renderer.render(scene,camera2,composer.renderTarget2,true)
		renderer.setViewport(width/4,0,width,height)//Split Screen
		renderer.setScissor(width/2,0,width,height)
		you.copyUniforms(coolPass.uniforms)
		composer.render()
		
		/*me.copyUniforms(coolPass.uniforms)
		renderer.setViewport(0,0,width/2,height)
		renderer.render(scene,camera,composer.renderTarget2,true)
		composer.render()
		
		you.copyUniforms(coolPass.uniforms)
		renderer.setViewport(width/2,0,width/2,height)
		renderer.render(scene,camera2,composer.renderTarget2,true)
		composer.render()*/
		
	}
	else{
		renderer.render(scene,camera,composer.renderTarget2,true)
		composer.render()
		//renderer.render(scene,camera)
	}
	audioStep(me,camera)
	window.webkitRequestAnimationFrame(render)
}
function audioStep(ship,camera){
	if(ship.soundNode){
		ship.sound.setVolume(3)
		var environmentTarget,musicTarget
		if(ship.finish){
			environmentTarget=0.1
			musicTarget=0.8
		}
		else if(ship.energy<=0.3){
			if(ship.energy<=0){
				environmentTarget=0.1
				musicTarget=0.1
			}
			else{
				environmentTarget=0.4
				musicTarget=0.4
			}
			if(ship.energy<0.15&&clock%15==0){
				resource.chimeSound.play()
			}
			else if(clock%30==0){
				resource.chimeSound.play()
			}
		}
		else{
			environmentTarget=1
			musicTarget=1
		}
		environmentNode.gain.value=lerp(environmentNode.gain.value,environmentTarget,0.1)
		musicNode.gain.value=lerp(musicNode.gain.value,musicTarget,0.1)
		shieldNode.frequency.lerp=lerp(shieldNode.frequency.lerp,ship.finish?0:ship.shield.material.opacity,0.1)
		shieldNode.frequency.value=Math.pow(10,2.8+(1-shieldNode.frequency.lerp))
		shieldNode.type=shieldNode.frequency.lerp>0.01?shieldNode.LOWPASS:shieldNode.ALLPASS
	}
	var inv=new THREE.Matrix4().getInverse(camera.matrixWorld)
	for(var s=0;s<ships.length;s++){
		if(ships[s]!==ship&&ships[s].energy>0){
			var delta=ships[s].main.position.clone().applyProjection(inv)
			delta.len=delta.length()
			delta.multiplyScalar(0.008)
			ships[s].sound.setPan(delta.x,delta.y,delta.z)
		}
		if(ships[s].soundNode){
			ships[s].sound.setVolume(ships[s].energy<=0?0:ships[s]===me?3:4)
			ships[s].soundNode.playbackRate.value=clamp(ships[s].enginetemp*0.2+0.8,0.8,1.2)
		}
	}
}
function fxStep(){
	//Shadows
	directional.target=me.main
	directional.position.copy(lightSource).multiplyScalar(0.01).add(me.main.position)
	
	//Uniforms
	if(racing){me.copyUniforms(coolPass.uniforms)}
	//scalePass.uniforms.backbuffer.value=savePass.renderTarget
	
	//Trippy Colors
	var amt=1-((clock+100)%150)/150
	var linepos=amt*1000-100
	resource.zoneMaterial.uniforms.line.value=
	resource.zoneTrackMaterial.uniforms.line.value=linepos*(Math.abs(linepos)*0.01+1)

	resource.trackMaterial.uniforms.wavepos.value.copy(emppos)
	resource.zoneTrackMaterial.uniforms.wavepos.value.copy(emppos)

	resource.trackMaterial.uniforms.wave.value=
	resource.zoneTrackMaterial.uniforms.wave.value=
	empwave=Math.min(empwave+10,emprange)
	if(empwave<emprange){
		for(var s=0;s<ships.length;s++){
			var dist=ships[s].main.position.distanceTo(emppos)
			if(!(ships[s]===empowner)&&dist<=empwave&&emphit.indexOf(ships[s])==-1){
				ships[s].slow(empslow)
				ships[s].hurt(emphurt)
				emphit.push(ships[s])
			}
		}
	}
	
	if((clock+100)%150==0){
		resource.zoneMaterial.uniforms.closeColor.value.copy(resource.zoneMaterial.uniforms.farColor.value)
		resource.zoneMaterial.uniforms.farColor.value.setHSL(Math.random(),1,0.5)
		resource.zoneTrackMaterial.uniforms.closeColor.value.copy(resource.zoneTrackMaterial.uniforms.farColor.value)
		resource.zoneTrackMaterial.uniforms.farColor.value.setHSL(Math.random(),1,0.5)
	}
	
	//Shield and autopilot move
	if(clock%2==0){
		if(resource.shieldTex.offset.x==0){
			resource.shieldTex.offset.x=1/4
			resource.absorbTex.offset.x=1/4
			resource.autopilotTex.offset.x=1/4
		}
		else{
			resource.shieldTex.offset.x=0
			resource.absorbTex.offset.x=0
			resource.autopilotTex.offset.x=0
		}
		resource.shieldTex.offset.y+=1/8
		resource.absorbTex.offset.y+=1/8
		resource.autopilotTex.offset.y+=1/8
		if(resource.shieldTex.offset.y>=1){
			resource.shieldTex.offset.y=0
			resource.absorbTex.offset.y=0
			resource.autopilotTex.offset.y=0
		}
	}
	resource.residueMat.uniforms.clock.value=clock*deltatime
	//Count down
	if(racing){
		countdown=Math.max(countdown-deltatime,0)
		if(countdown==0){
			hold=false
		}
	}
	var display=Math.ceil(countdown)
	resource.signTex.offset.y=display?-0.8+0.2*display:(time%20<10?-0.8:0)
}
function simulateParticles(){
	//Sparks
	var needsUpdate=false
	for(var c=0;c<sparks.geometry.vertices.length;c++){
		if(sparks.geometry.vertices[c].opacity<=0){
			continue
		}
		needsUpdate=true
		sparks.geometry.vertices[c].add(
			sparks.geometry.vertices[c].velocity.multiplyScalar(0.99))
		sparks.geometry.vertices[c].opacity-=deltatime*0.6
		sparks.geometry.colors[c].setRGB(
			(5*sparks.geometry.vertices[c].opacity),
			(5*sparks.geometry.vertices[c].opacity)*(1-sparks.geometry.vertices[c].color*0.5),
			(5*sparks.geometry.vertices[c].opacity)*(0.5-sparks.geometry.vertices[c].color*0.5)
		)
	}
	sparks.geometry.verticesNeedUpdate=needsUpdate
	sparks.geometry.colorsNeedUpdate=needsUpdate
	
	//Fragments
	needsUpdate=false
	for(var c=0;c<fragments.geometry.vertices.length;c++){
		if(resource.fragmentMat.attributes.opacity.value[c]<=0){
			continue
		}
		needsUpdate=true
		fragments.geometry.vertices[c].add(
			fragments.geometry.vertices[c].velocity.multiplyScalar(0.99))
		resource.fragmentMat.attributes.opacity.value[c]=
			Math.max(resource.fragmentMat.attributes.opacity.value[c]-deltatime*8,0)
	}
	fragments.geometry.verticesNeedUpdate=needsUpdate
	resource.fragmentMat.attributes.opacity.needsUpdate=needsUpdate
	
	//Smoke (much simpler)
	needsUpdate=false
	for(var c=0;c<smoke.geometry.vertices.length;c++){
		if(resource.smokeMat.attributes.opacity.value[c]<=0){
			continue
		}
		resource.smokeMat.attributes.opacity.value[c]=
			Math.max(0,resource.smokeMat.attributes.opacity.value[c]-deltatime)
		needsUpdate=true
		smoke.geometry.vertices[c].add(
			smoke.geometry.vertices[c].velocity.multiplyScalar(0.99))
	}
	smoke.geometry.verticesNeedUpdate=needsUpdate
	resource.smokeMat.attributes.opacity.needsUpdate=needsUpdate
	
	//Residue (even simpler)
	needsUpdate=resource.residueMat.attributes.exploding.needsUpdate
	for(var r=0;r<residualsystem.geometry.vertices.length;r++){
		if(resource.residueMat.attributes.exploding.value[r]<=0
			||resource.residueMat.attributes.exploding.value[r]>=1){
			continue
		}
		resource.residueMat.attributes.exploding.value[r]=
			Math.max(0,resource.residueMat.attributes.exploding.value[r]-deltatime*4)
		needsUpdate=true
	}
	resource.residueMat.attributes.exploding.needsUpdate=needsUpdate
	resource.residueMat.attributes.phase.needsUpdate=needsUpdate
	
	for(var c=0;c<emitters.length;c++){
		emitters[c].life-=deltatime
		if(emitters[c].life<=0){
			emitters.splice(c,1)
			c--
			continue
		}
		emitters[c].add(emitters[c].velocity)
		addSmoke(emitters[c],emitters[c].fireball)
		emitters[c].velocity.multiplyScalar(0.99)
		emitters[c].velocity.y-=0.01
	}
	for(var m=0;m<missiles.length;m++){
		missiles[m].life-=deltatime
		if(missiles[m].life<=0){
			missiles.splice(m,1)
			m--
			continue
		}
		var dist=missiles[m].velocity.length()
		var before=missiles[m].clone()
		for(var r=0;r<residuals.length;r++){
			if(residuals[r].distanceTo(missiles[m])<10){
				removeResidue(r)
				r--
			}
		}
		var solved=solveRay(missiles[m],missiles[m].velocity,dist,[trackcollide])
		addSmokeLerp(missiles[m],missiles[m].velocity,true)
		if(solved){
			missiles[m].velocity.copy(solved).multiplyScalar(dist)
		}
		else{
			for(var s=0;s<20;s++){
				addSpark(missiles[m],0.7)
			}
			missiles.splice(m,1)
			m--
		}
	}
}
