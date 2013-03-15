var context
backgroundaudio=document.getElementById('backgroundaudio')
boostaudio=document.getElementById('boostaudio')

window.addEventListener('load',initAudio,false)
function initAudio(){
	/*context=new webkitAudioContext()
	
	//Get the sound FX
	var req=new XMLHttpRequest()
	req.open('GET','audio/Sonic boom.wav',true)
	req.responseType='arraybuffer'
	req.onload=function(){
		context.decodeAudioData(req.response,function(buffer){
			boostbuffer=buffer
		})
	}
	req.send()
	//Create and hook up the nodes
	
	backgroundsource=context.createMediaElementSource(backgroundaudio)
	backgroundfilter=context.createBiquadFilter()
	backgroundfilter.type=backgroundfilter.HIGHPASS
	backgroundfilter.frequency.value=0
	
	backgroundgain=context.createGainNode()
	delaygain=context.createGainNode()
	delaygain.gain.value=0
	
	delay=context.createDelayNode()
	delay.delayTime.value=0.002
	
	backgroundsource.connect(backgroundfilter)
	backgroundfilter.connect(backgroundgain)
	backgroundgain.connect(context.destination)
	
	backgroundfilter.connect(delay)
	delay.connect(delaygain)
	delaygain.connect(context.destination)
	
	backgroundaudio.play()
	
	boostgain=context.createGainNode()
	boostgain.connect(context.destination)
	boostgain.gain.value=1.5*/
}
boostbuffer=null
function playBoostSound(){
	/*try{
		boostsource=context.createBufferSource()
		boostsource.buffer=boostbuffer
		boostsource.connect(boostgain)
		boostsource.noteOn(0)
	}
	catch(e){}*/
}
function audioStep(){
	/*backgroundfilter.frequency.value=boost?1200:Math.round(smooth(backgroundfilter.frequency.value,0,0.1))
	delaygain.gain.value=boost?1:smooth(delaygain.gain.value,0,0.1)
	delay.delayTime.value=0.0005+(Math.cos(t)*0.5+0.5)*0.002*/
}
