hudspeed=document.getElementById('speed')
hudbar=document.getElementById('hudbar')
hudhealth=document.getElementById('hudenergy')
shipdestroyed=document.getElementById('destroyed')
hudpercent=document.getElementById('lowerleft')
orange=new THREE.Vector3(255,130,5)
cyan=new THREE.Vector3(155,153,255)
critical=0.3
function limit(n){
	return Math.max(0,Math.round(n))
}
function updateHud(){
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
	)
	color.divideScalar(Math.max(color.x,Math.max(color.y,color.z))).multiplyScalar(255)
	color=limit(color.x)+','+limit(color.y)+','+limit(color.z)
	hudbar.style.backgroundColor='rgba('+color+',0.3)'
	hudenergy.style.backgroundColor='rgba('+color+',0.7)'
	hudpercent.style.color=energy<critical?'rgb(200,0,0)':'inherit'
	//console.log('rgba('+color+',0.3)')
}
function hurt(){
	energy=Math.max(energy-thrust.length()*0.000005,0)
	hudcolor=Math.max(50,100-thrust.length())
}
