loader=new THREE.JSONLoader()
resource={
	hullTex:'scene/ship2/Ship.png',
	hullToastTex:'scene/shipresource/Toast.png',
	padTex:'scene/trackresource/Pad2.png',
	poweruppadTex:'scene/trackresource/Pad2Powerup.png',
	flareTex:'scene/flare/Sunflare.png',
	flareTex1:'scene/flare/Hexflare.png',
	sparkTex:'scene/flare/Spark.png',
	shieldTex:'scene/shipresource/Shield.png',
	autopilotTex:'scene/shipresource/Autopilot.png',
	absorbTex:'scene/shipresource/Absorb.png',
	residueTex:'scene/residue/Glow.png',
	residueMaskTex:'scene/residue/GlowMask.png',
	smokeTex:'scene/flare/Smoke.png',
	signTex:'scene/trackresource/Sign.png',
	engineTex:'scene/shipresource/Engine.png',
	engineFlareTex:'scene/flare/Engineflare.png',
	circleFlareTex:'scene/flare/CircleFlare.png',
	fragmentTex:'scene/residue/Fragment.png'
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
resource.signMat=new THREE.MeshBasicMaterial({
	map:resource.signTex,
	//blending:THREE.AdditiveBlending,
	side:THREE.DoubleSide,
	depthWrite:false,
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
resource.engineMat=new THREE.MeshBasicMaterial({
	color:0xFFFFFF,
	map:resource.engineTex,
	blending:THREE.AdditiveBlending,
	transparent:true,
	depthWrite:false
})
/*resource.residueMat=new THREE.ParticleBasicMaterial({
	blending:THREE.AdditiveBlending,
	color:0xFFFFFF,
	depthWrite:false,
	map:resource.residueTex
})*/
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

			'gl_PointSize = (2000.0-1000.0*opacity) / length( mvPosition.xyz );',
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
resource.fragmentMat=new THREE.ShaderMaterial({
	uniforms:{
		texture:{type:"t",value:resource.fragmentTex}
	},
	attributes:{
		opacity:{type:'f',value:[]},
		phase:{type:'f',value:[]}
	},
	vertexShader:[
		'attribute float opacity;',
		'attribute float phase;',
		'varying float vOpacity;',
		'varying float vPhase;',
		'void main() {',
			'vOpacity=opacity;',
			'vPhase=phase;',
			'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
			'gl_PointSize = 125.0*opacity / pow(length( mvPosition.xyz ),0.5);',//
			'gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join('\n'),
	fragmentShader:[
		'varying float vOpacity;',
		'varying float vPhase;',
		'uniform sampler2D texture;',

		'void main() {',

			//'gl_FragColor = vec4( color * vColor, 1.0 );',
			'gl_FragColor = texture2D( texture, gl_PointCoord*0.25+vec2(mod(vPhase,4.0),floor(vPhase*0.25))*0.25);',
			'gl_FragColor.xyz*=max(vOpacity,1.0);',
			'gl_FragColor.w*=min(vOpacity,1.0);',

		'}'
	].join('\n'),
	depthWrite:false,
	depthTest:true,
	transparent:true
})
resource.residueMat=new THREE.ShaderMaterial({
	uniforms:{
		texture:{type:"t",value:resource.residueTex},
		textureMask:{type:'t',value:resource.residueMaskTex},
		clock:{type:'f',value:0}
	},
	attributes:{
		exploding:{type:"f",value:[]},
		phase:{type:"f",value:[]}
	},
	vertexShader:[
		'attribute float exploding;',
		'attribute float phase;',
		'varying float vExploding;',
		'varying float vPhase;',
		'void main() {',
			'vExploding=exploding;',
			'vPhase=phase;',
			'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
			'gl_PointSize = (3000.0-2000.0*exploding) / length( mvPosition.xyz );',
			'gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join('\n'),
	fragmentShader:[
		'uniform float clock;',
		'varying float vExploding;',
		'varying float vPhase;',
		'uniform sampler2D texture;',
		'uniform sampler2D textureMask;',

		'void main() {',

			//'gl_FragColor = vec4( color * vColor, 1.0 );',
			'gl_FragColor = texture2D( textureMask, gl_PointCoord )*texture2D( texture, gl_PointCoord+vec2(0.0,vPhase-clock));',
			'gl_FragColor.w*=vExploding;',

		'}'
	].join('\n'),
	blending:THREE.AdditiveBlending,
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
sceneloader=new THREE.SceneLoader()
sceneloader.load('scene/ship/Ship.js',function(data){
})
sceneloader.load('scene/ship2/Ship.js',function(data){
	resource.hullObj=data.objects['Hull']
	resource.shieldObj=data.objects['Shield']
	resource.absorbObj=data.objects['Absorb']
	resource.engineObj=data.objects['Engine']
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


//Load those sounds!
resource.chimeSound=new WebSound('audio/Airplane Chime.ogg')
resource.chimeSound.setVolume(1)
