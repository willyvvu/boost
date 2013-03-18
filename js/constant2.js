//Unit conversion
mph=3600*100/2.54/12/5280

//Global stuff
deltatime=1/60

//Speeds
maxboostspeed=500/mph//Maximum boost speed
maxspeed=760/mph//Maximum overall speed
friction=0.9
extfriction=0.9

//Energy usage
boostusage=0.004
collisionusage=0.001
maxcollisionspeed=300/mph

//Colors
orange=new THREE.Vector3(255,130,0)
cyan=new THREE.Vector3(100,100,255)
green=new THREE.Vector3(0,255,0)
red=new THREE.Vector3(255,0,0)

//Pushing rates
boostrate=0.1//How fast the boost takes you to boost speed
pushrate=0.04//How fast the push takes you to full speed

//Turning, braking, shifting, rolling
brakespeed=0.5//m/s^2 for braking
shiftdeg=0.3//Radians for shifting left and right
shiftspeed=0.9//m/s for shifting left and right
airshift=0.7//How much to decrease shifting while in the air

turndeg=0.02//Radians for how fast to turn
airturn=0.7//Ratio for how much slower to turn while in the air

rollrate=0.95//Ratio for rolling


function smooth(value,target,rate){
	return value+rate*(target-value)
}

