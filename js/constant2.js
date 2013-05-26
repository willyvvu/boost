//Unit conversion
mph=3600*100/2.54/12/5280
kph=3600/1000

//Global stuff
deltatime=1/60

//Speeds
boostspeed=1100/mph//Maximum boost speed
rollboost=0.3
maxspeed=1200/mph//Maximum overall speed
friction=0.00001
extfriction=0.99

//Energy usage
boostusage=0.002
collisionusage=deltatime/2
maxcollisionspeed=300/mph//Any faster than this, and a collision won't use more than collisionusage energy
hurtduration=0.5//How long the HUD will flash for getting hurt
absorbduration=1//How long the HUD will flash for an absorb
powerupduration=0.5//How long the HUD will flash for an absorb
fadein=0.5//How fast shields, etc fade in
fadeout=0.5//How fast shields, etc fade out
greenhex='#00FF00'
redhex='#FF0000'
whitehex='#FFFFFF'

//Colors
orange=new THREE.Vector3(255,130,0)
cyan=new THREE.Vector3(100,100,255)
green=new THREE.Vector3(0,255,0)
red=new THREE.Vector3(255,0,0)

//Pushing rates
boostrate=0.1//How fast the boost takes you to boost speed
pushrate=0.04//How fast the push takes you to full speed

//Turning, braking, shifting, rolling
brakespeed=5//m/s^2 for braking
shiftdeg=0.02//Radians for shifting left and right
airshift=0.7//How much to decrease shifting while in the air

airturn=0.7//Ratio for how much slower to turn while in the air

rollrate=0.95//Ratio for rolling

//Floating, etc.
adhere=0.5
float=2
climb=0.5

//Camera stuff
minfov=75//Field of view
addfov=120-minfov//How much field of view to add
near=0.1//Near
far=10000000//Far
camsmooth=0.1
radarfar=500
aimfar=300
aimangle=Math.PI/8

//Other stuff
slightly=0.01
trail=20
raycaster=new THREE.Raycaster()
collisionconst=0.5//Really small, but not 0
maxcollisions=10
blow=0//Seconds before blowing up
//Powerups

residueslow=40
emprange=600//This is hardcoded into the shader
empslow=100
emphurt=0.3
jumpforce=0.97
fullclip=100
worldpadding=100

