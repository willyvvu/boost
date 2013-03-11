function collide(){
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
			var rotation=new THREE.Matrix4().rotateByAxis(
				inv.rotateAxis(from.clone().cross(to)),
				Math.acos(Math.min(from.dot(to),1))
			)
			ship.matrix.multiply(rotation)
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			model.matrix.multiply(new THREE.Matrix4().getInverse(rotation))
			model.rotation.setEulerFromRotationMatrix(model.matrix)
			/*velocity.sub(intersections[0].face.normal.clone().multiplyScalar(
				velocity.dot(intersections[0].face.normal)
			))*/
			//rotateAxis takes a vector and rotates it using the matrix.
			ship.matrix.translate(new THREE.Vector3(0,dist<=adhere?adhere:dist,0))
			ship.rotation.setEulerFromRotationMatrix(ship.matrix)
			ship.position.getPositionFromMatrix(ship.matrix)
			velocity.copy(restrict(velocity,to))
			//Turn to match the road normal
			if(dist<=adhere){//On the road
				if(fall<0.2){
					recover+=fall
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
			}
		}
	}
	else{//Off road
		//console.log('off')
		clearTimeout(savingPlace)
		savingPlace=-1
	}
	ship.matrix.translate(new THREE.Vector3(0,fall,0))
	ship.position.getPositionFromMatrix(ship.matrix)
	fall+=-9.8*d*0.1
	to=to||ship.matrix.rotateAxis(new THREE.Vector3(0,1,0))
	
	//Check for front collisions
	frontray=new THREE.Raycaster(
		ship.matrix.rotateAxis(new THREE.Vector3(0,0,2)).add(ship.position),
		ship.matrix.rotateAxis(new THREE.Vector3(0,0.1,-2))
		,0,10+velocity.length()*d
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
			velocity=restrict(velocity,norm)
			coolPass.uniforms.damage.value=Math.min(coolPass.uniforms.damage.value+velocity.length()*0.0005,1)
			//.add(restrict(norm,to).multiplyScalar(1))
		}
	}
}
