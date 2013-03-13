//Variables
accel=0//1 is full acceleration, 0 is no acceleration
brake=0//1 is for brake
steer=0//1 is full turn right, -1 is full turn left, 0 is straight
shift=0//1 is full turn right, -1 is full turn left, 0 is straight
boost=0//1 is for full boost, 0 is for no boost
pushing=0//Seconds before temporary boost off a boost pad ends

//Gamepad
function gamepad(){
	var g=navigator.webkitGetGamepads()[0]
	if(g){
		steer=g.axes[0]
		brake=g.buttons[6]
		accel=g.buttons[7]
		boost=g.buttons[0]>thresh
		if(g.buttons[8]>thresh){respawn()}
	}
}
//Keyboard
keys=[]
function keyChange(e){//Picks up any change in keys: keyup and keydown
	var ind=keys.indexOf(e.keyCode)
	if(e.type=='keydown'){
		//console.log(e.keyCode)
		if(ind==-1){
			keys.push(e.keyCode)
			//Adds a keycode to list keys ONLY if it is not there already
			//This cuts down on redundant repeated event fires, when you
			//	hold down a key
			keyHandle(e.keyCode,true)
			//This function gets called once per keyup/down
		}
	}
	else if(ind!=-1){
		keys.splice(ind,1)
		keyHandle(e.keyCode,false)
	}
}
function keyHandle(){
	var ksteer=0,
		kaccel=0,
		kbrake=0,
		kshift=0,
		kboost=0,
		krespawn=0
	for(var k=0;k<keys.length;k++){
		switch(keys[k]){
			case 87://W
			case 38://Up
			case 73://I
				kaccel+=1//down?1:0
				break
			case 65://A
			case 37://Left
				ksteer-=1//down?1:0
				break
			case 83://S
			case 40://Down
			case 74://J
				kbrake+=1//down?1:0
				break
			case 68://D
			case 39://Right
				ksteer+=1//down?1:0
				break
			case 81://Q
				kshift-=1
				break
			case 69://E
				kshift+=1
				break
			case 32://Space
			case 79://O
				kboost=1//down?1:0
				break
			case 36://Home
				krespawn=1
				break
		}
	}
	accel=Math.max(0,Math.min(1,kaccel))
	brake=Math.max(0,Math.min(1,kbrake))
	boost=Math.max(0,Math.min(1,kboost))
	steer=Math.max(-1,Math.min(1,ksteer))
	shift=Math.max(-1,Math.min(1,kshift))
	if(krespawn &&respawning==0){
		respawning=0.01
	}
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
