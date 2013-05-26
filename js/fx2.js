var zoneDefaultColor=0x555555
resource.zoneMaterial=new THREE.ShaderMaterial({
	uniforms:{
		line:{type:'f',value:0},
		closeColor:{type:'c',value:new THREE.Color(zoneDefaultColor)},
		farColor:{type:'c',value:new THREE.Color(zoneDefaultColor)}
	},
	vertexShader:[
		'varying vec4 pos;',
		'void main(){',
			'gl_Position=projectionMatrix*',
				'modelViewMatrix*',
				'vec4(position,1.0);',
			'pos=gl_Position;',
		'}'
	].join('\n'),
	fragmentShader:[
		'varying vec4 pos;',
		'uniform float line;',
		'uniform vec3 closeColor;',
		'uniform vec3 farColor;',
		'void main(){',
			'vec3 color;',
			'float linecol;',
			'if(pos.z<line){',
				'color=closeColor;',
				'linecol=0.0;',
			'}',
			'else{',
				'color=farColor;',
				'linecol=clamp(1.0-0.02*(pos.z-line),0.0,1.0);',
			'}',
			'gl_FragColor=vec4(vec3((pos.z)/(pos.z*pos.z+10000.0)*200.0)*color',
				'+linecol,1.0);',
		'}'
	].join('\n')
})
resource.zoneTrackMaterial=new THREE.ShaderMaterial({
	uniforms:{
		line:{type:'f',value:0},
		wave:{type:'f',value:emprange},
		wavepos:{type:'v3',value:new THREE.Vector3()},
		map:{type:'t',value:null},
		closeColor:{type:'c',value:new THREE.Color(zoneDefaultColor)},
		farColor:{type:'c',value:new THREE.Color(zoneDefaultColor)}
	},
	vertexShader:[
		'varying vec4 pos;',
		'varying vec2 uvpos;',
		'varying float wavemag;',
		'uniform float wave;',
		'uniform vec3 wavepos;',
		'void main(){',
			'float dist=length(position-vec3(-wavepos.x,wavepos.z-200.0,wavepos.y));',//-wavepos.x
			'wavemag=100.0/(abs(dist-wave)*abs(dist-wave)+100.0)*clamp(1.0-(dist-400.0)/100.0,0.0,1.0);',
			'uvpos=uv;',
			'gl_Position=projectionMatrix*',
				'modelViewMatrix*',
				'vec4(position+vec3(0.0,0.0,-10.0)*wavemag,1.0);',
			'pos=gl_Position;',
		'}'
	].join('\n'),
	fragmentShader:[
		'varying vec2 uvpos;',
		'varying vec4 pos;',
		'varying float wavemag;',
		'uniform float line;',
		'uniform vec3 closeColor;',
		'uniform vec3 farColor;',
		'uniform sampler2D map;',
		'void main(){',
			'vec3 color;',
			'float linecol;',
			'if(pos.z<line){',
				'color=closeColor;',
				'linecol=0.0;',
			'}',
			'else{',
				'color=farColor;',
				'linecol=clamp(1.0-0.02*(pos.z-line),0.0,1.0);',
			'}',
			'gl_FragColor=texture2D(map,uvpos)+vec4((pos.z)/(pos.z*pos.z+10000.0)*100.0*color',
				'+wavemag*sin(uvpos.x*160.0)*sin(uvpos.y*160.0)',
				'+linecol,1.0);',//Line
		'}'
	].join('\n')
})



