var composer=new THREE.EffectComposer(renderer)
renderPass=new THREE.RenderPass(scene,camera)
composer.addPass(renderPass)
hexTexture=THREE.ImageUtils.loadTexture('fx/Hex.png')
var coolPass=new THREE.ShaderPass({//I'm going to be PRO with some
//CUSTOM SHADERS! WOAH! The coolPass makes everything so much cooler.
	uniforms:{
		'tDiffuse': { type: 't', value: null },
		'tHex': { type: 't', value: null},
		'phase': { type: 'f',value: 0},
		'distort': { type: 'f',value: 0},
		'damage': { type: 'f',value: 0},
		'boost': { type: 'f',value: 0},
		'aspect': { type: 'f',value: 1},
		'cover': { type: 'f',value: 0}
	},vertexShader: [
	'varying vec2 v;',
	'void main() {',
		'v = uv;',
		'gl_Position = vec4( position, 1.0 );',
	'}'
	].join('\n'),
	fragmentShader: [
	'uniform sampler2D tDiffuse;',
	'uniform sampler2D tHex;',
	'uniform float phase;',
	'uniform float aspect;',
	'uniform float damage;',
	'uniform float boost;',
	'uniform float cover;',
	'varying vec2 v;',
	'void main() {',
		'float glass=0.0;vec4 color=vec4(0.0,0.0,0.0,0.0);vec2 vc=v;',
		'vec2 center=vec2(1.0,1.0/aspect)*(v-0.5);',
		'float vin=clamp(length(center),0.0,1.0);',
		'if(phase>0.0){',
			'float x=(length(center)-1.5*phase+0.2);',
			'if(abs(x)<0.2){',
				'glass+= -(0.01+2.5*length(center))*0.2*(cos(3.14*x/0.2)+1.0);',
			'}}',
		'if(damage>0.0){',
			'glass+=0.2*vin*damage*texture2D(tHex,mod(0.004*gl_FragCoord,1.0).xy).x;',
			'color+=2.0*vin*vec4(0.3,-0.0,-0.2,1.0)*damage;};',
		'if(boost>0.0){color+=vin*boost*vec4(0.6,0.6,1.0,1.0)*0.9;};',
		'if(cover>0.0){color+=cover*vec4(1.0,1.0,1.0,1.0);};',
		'if(glass!=0.0){vc+=normalize(center)*glass;};',
		'if(boost>0.0){',
			'float vcm=(vc-0.5);'
			'gl_FragColor = texture2D(tDiffuse,vc)*0.3',
			'+texture2D(tDiffuse,0.97*vcm+0.5)*0.25',
			'+texture2D(tDiffuse,0.94*vcm+0.5)*0.2',
			'+texture2D(tDiffuse,0.91*vcm+0.5)*0.15',
			'+texture2D(tDiffuse,0.88*vcm+0.5)*0.1',
			'+color;',
		'}',
		'else{',
			'gl_FragColor = texture2D(tDiffuse,vc)+color;',
		'}',
	'}'
	].join('\n')
})
coolPass.renderToScreen=true
composer.addPass(coolPass)
coolPass.uniforms.tHex.value=hexTexture
composer.renderTarget1.format=THREE.RGBAFormat
composer.renderTarget2.format=THREE.RGBAFormat
