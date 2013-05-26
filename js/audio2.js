audioContext = new webkitAudioContext();
function WebSound(url,callback){
	var that=this
	that.loaded=false
	that.src=url
	that.buffer=null
	that.panner=audioContext.createPanner()
	that.volume=audioContext.createGainNode()
	
	that.req=new XMLHttpRequest()
	that.req.open('GET',url,true)
	that.req.responseType='arraybuffer'
	that.req.onload=function(){
		audioContext.decodeAudioData(that.req.response,function(buffer){
			that.buffer=buffer
			that.loaded=true
			if(callback){
				callback(that)
			}
		})
	}
	that.req.send()
}
WebSound.prototype.play=function(node,time){
	if(this.loaded) {
		var source=audioContext.createBufferSource()
		source.buffer = this.buffer
		source.connect(this.panner)
		source.playbackRate.value=1
		this.panner.connect(this.volume)
		this.volume.connect(node||audioContext.destination)
		source.start(time||0)
		return source
	}
}
WebSound.prototype.setVolume=function(level){
	this.volume.gain.value=level
}
WebSound.prototype.setPan=function(x,y,z){
	this.panner.setPosition(x,y,z)
}
WebSound.prototype.stop=function(context){
	context.stop(0)
}
function initAudio(){
	environmentNode=audioContext.createGainNode()
	musicNode=audioContext.createGainNode()
	shieldNode=audioContext.createBiquadFilter()
	backgroundAudio=document.getElementById('backgroundaudio')
	backgroundNode=audioContext.createMediaElementSource(backgroundAudio)
	
	environmentNode.connect(shieldNode)
	shieldNode.type=shieldNode.ALLPASS
	shieldNode.frequency.value=10000
	shieldNode.frequency.lerp=0
	shieldNode.connect(audioContext.destination)
	backgroundNode.connect(musicNode)
	musicNode.connect(shieldNode)
	backgroundAudio.play()
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
