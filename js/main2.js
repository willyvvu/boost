window.addEventListener('load',init)
window.addEventListener('resize',resize)
speed=document.getElementById('speed')
function init(){//Sets up everything, provided that we are all loaded and ready to go
	initCore()//Camera, renderer, scene
	initTrack()//Track
	initPads()//Boost pads
	initLights()//Let there be light!
	initSky()//And a sky
	initFlare()//Lensflare
	initShips()
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
	composer=new THREE.EffectComposer(renderer)
	composer.addPass(coolPass)
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
	coolPass.uniforms.aspect.value=camera.aspect
}
function initTrack(){
	trackcollide=resource.trackcollide
	trackcollide.material=new THREE.MeshNormalMaterial()
	trackcollide.geometry.computeBoundingSphere()
	//trackcollide.scale.multiplyScalar(10)
	trackcollide.visible=false
	scene.add(trackcollide)
	/*var n=track.geometry.faces.length
	var inv=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2)
	while(n--){
		track.geometry.faces[n].normal.applyQuaternion(inv)
	}*/
	track=resource.trackObj
	track.material=resource.trackMat//terrainMap
	track.material.map.anisotropy=renderer.getMaxAnisotropy()
	//track.material.normalMap.anisotropy=renderer.getMaxAnisotropy()
	//track.scale.multiplyScalar(10)
	scene.add(track)
	structure=resource.structureObj
	structure.material.materials[0].wireframe=false
	//structure.material=resource.terrainMap//new THREE.MeshLambertMaterial()
	//structure.scale.multiplyScalar(10)
	scene.add(structure)
}
function initPads(){
	boostpads=[]
	for(var p=0;p<resource.padData.length;p++){
		var place=resource.padData[p]
		var padobj=new THREE.Mesh(
			resource.padGeo,
			resource.padMat
		)
		padobj.position.copy(place.position)
		padobj.rotation.copy(place.rotation)
		boostpads.push(padobj)
		//console.log(padobj)
		//scene.add(padobj)
	}
}
function initLights(){
	lightSource=new THREE.Vector3(-6452.946084495651,2955.202170343886,7044.591326896616)
	
	//Lights, camera, action!
	directional=new THREE.DirectionalLight(0xFFFFFF,1.0)
	directional.position.copy(lightSource)
	scene.add(directional)
	ambient=new THREE.AmbientLight(0x888888)
	scene.add(ambient)
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
	scene.add(flare);
	
	sparks=new THREE.ParticleSystem(
		new THREE.Geometry(),
		resource.sparkMat
	)
	for(var c=0;c<100;c++){
		var vertex=new THREE.Vector3(0,0,0)
		vertex.velocity=new THREE.Vector3(0,0,0)
		vertex.opacity=0
		vertex.color=0
		sparks.geometry.vertices.push(vertex)
		sparks.geometry.colors.push(new THREE.Color(0x000000))
	}
	scene.add(sparks)
}
function simulateSparks(){
	for(var c=0;c<sparks.geometry.vertices.length;c++){
		if(sparks.geometry.vertices[c].opacity<=0){
			continue
		}
		sparks.geometry.vertices[c].add(
			sparks.geometry.vertices[c].velocity.clone())
		sparks.geometry.vertices[c].opacity-=0.01
		sparks.geometry.colors[c].setRGB(
			(2*sparks.geometry.vertices[c].opacity),
			(2*sparks.geometry.vertices[c].opacity)*(1-sparks.geometry.vertices[c].color*0.5),
			(2*sparks.geometry.vertices[c].opacity)*(0.5-sparks.geometry.vertices[c].color*0.5)
		)
	}
	sparks.geometry.verticesNeedUpdate=true
	sparks.geometry.colorsNeedUpdate=true
}
function initShips(){
	ships=[]
	colliders=[]
	
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
exported=[]
function render(){
	//renderer.render(scene,camera)//,composer.renderTarget2,true)
	time++
	gamepad()
	me.controller=controllers[0]||keyboard
	//you.controller=controllers[1]||keyboard2
	for(var s=0;s<ships.length;s++){
		ships[s].simulate()
	}
	speed.innerText=Math.round(me.engineforce.length()*mph)
	simulateSparks()
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
	}
	else{
		me.copyUniforms(coolPass.uniforms)
		renderer.render(scene,camera,composer.renderTarget2,true)
		composer.render()
	}
	window.webkitRequestAnimationFrame(render)
}
/*setInterval(function(){
	me.dynamics.topspeed+=50/mph
	you.dynamics.topspeed+=50/mph
	me.dynamics.accelerate+=0.1
	you.dynamics.accelerate+=0.1
},1000)*/
