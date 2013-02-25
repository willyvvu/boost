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
		'aspect': { type: 'f',value: 1}
	},vertexShader: [
	'varying vec2 v;',
	'void main() {',
		'v = uv;',
		'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
	'}'
	].join('\n'),
	fragmentShader: [
	'uniform sampler2D tDiffuse;',
	'uniform sampler2D tHex;',
	'uniform float phase;',
	'uniform float aspect;',
	'uniform float damage;',
	'uniform float boost;',
	'varying vec2 v;',
	'float bend(float n,float o){',
		'float p=0.35;',
		'float x=(n-1.5*o+p);',
		'if(x<-p||x>p){return 0.0;}',
		'return -(0.01+0.6*n)*p*(cos(3.14*x/p)+1.0);',
	'}',
	'float hex(vec4 pos){',
		'return 0.1*texture2D(tHex,mod(0.004*pos,1.0).xy).x;',
	'}',
	'void main() {',
		'float glass=0.0;vec4 color=vec4(0.0,0.0,0.0,0.0);vec2 vc=v;',
		'vec2 center=vec2(aspect,1.0)*(v-0.5);',
		'if(phase>0.0){glass+=bend(length(center),phase);};',
		'if(damage>0.0){glass+=damage*hex(gl_FragCoord);color+=vec4(0.3,-0.2,-0.2,1.0)*damage;};',
		'if(boost>0.0){color+=clamp(length(center),0.0,1.0)*boost*vec4(0.6,0.6,1.0,1.0)*0.8;};',
		'if(glass!=0.0){vc+=normalize(center)*glass;};',
		'gl_FragColor = texture2D(tDiffuse,vc)+color;',
	'}'
	].join('\n')
})
coolPass.renderToScreen=true
composer.addPass(coolPass)
coolPass.uniforms.tHex.value=hexTexture
