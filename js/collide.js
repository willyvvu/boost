inair=false
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
	var to=false
	if(intersections.length){
		var norm=/*track.matrix.rotateAxis*/(intersections[0].face.normal.clone())//.multiplyScalar(-1)
			,dist=intersections[0].distance-2
		//velocity.y+=Math.max(2*(adhere-intersections[0].distance),(adhere-intersections[0].distance))
		//Bob a bit
		from=ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
		to=norm
		//console.log(to)
		if(from.dot(to)>=1-climb){//Shallow enough
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
			velocity.projectOnPlane(to)
			thrust.projectOnPlane(to)
			external.projectOnPlane(to)
			if(exportposition){
				exported.push({position:intersections[0].point.clone(),rotation:ship.rotation.clone()})
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
	frontray=new THREE.Raycaster(
		ship.matrix.rotateAxis(new THREE.Vector3(0,0,2)).add(ship.position),
		ship.matrix.rotateAxis(new THREE.Vector3(0,0.1,-2))
		,0,10+velocity.length()*deltatime
	)
	rightrearray=new THREE.Raycaster(
		ship.position.clone(),
		ship.matrix.rotateAxis(new THREE.Vector3(2,-0.1,1))
		,0,4
	)
	leftrearray=new THREE.Raycaster(
		ship.position.clone(),
		ship.matrix.rotateAxis(new THREE.Vector3(-2,-0.1,1))
		,0,4
	)
	intersections=frontray.intersectObject(track)
		.concat(leftrearray.intersectObject(track))
		.concat(rightrearray.intersectObject(track))
	intersections.sort(function(a,b){return a.distance-b.distance})
	if(intersections.length){
		var norm=/*track.matrix.rotateAxis*/(intersections[0].face.normal.clone())//.multiplyScalar(-1)
			,dist=intersections[0].distance
			//console.log(norm)
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
}
