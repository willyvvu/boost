var composer=new THREE.EffectComposer(renderer)
renderPass=new THREE.RenderPass(scene,camera)
composer.addPass(renderPass)
//hexTexture=THREE.ImageUtils.loadTexture('fx/Hex.png')
var coolPass=new THREE.ShaderPass({//I'm going to be PRO with some
//CUSTOM SHADERS! WOAH! The coolPass makes everything so much cooler.
	uniforms:{
		'tDiffuse': { type: 't', value: null },
		//'tHex': { type: 't', value: null},
		'phase': { type: 'f',value: 0},
		'distort': { type: 'f',value: 0},
		'damage': { type: 'f',value: 0},
		'boost': { type: 'f',value: 0},
		'push': { type: 'f',value: 0},
		'motionblur': { type: 'f',value: 0},
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
	//'uniform sampler2D tHex;',
	'uniform float phase;',
	'uniform float aspect;',
	'uniform float damage;',
	'uniform float boost;',
	'uniform float push;',
	'uniform float cover;',
	'uniform float motionblur;',
	'varying vec2 v;',
	'void main() {',
		'vec4 color=vec4(0.0,0.0,0.0,0.0);vec2 vc=v;',
		'vec2 center=vec2(1.0,1.0/aspect)*(v-0.5);',
		'float vin=clamp(length(v-0.5)-0.25,0.0,1.0);',
		'if(phase>0.01){',
			'float x=(length(center)-1.5*phase+0.2);',
			'if(abs(x)<0.2){',
				'vc+=normalize(center)* -(0.01+2.5*length(center))*0.2*(cos(3.14*x/0.2)+1.0);',
			'}}',
		'if(damage>0.001){color+=vin*damage*vec4(0.6,0.0,-0.4,1.0);};',
		'if(boost>0.001){color+=vin*boost*vec4(0.6,0.6,1.0,1.0);};',
		'if(push>0.001){color+=vin*push*vec4(0.0,1.0,0.0,1.0);};',
		'if(cover>0.001){color+=cover*vec4(1.0,1.0,1.0,1.0);};',
		'if(motionblur>0.1){',
			'vec2 vcm=(vc-0.5);',
			'gl_FragColor = texture2D(tDiffuse,vc)*(1.0-0.6*motionblur)',
			'+texture2D(tDiffuse,0.975*vcm+0.5)*0.3*motionblur',
			'+texture2D(tDiffuse,0.95*vcm+0.5)*0.2*motionblur',
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
//coolPass.uniforms.tHex.value=hexTexture
composer.renderTarget1.format=THREE.RGBAFormat
composer.renderTarget2.format=THREE.RGBAFormat
function fxStep(){
	//Make the exhaust look like it's alive
	modelthrust.material.map.offset.y=Math.random()*0.2-0.1
	modelboost.material.map.offset.y=Math.random()*0.2-0.1
	//Exhaust behavior and other smoothing things
	modelthrust.material.map.offset.x=
		smooth(modelthrust.material.map.offset.x,-1+Math.max(accel,boost),0.1)
	modelboost.material.map.offset.x=
		smooth(modelboost.material.map.offset.x,boosting>0||pushing>0?0:-1,0.1)
	coolPass.uniforms.damage.value=
		smooth(coolPass.uniforms.damage.value,0,0.05)
	coolPass.uniforms.push.value=
		smooth(coolPass.uniforms.push.value,pushing>0?1:0,0.15)
	coolPass.uniforms.boost.value=
		smooth(coolPass.uniforms.boost.value,boosting>0?1:0,0.15)
	coolPass.uniforms.motionblur.value=
		smooth(coolPass.uniforms.motionblur.value,boosting>0||pushing>0?1:0,0.1)
}
