window.addEventListener('load',init)
window.addEventListener('resize',resize)
mehud=document.getElementById('hudcontainer')
infoelem=document.getElementById('info')
reticle=document.getElementById('reticle')
mouse={lookx:0,looky:0,down:false}
paused=false
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
}
function init(){//Sets up everything, provided that we are all loaded and ready to go
	initCore()//Camera, renderer, scene
	initTrack()//Track
	colliders=[]
	residuals=[]
	exported=[]
	emitters=[]
	zone=false
	initPads()//Boost pads
	initLights()//Let there be light!
	initSky()//And a sky
	initFlare()//Lensflare
	initParticles()
	initShips()
	//initShadow()
	countdown=4
	countDown()
	//All set and ready to go
	document.getElementById('hudcontainer').style.display=''
	document.getElementById('loading').style.display='none'
	render()
}
function initCore(){
	container=document.getElementById('container')
	renderer=new THREE.WebGLRenderer({clearColor:0x000000,clearAlpha:0})
	renderer.autoClear=false
	var maxaniso=renderer.getMaxAnisotropy()
	for(var c in resource){
		resource[c].anisotropy=maxaniso
	}
	composer=new THREE.EffectComposer(renderer)
	composer.addPass(scalePass)
	composer.addPass(savePass)
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
	trackcollide.geometry.computeBoundingSphere()
	trackcollide.visible=false
	scene.add(trackcollide)
	autonav=resource.autonav
	autonav.material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide})
	autonav.visible=false
	scene.add(autonav)
	track=resource.trackObj
	track.material=resource.trackMat//terrainMap
	scene.add(track)
	
	resource.objGround.material=new THREE.MeshPhongMaterial({
		map:resource.texGround
	})
	scene.add(resource.objGround)
	resource.obj0.material=new THREE.MeshPhongMaterial({
		map:resource.tex0,
		envMap:resource.skyTex
	})
	scene.add(resource.obj0)
	resource.obj1.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.tex1,
		envMap:resource.skyTex
	})
	scene.add(resource.obj1)
	resource.obj2.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.tex2
	})
	scene.add(resource.obj2)
	resource.obj3.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.tex2
	})
	scene.add(resource.obj3)
	resource.obj4.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.tex4,
		envMap:resource.skyTex
	})
	scene.add(resource.obj4)
	resource.objP.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.texP,
		envMap:resource.skyTex,
		side:THREE.DoubleSide
	})
	scene.add(resource.objP)
	resource.objP1.material=new THREE.MeshPhongMaterial({
		shininess: 10.0
	})
	scene.add(resource.objP1)
	resource.objI0.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		wireframe:true
	})
	scene.add(resource.objI0)
	resource.objI1.material=new THREE.MeshPhongMaterial({
		shininess: 10.0,
		map:resource.texI1
	})
	scene.add(resource.objI1)
	//structure=resource.structureObj
	//structure.material.materials[0].wireframe=false
	//scene.add(structure)
}
function initPads(){
	boostpads=[]
	for(var p=0;p<resource.padData.length;p++){
		var place=resource.padData[p]
		addBoostPad(place.position,place.rotation,place.powerup)
	}
}
function initLights(){
	lightSource=new THREE.Vector3(-6452.946084495651,2955.202170343886,7044.591326896616)
	
	//Lights, camera, action!
	directional=new THREE.DirectionalLight(0xFFFFFF,1.0)
	directional.position.copy(lightSource).multiplyScalar(0.01)
	scene.add(directional)
	ambient=new THREE.AmbientLight(0x555555)
	scene.add(ambient)
}
function initShadow(){
	renderer.shadowMapEnabled=true
	
	track.castShadow=true
	track.receiveShadow=true
	structure.castShadow=true
	structure.receiveShadow=true
	me.hull.castShadow=true
	me.hull.receiveShadow=true
	you.hull.castShadow=true
	you.hull.receiveShadow=true
	
	directional.castShadow=true
	directional.shadowDarkness = 0.8
	directional.shadowMapSoft = true;
	directional.shadowCameraVisible = true;
	directional.shadowCameraRight     =  50;
	directional.shadowCameraLeft      = -50;
	directional.shadowCameraTop       =  50;
	directional.shadowCameraBottom    = -50;
}
function initSky(){
	resource.skyMat.uniforms.tCube.value=resource.skyTex
	skyBox=new THREE.Mesh(new THREE.CubeGeometry(-100000,-100000,-100000,1,1,1),resource.skyMat)
	scene.add(skyBox)
}
function initFlare(){
	var flareColor=new THREE.Color(0xFFFF66)

	flare = new THREE.LensFlare( resource.flareTex, 700, 0.0, THREE.AdditiveBlending);
	flare.position.copy(lightSource)

	flare.add( resource.flareTex1, 512, 0.0, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 512, 0.0, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 512, 0.0, THREE.AdditiveBlending, flareColor);

	flare.add( resource.flareTex1, 60, 0.6, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 70, 0.7, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 120, 0.9, THREE.AdditiveBlending, flareColor);
	flare.add( resource.flareTex1, 70, 1.0, THREE.AdditiveBlending, flareColor);
	flare.customUpdateCallback=function( object ) {
		var f, fl = object.lensFlares.length;
		var flare;
		var vecX = -object.positionScreen.x * 2;
		var vecY = -object.positionScreen.y * 2;


		for( f = 0; f < fl; f++ ) {

			   flare = object.lensFlares[ f ];

			   flare.x = object.positionScreen.x + vecX * flare.distance;
			   flare.y = object.positionScreen.y + vecY * flare.distance;

			   flare.rotation = 0;

		}

		object.lensFlares[ 2 ].y += 0.025;
		object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

	}
	scene.add(flare);
}
function initParticles(){
	//Sparks
	currentspark=0
	sparks=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.sparkMat
	)
	for(var c=0;c<200;c++){
		var vertex=new THREE.Vector3(0,0,0)
		vertex.velocity=new THREE.Vector3(0,0,0)
		vertex.opacity=0
		vertex.color=0
		sparks.geometry.vertices.push(vertex)
		sparks.geometry.colors.push(new THREE.Color(0x000000))
	}
	scene.add(sparks)
	
	//Smoke
	currentsmoke=0
	smoke=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.smokeMat
	)
	for(var c=0;c<1000;c++){
		var vertex=new THREE.Vector3(0,-1000000,0)
		vertex.opacity=0
		vertex.velocity=new THREE.Vector3(0,0,0)
		smoke.geometry.vertices.push(vertex)
		resource.smokeMat.attributes.opacity.value.push(1)
	}
	resource.smokeMat.attributes.opacity.needsUpdate=true
	scene.add(smoke)
}
function initShips(){
	ships=[]
	
	me=new Ship()
	ships.push(me)
	scene.add(me.main)
	colliders.push(me.collider)
	me.main.position.z=25
	me.main.position.x=3
		
	you=new Ship()
	ships.push(you)
	scene.add(you.main)
	colliders.push(you.collider)
	you.main.position.z=20
	you.main.position.x=-3
	for(var s=1;s<=0;s++){
		u=new Ship()
		ships.push(u)
		scene.add(u.main)
		u.main.position.z=20-5*s
		u.main.position.x+=s%2==0?-3:3
		colliders.push(u.collider)
	}
	//camera.position.set(0,3,6)
	//camera.lookAt(new THREE.Vector3(0,0,-10))
	camera.rotation.y=Math.PI
	me.camera.add(camera)
	//camera2.position.set(0,3,6)
	//camera2.lookAt(new THREE.Vector3(0,0,-10))
	camera2.rotation.y=Math.PI
	you.camera.add(camera2)
}
time=0
counter=document.getElementById('countdown')
function countDown(){
	countdown--
	switch(countdown){
		case 3:
			counter.innerHTML='3'
			break
		case 2:
			counter.innerHTML='2'
			break
		case 1:
			counter.innerHTML='1'
			break
		case 0:
			counter.innerHTML='GO'
			break
		default:
			counter.innerHTML=''
			countdown=0
			return
	}
	setTimeout(countDown,1000)
}
function render(){
	if(!paused){
		time++
	}
	gamepad()
	me.controller=controllers[0]||keyboard
	//you.controller=controllers[1]||keyboard2
	for(var s=0;s<ships.length;s++){
		ships[s].simulate()
	}
	me.updateHUD(mehud)
	raycaster.ray.origin.getPositionFromMatrix(camera.matrixWorld)
	raycaster.ray.direction.set(0,0,-1).transformDirection(camera.matrixWorld)
	var intersections=raycaster.intersectObjects(info)
	if(intersections.length){
		var priority=-1
		for(var c=0;c<intersections.length;c++){
			if(intersections[c].object.priority>priority||priority==-1){
				priority=intersections[c].object.priority
				infoelem.innerHTML=intersections[c].object.info
			}
		}
	}
	else{
		infoelem.innerHTML=entity('Mettez votre réticule sur un objet pour apprendre plus')
	}
	infoelem.style.opacity=clamp(10*me.lookaway,0,1)
	reticle.style.opacity=clamp(10*me.lookaway,0,1)
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
		me.copyUniforms(coolPass.uniforms,scalePass.uniforms)
		scalePass.uniforms.backbuffer.value=savePass.renderTarget
		renderer.render(scene,camera,composer.renderTarget2,true)
		composer.render()
	}
	window.webkitRequestAnimationFrame(render)
}
function fxStep(){
	if(time%2==0){
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
	for(var r=0;r<residuals.length;r++){
		if(residuals[r].exploding){
			residuals[r].exploding+=deltatime*4
			residuals[r].material.opacity=1-residuals[r].exploding
			residuals[r].scale.set(residuals[r].exploding*2+1,residuals[r].exploding*2+1)
			if(residuals[r].exploding>1){
				scene.remove(residuals[r])
				residuals.splice(r,1)
				r--
			}
		}
		else if(time%2==0){
			residuals[r].rotation=Math.random()*Math.PI*2
			residuals[r].material.opacity=Math.random()*0.5+0.5
			var s=Math.random()+0.5
			residuals[r].scale.set(s,s)
		}
	}
}
function simulateParticles(){
	//Sparks
	var needupdate=false
	for(var c=0;c<sparks.geometry.vertices.length;c++){
		if(sparks.geometry.vertices[c].opacity<=0){
			continue
		}
		needupdate=true
		sparks.geometry.vertices[c].add(
			sparks.geometry.vertices[c].velocity.multiplyScalar(0.99))
		sparks.geometry.vertices[c].opacity-=deltatime*0.6
		sparks.geometry.colors[c].setRGB(
			(5*sparks.geometry.vertices[c].opacity),
			(5*sparks.geometry.vertices[c].opacity)*(1-sparks.geometry.vertices[c].color*0.5),
			(5*sparks.geometry.vertices[c].opacity)*(0.5-sparks.geometry.vertices[c].color*0.5)
		)
	}
	sparks.geometry.verticesNeedUpdate=needupdate
	sparks.geometry.colorsNeedUpdate=needupdate
	
	//Smoke (much simpler)
	needupdate=false
	for(var c=0;c<smoke.geometry.vertices.length;c++){
		resource.smokeMat.attributes.opacity.value[c]=
			Math.max(0,resource.smokeMat.attributes.opacity.value[c]-deltatime*0.3)
		if(resource.smokeMat.attributes.opacity.value[c]==0){
			continue
		}
		needupdate=true
		smoke.geometry.vertices[c].add(
			smoke.geometry.vertices[c].velocity.multiplyScalar(0.99))
	}
	smoke.geometry.verticesNeedUpdate=needupdate
	resource.smokeMat.attributes.opacity.needsUpdate=needupdate
	
	for(var c=0;c<emitters.length;c++){
		emitters[c].life-=deltatime
		if(emitters[c].life<=0){
			emitters.splice(c,1)
			c--
			continue
		}
		addSmoke(emitters[c],emitters[c].fireball)
		emitters[c].add(emitters[c].velocity)
		emitters[c].velocity.multiplyScalar(0.99)
		emitters[c].velocity.y-=0.01
	}
}
