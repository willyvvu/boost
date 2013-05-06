loader=new THREE.JSONLoader()
resource={
	hullTex:'scene/ship/Ship Simple.png',
	hullToastTex:'scene/ship/Ship Simple Toast.png',
	//thrustTex:'scene/ship/Thrust.png',
	shineTex:'scene/flare/Boostflare.png',
	trackTex:'scene/trackresource/Track Less Simple.png',
	trackSpecTex:'scene/trackresource/Track Less Simple Specular.png',
	//terrainTex:'scene/track6/Terrain.png',
	//trackSpecularTex:'scene/trackresource/Track Specular.png',
	//trackNormalTex:'scene/trackresource/Track Normal.png',
	padTex:'scene/trackresource/Pad2.png',
	poweruppadTex:'scene/trackresource/Pad2Powerup.png',
	flareTex:'scene/flare/Sunflare.png',
	flareTex1:'scene/flare/Hexflare.png',
	sparkTex:'scene/flare/Spark.png',
	shieldTex:'scene/ship/Shield.png',
	autopilotTex:'scene/ship/Autopilot.png',
	absorbTex:'scene/ship/Absorb.png',
	residueTex:'scene/residue/Glow.png',
	smokeTex:'scene/flare/Smoke.png',
	texGround:'scene/track7/Mars.png',
	tex0:'scene/track7/Glass.png',
	tex1:'scene/track7/Farm.png',
	tex2:'scene/track7/Industrial.png',
	tex4:'scene/track7/Evaporator.png',
	texP:'scene/track7/Solar.png',
	texI1:'scene/track7/Hex.png'
}
for(var c in resource){
	resource[c]=THREE.ImageUtils.loadTexture(resource[c])
}
resource.texGround.wrapS=resource.texGround.wrapT=
resource.tex0.wrapS=resource.tex0.wrapT=
resource.tex1.wrapS=resource.tex1.wrapT=
resource.tex2.wrapS=resource.tex2.wrapT=
resource.tex4.wrapS=resource.tex4.wrapT=
resource.texP.wrapS=resource.texP.wrapT=
resource.texI1.wrapS=resource.texI1.wrapT=
resource.shieldTex.wrapS=resource.shieldTex.wrapT=
resource.residueTex.wrapS=resource.residueTex.wrapT=
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
resource.trackMat=new THREE.MeshPhongMaterial({
	map:resource.trackTex,
	color: 0xFFFFFF,
	specularMap:resource.trackSpecTex,
	//normalMap:resource.trackNormalTex,
	shininess: 10.0,
	ambient: 0xCCCCCC,
	emissive: 0x000000,
	specular: new THREE.Color().setRGB(1.5,1.5,1.5)
	//transparent:true
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
	resource.hullObj=data.objects['Hull']
	resource.shieldObj=data.objects['Shield']
	resource.absorbObj=data.objects['Absorb']
})
loader.load('scene/residue/Residue.js',function(data){
	resource.residueGeo=data
})
sceneloader.load('scene/track7/World.js',function(data){
	resource.trackObj=data.objects['Track']
	resource.objGround=data.objects['Ground']
	resource.obj0=data.objects['Cube']
	resource.obj1=data.objects['Cube.001']
	resource.obj2=data.objects['Cube.002']
	resource.obj3=data.objects['Cube.003']
	resource.obj4=data.objects['Cube.004']
	resource.objP=data.objects['Plane']
	resource.objP1=data.objects['Plane.001']
	resource.objI0=data.objects['Icosphere']
	resource.objI1=data.objects['Icosphere.001']
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
	resource.obj0.info=entity("Les Tours\n(l'Habitation)\n\nTous les 50.000 habitants habiteraient dans les tours. En Mars, l'espace serait très limité, donc il n'y aurait pas les maisons individuelles! Chaque mètre couterait cher!")
	resource.obj1.info=entity("Les Fermes Verticales\n(De la Nature)\n\nParce que l'espace étaient limité, on cultiverait les plantes sur les toits (roofs) des gratte-ciels et dans les énormes fermes verticales. Les plantes assistait de faire l'oxygène. Aussi, les plantes terraformeraient la Mars en une planète habitable.")
	resource.obj2.info=entity("Le Garde-Meuble\n(De la Culture)\n\nCette grande garde-meuble garderait toute l'information culturelle et historique. Une note culturelle, par exemple, lirait, \"Tous les gens qui habiteraient en Mars devraient visiter la terre au moins d'une fois d'une vie\" . Aussi, il garde les nourritures et l'eau en trop. Aussi, il garde une section de l'internet.")
	resource.obj3.info=entity("La Mine\n(Du commerce)\n\nEn Mars, on utilisait une autre type de monnaie. L'économie serait basé sur quelques minérals rares dans la terre martienne. On les enlèverait et à cette mine, et après, on les enverrait à la terre.")
	resource.obj4.info=entity("Les Évaporateurs\n(l'Habitation)\n\n L'eau serait fait avec l'évaportation. L'eau est essentiel pour la vie de tous les habitants.")
	resource.objP.info=entity("Les Panneaux Solaires\n(Des Services Municipaux)\n\nPrès de 100% d'énergie viendrait des panneaux solaires. Ce serait une bonne forme d'energie.")
	resource.objP1.info=entity("La Plate-Forme d'Atterrissage\n(Des loisirs)\n\nPendant les vacances, quelques habitants feraient un voyage interstellaire ou un voyage à la terre. Aussi, on pourrait jouer dans une équipe de courses en voiture volants. Les voitures iraient vite, n'est-ce pas?")
	resource.objI0.info=entity("Le Dôme\n(l'Habitation)\n\nPour retenir l'oxygène et la temperature, il y avait un dôme de verre autour de la ville. Sans-dôme, les habitants mourraient")
	resource.objI1.info=entity("L'École Primaire et La Lycée\n(De l'Éducation)\n\nLes enfants étudieraient dans ces bâtiments. À l'intérieur de chaque bâtiment, il y avait une grande chambre de réalité virtuelle, qui montraient l'information que le garde-meuble garderait. Les universités seraient des laboratoires en espace.")
	resource.trackcollide.info=entity("La rue\n(Du Transport)\n\nMaintenant, on inventerait les voitures volants, qu'irait à plus de 1500 kph! Mais, à grande vitesse, ce n'étaient pas un human qui conduisait, c'étaient le pilote automatique! En général, les rues étaient élevé, loin de la terre.")
	resource.obj0.priority=2
	resource.obj1.priority=2
	resource.obj2.priority=10
	resource.obj3.priority=10
	resource.obj4.priority=10
	resource.objP.priority=10
	resource.objP1.priority=10
	resource.objI0.priority=0
	resource.objI1.priority=2
	resource.trackcollide.priority=5
	info=[resource.obj0,
	resource.obj1,
	resource.obj2,
	resource.obj3,
	resource.obj4,
	resource.objP,
	resource.objP1,
	resource.objI0,
	resource.objI1,
	resource.trackcollide]
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
