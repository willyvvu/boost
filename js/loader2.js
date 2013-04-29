loader=new THREE.JSONLoader()
resource={
	hullTex:THREE.ImageUtils.loadTexture('scene/ship/Ship Simple.png'),
	//thrustTex:THREE.ImageUtils.loadTexture('scene/ship/Thrust.png'),
	shineTex:THREE.ImageUtils.loadTexture('scene/flare/Boostflare.png'),
	trackTex:THREE.ImageUtils.loadTexture('scene/trackresource/TrackSimple.png'),
	terrainTex:THREE.ImageUtils.loadTexture('scene/track6/Terrain.png'),
	//trackSpecularTex:THREE.ImageUtils.loadTexture('scene/trackresource/Track Specular.png'),
	//trackNormalTex:THREE.ImageUtils.loadTexture('scene/trackresource/Track Normal.png'),
	padTex:THREE.ImageUtils.loadTexture('scene/trackresource/Pad2.png'),
	poweruppadTex:THREE.ImageUtils.loadTexture('scene/trackresource/Pad2Powerup.png'),
	flareTex:THREE.ImageUtils.loadTexture('scene/flare/Sunflare.png'),
	flareTex1:THREE.ImageUtils.loadTexture('scene/flare/Hexflare.png'),
	sparkTex:THREE.ImageUtils.loadTexture('scene/flare/Spark.png'),
	shieldTex:THREE.ImageUtils.loadTexture('scene/ship/Shield.png'),
	autopilotTex:THREE.ImageUtils.loadTexture('scene/ship/Autopilot.png'),
	absorbTex:THREE.ImageUtils.loadTexture('scene/ship/Absorb.png')
}
resource.shieldTex.wrapS=resource.shieldTex.wrapT=
resource.autopilotTex.wrapS=resource.autopilotTex.wrapT=
resource.absorbTex.wrapS=resource.absorbTex.wrapT=THREE.RepeatWrapping
//resource.shieldTex.repeat.set(2,2)
var skyPrefix='scene/skybox/'
var skyImages=[skyPrefix+'px.jpg',skyPrefix+'nx.jpg',
    skyPrefix+'py.jpg',skyPrefix+'ny.jpg',
    skyPrefix+'pz.jpg',skyPrefix+'nz.jpg' ]
resource.skyMat=new THREE.ShaderMaterial(THREE.ShaderLib.cube)
resource.skyTex=THREE.ImageUtils.loadTextureCube(skyImages)
//Materials later
resource.hullMat=new THREE.MeshLambertMaterial({
	map:resource.hullTex,
	specularMap:resource.hullTex,
	//normalMap:resource.hullNormalTex,
	color: 0xDDDDDD,
	shininess: 10.0,
	ambient:0xDDDDDD,// 0x888888,
	emissive: 0x000000,
	specular: 0xFFFFFF,
	combine:THREE.AddOperation
	//envMap:skyCube,
})
/*resource.thrustMat=new THREE.MeshBasicMaterial({
	transparent:true,
	blending:THREE.AdditiveBlending,
	//side:THREE.DoubleSide,
	map:resource.thrustTex,
	depthWrite:false
})*/
resource.shineMat=new THREE.SpriteMaterial({
	useScreenCoordinates:false,
	color:0xFFFFFF,
	depthWrite:false,
	blending:THREE.AdditiveBlending,
	map:resource.shineTex,
	transparent:true
})
resource.trackMat=new THREE.MeshBasicMaterial({
	map:resource.trackTex,
	color: 0xFFFFFF,
	//specularMap:resource.trackTex,
	//normalMap:resource.trackNormalTex,
	shininess: 10.0,
	ambient: 0xCCCCCC,
	emissive: 0x000000,
	specular: 0xFFFFFF
	//side:THREE.DoubleSide
})
resource.terrainMap=new THREE.MeshPhongMaterial({
	map:resource.terrainTex,
	color: 0xFFFFFF,
	//specularMap:resource.terrainTex,
	//normalMap:resource.trackNormalTex,
	shininess: 10.0,
	ambient: 0xCCCCCC,
	emissive: 0x222222,
	specular: 0xFFFFFF
	//side:THREE.DoubleSide
})
resource.padMat=new THREE.MeshBasicMaterial({
	map:resource.padTex,
	transparent:true
})
resource.poweruppadMat=new THREE.MeshBasicMaterial({
	map:resource.poweruppadTex,
	transparent:true
})
resource.ribbonMat=new THREE.MeshBasicMaterial({
	color:0xCCCCFF,
	side:THREE.DoubleSide,
	blending:THREE.AdditiveBlending,
	vertexColors:true,
	transparent:true,
	depthWrite:false
})
resource.sparkMat=new THREE.ParticleBasicMaterial({
	map:resource.sparkTex,
	blending:THREE.AdditiveBlending,
	depthWrite:false,
	depthTest:false,
	vertexColors:true,
	transparent:true
})
resource.shieldMat=new THREE.MeshBasicMaterial({
	map:resource.shieldTex,
	blending:THREE.AdditiveBlending,
	depthWrite:false,
	transparent:true
})
resource.absorbMat=new THREE.MeshBasicMaterial({
	map:resource.absorbTex,
	blending:THREE.AdditiveBlending,
	depthWrite:false,
	transparent:true
})

sceneloader=new THREE.SceneLoader()
sceneloader.load('scene/ship/Ship.js',function(data){
	resource.hullObj=data.objects['Hull']
	resource.shieldObj=data.objects['Shield']
	resource.absorbObj=data.objects['Absorb']
})
sceneloader.load('scene/track7/World.js',function(data){
	resource.trackObj=data.objects['Track']
	//resource.groundObj=data.objects.Ground
	resource.autonav=data.objects['Auto']
	resource.trackcollide=data.objects['Collide']
	//Precompute floor
	var fs=resource.trackcollide.geometry.faces
	for(var f=0;f<fs.length;f++){
		fs[f].isfloor=
			!fs[f].vertexColors[0].b&&
			!fs[f].vertexColors[1].b&&
			!fs[f].vertexColors[2].b
		fs[f].align=
			fs[f].vertexColors[0].r
			+fs[f].vertexColors[1].r
			+fs[f].vertexColors[2].r
			-fs[f].vertexColors[0].g
			-fs[f].vertexColors[1].g
			-fs[f].vertexColors[2].g
		fs[f].align/=-3
	}
	//resource.structureObj=data.objects['Plane.001']
	//resource.overpassObj=data.objects.Overpass
})
loader.load('scene/trackresource/Pad2.js',function(geo){resource.padGeo=geo})
var req=new XMLHttpRequest()
req.open('GET','scene/track7/Pads.js',true)
req.onload=function(){resource.padData=JSON.parse(req.response)}
req.send()

resource.ribbonCol=[]
for(var c=0;c<trail;c++){
	var col=new THREE.Color(0x88DDFF)
	col.multiplyScalar((1-c/trail)/(c/trail+1.1))
	resource.ribbonCol.push(col)
	resource.ribbonCol.push(col)
}
