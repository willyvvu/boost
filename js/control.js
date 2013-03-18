//Variables
accel=0//1 is full acceleration, 0 is no acceleration
lbrake=0//1 is for left airbrake
rbrake=0//1 is for right airbrake
steer=0//1 is full turn right, -1 is full turn left, 0 is straight
boost=0//1 is for full boost, 0 is for no boost
pushing=0//Seconds before temporary boost off a boost pad ends
roll=0//Barrel rolling?
rolling=0//How far along the roll you are
rollboost=0

threshold=0.15
function deadZone(n){
	if(n>threshold){ 
		return (n-threshold)/(1-threshold)
	}
	else if(n<-threshold){
		return (n+threshold)/(1-threshold)
	}
	return 0
}
//Gamepad
ydown=false
function gamepad(){
	var g=navigator.webkitGetGamepads()[0]
	if(g){
		if(control==1){
			steer=deadZone(g.axes[0])//Main stick
			lbrake=deadZone(g.axes[4])//Triggers
			rbrake=deadZone(g.axes[5])
			accel=deadZone(g.buttons[0])//A
			boost=deadZone(g.buttons[1])!=0//B
			roll=deadZone(g.buttons[5])-deadZone(g.buttons[4])+deadZone(g.buttons[7])//Clicking rolls
			//console.log(g.buttons)
		}
		if(deadZone(g.buttons[3])!=0){
			if(!ydown){
				if(control){
					control=control==1?2:1
				}
				ydown=true
			}
		}
		else{
			ydown=false
		}
		if(deadZone(g.buttons[9])!=0){respawn()}//Start
	}
}
exported=[]
exportposition=false
//Keyboard
keys=[]
function keyChange(e){//Picks up any change in keys: keyup and keydown
	var ind=keys.indexOf(e.keyCode)
	if(e.type=='keydown'){
		//console.log(e.keyCode)
		if(e.keyCode==45){exportposition=true}//Insert
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
		klbrake=0,
		krbrake=0,
		kboost=0,
		kroll=0,
		krespawn=0
	for(var k=0;k<keys.length;k++){
		switch(keys[k]){
			case 87://W
			case 38://Up
			case 73://I
				kaccel+=1
				break
			case 65://A
			case 37://Left
				ksteer-=1
				break
			case 83://S
			case 40://Down
			case 74://J
				klbrake+=1
				krbrake+=1
				break
			case 68://D
			case 39://Right
				ksteer+=1
				break
			case 81://Q
				klbrake+=1
				break
			case 69://E
				krbrake+=1
				break
			case 90://Z
				kroll-=1
				break
			case 67://X
				kroll+=1
				break
			case 32://Space
			case 79://O
				kboost=1
				break
			case 36://Home
				krespawn=1
				break
		}
	}
	if(control==1){
		accel=Math.max(0,Math.min(1,kaccel))
		lbrake=Math.max(0,Math.min(1,klbrake))
		rbrake=Math.max(0,Math.min(1,krbrake))
		boost=Math.max(0,Math.min(1,kboost))
		steer=Math.max(-1,Math.min(1,ksteer))
		roll=Math.max(-1,Math.min(1,kroll))
	}
	if(krespawn &&respawning==0){
		respawning=0.01
	}
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
