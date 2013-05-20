function Ship(){
	this.__proto__=_Ship
	
	//Model and scene
	this.main=null//The object that adheres to the track, always
	this.holder=new THREE.Object3D()//The object that the camera follows, holds the model
	this.model=new THREE.Object3D()//The object that does barrel rolls
	this.camera=new THREE.Object3D()//Simulate a followed camera
	this.hull=null//Set up in setUpModel()
	this.collider=null
	this.thrust=null
	this.boost=null
	this.shine=null
	this.quanta=1
	this.setUpModel()
	
	//Rays and directions
	this.left=new THREE.Vector3()
	this.up=new THREE.Vector3()
	this.front=new THREE.Vector3()
	this.floor=new THREE.Vector3()
	
	//this.lookaway=0
	this.upsmooth=new THREE.Vector3(0,1,0)
	this.frontsmooth=new THREE.Vector3(0,0,-1)
	this.leftsmooth=new THREE.Vector3(1,0,0)
	this.frontsmoothless=new THREE.Vector3(0,0,-1)
	this.camerahit=new THREE.Vector3()
	this.holderOffset=new THREE.Vector3()
	this.respawnsave={position:new THREE.Vector3(),rotation:new THREE.Vector3()}
	this.nextsave=0
	
	//For show
	this.enginetemp=0
	this.floatphase=Math.random()*1000
	this.modelrotate=0//The rotation of the model when turning
	this.camstrafe=0//When the camera goes left/right while turning
	this.camboost=0//When the camera falls slightly behind when boosting
	this.camboostsmooth=0
	this.shiftsmooth=0//The smoothed out side-shifting
	this.hudColor=new THREE.Vector3()
	this.hurting=0
	this.uniforms={
		phase:0,
		motionblur:0,
	}
	this.radar=[]
	this.warning=[]
	
	//Mechanics
	this.lap=0
	this.lapstate=0//0: on track, 1: before line, 2: after line
	/*Lap logic:
	 * If enter 1,
	 *  if was in 2, lap--
	 * 
	 * If enter 2
	 *  if was in 1, lap++
	*/
	this.powerup=''
	this.poweringup=0
	this.absorbing=0
	this.shielding=0
	this.autopiloting=0
	this.assisting=0
	this.dropping=0
	this.charge=0
	this.dying=0
	
	//Velocities
	this.engineforce=new THREE.Vector3()
	this.externalforce=new THREE.Vector3()
	this.velocity=new THREE.Vector3()
	this.angularAxis=false
	this.boosting=0
	this.pushing=0
	this.aircount=5//This constant
	this.grounded=this.aircount
	this.energy=1
	this.addenergy=0
	this.gforce=new THREE.Vector3()
	this.vforce=new THREE.Vector3()
	this.hitapad=0
	
	//Roll
	this.rolling=0//Which direction rolling
	this.roll=0
	this.rollboost=0
	this.wasgrounded=10
	
	//Control variables
	this.pilotassist=true
	this.autoalign=0//Where on the track to align to
	this.control=new Control()//The pooled control object
	this.controlsmooth=new Control()//The final control object
	this.controller=false//If controlled by a controller, else autopilot
	this.autocontrol=new Control()
	this.dynamics={
		accelerate:4000,//Acceleration force (N)
		topspeed:1000/mph,//Speed achievable by acceleration
		/* 400 Vector
		 * 500 Venom
		 * 600 Flash
		 * 700 Rapier
		 * 800 Phantom
		 */
		mass:2000,//Kilograms
		handle:0.1,//Handling
		turndeg:0.032,//Radians for how fast to turn
		shiftdeg:0.01//Radians for how fast to shift
	}
}
_Ship={//All useful ship functions
	setUpModel:function(){
		//Sets up the model
		this.main=new THREE.Mesh(
			new THREE.CubeGeometry(5,3,8,1,1,1),
			new THREE.MeshBasicMaterial()
		)
		this.main.visible=false
		this.main.ship=this
		colliders.push(this.main)
		this.hull=resource.hullObj.clone()
		this.hull.material=resource.hullMat.clone()
		this.shield=resource.shieldObj.clone()
		this.shield.material=resource.shieldMat.clone()
		this.shield.visible=false
		this.absorb=resource.absorbObj.clone()
		this.absorb.material=resource.absorbMat.clone()
		this.absorb.visible=false
		this.thrust=new THREE.Ribbon(//THREE.Ribbon(
			new THREE.Geometry(),
			resource.thrustMat//resource.ribbonMat
		)
		for(var c=0;c<trail;c++){
			var col=new THREE.Color(0xFFFFFF)
			this.thrust.geometry.colors.push(col)
			this.thrust.geometry.colors.push(col)
			var a=new THREE.Vector3()
			a.velocity=new THREE.Vector3()
			a.color=0
			this.thrust.geometry.vertices.push(a)
			this.thrust.geometry.vertices.push(new THREE.Vector3())
		}
		//this.shine=new THREE.Sprite(resource.shineMat.clone())
		//this.shine.position.set(0,0,1.9)
		//this.shine.scale.multiplyScalar(2)
		
		//Get hierarchies sorted out
		scene.add(this.holder)
		this.main.add(this.collider)
		this.holder.add(this.model)
		scene.add(this.camera)
		this.model.add(this.hull)
		this.model.add(this.boost)
		this.model.add(this.shield)
		this.model.add(this.absorb)
		scene.add(this.thrust)
		//this.model.add(this.shine)
		
		this.camera.eulerOrder='YXZ'
	},
	respawn:function(){
		this.hull.material.map=resource.hullTex
		this.main.position.copy(this.respawnsave.position)
		this.main.rotation.copy(this.respawnsave.rotation)
		this.holder.position.copy(this.respawnsave.position)
		this.holder.rotation.set(0,0,0)
		this.camera.position.copy(this.respawnsave.position)
		this.camera.rotation.set(0,0,0)
		this.main.updateMatrixWorld()
		this.angularAxis=false
		this.energy=1
		this.directions()
		this.velocity.set(0,0,0)
		this.engineforce.set(0,0,0)
		this.externalforce.set(0,0,0)
		//this.shine.material.opacity=1
		this.powerup=''
		this.upsmooth.copy(this.up)
		this.frontsmooth.copy(this.front)
		this.leftsmooth.copy(this.left)
		this.frontsmoothless.copy(this.front)
		this.quanta=1
		this.lap=0
		this.lapstate=0
	},
	simulate:function(){
		if(!paused){
			this.directions()
			this.sendRays()
		}
		this.checkControls()
		if(!paused){
			this.calculateForce()
			//this.main.position.add(this.velocity.clone().multiplyScalar(deltatime))
			this.resolveCollisions()
			this.modelFX()
			this.checkLap()
			this.proximity()
		}
		this.modelCam()
	},
	directions:function(){
		this.left.set(1,0,0).transformDirection(this.main.matrixWorld)
		this.up.set(0,1,0).transformDirection(this.main.matrixWorld)
		this.front.set(0,0,-1).transformDirection(this.main.matrixWorld)
		
		this.upsmooth.lerp(this.up,camsmooth).normalize()
		this.frontsmooth.lerp(this.front,camsmooth).normalize()
		this.leftsmooth.lerp(this.left,camsmooth).normalize()
		this.frontsmoothless.lerp(this.front,0.3).normalize()
	},
	sendRays:function(){
		if(this.control.ex!=0&&(this.control.ex!=this.controlsmooth.ex)){
			var powerup=this.control.ex==2
			raycaster.ray.origin.copy(this.main.position)
			raycaster.ray.direction.copy(this.up).multiplyScalar(-1)
			var intersections=raycaster.intersectObject(track)
			if(intersections.length){
				var obj={position:intersections[0].point.clone(),rotation:this.main.rotation.clone()}
				if(powerup){
					obj.powerup=true
				}
				exported.push(obj)
				addBoostPad(intersections[0].point,this.main.rotation,powerup)
			}
			console.log(exported)
		}
		this.controlsmooth.ex=this.control.ex
	},
	autopilot:function(){
		raycaster.ray.origin.copy(this.main.position).add(this.left.clone().multiplyScalar(50))
		raycaster.ray.direction.copy(this.left).multiplyScalar(-1)
		var intersections=raycaster.intersectObject(autonav)
		var angle=align=wrongway=0
		if(intersections.length){
			var normal=intersections[0].face.normal.clone().transformDirection(intersections[0].object.matrix)
			align=intersections[0].distance<=100?50-intersections[0].distance:0
			normal.projectOnPlane(this.up)
			angle=(normal.angleTo(this.front)<Math.PI/2?-1:1)*normal.angleTo(this.left)*180/Math.PI
			wrongway=Math.abs(angle)>90?sign(angle):0
		}
		var combined=0.4*(angle+sign(align)*clamp(2*Math.abs(align)-2,0,15))//sign(align)*alignweight+(1-alignweight)*(1-0.0001/(0.0001+angle))*sign(angle)*autoangleweight
		if(this.pilotassist&&Math.abs(combined)>15&&this.velocity.length()>40){
			this.assisting=1
		}
		this.autocontrol.lbrake=wrongway?1:lerp(this.autocontrol.lbrake,-clamp(2*(combined+0.1),-1,0),0.5)
		this.autocontrol.rbrake=wrongway?1:lerp(this.autocontrol.rbrake,clamp(2*(combined-0.1),0,1),0.5)
		this.autocontrol.steer=lerp(this.autocontrol.steer,clamp(wrongway||combined,-1,1),0.5)
		this.autocontrol.boost=0
		this.autocontrol.accel=wrongway?0:1//0-30 full 30-60 taper >60 off
		/*if(time>this.nextautoalign){
			this.autoalign=Math.random()-0.5
			this.nextautoalign=time+60*5+Math.random()*15
		}*/
		if(this.powerup){
			if(this.energy<0.4){//Absorb it!
				this.autocontrol.use=-1
			}
			else{//Use it!
				this.autocontrol.use=1
			}
		}
		else{
			this.autocontrol.use=0
		}
	},
	checkControls:function(){
		if(!paused){
			if(this.energy<=0){//Dead. Disable controls
				this.control.zero()
			}
			else if(this.controller){//Human Control
				this.control.copy(this.controller)
				if(this.pilotassist||this.autopiloting){
					this.autopilot()
				}
				if(this.autopiloting){
					this.assisting=0
					this.control.autopilot(this.autocontrol)
				}
				else if(this.assisting){
					this.control.assist(this.autocontrol)
				}
			}
			else{//No controller
				this.autopilot()
				this.control.copy(this.autocontrol)
			}
		}
		if(!paused){
			this.controlsmooth.accel=/*zone?1:*/clamp(this.control.accel,0,1)
			this.enginetemp=this.controlsmooth.accel>this.enginetemp?Math.min(this.enginetemp+deltatime/3,this.controlsmooth.accel):Math.max(this.enginetemp-deltatime,0)
			this.controlsmooth.lbrake=clamp(lerp(this.controlsmooth.lbrake,this.control.lbrake*this.control.lbrake,0.5),0,1)
			this.controlsmooth.rbrake=clamp(lerp(this.controlsmooth.rbrake,this.control.rbrake*this.control.rbrake,0.5),0,1)
			this.controlsmooth.pitch=clamp(lerp(this.controlsmooth.pitch,this.control.pitch,0.1),-1,1)
			this.controlsmooth.boost=clamp(this.control.boost,0,1)
			var f=more(this.control.steer,this.controlsmooth.steer)?1:0.2
			var d=this.control.steer-this.controlsmooth.steer
			this.controlsmooth.steer=clamp(this.controlsmooth.steer+(d>0?1:-1)*(1-f/(f+Math.abs(d))),-1,1)
			this.controlsmooth.roll=clamp(lerp(this.controlsmooth.roll,this.control.roll,0.5),-1,1)
			if(this.control.respawn&&(this.control.respawn!=this.controlsmooth.respawn)){
				this.respawn()
			}
			this.controlsmooth.respawn=this.control.respawn
			//if(zone&&time%600==0){
			//	this.nextQuanta()
			//}
			if(this.control.use==-1&&this.control.use!=this.controlsmooth.use){
				if(this.powerup){
					this.heal(powerups[this.powerup].energy)
					this.powerup=''
				}
				else{//Cancel other effects
					if(this.shielding>fadeout){
						this.shielding=fadeout
					}
					if(this.autopiloting>0){
						this.autopiloting=0
					}
				}
			}
			if(this.control.use==1&&this.control.use!=this.controlsmooth.use&&this.powerup&&!this.autopiloting){
				//if(this.powerup!='emp'||this.charge>=1){
					powerups[this.powerup].use(this)
					this.powerup=''
					this.charge=0
				/*}
				else if(this.powerup=='emp'){
					this.charge+=deltatime*1.5
					if(this.charge>=1){
						powerups[this.powerup].use(this)
						this.powerup=''
					}
				}*/
			}
			/*if(this.powerup!='emp'||this.control.use!=1){
				this.charge=lerp(this.charge,0,0.5)
			}*/
			this.controlsmooth.use=this.control.use
		}
		/*this.controlsmooth.lookx=clamp(lerp(this.controlsmooth.lookx,this.control.lookx,0.1),-1,1)
		this.controlsmooth.looky=clamp(lerp(this.controlsmooth.looky,this.control.looky,0.1),-1,1)
		this.lookaway=clamp(Math.max(Math.abs(this.controlsmooth.lookx),
				Math.abs(this.controlsmooth.looky)),0,1)
		if(!paused&&(this.lookaway>0.1||mouse.down)&&this.velocity.length()>40){
			this.shield.material.map=resource.autopilotTex
			this.autopiloting=1.5//Math.max(this.autopiloting,2)
		}*/
	},
	calculateForce:function(){
		var morelength=0,length=this.engineforce.length(),handle=this.dynamics.handle
		if(this.dying==0){//Dead physics
			var finalrotation=modelrotation=0
			this.vforce.copy(this.velocity).multiplyScalar(2)
			if(this.pushing>0){//Being pushed along
				if(length<maxspeed){
					morelength+=this.dynamics.mass*Math.min(pushrate*(maxspeed-length),maxspeed-length)
				}
			}
			else if(this.controlsmooth.boost||this.boosting>0){//Boosting
				//Boosting is guaranteed for a certain amount of time
				if(this.boosting==0){
					//Just started
					this.camboost=1
					this.uniforms.phase=slightly
					//if(zone){this.nextQuanta()}
				}
				this.hurt(boostusage,0,true)
				this.boosting=Math.max(0,this.boosting-0.2)
				if(this.controlsmooth.boost){
					this.boosting=1
				}
				if(length<boostspeed){
					morelength+=this.dynamics.mass*Math.min(20,boostspeed-length)//Speed of sound is 340 m/s
				}
			}
			else if(this.controlsmooth.accel){//Normal acceleration
				if(length<this.dynamics.topspeed){
					morelength+=Math.pow(1-length/this.dynamics.topspeed,0.9)*(this.controlsmooth.accel*this.dynamics.accelerate)
				}
			}
			if(Math.min(this.controlsmooth.lbrake,this.controlsmooth.rbrake)>0){//Braking? Active deccel.
				if(length>0){//&&!zone){
					morelength-=this.dynamics.mass*Math.min(brakespeed*Math.min(this.controlsmooth.lbrake,this.controlsmooth.rbrake),length)
				}
			}
			//handle=lerp(this.dynamics.handle,0.1,Math.max(this.controlsmooth.lbrake,this.controlsmooth.rbrake))
			morelength=Math.max(-length*handle,morelength/this.dynamics.mass)
		
			var realsteer=(this.grounded?1:airturn)*this.dynamics.turndeg//*(this.engineforce.length()*0.001+1)
			if(this.controlsmooth.steer){//Steering
				finalrotation+=-this.controlsmooth.steer*realsteer
				modelrotation+=this.controlsmooth.steer*realsteer
			}
			//Left/right shift
			this.shiftsmooth=lerp(this.shiftsmooth,-(this.controlsmooth.rbrake-this.controlsmooth.lbrake)*(this.grounded?1:airshift),0.2)
			if(this.shiftsmooth){
				finalrotation+=this.shiftsmooth*(this.grounded?1:airturn)*this.dynamics.shiftdeg
			}
			
			//Adjustable skid
			if(countdown<=0){
				this.engineforce.copy(
					this.front.clone().multiplyScalar(length*handle+morelength)
					.add(this.engineforce.clone().multiplyScalar(1-handle))
				)
				this.main.rotateOnAxis(this.up,finalrotation)
				this.modelrotate+=-this.shiftsmooth*0.02+modelrotation
			}
			this.pushing=Math.max(0,this.pushing-deltatime)
			this.externalforce.add(this.up.clone().multiplyScalar(-9.8*(2-0.5*this.controlsmooth.pitch)))//Fall
		}
		else{//Dead stuff
			if(this.angularAxis==false){//BOOM!
				//this.engineforce.set(0,0,0)
				this.hull.material.map=resource.hullToastTex
				this.externalforce.set(Math.random()-0.5,80,Math.random()-0.5)
				this.angularAxis=new THREE.Quaternion().setFromEuler(
					new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).multiplyScalar(0.5)
				,'XYZ')
				for(var c=0;c<100;c++){//Flying sparks
					addSpark(this.main.position,0.7)
				}
				for(var c=0;c<20;c++){//Fireballs
					addEmitter(this.main.position,new THREE.Vector3(2*(Math.random()-0.5),Math.random()+0.5,2*(Math.random()-0.5)).multiplyScalar(1),Math.random()*2,true)
				}
				for(var c=0;c<100;c++){//Fire
					addSmoke(new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5).normalize().multiplyScalar(10).add(this.main.position),true)
				}
				this.camerahit.set(Math.random()-0.5,Math.random()-0.5,0).multiplyScalar(2)
			}
			var q=new THREE.Quaternion().setFromEuler(this.main.rotation,this.main.eulerOrder)
			q.multiply(this.angularAxis)
			this.main.rotation.setEulerFromQuaternion(q,this.main.eulerOrder)
			this.externalforce.y-=9.8*0.1//9.8//Fall
		}
		//Friction stuff
		this.engineforce.multiplyScalar(Math.max(0,1-
			(1/(1+morelength))*length*friction))//Thrust friction
		//this.externalforce.y-=9.8*2//Fall
		
		this.externalforce.multiplyScalar(extfriction)//External friction
		
		//Shift, continued
		//this.externalforce.add(this.left.clone().multiplyScalar(-this.shiftsmooth*shiftspeed*(this.grounded?1:airshift)))
		this.velocity.addVectors(
			this.engineforce.clone().applyAxisAngle(this.up,this.dynamics.shiftdeg*this.shiftsmooth)
			,this.externalforce
		)
		this.vforce.sub(this.velocity)
	},
	resolveCollisions:function(){
		/*this.resolveRay(this.bottomray,10)
		this.resolveRay(this.leftray,1,true)
		this.resolveRay(this.rightray,1,true)*/
		this.hitapowerup=false
		this.sparknormal=false
		this.autoalign=0
		this.grounded=Math.max(this.grounded-1,0)
		var forwards=new THREE.Vector3().copy(this.velocity)
		this.solveRay(this.main.position,forwards,forwards.length()*deltatime,colliders.concat(rescolliders,[trackcollide]))
		if(countdown<=0&&!this.grounded!=!this.wasgrounded){
			if(this.grounded){
				//Just landed
				this.rolling=0
				if(this.dying==0&&this.rollboost){
					this.camboost=1
					this.pushing=Math.max(this.pushing,this.rollboost)
					this.uniforms.phase=slightly
				}
				this.rollboost=0
			}
		}
		this.wasgrounded=this.grounded
		this.hurting=Math.max(0,this.hurting-deltatime)
		this.shielding=Math.max(0,this.shielding-deltatime)
		this.absorbing=Math.max(0,this.absorbing-deltatime)
		this.poweringup=Math.max(0,this.poweringup-deltatime)
		this.autopiloting=Math.max(0,this.autopiloting-deltatime)
		this.assisting=Math.max(0,this.assisting-deltatime)
		this.dropping=Math.max(0,this.dropping-deltatime)
		
		if(this.sparknormal){//Scraping
			var vel=this.velocity.clone().multiplyScalar(deltatime*0.9)
			addSpark(this.main.position.clone().sub(vel).sub(this.sparknormal),vel)
			this.hurt(collisionusage*Math.abs(this.sparknormal.dot(this.front)),0.01)
		}
		if(this.dying==0){//None of this after boom boom
			if(this.hitapad==2){
				//if(zone){this.nextQuanta()}
				this.hitapad=1
				if(this.hitapowerup){
					if(!this.powerup&&!this.autopiloting){
						var rand=Math.random()
						for(var p in powerups){
							rand-=powerups[p].probability
							if(rand<=0){
								this.powerup=p
								this.poweringup=powerupduration
								break
							}
						}
						
					}
				}
				else{
					//this.uniforms.phase=slightly
					this.pushing=Math.max(this.pushing,0.2)
				}
					//this.heal(0.05)
			}
			if(this.dropping&&time%3==0){
				addResidue(this.front.clone().multiplyScalar(-3).add(this.main.position))
			}
		}
		this.vforce.sub(this.velocity)
		var len=this.vforce.length()
		//this.vforce.multiplyScalar(len?Math.min(1,len)/len:0)
		this.vforce
		.transformDirection(new THREE.Matrix4().getInverse(this.main.matrix))//.lerp(this.vforce,0.1)
		.multiplyScalar(len)
		this.gforce.lerp(this.vforce,0.1)
	},
	solveRay:function(origin,direction,distance,objects,_times,_now,_previousface,_wasfloor){
		//console.log('solved')
		//Trace a ray in direction. If it hits a wall, trace again, until distance runs out.
		_times=_times||1
		_now=_now||direction.clone()
		_now.normalize()
		raycaster.ray.origin.copy(origin)
		raycaster.ray.direction.copy(_now)
		var intersections=raycaster.intersectObjects(objects)
		var intersection=false
		for(var c=0;c<intersections.length;c++){
			if(intersections[c].distance-collisionconst>distance){
				if(this.hitapad==1){//No pad
					this.hitapad=0
				}
				break
			}
			if(!intersection&&
				(intersections[c].object===trackcollide||intersections[c].object.ship)){
				intersection=intersections[c]
			}
			if(intersections[c].object.boostpad&&_times==1){
				if(this.hitapad==0){
					this.hitapowerup=intersections[c].object.powerup
					this.hitapad=2
				}
			}
			if(intersections[c].object.residue&&_times==1){
				this.hurt(0.05,0.3)
				if(!this.shielding&&!this.autopiloting){
					this.slow(residueslow)
				}
				removeResidue(intersections[c].object)
			}
		}
		if(c>=intersections.length&&this.hitapad==1){//No pad
			this.hitapad=0
		}
		if(intersection){
			//Hit something
			
			var normal=intersection.face.normal.clone().transformDirection(intersection.object.matrix)
			distance-=Math.max(intersection.distance-collisionconst,0)
			origin.copy(intersection.point).add(
				_now.clone().multiplyScalar(-collisionconst))
			if(_previousface&&normal.equals(_previousface)){
				//Hit the same face twice.
				//console.log('Houstin, we have a problem.')
				/*var l=new THREE.Line(
					new THREE.Geometry(),
					new THREE.LineBasicMaterial()
				)
				l.geometry.vertices.push(intersection.point.clone())
				l.geometry.vertices.push(intersection.point.clone().add(_now))
				l.geometry.verticesNeedUpdate=true
				scene.add(l)*/
				_now.add(normal.clone().multiplyScalar(0.05))
			}
			//Sparks!
			var dot=normal.dot(this.up)
			if(Math.abs(dot)<0.7){
				this.sparknormal=normal.clone()
			}//Wall scrape
			//Now originating from the point of intersection (and a bit inwards)
			/*if(!intersection.face.isfloor){
				//Wall. Kick it back
				this.externalforce.add(normal)
			}*/
			if(intersection.object.ship){//Hit another ship
				//Compensate for other motion
				this.engineforce.sub(intersection.object.ship.velocity)
				this.externalforce.sub(intersection.object.ship.velocity)
			}
			if(!_previousface||intersection.face.isfloor==_wasfloor){
				var dotl=normal.dot(this.left)
				var dotu=normal.dot(new THREE.Vector3(0,1,0))
				if(!_previousface&&intersection.face.isfloor){//Used to be dotu
					if(intersection.face.align){
						this.autoalign=intersection.face.align
					}
					//Hit floor
					this.grounded=this.aircount
					var angle=Math.acos(clamp(dot,-1,1))
					//if(angle>Math.PI/2){angle-=Math.PI}
					if(this.dying==0&&angle!=0){
						var inv=new THREE.Matrix4().getInverse(this.main.matrix)
						this.main.rotateOnAxis(
							normal.clone().cross(this.up).transformDirection(inv),
							-angle
						)
					}
					this.externalforce.set(0,0,0)
					//this.velocity.addVectors(this.engineforce,this.externalforce)
					//_now.copy(this.velocity).normalize()
				}
				restrict(_now.multiplyScalar(distance),normal)
				restrict(this.engineforce,normal)
				restrict(this.externalforce,normal)
				this.velocity.addVectors(this.engineforce,this.externalforce)
				distance=_now.length()
				/*var debug=new THREE.Mesh(
					new THREE.CubeGeometry(1,1,.1,1,1,1),
					new THREE.MeshNormalMaterial()
				)
				debug.lookAt(normal)
				debug.position.copy(intersection.point)
				scene.add(debug)*/
			}
			else{
				//Floor-wall collision
				//console.log('cross')
				var crossed=_previousface.clone().cross(normal)
				_now.multiplyScalar(distance).projectOnVector(crossed)
				this.engineforce.projectOnVector(crossed)
				this.externalforce.projectOnVector(crossed)
				this.velocity.addVectors(this.engineforce,this.externalforce)
				distance=_now.length()
			}
			if(intersection.object.ship){
				this.engineforce.add(intersection.object.ship.velocity)
				this.externalforce.add(intersection.object.ship.velocity)
			}
			if(_times<maxcollisions&&distance>0.01){
				return this.solveRay(origin,direction,distance,objects,_times+1,_now,normal,intersection.face.isfloor)//Continue
			}
			else{
				return _now
			}
		}
		else{//Continue on
			origin.add(_now.clone().multiplyScalar(distance))
			return _now
		}
	},
	checkLap:function(){
		var incylinder=
			this.main.position.x>-35&&
			this.main.position.x<35&&
			this.main.position.y>-35&&
			this.main.position.y<35
		if(incylinder&&
			this.main.position.z<35&&
			this.main.position.z>0
		){
			if(this.lapstate==2){
				this.lap=Math.max(this.lap-1,0)
			}
			this.lapstate=1
		}
		else if(incylinder&&
			this.main.position.z<=0&&
			this.main.position.z>-35
		){
			if(this.lapstate==1){
				this.lap++
			}
			this.lapstate=2
		}
		else{
			this.lapstate=0
		}
	},
	hurt:function(amount,shake,override){
		if(override||!this.shielding&&!this.autopiloting){
			this.energy=Math.max(this.energy-amount,0)
			this.hurting=hurtduration
		}
		if(shake&&this.dying==0){
			this.camerahit.set(Math.random()-0.5,Math.random()-0.5,0).multiplyScalar(shake)
		}
		//this.hudColor.add(orange.clone().multiplyScalar(amounthurt*deltatime))
	},
	heal:function(amount){
		this.energy=Math.min(this.energy+amount,1)
		this.absorbing=absorbduration
		//this.hudColor.add(orange.clone().multiplyScalar(amounthurt*deltatime))
	},
	slow:function(amount){
		var len=this.engineforce.length()
		this.engineforce.multiplyScalar(Math.max(0,len-amount)/(len==0?1:len))
	},
	modelCam:function(){
		var incomp=1-this.camboostsmooth*0.3
		var camstrafe=this.modelrotate*Math.min(this.engineforce.length()*deltatime*0.08,1)
		this.camera.up.copy(this.upsmooth).lerp(
			new THREE.Vector3(0,1,0),
			clamp(this.dying==0?0:1,0,1)
		)
		if(!this.control.rearview||this.dying>0){
			//Normal camera
			if(this.camera.children.length){
				this.camera.children[0].fov=minfov+addfov*this.camboostsmooth
				/*if(this.dying!=0){
					this.camera.children[0].fov=
						Math.min(
							this.camera.children[0].fov,
							900/this.camera.position.distanceTo(this.holder.position)
						)
				}*/
				this.camera.children[0].updateProjectionMatrix()
			}
			var togo=this.holder.position.clone().add(
					this.frontsmooth.clone().multiplyScalar(-2*(clamp(this.dying==0?0:1,0,1))+incomp*(-4.5
						-3*Math.min(this.engineforce.length()*deltatime*0.085,1)*(1-0.2*this.camboostsmooth)))
					.add(this.upsmooth.clone().multiplyScalar(3*incomp))
					.add(this.leftsmooth.clone().multiplyScalar(2.5*incomp*camstrafe)))
			if(this.dying==0){
				this.camera.position.copy(togo)
			}
			this.camera.lookAt(this.holder.position.clone()
				.add(this.frontsmooth.clone().multiplyScalar(4))
				.add(this.leftsmooth.clone().multiplyScalar(3*camstrafe))
				.lerp(this.main.position,clamp(this.dying==0?0:1,0,1)))
			this.camera.rotation.add(this.camerahit)
			/*this.camera.rotation.x+=Math.PI/2*this.controlsmooth.looky
			this.camera.rotation.y-=Math.PI*this.controlsmooth.lookx*/
		}
		else{
			//Rearview camera
			this.camera.position.copy(this.holder.position)
				.add(this.upsmooth.clone().multiplyScalar(3.5))
			this.camera.lookAt(this.camera.position.clone().add(this.frontsmooth.clone().multiplyScalar(-5)))
		}
		this.camerahit.multiplyScalar(0.8)
		if(time%5==0){
			this.camerahit.multiplyScalar(-1)
		}
		this.uniforms.motionblur=(this.boosting>0||this.pushing>0)&&this.dying==0?1:
			lerp(this.uniforms.motionblur,0,0.1)
		
		if(this.uniforms.phase>0){
			this.uniforms.phase+=Math.min(0.03,1-this.uniforms.phase)
			if(this.uniforms.phase==1){
				this.uniforms.phase=0
			}
		}
	},
	modelFX:function(){
		//Rolling. Needs a better home.
		if(this.rolling){
			//Continue rolling
			this.roll=this.rolling*0.05+this.roll//lerp(this.roll,this.rolling,0.05)
			if(Math.abs(this.roll)>0.75){
				this.rolling=0
				this.rollboost+=rollboost
				this.roll+=this.roll>0?-1:1
			}
		}
		else if(this.control.roll&&!this.grounded){
			this.rolling=this.control.roll>0?1:-1
		}
		else{//Not rolling
			this.roll=lerp(this.roll,0,0.1)
		}
		
		this.holder.up.copy(this.upsmooth)
		this.holder.position.copy(this.main.position).sub(this.holderOffset)
		this.holderOffset.multiplyScalar(0.9)
		this.holder.lookAt(this.main.position.clone().add(this.frontsmoothless.clone().multiplyScalar(-5)))
		var rotate=new THREE.Vector3(
			0.2*this.controlsmooth.pitch+0.03*Math.sin(time*0.04+this.floatphase),
			0.03*Math.sin(time*0.02+this.floatphase),
			clamp(-1.5*this.modelrotate,-0.7,0.7)-Math.PI*2*this.roll+0.03*Math.sin(time*0.03+this.floatphase)
		)
		this.model.rotation.copy(rotate)
		//this.holder.updateMatrix()
		this.holder.position.add(
				this.up.clone()
				.multiplyScalar(Math.sin(time*0.025+this.floatphase)*0.3)
		)
		this.modelrotate*=0.95
		this.camboostsmooth=lerp(this.camboostsmooth,this.camboost?1:this.pushing||this.boosting?0.6:0,0.1)
		this.camboost=Math.max(0,this.camboost-0.05)
		//Smoke trail
		/*if(this.energy==0){
			this.shine.material.opacity=0
		}
		else{
			this.shine.material.opacity=1
		}*/
		if(this.energy<0.3){
			if(this.dying==0){
				addSmoke(this.front.clone().multiplyScalar(-2).add(this.main.position))
			}
			else{
				addSmoke(this.main.position.clone())
			}
		}
		//Perform death
		if(this.energy<=0||this.dying>0){
			this.enginetemp=0
			this.dying+=deltatime
		}
		if(this.dying>2){
			this.dying=0
			this.respawn()
		}
		//Exhaust line
		//this.main.updateMatrixWorld()
		this.holder.updateMatrixWorld()
		this.model.updateMatrixWorld()
		this.thrust.geometry.vertices[0].set(0.15,0.15,2.6).applyMatrix4(this.model.matrixWorld)
		this.thrust.geometry.vertices[1].set(-0.15,0.15,2.6).applyMatrix4(this.model.matrixWorld)
		
		this.thrust.geometry.vertices[0].velocity.copy(this.frontsmooth).multiplyScalar(-5)
		this.thrust.geometry.vertices[0].color=this.enginetemp
		this.thrust.geometry.colors[0].setRGB(0.5,0.8,1).multiplyScalar(this.thrust.geometry.vertices[0].color)
		this.thrust.geometry.colors[1].setRGB(0.5,0.8,1).multiplyScalar(this.thrust.geometry.vertices[0].color)
		for(var c=this.thrust.geometry.vertices.length-2;c>=2;c-=2){
			this.thrust.geometry.vertices[c].velocity.copy(this.thrust.geometry.vertices[c-2].velocity).multiplyScalar(0.8)
			this.thrust.geometry.vertices[c].color=Math.max(this.thrust.geometry.vertices[c-2].color-1/trail,0)
			this.thrust.geometry.vertices[c].copy(this.thrust.geometry.vertices[c-2]).add(this.thrust.geometry.vertices[c].velocity)
			this.thrust.geometry.vertices[c+1].copy(this.thrust.geometry.vertices[c-1]).add(this.thrust.geometry.vertices[c].velocity)
			this.thrust.geometry.colors[c].setRGB(0.5,0.8,1).multiplyScalar(this.thrust.geometry.vertices[c].color)
			this.thrust.geometry.colors[c+1].setRGB(0.5,0.8,1).multiplyScalar(this.thrust.geometry.vertices[c].color)
		}
		this.thrust.geometry.verticesNeedUpdate=true
		this.thrust.geometry.colorsNeedUpdate=true
		this.shield.visible=!!this.shielding||!!this.autopiloting
		this.absorb.visible=!!this.absorbing
		this.shield.material.opacity=Math.min(this.shield.material.opacity+(deltatime/fadein),(1/fadeout)*Math.min(fadeout,Math.max(this.shielding,this.autopiloting)))
		this.absorb.material.opacity=Math.min(this.absorb.material.opacity+(deltatime/fadein),(1/fadeout)*Math.min(fadeout,this.absorbing))
	},
	proximity:function(){
		var inv=new THREE.Matrix4().getInverse(this.main.matrix)
		this.radar=[]
		this.warning=[]
		for(var s=0;s<ships.length;s++){
			if(ships[s]!==this&&ships[s].energy>0){
				var delta=ships[s].main.position.clone().applyProjection(inv)
				delta.len=delta.length()
				if(delta.z>0&&delta.len<radarfar){
					this.radar.push(delta)
				}
			}
		}
		this.radar.sort(function(a,b){return a.z-b.z})
		for(var m=0;m<missiles.length;m++){
			var dist=missiles[m].distanceTo(this.main.position)
			if(missiles[m].owner!==this&&dist<radarfar){
				if(dist<10){
					//We are hit!
					this.hurt(0.2,0.3)
					this.slow(10)
					for(var s=0;s<20;s++){
						addSpark(missiles[m],0.7)
					}
					missiles.splice(m,1)
					m--
				}
				else{
					var warn=missiles[m].clone().sub(this.main.position).applyProjection(inv)
					if(warn.angleTo(new THREE.Vector3(0,0,1))<Math.PI/2){//Behind
						warn.type='Missiles'
						warn.front=false
						this.warning.push(warn)
					}
				}
			}
		}
		for(var r=0;r<rescolliders.length;r+=10){
			var dist=rescolliders[r].position.distanceTo(this.main.position)
			if(dist<radarfar){
				var warn=rescolliders[r].position.clone().sub(this.main.position).applyProjection(inv)
				if(warn.angleTo(new THREE.Vector3(0,0,-1))<Math.PI/2){//In front
					warn.type='Residue'
					warn.front=true
					this.warning.push(warn)
				}
			}
		}
	},
	updateHUD:function(element){
		if(this.energy==0){
			element.style.display='none'
			return
		}
		element.style.display=''
		var flash=time%10<=5
		var powerup=element.getElementsByClassName('powerup')[0]
		var speed=element.getElementsByClassName('speed')[0]
		var energy=element.getElementsByClassName('energy')[0]
		var lowerleft=element.getElementsByClassName('lowerleft')[0]
		var currentlap=element.getElementsByClassName('currentlap')[0]
		var radar=element.getElementsByClassName('radar')[0]
		var warnfront=element.getElementsByClassName('warnfront')[0]
		var warnbehind=element.getElementsByClassName('warnbehind')[0]
		var topcenter=element.getElementsByClassName('topcenter')[0]
		
		topcenter.innerText=this.assisting?'Pilot Assist':''
		
		if(this.radar.length){
			radar.style.left=clamp(this.radar[0].x*0.1+50,20,80)+'%'
			radar.innerText='||||||'.slice(0,Math.ceil(6*(1-this.radar[0].len/radarfar)))
		}
		else{
			radar.innerText=''
		}
		warnfront.innerText=''
		warnbehind.innerText=''
		if(this.warning.length){
			warnfront.style.color=
			warnbehind.style.color=flash?'red':'white'
			for(var w=0;w<this.warning.length;w++){
				if(this.warning[w].front){
					warnfront.innerText=this.warning[w].type
				}
				else{
					warnbehind.innerText=this.warning[w].type
				}
			}
		}
		speed.innerText=Math.round(this.engineforce.length()*mph)
		energy.innerText=Math.round(this.energy*100)
		
		currentlap.innerText=Math.max(1,this.lap)
		
		lowerleft.style.color=
			(!!this.shielding||!!this.autopiloting)?(flash&&(!!this.hurting||!!this.absorbing)?whitehex:greenhex)://Shielding
			flash&&!!this.absorbing?greenhex:
			(!this.hurting&&this.energy<=0.3||!flash&&(!!this.hurting||this.energy<=0.1))?redhex:whitehex
		var autodisengaging=(this.autopiloting>0&&this.autopiloting<=1)
		powerup.innerText=this.autopiloting?'Autopilot '+(autodisengaging?'Disengaging':'Engaged'):
			(this.powerup&&powerups[this.powerup].name)
		powerup.style.color=flash&&(this.poweringup||
				autodisengaging)?'black':
			this.autopiloting?greenhex:whitehex
		
		//element.style.opacity=clamp(1-this.lookaway*10,0,1)
		if(false){
			element.style.top=25+me.gforce.y+'%'
			element.style.left=50+me.gforce.x+'%'
			var scale=me.gforce.z+100
			element.style.width=scale+'%'
			element.style.height=scale+'%'
		}
	},
	nextQuanta:function(){
		this.quanta++
		var q=50/mph
		this.dynamics.accelerate+=0.5
		this.dynamics.topspeed+=q
		maxspeed+=q
		boostspeed+=q
	},
	copyUniforms:function(cool){
		cool.motionblur.value=this.uniforms.motionblur
		cool.phase.value=this.uniforms.phase
	}
}
