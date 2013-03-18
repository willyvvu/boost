inair=false
control=1
ldist=0
function collideStep(){
	//Boost?
	bottomray=new THREE.Raycaster(
		new THREE.Vector3(0,2,0).applyProjection(ship.matrix),
		ship.matrix.rotateAxis(new THREE.Vector3(0,-1,0))
		,0,5
	)
	var intersections=bottomray.intersectObjects(boostpads)
	if(intersections.length==1&&pushing<0.1){
		//Hit one.
		pushing+=padpush
		$energy=0.1
	}
	
	//Bottom collisions
	bottomray=new THREE.Raycaster(
		new THREE.Vector3(0,2,0).applyProjection(ship.matrix),
		ship.matrix.rotateAxis(new THREE.Vector3(0,-1,0))
		,0,10-fall
	)
	intersections=bottomray.intersectObject(track)
	ship.updateMatrix()
	to=false
	if(intersections.length){
		var norm=/*track.matrix.rotateAxis*/(intersections[0].face.normal.clone())//.multiplyScalar(-1)
			,dist=intersections[0].distance-2
		//velocity.y+=Math.max(2*(adhere-intersections[0].distance),(adhere-intersections[0].distance))
		//Bob a bit
		from=ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
		to=norm
		//console.log(to)
		if(from.dot(to)>=1-climb){//Shallow enough
			var originalpos=ship.position.clone()
			ship.matrix.translate(new THREE.Vector3(0,-dist,0))
			var inv=new THREE.Matrix4().getInverse(ship.matrix)
			var rotation=new THREE.Matrix4().makeRotationAxis(
				inv.rotateAxis(from.clone().cross(to)),
				from.angleTo(to)
			)
			ship.matrix.multiply(rotation)
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			model.updateMatrix()
			model.matrix.multiply(new THREE.Matrix4().getInverse(rotation))
			model.rotation.setEulerFromRotationMatrix(model.matrix)
			ship.matrix.translate(new THREE.Vector3(0,adhere,0))
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			ship.position.getPositionFromMatrix(ship.matrix)
			//model.position.add(originalpos.sub(ship.position))
			velocity.projectOnPlane(to)
			thrust.projectOnPlane(to)
			external.projectOnPlane(to)
			if(exportposition){
				exported.push({position:intersections[0].point.clone(),rotation:ship.rotation.clone(),left:ldist})
				var stringified=JSON.stringify(exported)
				console.log(stringified)
				exportposition=false
			}
			//Turn to match the road normal
			if(dist<=adhere){//On the road
				if(inair){
					inair=false
					recover+=fall
					if(rollboost>0||rolling!=0){//If did a barrel roll, give some boost
						if(Math.abs(rolling)<0.5){//More than half a roll
							rollboost++
						}
						rolling=0
						roll=0
						pushing+=rollpush*rollboost
						$energy=rollenergy*rollboost
						rollboost=0
					}
				}
				fall=0
			}
			if(dist<=adhere+2){
				if(savingPlace<0){
					clearTimeout(savingPlace)
					savingPlace=savePlace()
				}
			}
			else{//Off road
				//console.log('off')
				clearTimeout(savingPlace)
				savingPlace=-1
				inair=true
			}
		}
	}
	else{//Off road
		//console.log('off')
		clearTimeout(savingPlace)
		savingPlace=-1
		inair=true
	}
	ship.matrix.translate(new THREE.Vector3(0,fall,0))
	ship.position.getPositionFromMatrix(ship.matrix)
	fall+=-9.8*deltatime*0.1
	to=to||ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
	
	//Check for front collisions
	backdir=ship.matrix.rotateAxis(new THREE.Vector3(0,0,2)).add(ship.position)
	forwardsdir=ship.matrix.rotateAxis(new THREE.Vector3(0,0,-1))
	leftdir=ship.matrix.rotateAxis(new THREE.Vector3(1,0,0))
	frontray=new THREE.Raycaster(
		backdir,
		forwardsdir
		,0
	)
	rightrearray=new THREE.Raycaster(
		backdir,
		leftdir.clone().multiplyScalar(-1)
		,0
	)
	leftrearray=new THREE.Raycaster(
		backdir,
		leftdir.clone()
		,0
	)
	frontintersections=frontray.intersectObject(track)
	lintersections=leftrearray.intersectObject(track)
	rintersections=rightrearray.intersectObject(track)
	lrintersections=rintersections.concat(lintersections)
	lrintersections.sort(function(a,b){return a.distance-b.distance})
		var leftdist=0,rightdist=0,move=0,matchleft=false
		if(lintersections.length){
			leftdist=lintersections[0].distance
			if(leftdist>=50){return}
			matchleft=lintersections[0].face.normal.clone().multiplyScalar(-1)
		}
		if(rintersections.length){
			rightdist=rintersections[0].distance
			if(rightdist>=50){return}
			if(matchleft){
				matchleft.add(rintersections[0].face.normal.clone().multiplyScalar(0.5))
			}
			else{
				matchleft=rintersections[0].face.normal.clone()
			}
		}
		if(leftdist&&rightdist){
			ldist=(rightdist/(leftdist+rightdist))
			move=(leftdist/(leftdist+rightdist))*2-1
		}
		else if(leftdist){//Only one wall found. compensating.
			if(leftdist<10){move=-0.3}
		}
		else if(rightdist){
			if(rightdist<10){move=0.3}
		}
	if(control==2){
		lbrake=smooth(lbrake,Math.min(Math.max(-Math.min(10*move,0),-1),1),0.1)
		rbrake=smooth(rbrake,Math.min(Math.max(Math.max(10*move,0),-1),1),0.1)
		if(matchleft){
			matchleft.projectOnPlane(to)
			matchleft.normalize()
			steer=smooth(steer,Math.min(Math.max(-20*(Math.asin(matchleft.dot(forwardsdir))),-1),1),0.1)
		}
		else{
			steer=smooth(steer,0,0.1)
		}
		accel=1
		//console.log(leftdist,rightdist,move)
	}
}
function applyCollideStep(){
	if(frontintersections.length){
		collideRay(frontintersections,6,forwardsdir)
	}
	if(lrintersections.length){
		collideRay(lrintersections,3,leftdir)
	}
}
function collideRay(intersections,bumpdistance,forwards){
	var norm=/*track.matrix.rotateAxis*/(intersections[0].face.normal.clone())//.multiplyScalar(-1)
		,dist=intersections[0].distance
		//console.log(norm)
	if(dist>bumpdistance+velocity.clone().multiplyScalar(deltatime).projectOnVector(forwards).length()){return}
	if(norm.dot(to)<climb&&norm.dot(velocity)<0){//Wall is steep enough
		//ship.position.add(restrict(norm,to).normalize()
			//.multiplyScalar(2.5-ship.position.distanceTo(intersections[0].point)))
			//Keep away
		hurt()
		velocity.projectOnPlane(norm)
		thrust.projectOnPlane(norm)
		external.projectOnPlane(norm)
	}
}