function formatTime(n){
	var millis=n%1000
	n=(n-millis)/1000
	var seconds=n%60
	n=(n-seconds)/60
	var minutes=n
	return (minutes/100).toFixed(2).slice(2)+':'+(seconds/100).toFixed(2).slice(2)+'.'+(millis/1000).toFixed(1).slice(2)
}
function more(a,b){//a>b when b>0,else, a<b when b<0
	return a*b>b*b
}
function lerp(value,target,rate){
	return value+rate*(target-value)
}
function clamp(value,min,max){
	return Math.min(Math.max(value,min),max)
}
function sign(value){
	return value?
	value>0?1:-1
	:0
}
function restrict(vec,plane){//Real simple.
	if(vec.clone().normalize().dot(plane.clone().normalize())<0){
		vec.projectOnPlane(plane)
	}
}
function addSpark(position,velocity){
	var current=sparks.geometry.vertices[currentspark]
	current.copy(position)
	current.velocity.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
	if(typeof velocity=='number'){
		current.velocity.multiplyScalar(velocity)
	}
	else{
		current.velocity.multiplyScalar(0.1)
		current.velocity.add(velocity)
	}
	current.opacity=1
	current.color=Math.random()
	currentspark++
	if(currentspark>=sparks.geometry.vertices.length){currentspark=0}
}
function addFragment(position,velocity,large){
	var current=fragments.geometry.vertices[currentfragment]
	current.copy(position)
	current.velocity.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
	if(velocity){
		current.velocity.multiplyScalar(0.5)
		current.velocity.add(velocity)
	}
	resource.fragmentMat.attributes.opacity.value[currentfragment]=large?3:2
	currentfragment++
	if(currentfragment>=fragments.geometry.vertices.length){currentfragment=0}
}
function addSmokeLerp(position,velocity,fireball){
	var totaldist=velocity.length()
	var temp=new THREE.Vector3()
	for(var filldist=0;filldist<totaldist;filldist+=1){
		temp.copy(velocity).multiplyScalar(-filldist/totaldist).add(position)
		addSmoke(temp,fireball)
	}
}
function addSmoke(position,fireball){
	var current=smoke.geometry.vertices[currentsmoke]
	current.copy(position)
	current.velocity.set(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)
	current.velocity.multiplyScalar(0.02)
	resource.smokeMat.attributes.opacity.value[currentsmoke]=fireball?1.1:1
	currentsmoke++
	if(currentsmoke>=smoke.geometry.vertices.length){currentsmoke=0}
}
function addEmitter(position,velocity,life,fireball){
	var emit=new THREE.Vector3().copy(position)
	emit.velocity=velocity
	emit.life=life
	emit.fireball=fireball
	emitters.push(emit)
}
function smartpop(list,item){
	var ind=list.indexOf(item)
	if(ind!=-1){
		list.splice(ind,1)
	}
}
function addBoostPad(position,rotation,powerup){
	var pad=new THREE.Mesh(
		resource.padGeo,
		powerup?resource.poweruppadMat:resource.padMat
	)
	pad.position.copy(position)
	pad.rotation.copy(rotation)
	pad.scale.multiplyScalar(5)
	var collider=new THREE.Mesh(
		new THREE.CubeGeometry(15,5,15),
		new THREE.MeshBasicMaterial()
	)
	//collider.geometry.applyMatrix(new THREE.Matrix4().rotateX(-Math.PI/2))
	collider.position.copy(position)
	collider.rotation.copy(rotation)
	collider.boostpad=pad
	collider.powerup=!!powerup
	collider.visible=false
	boostpads.push(pad)
	scene.add(pad)
	scene.add(collider)
	padcolliders.push(collider)
}
function addResidue(position,owner){
	var current=residualsystem.geometry.vertices[currentresidue]
	current.copy(position)
	current.owner=owner
	current.index=currentresidue
	resource.residueMat.attributes.exploding.value[currentresidue]=1
	residuals.unshift(current)
	var rescol=new THREE.Mesh(new THREE.CubeGeometry(3,3,3),new THREE.MeshBasicMaterial())
	rescol.position.copy(position)
	rescol.visible=false
	rescol.residue=true
	scene.add(rescol)
	rescolliders.unshift(rescol)
	if(residuals.length>residualsystem.geometry.vertices.length){
		residuals.splice(residualsystem.geometry.vertices.length)
		rescolliders.splice(residualsystem.geometry.vertices.length)
	}
	currentresidue++
	if(currentresidue>=residualsystem.geometry.vertices.length){currentresidue=0}
	residualsystem.geometry.verticesNeedUpdate=true
	resource.residueMat.attributes.exploding.needsUpdate=true
	resource.residueMat.attributes.phase.needsUpdate=true
}
function removeResidue(r,velocity,large){
	for(var f=0;f<10;f++){
		addFragment(residuals[r],velocity,large)
	}
	resource.residueMat.attributes.exploding.value[residuals[r].index]=1-slightly
	residuals.splice(r,1)
	scene.remove(rescolliders[r])
	rescolliders.splice(r,1)
}
function entity(text){
	for(var e in entityTable){
		text=text.replace(new RegExp(e,'g'),'&'+entityTable[e]+';')
	}
	return text.replace(/\n/g,'<br>')
}
// all HTML4 entities as defined here: http://www.w3.org/TR/html4/sgml/entities.html
// added: amp, lt, gt, quot and apos
entityTable = {
	'À':'Agrave',
	'à':'agrave',
	'È':'Egrave',
	'è':'egrave',
	'É':'Eacute',
	'é':'eacute',
	'ô':'ocirc',
	'â':'acirc',
	"'":'apos',
	'\"':'quot'
}
function solveRay(origin,direction,distance,objects,_times,_now,_previousface,_wasfloor){
	//console.log('solved')
	//Trace a ray in direction. If it hits a wall, trace again, until distance runs out.
	_times=_times||1
	_now=_now||direction.clone()
	_now.normalize()
	raycaster.ray.origin.copy(origin)
	raycaster.ray.direction.copy(_now)
	var intersections=raycaster.intersectObjects(objects)
	var intersection=false
	for(var c=0;c<intersections.length;c++){
		if(intersections[c].distance-collisionconst>distance){
			break
		}
		if(!intersection&&intersections[c].object===trackcollide){
			intersection=intersections[c]
		}
	}
	if(intersection){
		//Hit something
		var normal=intersection.face.normal.clone().transformDirection(intersection.object.matrix)
		if(!intersection.face.isfloor){//&&normal.dot(_now)<-0.5){
			//Missiles should explode now: hit a wall
			return false
		}
		distance-=Math.max(intersection.distance-collisionconst,0)
		origin.copy(intersection.point).add(
			_now.clone().multiplyScalar(-collisionconst))
		if(_previousface&&normal.equals(_previousface)){
			_now.add(normal.clone().multiplyScalar(0.05))
		}
		if(!_previousface||intersection.face.isfloor==_wasfloor){
			restrict(_now,normal)
		}
		else{
			//Floor-wall collision
			//console.log('cross')
			var crossed=_previousface.clone().cross(normal)
			_now.projectOnVector(crossed)
			
		}
		if(_times<maxcollisions&&distance>0.01){
			return solveRay(origin,direction,distance,objects,_times+1,_now,normal,intersection.face.isfloor)//Continue
		}
		else{
			return _now.normalize()
		}
	}
	else{//Continue on
		origin.add(_now.clone().multiplyScalar(distance))
		return _now.normalize()
	}
}
function coneSort(a,b){
	return a.angle-b.angle
}
function parseHUD(element){
	element.powerup=element.getElementsByClassName('powerup')[0]
	element.speed=element.getElementsByClassName('speed')[0]
	element.energy=element.getElementsByClassName('energy')[0]
	element.lowerleft=element.getElementsByClassName('lowerleft')[0]
	element.currentlap=element.getElementsByClassName('currentlap')[0]
	element.currenttime=element.getElementsByClassName('currenttime')[0]
	element.radar=element.getElementsByClassName('radar')[0]
	element.warnfront=element.getElementsByClassName('warnfront')[0]
	element.warnbehind=element.getElementsByClassName('warnbehind')[0]
	element.topcenter=element.getElementsByClassName('topcenter')[0]
	element.reticle=element.getElementsByClassName('reticle')[0]
}
function flareCallback(object){
	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;
	for( f = 0; f < fl; f++ ) {
		   flare = object.lensFlares[ f ];
		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;
		   flare.rotation = 0;
	}
}
function engineFlareCallback(object){
	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;
	//console.log(object.positionScreen)
	for( f = 0; f < fl; f++ ) {
		   flare = object.lensFlares[ f ];
		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;
		   flare.scale=clamp(100*(1-object.positionScreen.z),0,1);
		   flare.rotation = 0;
	}
}
