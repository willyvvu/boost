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
	
	this.upsmooth=new THREE.Vector3(0,1,0)
	this.frontsmooth=new THREE.Vector3(0,0,-1)
	this.leftsmooth=new THREE.Vector3(1,0,0)
	this.frontsmoothless=new THREE.Vector3(0,0,-1)
	this.holderOffset=new THREE.Vector3()
	this.respawnsave={position:new THREE.Vector3(),rotation:new THREE.Vector3()}
	this.nextsave=0
	
	//For show
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
	
	this.powerup=''
	this.poweringup=0
	this.absorbing=0
	this.shielding=0
	this.autopiloting=0
	
	//Velocities
	this.engineforce=new THREE.Vector3()
	this.externalforce=new THREE.Vector3()
	this.velocity=new THREE.Vector3()
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
	this.autoalign=0//Where on the track to align to
	this.control={
		accel:0,
		lbrake:0,
		rbrake:0,
		boost:0,
		steer:0,
		pitch:0,
		roll:0,
		use:0
	}//The pooled control object
	this.controlsmooth={
		accel:0,
		lbrake:0,
		rbrake:0,
		boost:0,
		steer:0,
		pitch:0,
		roll:0,
		use:0
	}//The final control object
	this.controller=false//If controlled by a controller, else autopilot
	this.autocontrol={
		accel:0,
		lbrake:0,
		rbrake:0,
		boost:0,
		steer:0,
		pitch:0,
		roll:0,
		use:0
	}
	this.dynamics={
		accelerate:8000,//Acceleration force (N)
		topspeed:800/mph,//Speed achievable by acceleration
		/* 400 Vector
		 * 500 Venom
		 * 600 Flash
		 * 700 Rapier
		 * 800 Phantom
		 */
		mass:2000,//Kilograms
		handle:0.5,//Handling
		turndeg:0.025,//Radians for how fast to turn
		shiftdeg:0.01//Radians for how fast to shift
	}
}
_Ship={//All useful ship functions
	setUpModel:function(){
		//Sets up the model
		this.main=new THREE.Mesh(
			new THREE.CubeGeometry(3,2,4.5,1,1,1),
			new THREE.MeshBasicMaterial()
		)
		this.main.visible=false
		this.main.ship=this
		colliders.push(this.main)
		this.hull=resource.hullObj.clone()
		this.hull.material=resource.hullMat
		this.shield=resource.shieldObj.clone()
		this.shield.material=resource.shieldMat.clone()
		this.shield.visible=false
		this.absorb=resource.absorbObj.clone()
		this.absorb.material=resource.absorbMat.clone()
		this.absorb.visible=false
		this.thrust=new THREE.Ribbon(
			new THREE.Geometry(),
			resource.ribbonMat
		)
		this.thrust.geometry.colors=resource.ribbonCol
		for(var c=0;c<trail;c++){
			this.thrust.geometry.vertices.push(new THREE.Vector3())
			this.thrust.geometry.vertices.push(new THREE.Vector3())
		}
		this.shine=new THREE.Sprite(resource.shineMat.clone())
		this.shine.position.set(0,0,1.9)
		this.shine.scale.multiplyScalar(2)
		
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
		this.model.add(this.shine)
		
		var lineMat = new THREE.LineBasicMaterial({
			color: 0xffffff,
		});
	},
	simulate:function(){
		this.directions()
		this.sendRays()
		if(!this.controller||this.autopiloting){this.autopilot()}
		this.checkControls()
		this.calculateForce()
		this.resolveCollisions()
		//this.main.position.add(this.velocity.clone().multiplyScalar(deltatime))
		this.modelCam()
		this.modelFX()
	},
	directions:function(){
		this.left=new THREE.Vector3(1,0,0).transformDirection(this.main.matrixWorld)
		this.up=new THREE.Vector3(0,1,0).transformDirection(this.main.matrixWorld)
		this.front=new THREE.Vector3(0,0,-1).transformDirection(this.main.matrixWorld)
		
		this.upsmooth.lerp(this.up,camsmooth).normalize()
		this.frontsmooth.lerp(this.front,camsmooth).normalize()
		this.leftsmooth.lerp(this.left,camsmooth).normalize()
		this.frontsmoothless.lerp(this.front,0.3).normalize()
	},
	sendRays:function(){
		if(this.control.export){
			var powerup=this.control.export==2
			var intersections=raycaster.intersectObject(track)
			if(intersections.length){
				var obj={position:intersections[0].point.clone(),rotation:this.main.rotation.clone()}
				if(powerup){
					obj.powerup=true
				}
				exported.push(obj)
				addBoostPad(intersections[0].point,this.main.rotation,powerup)
			}
			
			this.control.export=0
			console.log(exported)
		}
	},
	autopilot:function(){
		raycaster.ray.origin.copy(this.main.position).add(this.left.clone().multiplyScalar(50))
		raycaster.ray.direction.copy(this.left).multiplyScalar(-1)
		var intersections=raycaster.intersectObject(autonav)
		var angle=align=wrongway=0
		if(intersections.length){
			var normal=intersections[0].face.normal.clone().transformDirection(intersections[0].object.matrix)
			align=intersections[0].distance<=100?50-intersections[0].distance:0
			normal.projectOnPlane(this.floor)
			angle=(normal.angleTo(this.front)<Math.PI/2?-1:1)*normal.angleTo(this.left)*180/Math.PI
			wrongway=Math.abs(angle)>30?sign(angle):0
		}
		var combined=wrongway||0.3*(angle+sign(align)*clamp(2*Math.abs(align)-2,0,15))//sign(align)*alignweight+(1-alignweight)*(1-0.0001/(0.0001+angle))*sign(angle)*autoangleweight
		this.autocontrol.lbrake=wrongway?1:-clamp(combined+0.5,-1,0)
		this.autocontrol.rbrake=wrongway?1:clamp(combined-0.5,0,1)
		this.autocontrol.steer=clamp(combined,-1,1)
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
		if(countdown>0){return}
		if(this.controller&&!this.autopiloting){this.control=this.controller}
		else{this.control=this.autocontrol}
		if(this.autopiloting){
			this.control.use=this.controller.use//Be able to disable autopilot
		}
		this.controlsmooth.accel=zone?1:clamp(this.control.accel,0,1)
		this.controlsmooth.lbrake=clamp(lerp(this.controlsmooth.lbrake,this.control.lbrake*this.control.lbrake,0.5),0,1)
		this.controlsmooth.rbrake=clamp(lerp(this.controlsmooth.rbrake,this.control.rbrake*this.control.rbrake,0.5),0,1)
		this.controlsmooth.pitch=clamp(lerp(this.controlsmooth.pitch,this.control.pitch,0.1),-1,1)
		this.controlsmooth.boost=clamp(this.control.boost,0,1)
		var f=more(this.control.steer,this.controlsmooth.steer)?1:0.2
		var d=this.control.steer-this.controlsmooth.steer
		this.controlsmooth.steer=clamp(this.controlsmooth.steer+(d>0?1:-1)*(1-f/(f+Math.abs(d))),-1,1)
		this.controlsmooth.roll=clamp(lerp(this.controlsmooth.roll,this.control.roll,0.5),-1,1)
		if(this.control.respawn&&(this.control.respawn!=this.controlsmooth.respawn)||this.energy==0){
			this.main.position.copy(this.respawnsave.position)
			this.main.rotation.copy(this.respawnsave.rotation)
			this.main.updateMatrix()
			this.energy=1
			this.velocity.set(0,0,0)
			this.engineforce.set(0,0,0)
			this.externalforce.set(0,0,0)
			this.quanta=1
		}
		this.controlsmooth.respawn=this.control.respawn
		if(zone&&time%600==0){
			this.nextQuanta()
		}
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
		if(this.control.use==1&&this.powerup){
			powerups[this.powerup].use(this)
			this.powerup=''
		}
		this.controlsmooth.use=this.control.use
	},
	calculateForce:function(){
		var handle=this.dynamics.handle
		this.vforce.copy(this.velocity).multiplyScalar(2)
		var length=this.engineforce.length()
		var morelength=0
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
				if(zone){this.nextQuanta()}
			}
			this.hurt(boostusage)
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
			if(length>0&&!zone){
				morelength-=this.dynamics.mass*Math.min(brakespeed*Math.min(this.controlsmooth.lbrake,this.controlsmooth.rbrake),length)
			}
		}
		//handle=lerp(this.dynamics.handle,0.1,Math.max(this.controlsmooth.lbrake,this.controlsmooth.rbrake))
		
		morelength=Math.max(-length,morelength/this.dynamics.mass)
		var realsteer=(this.grounded?1:airturn)*this.dynamics.turndeg//*(this.engineforce.length()*0.001+1)
		if(this.controlsmooth.steer){//Steering
			this.main.matrix.rotateY(-this.controlsmooth.steer*realsteer)
			this.modelrotate+=this.controlsmooth.steer*realsteer
		}
		//Left/right shift
		this.shiftsmooth=lerp(this.shiftsmooth,-(this.controlsmooth.rbrake-this.controlsmooth.lbrake)*(this.grounded?1:airshift),0.2)
		if(this.shiftsmooth){
			this.main.matrix.rotateY(this.shiftsmooth*(this.grounded?1:airturn)*this.dynamics.shiftdeg)
		}
		this.main.rotation.setEulerFromRotationMatrix(this.main.matrix)
		
		//Adjustable skid
		this.engineforce.copy(
			this.front.clone().multiplyScalar(length*handle+morelength)
			.add(this.engineforce.clone().multiplyScalar(1-handle))
		)
		//Friction stuff
		var v=this.engineforce.length()
		this.engineforce.multiplyScalar(Math.max(0,1-
			(1/(1+morelength))*v*friction))//Thrust friction
		//this.externalforce.y-=9.8*2//Fall
		this.externalforce.add(this.up.clone().multiplyScalar(-9.8*(2-0.5*this.controlsmooth.pitch)))//Fall
		//new THREE.Vector3(0,-9.8*2,0))
		this.externalforce.multiplyScalar(extfriction)//External friction
		
		//Shift, continued
		//this.externalforce.add(this.left.clone().multiplyScalar(-this.shiftsmooth*shiftspeed*(this.grounded?1:airshift)))
		this.velocity.addVectors(
			this.engineforce.clone().applyAxisAngle(this.up,shiftdeg*this.shiftsmooth)
			,this.externalforce
		)
		this.modelrotate+=-this.shiftsmooth*0.02
		this.pushing=Math.max(0,this.pushing-deltatime)
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
		this.solveRay(this.main.position,forwards,forwards.length()*deltatime,colliders.concat([trackcollide]))
		if(countdown<=0&&!this.grounded!=!this.wasgrounded){
			if(this.grounded){
				//Just landed
				this.rolling=0
				if(this.rollboost){
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
		
		if(this.sparknormal){//Scraping
			var vel=this.velocity.clone().multiplyScalar(deltatime*0.9)
			addSpark(this.main.position.clone().sub(vel).sub(this.sparknormal),vel)
			this.hurt(collisionusage*Math.abs(this.sparknormal.dot(this.front)))
		}
		if(this.hitapad==2){
			if(zone){this.nextQuanta()}
			this.hitapad=1
			if(this.hitapowerup){
				if(!this.powerup&&!this.autopiloting){
					this.powerup=Math.random()>0.5?'autopilot':'shield'
					this.poweringup=powerupduration
				}
			}
			else{
				this.uniforms.phase=slightly
				this.pushing=Math.max(this.pushing,0.3)
			}
				//this.heal(0.05)
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
		if(intersections.length&&intersections[0].distance-collisionconst<=distance){
			//Hit something
			for(var c=0;c<intersections.length;c++){
				if(intersections[c].object.boostpad){
					if(this.hitapad==0){
						this.hitapowerup=intersections[c].object.powerup
						this.hitapad=2
					}
					break
				}
			}
			if(c>=intersections.length&&this.hitapad==1){//No pad
				this.hitapad=0
			}
			var normal=intersections[0].face.normal.clone().transformDirection(intersections[0].object.matrix)
			distance-=Math.max(intersections[0].distance-collisionconst,0)
			origin.copy(intersections[0].point).add(
				_now.clone().multiplyScalar(-collisionconst))
			if(_previousface&&normal.equals(_previousface)){
				//Hit the same face twice.
				//console.log('Houstin, we have a problem.')
				/*var l=new THREE.Line(
					new THREE.Geometry(),
					new THREE.LineBasicMaterial()
				)
				l.geometry.vertices.push(intersections[0].point.clone())
				l.geometry.vertices.push(intersections[0].point.clone().add(_now))
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
			/*if(!intersections[0].face.isfloor){
				//Wall. Kick it back
				this.externalforce.add(normal)
			}*/
			if(intersections[0].object.ship){//Hit another ship
				//Compensate for other motion
				this.engineforce.sub(intersections[0].object.ship.velocity)
				this.externalforce.sub(intersections[0].object.ship.velocity)
			}
			if(!_previousface||intersections[0].face.isfloor==_wasfloor){
				var dotl=normal.dot(this.left)
				var dotu=normal.dot(new THREE.Vector3(0,1,0))
				if(!_previousface&&intersections[0].face.isfloor){//Used to be dotu
					if(intersections[0].face.align){
						this.autoalign=intersections[0].face.align
					}
					//Hit floor
					this.grounded=this.aircount
					var angle=Math.acos(clamp(dot,-1,1))
					//if(angle>Math.PI/2){angle-=Math.PI}
					if(angle!=0){
						var inv=new THREE.Matrix4().getInverse(this.main.matrix)
						this.main.matrix.rotateByAxis(
							normal.clone().cross(this.up).transformDirection(inv),
							-angle
						)
						this.main.rotation.setEulerFromRotationMatrix(this.main.matrix)
					}
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
				debug.position.copy(intersections[0].point)
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
			if(intersections[0].object.ship){
				this.engineforce.add(intersections[0].object.ship.velocity)
				this.externalforce.add(intersections[0].object.ship.velocity)
			}

			if(_times==maxcollisions){
				//console.log('max')
			}
			if(_times<maxcollisions){
				return this.solveRay(origin,direction,distance,objects,_times+1,_now,normal,intersections[0].face.isfloor)//Continue
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
	hurt:function(amount){
		if(!this.shielding&&!this.autopiloting){
			this.energy=Math.max(this.energy-amount,0)
		}
		this.hurting=hurtduration
		//this.hudColor.add(orange.clone().multiplyScalar(amounthurt*deltatime))
	},
	heal:function(amount){
		this.energy=Math.min(this.energy+amount,1)
		this.absorbing=absorbduration
		//this.hudColor.add(orange.clone().multiplyScalar(amounthurt*deltatime))
	},
	modelCam:function(){
		//Rolling. Needs a better home.
		if(this.rolling){
			//Continue rolling
			this.roll=this.rolling*0.05+this.roll//lerp(this.roll,this.rolling,0.05)
			if(Math.abs(this.roll)>0.75){
				this.rolling=0
				this.rollboost+=1
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
		this.holder.updateMatrix()
		var rotate=new THREE.Vector3(
			0.2*this.controlsmooth.pitch+0.03*Math.sin(time*0.04+this.floatphase),
			0.03*Math.sin(time*0.02+this.floatphase),
			-1.5*this.modelrotate-Math.PI*2*this.roll+0.03*Math.sin(time*0.03+this.floatphase)
		)
		if(rotate.x){this.holder.matrix.rotateX(rotate.x)}
		if(rotate.y){this.holder.matrix.rotateY(rotate.y)}
		if(rotate.z){this.holder.matrix.rotateZ(rotate.z)}
		this.holder.rotation.setEulerFromRotationMatrix(this.holder.matrix)
		this.holder.position.add(
			new THREE.Vector3(0,1,0)
				.transformDirection(this.holder.matrix)
				.multiplyScalar(Math.sin(time*0.025+this.floatphase)*0.3)
		)
		
		this.camera.up.copy(this.upsmooth)
		this.modelrotate*=0.95
		this.camboostsmooth=lerp(this.camboostsmooth,this.camboost?1:this.pushing||this.boosting?0.6:0,0.1)
		this.camboost=Math.max(0,this.camboost-0.05)
		var incomp=1-this.camboostsmooth*0.3
		var camstrafe=this.modelrotate*Math.min(this.engineforce.length()*deltatime*0.08,1)
		if(!this.control.rearview){
			//Normal camera
			if(this.camera.children.length){
				this.camera.children[0].fov=minfov+addfov*this.camboostsmooth
				this.camera.children[0].updateProjectionMatrix()
			}
			this.camera.position.copy(this.holder.position)
				.add(this.frontsmooth.clone().multiplyScalar(incomp*(-4.5
					-3*Math.min(this.engineforce.length()*deltatime*0.085,1)*(1-0.2*this.camboostsmooth))))
				.add(this.upsmooth.clone().multiplyScalar(3*incomp))
				.add(this.leftsmooth.clone().multiplyScalar(1.5*incomp*camstrafe))
			this.camera.lookAt(this.holder.position.clone()
				.add(this.frontsmooth.clone().multiplyScalar(4))
				.add(this.leftsmooth.clone().multiplyScalar(3*camstrafe)))
		}
		else{
			//Rearview camera
			this.camera.position.copy(this.holder.position)
				.add(this.upsmooth.clone().multiplyScalar(3.5))
			this.camera.lookAt(this.camera.position.clone().add(this.frontsmooth.clone().multiplyScalar(-5)))
		}
	},
	modelFX:function(){
		//Exhaust line
		this.holder.updateMatrix()
		this.thrust.geometry.vertices.unshift(
			this.thrust.geometry.vertices.pop().set(-0.15,0,1.8).applyProjection(this.holder.matrix))
		this.thrust.geometry.vertices.unshift(
			this.thrust.geometry.vertices.pop().set(0.15,0,1.8).applyProjection(this.holder.matrix))
		this.thrust.geometry.verticesNeedUpdate=true
		
		this.uniforms.motionblur=this.boosting>0||this.pushing>0?1:
			lerp(this.uniforms.motionblur,0,0.1)
		
		if(this.uniforms.phase>0){
			this.uniforms.phase+=Math.min(0.03,1-this.uniforms.phase)
			if(this.uniforms.phase==1){
				this.uniforms.phase=0
			}
		}
		
		this.shield.visible=!!this.shielding||!!this.autopiloting
		this.absorb.visible=!!this.absorbing
		this.shield.material.opacity=Math.min(this.shield.material.opacity+(deltatime/fadein),(1/fadeout)*Math.min(fadeout,Math.max(this.shielding,this.autopiloting)))
		this.absorb.material.opacity=Math.min(this.absorb.material.opacity+(deltatime/fadein),(1/fadeout)*Math.min(fadeout,this.absorbing))
	},
	nextQuanta:function(){
		this.quanta++
		var q=50/mph
		this.dynamics.accelerate+=0.5
		this.dynamics.topspeed+=q
		maxspeed+=q
		boostspeed+=q
	},
	copyUniforms:function(scale,cool){
		scale.motionblur.value=this.uniforms.motionblur
		cool.phase.value=this.uniforms.phase
	}
}
