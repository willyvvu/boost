//Keyboard
keys=[]
function keyChange(e){//Picks up any change in keys: keyup and keydown
	//console.log(e.keyCode)
	var ind=keys.indexOf(e.keyCode)
	if(e.type=='keydown'){
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
pedal=0//1 is full acceleration, 0 is no acceleration
brake=0//1 is for brake
steer=0//1 is full turn right, -1 is full turn left, 0 is straight
boosting=0//1 is for full boost, 0 is for no boost
function keyHandle(){
	var ksteer=0,
		kpedal=0,
		kbrake=0,
		kboosting=0,
		krespawn=0
	for(var k=0;k<keys.length;k++){
		switch(keys[k]){
			case 87://W
			case 38://Up
			case 73://I
				kpedal+=1//down?1:0
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
			case 32://Space
			case 79://O
				kboosting=1//down?1:0
				break
			case 36://Home
				krespawn=1
				break
		}
	}
	pedal=Math.max(0,Math.min(1,kpedal))
	brake=Math.max(0,Math.min(1,kbrake))
	boosting=Math.max(0,Math.min(1,kboosting))
	steer=Math.max(-1,Math.min(1,ksteer))
	if(krespawn){
		respawning=0.01
	}
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
