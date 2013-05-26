[{
	textures:{
		texGround:'scene/track7/Mars.png',
		tex0:'scene/track7/Glass.png',
		tex1:'scene/track7/Farm.png',
		tex2:'scene/track7/Industrial.png',
		tex4:'scene/track7/Evaporator.png',
		texP:'scene/track7/Solar.png',
		texI1:'scene/track7/Hex.png',
		trackTex:'scene/trackresource/Track Less Simple.png',
		trackZTex:'scene/trackresource/Track Simple.png',
		trackSpecTex:'scene/trackresource/Track Less Simple Specular.png'
	},
	init:function(){
		track=resource.trackObj
		if(zone){
			track.material=resource.zoneTrackMaterial
			resource.zoneTrackMaterial.uniforms.map.value=resource.trackZTex
		}
		else{
			track.material=resource.trackMaterial
			resource.trackMaterial.uniforms.map.value=resource.trackTex
			resource.trackMaterial.uniforms.diffuse.value= new THREE.Color(0xFFFFFF)
			resource.trackMaterial.uniforms.specularMap.value=resource.trackSpecTex
			//normalMap.value=resource.trackNormalTex,
			resource.trackMaterial.uniforms.shininess.value= 10.0
			resource.trackMaterial.uniforms.ambient.value= new THREE.Color(0xCCCCCC)
			resource.trackMaterial.uniforms.emissive.value= new THREE.Color(0x000000)
			resource.trackMaterial.uniforms.specular.value= new THREE.Color().setRGB(1.5,1.5,1.5)
			/*new THREE.ShaderMaterial({
				uniforms:THREE.ShaderLib.phong.uniforms,
				vertexShader:resource.trackMaterial.vertexShader,
				fragmentShader:resource.trackMaterial.fragmentShader,
				lights:true,
				map:resource.trackTex,
				color: 0xFFFFFF,
				specularMap:resource.trackSpecTex,
				//normalMap:resource.trackNormalTex,
				shininess: 10.0,
				ambient: 0xCCCCCC,
				emissive: 0x000000,
				specular: new THREE.Color().setRGB(1.5,1.5,1.5)
			})*/
		}
		scene.add(track)
		resource.objGround.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			map:resource.texGround
		})
		scene.add(resource.objGround)
		resource.obj0.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			map:resource.tex0,
			envMap:resource.skyTex,
			reflectivity:0.8
		})
		scene.add(resource.obj0)
		resource.obj1.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.tex1,
			envMap:resource.skyTex
		})
		scene.add(resource.obj1)
		resource.obj2.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.tex2
		})
		scene.add(resource.obj2)
		resource.obj3.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.tex2
		})
		scene.add(resource.obj3)
		resource.obj4.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.tex4,
			envMap:resource.skyTex
		})
		scene.add(resource.obj4)
		resource.objP.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.texP,
			envMap:resource.skyTex,
			side:THREE.DoubleSide
		})
		scene.add(resource.objP)
		resource.objP1.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0
		})
		scene.add(resource.objP1)
		if(!zone){
			resource.objI0.material=new THREE.MeshPhongMaterial({
				shininess: 10.0,
				wireframe:true
			})
			scene.add(resource.objI0)
		}
		resource.objI1.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0,
			map:resource.texI1
		})
		scene.add(resource.objI1)
		
		resource.signObj.material=resource.signMat
		scene.add(resource.signObj)
		
		resource.postObj.material=zone?resource.zoneMaterial:new THREE.MeshPhongMaterial({
			shininess: 10.0
		})
		scene.add(resource.postObj)
	},
	loadURL:'scene/track7/World.js',
	loadCallback:function(data){
		//Objects
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
		
		resource.signObj=data.objects['Sign']
		resource.postObj=data.objects['Post']
		//resource.groundObj=data.objects.Ground
		resource.autonav=data.objects['Auto']
		resource.centernav=data.objects['Center']
		resource.trackcollide=data.objects['Collide']
		resource.trackclosecollide=data.objects['CloseCollide']
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
		for(var c=0;c<resource.length;c++){
			if(resource[c].geomtery){
				resource[c].geometry.computeFaceNormals()
				resource[c].geometry.computeVertexNormals()
				resource[c].geometry.normalsNeedUpdate=true
				resource[c].geometry.verticesNeedUpdate=true
			}
		}
	},
	pads:[{"position":{"x":105.64046482707681,"y":46.99412990984765,"z":-239.9614601891105},"rotation":{"x":0.37612756886280335,"y":-0.7475960076661983,"z":0.15812109483801656}},{"position":{"x":82.44699638530781,"y":50.83009150703627,"z":-262.1610322655443},"rotation":{"x":0.3371142401981714,"y":-0.6811270026666686,"z":0.09955624555603}},{"position":{"x":105.7620771332593,"y":54.448834851832736,"z":-266.8271095685131},"rotation":{"x":0.3839600810323455,"y":-0.7824249712815653,"z":0.16354627571345687}},{"position":{"x":119.01750489257113,"y":53.01512720195162,"z":-255.99332003570836},"rotation":{"x":0.3847832662206853,"y":-0.785950169500978,"z":0.16412763910264666},"powerup":true},{"position":{"x":117.30246437544092,"y":58.50390896141235,"z":-277.31286675866266},"rotation":{"x":0.3617852603690301,"y":-0.6773985121634634,"z":0.14873926099583806},"powerup":true},{"position":{"x":95.6091537174748,"y":55.530442233181205,"z":-274.78052842134116},"rotation":{"x":0.34151014606496993,"y":-0.7143771191758742,"z":0.10238098785558476},"powerup":true},{"position":{"x":-128.67304200020732,"y":75.46986124325562,"z":-604.5808428997095},"rotation":{"x":-2.4958067986157255,"y":1.1705823644861508,"z":2.648683535444712}},{"position":{"x":-121.94517918266301,"y":74.12600897241224,"z":-589.9160263246403},"rotation":{"x":-2.4813688338905697,"y":1.180765901098493,"z":2.6353577542065745}},{"position":{"x":-304.5195980530158,"y":-65.74135282869622,"z":-160.64472159614888},"rotation":{"x":-2.800840206583443,"y":-1.2822329370342336,"z":-2.9274004773709272}},{"position":{"x":-278.23911101223405,"y":-65.55835314453509,"z":-169.82758897426254},"rotation":{"x":-2.9320727805017768,"y":-1.2449894081293187,"z":-3.054296941238912}},{"position":{"x":-252.50919961215618,"y":-64.54341770649486,"z":-180.19268852965442},"rotation":{"x":-3.020105269402852,"y":-1.256831238199427,"z":3.1023310348889375}},{"position":{"x":207.83133093987368,"y":-47.10106963508114,"z":204.56756745689407},"rotation":{"x":2.3882257498276496,"y":-1.3875449430941633,"z":2.7142311846850373},"powerup":true},{"position":{"x":210.53338202158915,"y":-51.456821149061284,"z":190.91549053896946},"rotation":{"x":2.125630820139672,"y":-1.4514428747158246,"z":2.4544714785757527},"powerup":true},{"position":{"x":213.0060509085315,"y":-56.673352609582736,"z":174.71292062390594},"rotation":{"x":2.5292697744068544,"y":-1.4652673143101755,"z":2.8299789035699052},"powerup":true},{"position":{"x":702.9761310196374,"y":24.919207474345182,"z":250.6756199191997},"rotation":{"x":2.9915729016381314,"y":-0.8546114914976641,"z":2.952564843206528}},{"position":{"x":693.230166854932,"y":23.810149432937266,"z":261.1089723805462},"rotation":{"x":2.996856743979673,"y":-0.8360883778649294,"z":2.9565184258113386}},{"position":{"x":1039.3378151935683,"y":41.9030737101043,"z":452.62898292064455},"rotation":{"x":0.0670430118632561,"y":-0.7921818145669117,"z":0.20910641408176042}},{"position":{"x":702.131106085966,"y":-47.74898877725189,"z":251.21976782284133},"rotation":{"x":-2.812031989236137,"y":1.145986952383021,"z":2.8988428272920763}},{"position":{"x":711.3061672636052,"y":-44.762286184840015,"z":231.82600939624774},"rotation":{"x":-2.831811551924381,"y":1.110415133875371,"z":2.916719450957059}},{"position":{"x":723.4984308481219,"y":-46.614903779634176,"z":259.59126440902776},"rotation":{"x":-2.82295211624508,"y":1.1207458282759946,"z":2.908495975368468}},{"position":{"x":132.89932919298033,"y":-60.266647770944076,"z":284.64798268013726},"rotation":{"x":-3.130037847372691,"y":1.165846636793021,"z":-2.947734509714803}},{"position":{"x":136.95913215917562,"y":-63.56296209195357,"z":299.3871427761616},"rotation":{"x":3.1375478208109633,"y":1.1949728861234574,"z":-2.933307004999512},"powerup":true},{"position":{"x":128.53822275878247,"y":-56.82457517498877,"z":269.350137063849},"rotation":{"x":-3.0786903905877443,"y":1.185926093289811,"z":-2.9880830315164335},"powerup":true},{"position":{"x":117.73562539234568,"y":-60.17059029590178,"z":290.3884790061376},"rotation":{"x":-3.106639479550339,"y":1.1130450170246642,"z":-2.9689972338996733}},{"position":{"x":-262.7197925098365,"y":5.606247085026334,"z":891.0199835917829},"rotation":{"x":0.26265668718882296,"y":-1.4606128790463462,"z":0.4308225457686118}},{"position":{"x":-265.52062980390616,"y":2.935420862104298,"z":875.7015412899995},"rotation":{"x":0.25079747013920106,"y":-1.4576928772759157,"z":0.4190371473732995}},{"position":{"x":-266.9985481973361,"y":0.44110462701035313,"z":861.0980846365944},"rotation":{"x":0.2661632847509803,"y":-1.4614448082592157,"z":0.4343080601246453},"powerup":true},{"position":{"x":77.58922195667564,"y":18.339203827138864,"z":513.3074531273235},"rotation":{"x":0.059191739103916556,"y":-0.63298538639464,"z":-0.0252919292674651}},{"position":{"x":432.18827688774905,"y":40.79528708335967,"z":565.8532055478431},"rotation":{"x":3.1255854339627533,"y":-0.20539877890879307,"z":2.965825365393709},"powerup":true},{"position":{"x":318.93268049014097,"y":64.39967826416353,"z":832.4608978798501},"rotation":{"x":2.7798099197421893,"y":1.2419005097000717,"z":-2.9418289825308204}},{"position":{"x":16.765276513398618,"y":95.93608119776705,"z":615.2983524790442},"rotation":{"x":-0.05291155545910495,"y":0.019606425205828185,"z":-0.008839046388819974},"powerup":true},{"position":{"x":-14.970735801533642,"y":95.89441777116038,"z":614.4128634409789},"rotation":{"x":-0.047253150888663914,"y":0.044615111317549354,"z":-0.001784546583892908},"powerup":true},{"position":{"x":1.1181680283282383,"y":95.87631450379605,"z":614.2140129714103},"rotation":{"x":-0.05284809263203815,"y":0.026786200022991702,"z":-0.008840517048589009}},{"position":{"x":17.864180550788877,"y":96.6219687376346,"z":630.5587782018712},"rotation":{"x":-0.05219663584620244,"y":0.10016811156580939,"z":-0.008881869463939774}},{"position":{"x":-14.506184775741666,"y":96.7103110543507,"z":630.401267211097},"rotation":{"x":-0.04722512431044823,"y":0.060291619920771235,"z":-0.001786015951182661}},{"position":{"x":3.234813445222778,"y":97.21485560247577,"z":643.3384612662106},"rotation":{"x":-0.04712070701792299,"y":0.11838191775067483,"z":-0.0017953361394056162}}]
}]