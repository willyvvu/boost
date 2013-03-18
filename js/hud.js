hudspeed=document.getElementById('speed')
hudbar=document.getElementById('hudbar')
hudhealth=document.getElementById('hudenergy')
shipdestroyed=document.getElementById('destroyed')
hudpercent=document.getElementById('lowerleft')
orange=new THREE.Vector3(255,130,0)
cyan=new THREE.Vector3(100,100,255)
green=new THREE.Vector3(0,255,0)
critical=0.3
function limit(n){
	return Math.max(0,Math.round(n))
}
function hudStep(){
	if(energy<=0){
		shipdestroyed.style.display='initial'
		energy=0
	}
	else{
		shipdestroyed.style.display='none'
	}
	hudpercent.innerHTML=Math.ceil(energy*100)+'%'
	hudspeed.innerHTML=Math.round(thrust.length()*speedunit)
	hudbar.style.width=Math.min(thrust.length()/maxspeed,1)*(window.innerWidth-40)+'px'
	hudenergy.style.height=energy*100+'%'
	var color=new THREE.Vector3(energy<critical?3:1,1,1)
	color.multiplyScalar(1).add(
		orange.clone().multiplyScalar(coolPass.uniforms.damage.value*0.01)
	).add(
		cyan.clone().multiplyScalar(coolPass.uniforms.boost.value*0.01)
	).add(
		green.clone().multiplyScalar(coolPass.uniforms.push.value*0.01)
	)
	color.divideScalar(Math.max(color.x,Math.max(color.y,color.z))).multiplyScalar(255)
	color=limit(color.x)+','+limit(color.y)+','+limit(color.z)
	hudbar.style.backgroundColor='rgba('+color+',0.3)'
	hudenergy.style.backgroundColor='rgba('+color+',0.7)'
	hudpercent.style.color=energy<critical?'rgb(200,0,0)':'inherit'
	//console.log('rgba('+color+',0.3)')
	if(startTime){
		document.getElementById('currenttime').innerHTML=formatTime(new Date().valueOf()-startTime)
	}
	else{
		document.getElementById('currenttime').innerHTML=formatTime(0)
	}
}
function hurt(){
	energy=Math.max(energy-Math.min(thrust.length()*collisionusage,maxcollisionusage),0)
	coolPass.uniforms.damage.value=Math.min(coolPass.uniforms.damage.value+velocity.length()*0.01,1)
}
function formatTime(n){
	var millis=n%1000
	n=(n-millis)/1000
	var seconds=n%60
	n=(n-seconds)/60
	var minutes=n
	return (minutes/100).toFixed(2).slice(2)+':'+(seconds/100).toFixed(2).slice(2)+'.'+(millis/1000).toFixed(1).slice(2)
}
function addTime(n){
	times.push(n)
	saveTimes()
	startTime=0
}
function saveTimes(){
	localStorage.times=JSON.stringify(times)
	document.getElementById('lasttime').innerHTML=times.length?formatTime(times.slice(-1)[0]):''
	if(times.length){
		var mintime=Infinity
		for(var min=0;min<times.length;min++){
			mintime=Math.min(times[min],mintime)
		}
		document.getElementById('besttime').innerHTML=formatTime(mintime)
	}
	else{
		document.getElementById('besttime').innerHTML=''
	}
}
if(localStorage.times){
	times=JSON.parse(localStorage.times)
}
else{
	times=[]
}
saveTimes()
