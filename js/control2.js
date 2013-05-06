function Control(){
	this.__proto__=_Control
	this.zero()
	return this
}
_Control={
	zero:function(){
		this.accel=0
		this.lbrake=0
		this.rbrake=0
		this.boost=0
		this.steer=0
		this.pitch=0
		this.roll=0
		this.use=0
		this.respawn=0
		this.rearview=0
		this.ex=0
		this.lookx=0
		this.looky=0
	},
	copy:function(obj){
		this.accel=obj.accel
		this.lbrake=obj.lbrake
		this.rbrake=obj.rbrake
		this.boost=obj.boost
		this.steer=obj.steer
		this.pitch=obj.pitch
		this.roll=obj.roll
		this.use=obj.use
		this.respawn=obj.respawn
		this.rearview=obj.rearview
		this.ex=obj.ex
		this.lookx=obj.lookx
		this.looky=obj.looky
	}
}
//Variables
keyboard=new Control()
keyboard2=new Control()
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
			if(controllers[c]===null){
				controllers[c]=new Control()
				controllers[c].paused=false
			}
			if(controllers[c]){
				controllers[c].zero()
				controllers[c].steer=deadZone(g.axes[0])+deadZone(g.axes[6])//Main stick
				controllers[c].pitch=deadZone(g.axes[1])+deadZone(g.axes[7])
				controllers[c].lookx=deadZone(g.axes[5])//C stick
				controllers[c].looky=deadZone(g.axes[2])
				controllers[c].lbrake=deadZone((g.axes[3]+1)/2)//Triggers
				controllers[c].rbrake=deadZone((g.axes[4]+1)/2)
				controllers[c].accel=deadZone(g.buttons[1])//A
				controllers[c].boost=deadZone(g.buttons[2])//B
				controllers[c].use=deadZone(g.buttons[3])-deadZone(g.buttons[0])//Y-X
				controllers[c].rearview=deadZone(g.buttons[7])
				//controllers[c].respawn=deadZone(g.buttons[9])
				var cpaused=deadZone(g.buttons[9])!=0
				if(cpaused&&(cpaused!=controllers[c].paused)){
					paused=!paused
				}
				controllers[c].paused=cpaused
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
		if(e.keyCode==19){//Pause
			paused=!paused
		}
		if(ind==-1){
			keys.push(e.keyCode)
			//Adds a keycode to list keys ONLY if it is not there already
			//This cuts down on redundant repeated event fires, when you
			//	hold down a key
			keyHandle(e.keyCode,true)
			console.log(e.keyCode)
			//This function gets called once per keyup/down
		}
	}
	else if(ind!=-1){
		keys.splice(ind,1)
		keyHandle(e.keyCode,false)
	}
}
function keyHandle(){
	keyboard.zero()
	keyboard2.zero()
	keyboard.lookx=mouse.lookx
	keyboard.looky=mouse.looky
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
			case 45:
				keyboard.ex=1//Insert
				break
			case 46:
				keyboard.ex=2//Delete
				break
		}
	}
	/*if(krespawn &&respawning==0){
		respawning=0.01
	}*/
}
window.addEventListener('keyup',keyChange)
window.addEventListener('keydown',keyChange)
