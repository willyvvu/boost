//All constants that can be changed
//Unit settings
mph=3600*100/2.54/12/5280
kmph=3600/1000
speedunit=mph
//Camera settings
fov=65//Field of view
near=0.1//Near
far=10000000//Far
camchase=new THREE.Vector3(0,3,10)

//Movement settings
friction=0.9
grip=0.1
gravity=0.1
float=1
climb=0.7

//Everyone loves a skybox!
skyPrefix='scene/skybox/'
skyImages=[skyPrefix+'px.jpg',skyPrefix+'nx.jpg',
    skyPrefix+'py.jpg',skyPrefix+'ny.jpg',
    skyPrefix+'pz.jpg',skyPrefix+'nz.jpg' ]
//Where all the skybox images will come from
