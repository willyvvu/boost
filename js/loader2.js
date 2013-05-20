loader=new THREE.JSONLoader()
resource={
	hullTex:'scene/ship2/Ship.png',
	hullToastTex:'scene/shipresource/Toast.png',
	shineTex:'scene/flare/Boostflare.png',
	padTex:'scene/trackresource/Pad2.png',
	poweruppadTex:'scene/trackresource/Pad2Powerup.png',
	flareTex:'scene/flare/Sunflare.png',
	flareTex1:'scene/flare/Hexflare.png',
	sparkTex:'scene/flare/Spark.png',
	shieldTex:'scene/shipresource/Shield.png',
	autopilotTex:'scene/shipresource/Autopilot.png',
	absorbTex:'scene/shipresource/Absorb.png',
	residueTex:'scene/residue/Glow.png',
	smokeTex:'scene/flare/Smoke.png'
}
for(var c in resource){
	resource[c]=THREE.ImageUtils.loadTexture(resource[c])
	resource[c].wrapS=resource[c].wrapT=THREE.RepeatWrapping
}
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

resource.padMat=new THREE.MeshBasicMaterial({
	map:resource.padTex,
	transparent:true
})
resource.poweruppadMat=new THREE.MeshBasicMaterial({
	map:resource.poweruppadTex,
	transparent:true
})
resource.thrustMat=new THREE.MeshBasicMaterial({
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
resource.smokeMat=new THREE.ShaderMaterial({
	uniforms:{
		texture:{type:"t",value:resource.smokeTex}
	},
	attributes:{
		opacity:{type:'f',value:[]}
	},
	vertexShader:[
		'attribute float opacity;',
		'varying float vOpacity;',
		'void main() {',
			'vOpacity=opacity;',
			'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',

			'gl_PointSize = (1500.0-1000.0*opacity) / length( mvPosition.xyz );',
			//'gl_PointSize = size * ( 300.0 / length( mvPosition.xyz ) );',

			'gl_Position = projectionMatrix * mvPosition;',

		'}'
	].join('\n'),
	fragmentShader:[
		'uniform sampler2D texture;',
		'varying float vOpacity;',

		'void main() {',

			//'gl_FragColor = vec4( color * vColor, 1.0 );',
			'gl_FragColor = texture2D( texture, gl_PointCoord );',
			'gl_FragColor.w*=clamp(vOpacity,0.0,1.0);',
			'gl_FragColor.x+=clamp(10.0*(vOpacity-1.0),0.0,1.0);',
			'gl_FragColor.y+=clamp(5.0*(vOpacity-1.0),0.0,1.0);',

		'}'
	].join('\n'),
	blending:THREE.NormalBlending,
	depthWrite:false,
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
resource.residueMat=new THREE.SpriteMaterial({
	useScreenCoordinates:false,
	blending:THREE.AdditiveBlending,
	color:0xFFFFFF,
	depthWrite:false,
	map:resource.residueTex
})
sceneloader=new THREE.SceneLoader()
sceneloader.load('scene/ship/Ship.js',function(data){
})
sceneloader.load('scene/ship2/Ship.js',function(data){
	resource.hullObj=data.objects['Hull']
	resource.shieldObj=data.objects['Shield']
	resource.absorbObj=data.objects['Absorb']
 })
loader.load('scene/residue/Residue.js',function(data){
	resource.residueGeo=data
})
loader.load('scene/trackresource/Pad2.js',function(geo){resource.padGeo=geo})


/*resource.ribbonCol=[]
for(var c=0;c<trail;c++){
	var col=new THREE.Color(0x88DDFF)
	col.multiplyScalar((1-c/trail)/(c/trail+1.1))
	resource.ribbonCol.push(col)
	resource.ribbonCol.push(col)
}*/

var req=new XMLHttpRequest()
req.open('GET','scene/track7/track.js',true)
req.onload=function(){
	currenttrack=eval(req.response)[0]
	console.log(currenttrack)
	sceneloader.load(currenttrack.loadURL,currenttrack.loadCallback)
	for(var c in currenttrack.textures){
		resource[c]=THREE.ImageUtils.loadTexture(currenttrack.textures[c])
		resource[c].wrapS=resource[c].wrapT=THREE.RepeatWrapping
	}
}
req.send()
