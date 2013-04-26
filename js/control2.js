//Variables
keyboard={
	accel:0,
	lbrake:0,
	rbrake:0,
	boost:0,
	steer:0,
	pitch:0,
	roll:0
}
keyboard2={
	accel:0,
	lbrake:0,
	rbrake:0,
	boost:0,
	steer:0,
	pitch:0,
	roll:0
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
		//if(e.keyCode==45){exportposition=true}//Insert
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
	if(e.keyCode==82&&e.type=='keydown'&&!keyboard.respawn){
		keyboard.respawn=1
	}
	else if(e.keyCode==82&&e.type=='keyup'&&keyboard.respawn){
		keyboard.respawn=0
	}
	if(e.keyCode==45&&e.type=='keydown'){
		keyboard.export=1
	}
}
function keyHandle(){
	var ksteer=0,
		kaccel=0,
		klbrake=0,
		krbrake=0,
		kboost=0,
		kroll=0,
		krespawn=0,
		kpitch=0,
		krearview=0,
		ksteer2=0,
		kaccel2=0,
		kboost2=0,
		klbrake2=0,
		krbrake2=0
	for(var k=0;k<keys.length;k++){
		switch(keys[k]){
			case 87://W
				//kpitch-=1
				kaccel+=1
				break
			case 73://I
				//kaccel+=1
				break
			case 38://Up
				kaccel2+=1
				break
			case 65://A
				ksteer-=1
				break
			case 37://Left
				ksteer2-=1
				break
			case 83://S
				krearview+=1
				//kpitch+=1
				break
			case 74://J
				klbrake+=1
				break
			case 76://L
				krbrake+=1
				break
			case 40://Down
				kboost2+=1
				/*klbrake2+=1
				krbrake2+=1*/
				break
			case 68://D
				ksteer+=1
				break
			case 39://Right
				ksteer2+=1
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
			case 186://;
				krearview=1
				break
		}
	}
	keyboard.accel=Math.max(0,Math.min(1,kaccel))
	keyboard.lbrake=Math.max(0,Math.min(1,klbrake))
	keyboard.rbrake=Math.max(0,Math.min(1,krbrake))
	keyboard.boost=Math.max(0,Math.min(1,kboost))
	keyboard.steer=Math.max(-1,Math.min(1,ksteer))
	keyboard.roll=Math.max(-1,Math.min(1,kroll))
	keyboard.pitch=Math.max(-1,Math.min(1,kpitch))
	keyboard.rearview=krearview
	keyboard2.accel=Math.max(0,Math.min(1,kaccel2))
	keyboard2.steer=Math.max(-1,Math.min(1,ksteer2))
	keyboard2.lbrake=Math.max(-1,Math.min(1,klbrake2))
	keyboard2.rbrake=Math.max(-1,Math.min(1,krbrake2))
	keyboard2.boost=Math.max(-1,Math.min(1,kboost2))
	/*if(krespawn &&respawning==0){
		respawning=0.01
	}*/
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
