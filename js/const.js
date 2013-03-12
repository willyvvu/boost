//All constants that can be changed
//Unit settings
mph=3600*100/2.54/12/5280
kmph=3600/1000
speedunit=mph
//Camera settings
minfov=65//Field of view
maxfov=120//Field of view
near=0.1//Near
far=10000000//Far
camchase=new THREE.Vector3(0,7,10)

//Constants
friction=0.9
gravity=0.1
adhere=1.0
float=1.5
climb=0.7

//Movement + Handling
//All speeds in m/s
maxspeed=223.52//201.168//340
energy=1
accel=0.25//meters per second squared
turn=[
	0.025,//I or O pressed
	0.03,//No keys pressed
	0.035//J and I pressed, or just J
]
drift=[
	0.05,//I or O pressed
	0.05,//No keys pressed
	0.2//J and I pressed, or just J
]

//Everyone loves a skybox!
skyPrefix='scene/skybox/'
skyImages=[skyPrefix+'px.jpg',skyPrefix+'nx.jpg',
    skyPrefix+'py.jpg',skyPrefix+'ny.jpg',
    skyPrefix+'pz.jpg',skyPrefix+'nz.jpg' ]
//Where all the skybox images will come from
