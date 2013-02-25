//Sets up the scene, and everything inside it
//Get the essentials up and running
container=document.getElementById('container')
renderer=new THREE.WebGLRenderer({clearColor:0x000000,clearAlpha:1})
container.appendChild(renderer.domElement)
camera=new THREE.PerspectiveCamera(fov,0,near,far)
camera.position.copy(camchase)
scene=new THREE.Scene()
//scene.add(camera)
loader=new THREE.JSONLoader()

//Skybox. Wonderful.
skyMaterial=new THREE.ShaderMaterial(THREE.ShaderLib.cube)
skyMaterial.uniforms.tCube.value=THREE.ImageUtils.loadTextureCube(skyImages)
skyBox=new THREE.Mesh(new THREE.CubeGeometry(-100000,-100000,-100000,1,1,1),skyMaterial)
scene.add(skyBox)

ship=new THREE.Object3D()
ship.add(camera)
scene.add(ship)
//Load the stuff
loader.load('scene/ship/Ship.js',function(geo){
	hull=new THREE.Mesh(
		geo,
		new THREE.MeshPhongMaterial({
			map:THREE.ImageUtils.loadTexture('scene/ship/Ship.png')
		})
	)
	//hull.material.map.anisotropy=renderer.getMaxAnisotropy()
	ship.add(hull)
})
loader.load('scene/ship/Thrust.js',function(geo){
	thrust=new THREE.Mesh(
		geo,
		new THREE.MeshBasicMaterial({
			map:THREE.ImageUtils.loadTexture('scene/ship/Thrust.png'),
			transparent:true,
			blending:THREE.AdditiveBlending
		})
	)
	thrust.material.map.offset.x=-1
	ship.add(thrust)
})
loader.load('scene/ship/Boost.js',function(geo){
	boost=new THREE.Mesh(
		geo,
		new THREE.MeshBasicMaterial({
			map:THREE.ImageUtils.loadTexture('scene/ship/Thrust.png'),
			transparent:true,
			blending:THREE.AdditiveBlending,
			side:THREE.DoubleSide
		})
	)
	boost.material.map.offset.x=-1
	ship.add(boost)
})
loader.load('scene/track/Track.js',function(geo){
	track=new THREE.Mesh(
		geo,
		new THREE.MeshLambertMaterial()
	)
	scene.add(track)
})


//Lights, camera, action!
directional1=new THREE.DirectionalLight(0xFFFFFF,1.0)
directional1.position.set(-10,10,1)
scene.add(directional1)
ambient1=new THREE.AmbientLight(0x333333)
scene.add(ambient1)
