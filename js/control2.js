//Variables
keyboard={
	accel:0,
	lbrake:0,
	rbrake:0,
	boost:0,
	steer:0,
	pitch:0,
	roll:0,
	use:0
}
keyboard2={
	accel:0,
	lbrake:0,
	rbrake:0,
	boost:0,
	steer:0,
	pitch:0,
	roll:0,
	use:0
}
controllers=[null,null]
threshold=0.05
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
function gamepad(){
	for(var c=0;c<=1;c++){
		var g=navigator.webkitGetGamepads()[c]
		if(g){
			if(controllers[c]===null){controllers[c]={}}
			if(deadZone(g.buttons[3])!=0){//Y
				controllers[c]=false
				continue
			}
			else{
				controllers[c]={}
			}
			if(controllers[c]){
				controllers[c].steer=deadZone(g.axes[0])//Main stick
				controllers[c].pitch=deadZone(g.axes[1])
				controllers[c].lbrake=deadZone((g.axes[3]+1)/2)//Triggers
				controllers[c].rbrake=deadZone((g.axes[4]+1)/2)
				controllers[c].accel=deadZone(g.buttons[1])//A
				controllers[c].boost=deadZone(g.buttons[2])!=0//B
				controllers[c].rearview=deadZone(g.buttons[7])
				if(deadZone(g.buttons[9])&&!controllers[c].respawn){
					controllers[c].respawn=1
				}
				if(!deadZone(g.buttons[9])&&controllers[c].respawn){
					controllers[c].respawn=0
				}
				controllers[c].roll=deadZone(g.buttons[5])-deadZone(g.buttons[4])+deadZone(g.buttons[7])//Clicking rolls
				//console.log(g.buttons)
			}
			//if(deadZone(g.buttons[9])!=0){respawn()}//Start
		}
	}
}
exported=[]
exportposition=false
//Keyboard
keys=[]
function keyChange(e){//Picks up any change in keys: keyup and keydown
	var ind=keys.indexOf(e.keyCode)
	if(e.type=='keydown'){
		if(ind==-1){
			keys.push(e.keyCode)
			//Adds a keycode to list keys ONLY if it is not there already
			//This cuts down on redundant repeated event fires, when you
			//	hold down a key
			keyHandle(e.keyCode,true)
			//console.log(e.keyCode)
			//This function gets called once per keyup/down
		}
	}
	else if(ind!=-1){
		keys.splice(ind,1)
		keyHandle(e.keyCode,false)
	}
	if(e.keyCode==45&&e.type=='keydown'){
		keyboard.export=1//Insert
	}
	if(e.keyCode==19&&e.type=='keydown'){
		keyboard.export=2//Pause
	}
}
function keyHandle(){
	keyboard.accel=0
	keyboard.lbrake=0
	keyboard.rbrake=0
	keyboard.boost=0
	keyboard.steer=0
	keyboard.pitch=0
	keyboard.roll=0
	keyboard.use=0
	keyboard.respawn=0
	keyboard.rearview=0
	
	keyboard2.accel=0
	keyboard2.lbrake=0
	keyboard2.rbrake=0
	keyboard2.boost=0
	keyboard2.steer=0
	keyboard2.pitch=0
	keyboard2.roll=0
	keyboard2.use=0
	keyboard2.respawn=0
	keyboard2.rearview=0
	
	for(var k=0;k<keys.length;k++){
		switch(keys[k]){
			case 87://W
				keyboard.accel+=1
				break
			case 65://A
				keyboard.steer-=1
				break
			case 83://S
				keyboard.rearview+=1
				break
			case 68://D
				keyboard.steer+=1
				break
			case 74://J
				keyboard.lbrake+=1
				break
			case 76://L
				keyboard.rbrake+=1
				break
			case 73://I
				keyboard.use=1
				break
			case 75://J
				keyboard.use=-1
				break
			case 38://Up
				keyboard2.accel+=1
				break
			case 40://Down
				keyboard2.boost+=1
				break
			case 37://Left
				keyboard2.steer-=1
				break
			case 39://Right
				keyboard2.steer+=1
				break
			case 90://Z
				keyboard.roll-=1
				break
			case 67://X
				keyboard.roll+=1
				break
			case 32://Space
			case 79://O
				keyboard.boost=1
				break
			case 36://Home
			case 82://R
				keyboard.respawn=1
				break
			case 186://;
				keyboard.rearview=1
				break
		}
	}
	/*if(krespawn &&respawning==0){
		respawning=0.01
	}*/
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
