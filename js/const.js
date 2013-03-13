//All constants that can be changed
//Camera settings
minfov=65//Field of view
maxfov=120//Field of view
near=0.1//Near
far=10000000//Far
camchase=new THREE.Vector3(0,7,10)

thresh=0.15

//Constants
friction=0.9
extfriction=0.9
gravity=0.1
adhere=1.0
float=1.5
climb=0.7
energy=1

//Movement + Handling
//Unit settings
mph=3600*100/2.54/12/5280
kmph=3600/1000
speedunit=mph
//All speeds in m/s
accelspeed=178.816//400 mph: Speed that is achivable by only with regular acceleration
pushspeed=201.168//450 mph: Speed achievable after going over a boost pad
boostspeed=223.52//500 mph: Speed achievable by boosting
maxspeed=268.224//600 mph: Absolute max speed, terminal velocity

accelconst=0.5//meters per second squared
brakeconst=0.5//friction ratio, except decreasing
shiftconst=0.7//radians for shifting left and right
$shift=0//Smoothed shift
$$shift=0.2//Smoothed shift rate
pushconst=0.1//ratio of pushspeed going over a boost pad

turnspeed=0.035
drift=0.5

//Everyone loves a skybox!
skyPrefix='scene/skybox/'
skyImages=[skyPrefix+'px.jpg',skyPrefix+'nx.jpg',
    skyPrefix+'py.jpg',skyPrefix+'ny.jpg',
    skyPrefix+'pz.jpg',skyPrefix+'nz.jpg' ]
//Where all the skybox images will come from
