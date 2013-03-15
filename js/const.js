//All constants that can be changed
//Camera settings
minfov=65//Field of view
addfov=150-minfov//How much field of view to add
near=0.1//Near
far=10000000//Far
camchase=new THREE.Vector3(0,7,10)

//Constants
friction=0.9
extfriction=0.9
gravity=0.1
adhere=1.5
float=1.5
climb=0.5
energy=1
$energy=0//Energy to add
$$energy=0.005//Speed of energy to add

//Energy usage
initialboostusage=0.03
boostusage=0.004
collisionusage=0.00004
maxcollisionusage=0.007//Per step
rollenergy=0.1

//Pushes
rollpush=0.3
padpush=0.2

//Movement + Handling
//Unit settings
mph=3600*100/2.54/12/5280
kmph=3600/1000
speedunit=mph
//All speeds in m/s
accelspeed=500/mph//400 mph: Speed that is achivable by only with regular acceleration
pushspeed=700/mph//450 mph: Speed achievable after going over a boost pad
boostspeed=600/mph//500 mph: Speed achievable by boosting
maxspeed=Math.max(pushspeed,boostspeed)
accelconst=0.5//meters per second squared
brakeconst=0.5//friction ratio, except decreasing
shiftconst=0.7//radians for shifting left and right
shiftconst2=0.7//meters per second for shifting left and right
airshiftratio=0.4//How much to decrease shifting (0.5 -> half the speed)
$shift=0//Smoothed shift
$$shift=0.2//Smoothed shift rate
pushconst=0.2
//ratio of pushspeed going over a boost pad

turnspeed=0.035
airturnratio=0.4
$steer=0
drift=0.5
rollspeed=0.95

//Everyone loves a skybox!
skyPrefix='scene/skybox/'
skyImages=[skyPrefix+'px.jpg',skyPrefix+'nx.jpg',
    skyPrefix+'py.jpg',skyPrefix+'ny.jpg',
    skyPrefix+'pz.jpg',skyPrefix+'nz.jpg' ]
//Where all the skybox images will come from
