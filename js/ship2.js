ships=[]
resource={}
function Ship(){
	this.__proto__=_Ship
	
	//Model and scene
	this.main=new THREE.Object3()
	this.model=new THREE.Object3()
	this.hull=new THREE.Mesh()
	this.thrust=new THREE.Mesh()
	this.boost=new THREE.Mesh()
	this.shine=new THREE.Sprite()
	
	//Rays and directions
	this.left=new THREE.Vector3()
	this.up=new THREE.Vector3()
	this.front=new THREE.Vector3()
	this.floor=new THREE.Vector3()
	this.rayleft=new THREE.RayCaster()
	this.rayright=new THREE.RayCaster()
	this.rayfront=new THREE.RayCaster()
	this.raybottom=new THREE.RayCaster()
	
	//For show
	this.modelrotatez=0
	this.camerastrafe=0
	this.shiftsmooth=0
	this.hudColor=new THREE.Vector3()
	
	//Velocities
	this.engineforce=new THREE.Vector3()
	this.externalforce=new THREE.Vector3()
	this.totalforce=new THREE.Vector3()
	this.boosting=0
	this.pushing=0
	this.inair=false
	this.energy=1
	this.addenergy=0
	
	//Roll
	this.rolling=0
	this.rollboost=0
	
	//Control variables
	this.autopilot=false
	this.autoalign=0.5//Where on the track to align to
	this.control={
		accel:0,
		lbrake:0,
		rbrake:0,
		boost:0,
		steer:0,
		roll:0
	}
	this.dynamics={
		accelerate:0.25,//How fast to accelerate
		topspeed:400/mph,//Speed achievable by acceleration
		handle:0.5//Handling
	}
}
_Ship={//All useful ship functions
	simulate:function(){
		this.directions()
		this.sendRays()
		if(this.autopilot){this.autopilot()}
		this.clampControls()
		this.calculateForce()
		this.resolveCollisions()
		this.main.position.add(this.velocity.clone().multiplyScalar(deltatime))
	},
	directions:function(){
		this.left=this.main.matrixWorld.rotateAxis(new THREE.Vector3(1,0,0))
		this.up=this.main.matrixWorld.rotateAxis(new THREE.Vector3(0,1,0))
		this.front=this.main.matrixWorld.rotateAxis(new THREE.Vector3(0,0,-1))
	},
	sendRays:function(){
		this.rayleft.ray.origin=
		this.rayright.ray.origin=
		this.rayfront.ray.origin=
		this.raybottom.ray.origin=
		this.main.position
		
		this.rayleft.ray.direction.copy(this.left)
		this.rayright.ray.direction.copy(this.left).multiplyScalar(-1)
		this.rayfront.ray.direction.copy(this.front)
		this.raybottom.ray.direction.copy(this.up).multiplyScalar(-1)

		this.rayleft.intersections=this.rayleft.intersectObject(track)
		this.rayright.intersections=this.rayright.intersectObject(track)
		this.rayfront.intersections=this.rayfront.intersectObject(track)
		this.raybottom.intersections=this.raybottom.intersectObjects(boostpads.concat([track]))
		this.floor=(
			this.raybottom.intersections.length&&
			this.raybottom.intersections[0].face.normal
			)||THREE.Vector3(0,1,0)
	},
	autopilot:function(){
		var leftdist=0,rightdist=0,move=0,matchleft=false
		if(this.rayleft.intersections.length){
			leftdist=this.rayleft.intersections[0].distance
			if(leftdist>=50){
				leftdist=0
				return
			}
			matchleft=this.rayleft.intersections[0].face.normal.clone().multiplyScalar(-1)
		}
		if(this.rayright.intersections.length){
			rightdist=this.rayright.intersections.length[0].distance
			if(rightdist>=50){
				rightdist=0
				return
			}
			if(matchleft){
				matchleft.add(this.rayright.intersections.length[0].face.normal.clone().multiplyScalar(0.5))
			}
			else{
				matchleft=this.rayright.intersections.length[0].face.normal.clone()
			}
		}
		if(leftdist&&rightdist){
			move=(this.autoalign-(leftdist/(leftdist+rightdist)))*2
		}
		else if(leftdist){//Only one wall found. compensating.
			if(leftdist<10){move=0.3}
		}
		else if(rightdist){
			if(rightdist<10){move=-0.3}
		}
		this.control.lbrake=smooth(this.control.lbrake,Math.min(Math.max(-Math.min(10*move,0),-1),1),0.1)
		this.control.rbrake=smooth(this.control.rbrake,Math.min(Math.max(Math.max(10*move,0),-1),1),0.1)
		if(matchleft){
			matchleft.projectOnPlane(this.floor)
			matchleft.normalize()
			this.control.steer=smooth(this.control.steer,Math.min(Math.max(-20*(Math.asin(matchleft.dot(this.forwards))),-1),1),0.1)
		}
		else{
			this.control.steer=smooth(this.control.steer,0,0.1)
		}
		this.control.accel=1
		this.control.boost=0
		//console.log(leftdist,rightdist,move)
	},
	clampControls:function(){
		this.accel=Math.max(0,Math.min(1,this.accel))
		this.lbrake=Math.max(0,Math.min(1,this.lbrake))
		this.rbrake=Math.max(0,Math.min(1,this.rbrake))
		this.boost=Math.max(0,Math.min(1,this.boost))
		this.steer=Math.max(-1,Math.min(1,this.steer))
		this.roll=Math.max(-1,Math.min(1,this.roll))
	},
	calculateForce:function(){
		var length=this.engineforce.length()
		var morelength=0
		if(this.pushing>0){//Being pushed along
			if(length<maxspeed){
				morelength+=Math.min(pushrate*(maxspeed-length),maxspeed-length)
			}
		}
		if(this.control.boost||this.boosting>0){//Boosting
			//Boosting is guarenteed for a certain amout of time
			this.boosting-=Math.min(0.2,this.boosting)
			if(this.control.boost){
				this.boosting=1
			}
			if(this.length<maxboost){
				morelength=0.10*(boostspeed-length)//Speed of sound is 340 m/s
			}
			this.energy-=boostusage
		}
		if(this.control.accel>0){//Normal acceleration
			if(length<this.topspeed){
				morelength+=Math.min(this.accelerate*this.control.accel,this.topspeed-length)
			}
		}
		if(Math.min(this.control.lbrake,this.control.rbrake)>0){//Braking? Active deccel.
			if(length>0){
				morelength-=Math.min(prakespeed*Math.min(this.control.lbrake,this.control.rbrake),length)
			}
		}
		if(this.control.steer!=0){//Steering
			var realsteer=(this.inair?airturn:1)*turndeg*(velocity.length()*0.001+1)
			this.main.matrix.rotateY(-steer*realsteer)
			this.main.rotation.setEulerFromRotationMatrix(ship.matrix)
			this.modelrotatez+=-this.control.steer*realsteer*20
			this.camstrafe-=(-this.control.steer*realsteer*0.75)
		}
		var newvel=new THREE.Vector3(0,0,-length-morelength*(1/this.handle))
		//Adjustable skid
		this.engineforce.copy(
			this.main.matrix.rotateAxis(newvel.clone()).multiplyScalar(newvel.length()*this.handle)
			.add(this.engineforce.clone().multiplyScalar(1-this.handle))
		)
		
		//Friction stuff
		if(Math.min(this.control.lbrake,this.control.rbrake)>0){//Braking? Increase friction
			this.engineforce.multiplyScalar(Math.pow(1-Math.min(this.control.lbrake,this.control.rbrake)*(1-brakespeed),deltatime))
		}
		this.engineforce.multiplyScalar(Math.pow(friction,deltatime))//Thrust friction
		this.externalforce.add(this.up.clone().multiplyScalar(-9.8*deltatime*0.1))//Fall
		this.externalforce.multiplyScalar(extfriction)//External friction
		
		//Left/right shift
		this.shiftsmooth=smooth(this.shiftsmooth,-(this.control.rbrake-this.control.lbrake)*(inair?airshiftratio:1)*shiftconst,0.2)
		this.external.add(left.clone().multiplyScalar(-$shift*shiftconst2*(inair?airshiftratio:1)))
		this.velocity.addVectors(
			this.engineforce.clone().applyAxisAngle(this.main.matrixWorld.rotateAxis(new THREE.Vector3(0,1,0)),this.shiftsmooth)
			,external
		)
		modelrotatez+=shiftsmooth
		camerastrafe+=shiftsmooth*0.05
	},
	resolveCollisions:function(){
		if(this.bottomray.intersections.length){
			//console.log(to)
			if(this.up.dot(to)>=1-climb){//Shallow enough
				this.main.matrix.translate(new THREE.Vector3(0,-this.bottomray.intersections[0].distance,0))
				var inv=new THREE.Matrix4().getInverse(this.main.matrix)
				var rotation=new THREE.Matrix4().makeRotationAxis(
					inv.rotateAxis(this.up.clone().cross(this.floor)),
					this.up.angleTo(this.floor)
				)
				this.main.matrix.multiply(rotation)
				this.main.rotation.setEulerFromRotationMatrix(this.main.matrix)
				this.model.updateMatrix()
				this.model.matrix.multiply(new THREE.Matrix4().getInverse(rotation))
				this.model.rotation.setEulerFromRotationMatrix(this.model.matrix)
				this.main.matrix.translate(new THREE.Vector3(0,adhere,0))
				this.main.rotation.setEulerFromRotationMatrix(this.main.matrix)
				this.main.position.getPositionFromMatrix(this.main.matrix)
				this.velocity.projectOnPlane(this.floor)
				this.engineforce.projectOnPlane(this.floor)
				external.projectOnPlane(this.floor)
				/*if(exportposition){
					exported.push({position:this.bottomray.itersections[0].point.clone(),rotation:this.main.rotation.clone()})
					var stringified=JSON.stringify(exported)
					console.log(stringified)
					exportposition=false
				}*/
				//Turn to match the road normal
				if(this.bottomray.intersections[0].distance<=adhere){//On the road
					if(this.inair){
						this.inair=false
						this.recover+=this.externalforce.length()
						if(this.rollboost>0||this.rolling!=0){//If did a barrel roll, give some boost
							if(Math.abs(this.rolling)<0.5){//More than half a roll
								this.rollboost++
							}
							this.rolling=0
							this.control.roll=0
							this.pushing+=this.rollpush*rollboost
							this.addenergy=this.rollenergy*rollboost
							this.rollboost=0
						}
					}
					this.velocity.projectOnPlane(this.up)
					this.externalforce.projectOnPlane(this.up)
					this.engineforce.projectOnPlane(this.up)
				}
				/*if(this.bottomray.intersections[0].distance<=adhere+2){
					if(savingPlace<0){
						clearTimeout(savingPlace)
						savingPlace=savePlace()
					}
				}*/
				else{//Off road
					//console.log('off')
					//clearTimeout(savingPlace)
					//savingPlace=-1
					this.inair=true
				}
			}
		}
		else{//Off road
			//console.log('off')
			//clearTimeout(savingPlace)
			//savingPlace=-1
			this.inair=true
		}
		this.solveRay(this.frontray,3)
		this.solveRay(this.leftray,3)
		this.solveRay(this.rightray,3)
	},
	solveRay:function(ray,bumpdistance){
		//If a ray intersects at {{intersections}}, and must not exceed {{distance}},
		//Limit the velocity so that the ship will not do so.
		if(ray.intersections.length){
			if(ray.intersections[0].distance<
				bumpdistance+velocity.clone().multiplyScalar(deltatime).projectOnVector(ray.ray.direction).length()
			){
				//In range
				if(ray.intersections[0].face.normal.dot(this.floor)<climb
					&&ray.intersections[0].face.normal.dot(this.velocity)<0){//Wall is steep enough
					//ship.position.add(restrict(norm,to).normalize()
						//.multiplyScalar(2.5-ship.position.distanceTo(intersections[0].point)))
						//Keep away
					this.hurt()
					this.velocity.projectOnPlane(ray.intersections[0].face.normal)
					this.engineforce.projectOnPlane(ray.intersections[0].face.normal)
					this.externalforce.projectOnPlane(ray.intersections[0].face.normal)
				}
			}
		}
	},
	hurt:function(){
		var amounthurt=Math.min(thrust.length(),maxcollisionspeed)/maxcollisionspeed
		energy=Math.max(energy-Math.min(amounthurt*collisionusage),0)
		this.hudColor.add(orange.clone().multiplyScalar(amounthurt*deltatime))
	},
	modelFX:function(){
			//Make the exhaust look like it's alive
		modelthrust.material.map.offset.y=Math.random()*0.2-0.1
		modelboost.material.map.offset.y=Math.random()*0.2-0.1
		//Exhaust behavior and other smoothing things
		modelthrust.material.map.offset.x=
			smooth(modelthrust.material.map.offset.x,Math.max(accel,boost)-1,0.1)
		modelthrust.material.opacity=
			smooth(modelthrust.material.opacity,modelthrust.material.map.offset.x>-0.9?1:0,0.1)
		boostsprite.material.opacity=
			smooth(boostsprite.material.opacity,Math.max(accel,boost),0.1)
		modelboost.material.map.offset.x=
			smooth(modelboost.material.map.offset.x,boosting>0||pushing>0?0:-1,0.1)
		modelboost.material.opacity=
			smooth(modelboost.material.opacity,modelboost.material.map.offset.x>-0.9?1:0,0.1)
		coolPass.uniforms.damage.value=
			smooth(coolPass.uniforms.damage.value,0,0.05)
		coolPass.uniforms.push.value=
			smooth(coolPass.uniforms.push.value,pushing>0?1:0,0.15)
		coolPass.uniforms.boost.value=
			smooth(coolPass.uniforms.boost.value,boosting>0?1:0,0.15)
		coolPass.uniforms.motionblur.value=
			smooth(coolPass.uniforms.motionblur.value,boosting>0||pushing>0?1:0,0.1)
	}
}
