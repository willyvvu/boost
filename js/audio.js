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
	backgroundsource.connect(backgroundfilter)
	backgroundfilter.connect(context.destination)
	
	boostsource=context.createMediaElementSource(boostaudio)
	boostgain=context.createGainNode()
	boostsource.connect(boostgain)
	boostgain.connect(context.destination)
	
	//backgroundaudio.play()
}
