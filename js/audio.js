var context
backgroundaudio=document.getElementById('backgroundaudio')
boostaudio=document.getElementById('boostaudio')

window.addEventListener('load',initAudio,false)
function initAudio(){
	context=new webkitAudioContext()
	backgroundsource=context.createMediaElementSource(backgroundaudio)
	backgroundfilter=context.createBiquadFilter()
	backgroundfilter.type=backgroundfilter.HIGHPASS
	backgroundfilter.frequency.value=0
	
	/*boostsource=context.createMediaElementSource(boostaudio)
	boostgain=context.createGainNode()
	boostsource.connect(boostgain)
	boostgain.connect(context.destination)*/
	
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
}