resource.trackMaterial=new THREE.ShaderMaterial({
	lights:true,
	uniforms: THREE.UniformsUtils.merge( [

		THREE.UniformsLib[ "common" ],
		THREE.UniformsLib[ "bump" ],
		THREE.UniformsLib[ "normalmap" ],
		THREE.UniformsLib[ "fog" ],
		THREE.UniformsLib[ "lights" ],
		THREE.UniformsLib[ "shadowmap" ],

		{
			wave:{type:'f',value:emprange},
			wavepos:{type:'v3',value:new THREE.Vector3()},
			
			"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
			"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
			"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
			"shininess": { type: "f", value: 30 },
			"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
		}

	] ),

	vertexShader: [

		"#define PHONG",
		"#define USE_MAP",
		"#define USE_SPECULARMAP",

		'varying vec4 pos;',
		'varying vec2 uvpos;',
		'varying float wavemag;',
		'uniform float wave;',
		'uniform vec3 wavepos;',
			

		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",

		THREE.ShaderChunk[ "map_pars_vertex" ],
		THREE.ShaderChunk[ "lightmap_pars_vertex" ],
		THREE.ShaderChunk[ "envmap_pars_vertex" ],
		THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
		THREE.ShaderChunk[ "color_pars_vertex" ],
		THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
		THREE.ShaderChunk[ "skinning_pars_vertex" ],
		THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

		"void main() {",

			THREE.ShaderChunk[ "map_vertex" ],
			THREE.ShaderChunk[ "lightmap_vertex" ],
			THREE.ShaderChunk[ "color_vertex" ],

			THREE.ShaderChunk[ "morphnormal_vertex" ],
			THREE.ShaderChunk[ "skinbase_vertex" ],
			THREE.ShaderChunk[ "skinnormal_vertex" ],
			THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"vNormal = normalize( transformedNormal );",

			THREE.ShaderChunk[ "morphtarget_vertex" ],
			THREE.ShaderChunk[ "skinning_vertex" ],
			THREE.ShaderChunk[ "default_vertex" ],

			"vViewPosition = -mvPosition.xyz;",

			THREE.ShaderChunk[ "worldpos_vertex" ],
			THREE.ShaderChunk[ "envmap_vertex" ],
			THREE.ShaderChunk[ "lights_phong_vertex" ],
			THREE.ShaderChunk[ "shadowmap_vertex" ],
			
			'float dist=length(position-vec3(-wavepos.x,wavepos.z-200.0,wavepos.y));',//-wavepos.x
			'wavemag=100.0/(abs(dist-wave)*abs(dist-wave)+100.0)*clamp(1.0-(dist-400.0)/100.0,0.0,1.0);',
			'uvpos=uv;',
			'gl_Position=projectionMatrix*',
				'modelViewMatrix*',
				'vec4(position+vec3(0.0,0.0,-10.0)*wavemag,1.0);',
			'pos=gl_Position;',
		"}"

	].join("\n"),

	fragmentShader: [

		"#define PHONG",
		"#define USE_MAP",
		"#define USE_SPECULARMAP",

		"uniform vec3 diffuse;",
		"uniform float opacity;",

		"uniform vec3 ambient;",
		"uniform vec3 emissive;",
		"uniform vec3 specular;",
		"uniform float shininess;",


		'varying vec4 pos;',
		'varying vec2 uvpos;',
		'varying float wavemag;',
		'uniform float wave;',
		'uniform vec3 wavepos;',


		THREE.ShaderChunk[ "color_pars_fragment" ],
		THREE.ShaderChunk[ "map_pars_fragment" ],
		THREE.ShaderChunk[ "lightmap_pars_fragment" ],
		THREE.ShaderChunk[ "envmap_pars_fragment" ],
		THREE.ShaderChunk[ "fog_pars_fragment" ],
		THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
		THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
		THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
		THREE.ShaderChunk[ "normalmap_pars_fragment" ],
		THREE.ShaderChunk[ "specularmap_pars_fragment" ],

		"void main() {",

			"gl_FragColor = vec4( vec3 ( 1.0 ), opacity );",

			THREE.ShaderChunk[ "map_fragment" ],
			THREE.ShaderChunk[ "alphatest_fragment" ],
			THREE.ShaderChunk[ "specularmap_fragment" ],

			THREE.ShaderChunk[ "lights_phong_fragment" ],

			THREE.ShaderChunk[ "lightmap_fragment" ],
			THREE.ShaderChunk[ "color_fragment" ],
			THREE.ShaderChunk[ "envmap_fragment" ],
			THREE.ShaderChunk[ "shadowmap_fragment" ],

			THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

			THREE.ShaderChunk[ "fog_fragment" ],
			
			'gl_FragColor+=wavemag*sin(uvpos.x*160.0)*sin(uvpos.y*160.0);',
		"}"

	].join("\n")
})


