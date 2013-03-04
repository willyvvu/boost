//Keyboard
keys=[]
function keyChange(e){//Picks up any change in keys: keyup and keydown
	console.log(e.keyCode)
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
kleft=0
kright=0
kforwards=0
kbackwards=0
function keyHandle(code,down){
	switch(code){
		case 87://W
		case 38://Up
		case 73://I
			kforwards=down?1:0
			break
		case 65://A
		case 37://Left
			kleft=down?1:0
			break
		case 83://S
		case 40://Down
		case 74://J
			kbackwards=down?1:0
			break
		case 68://D
		case 39://Right
			kright=down?1:0
			break
		case 32://Space
		case 79://O
			boosting=down?1:0
			break
		case 36:
			ship.position.set(0,0,0)
			ship.rotation.set(0,0,0)
			velocity.set(0,0,0)
			fall=0
			break
	}
	pedal=kforwards
	brake=kbackwards
	steer=kright-kleft
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