var scalePass=new THREE.ShaderPass({//I'm going to be PRO with some
//Scales up the image. For use with motion blur.
	uniforms:{
		'tDiffuse': { type: 't', value: null },
		'backbuffer': { type: 't', value: null },
		'motionblur': { type: 'f',value: 0}
	},
	vertexShader: [
	'varying vec2 v;',
	'void main() {',
		'v = uv;',
		'gl_Position = vec4( position, 1.0 );',
	'}'
	].join('\n'),
	fragmentShader: [
	'uniform sampler2D tDiffuse;',
	'uniform sampler2D tDepth;',
	'uniform sampler2D backbuffer;',
	'uniform float motionblur;',
	'varying vec2 v;',
	'void main() {',
		'float vin=length(v-0.5)*10.0;',
		'vin=vin/(vin+1.0);',
		'gl_FragColor = texture2D(tDiffuse,v)*(1.0-vin*motionblur)',
		'+texture2D(backbuffer,v)*vin*motionblur;',
	'}'
	].join('\n')
})
var coolPass=new THREE.ShaderPass({//I'm going to be PRO with some
//CUSTOM SHADERS! WOAH! The coolPass makes everything so much cooler.
	uniforms:{
		'tDiffuse': { type: 't', value: null },
		'phase': { type: 'f',value: 0},
		'motionblur': { type: 'f',value: 0},
		'resolution': { type: 'v2',value: new THREE.Vector2()},
	},
	vertexShader: [
	'varying vec2 v;',
	'varying vec3 pos;',
	'void main() {',
		'v = uv;',
		'gl_Position = vec4( position, 1.0 );',
	'}'
	].join('\n'),
	fragmentShader: [
	'uniform sampler2D tDiffuse;',
	'uniform float phase;',
	'uniform vec2 resolution;',
	'uniform float motionblur;',
	'varying vec2 v;',
	'varying vec3 pos;',
	'void main() {',
		'vec2 vc=v;',
		'vec2 center=vec2(1.0,resolution.y/resolution.x)*(v-0.5);',
		'float vin=clamp(length(v-0.5)-0.4,0.0,1.0);',
		'if(phase>0.01){',
			'float lc=length(center);',
			'float x=(lc-1.5*phase+0.2);',//0.5=phase
			'vc+=center*-0.7/(1.0+10000.0*x*x*x*x);',//'(2.5/((lc-x)*(lc-x)));',
		'}',
		'if(motionblur>0.01){',
			'vec2 center=vc-0.5;',
			'gl_FragColor=texture2D(tDiffuse,vc)*(1.0-0.6*motionblur)',
				'+texture2D(tDiffuse,(center*1.05)+0.5)*0.3*motionblur',
				'+texture2D(tDiffuse,(center*1.10)+0.5)*0.2*motionblur',
				'+texture2D(tDiffuse,(center*1.15)+0.5)*0.1*motionblur;',
		'}',
		'else{',
			'gl_FragColor=texture2D(tDiffuse,vc);',
		'}',
		// apply gamma correction and exposure
		//'gl_FragColor = vec4( pow( exposure * gl_FragColor.xyz, vec3( 1.1 ) ), 1.0 );',
		
		// Perform tone-mapping
		'float exposure=1.2;',
		'float Y = dot(vec4(0.30, 0.59, 0.11, 0.0), gl_FragColor);',
		'float YD = exposure * (exposure/0.8 + 1.0) / (exposure + 1.0);',
		'gl_FragColor *= YD;',
	
		'gl_FragColor = vec4( gl_FragColor.xyz, 1.0 );',
		
		//Strange stuff goes here
		/*'float a=clamp(2.0-4.0*abs(strange),0.0,1.0);',
		'float b=clamp(2.0-4.0*abs(strange-0.5),0.0,1.0);',
		'float c=clamp(1.5-4.0*abs(strange-0.875),0.0,1.0);',
		'gl_FragColor=vec4(',
			'a*gl_FragColor.x+c*gl_FragColor.y+b*gl_FragColor.z,',
			'b*gl_FragColor.x+a*gl_FragColor.y+c*gl_FragColor.z,',
			'c*gl_FragColor.x+b*gl_FragColor.y+a*gl_FragColor.z,',
			'1.0);',*/

	'}'
	].join('\n')
})
//var savePass=new THREE.SavePass(new THREE.WebGLRenderTarget(2,2))
