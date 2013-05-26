powerups={
	fragment:{probability:0.2,
		name:'Fragment Cannon',
		reticle:true,
		energy:function(ship){
			return 0.2*(ship.fragmentammo/fullclip)
		},
		obtain:function(ship){
			ship.fragmentammo=fullclip
		},
		use:function(ship,hold){
			if(clock%2==0){
				return false
			}
			raycaster.ray.origin.copy(ship.main.position)//.copy(ship.up).multiplyScalar(0.2)
			if(ship.target.length){
				raycaster.ray.direction.copy(ship.target[0].point).sub(ship.main.position).normalize()
			}
			else{
				raycaster.ray.direction.copy(ship.front)
				if(ship.control.rearview){
					raycaster.ray.direction.multiplyScalar(-1)
				}
			}
			raycaster.ray.direction
				.add(ship.up.clone().multiplyScalar(0.03*Math.random()))
				.add(ship.left.clone().multiplyScalar(0.12*(Math.random()-0.5)))
			var intersections=raycaster.intersectObjects(shipcolliders.concat(rescolliders,[trackclosecollide]))
			if(intersections.length){
				var vel=false
				if(intersections[0].object.ship){
					intersections[0].object.ship.hurt(0.05)
					intersections[0].object.ship.slow(1)
					vel=intersections[0].object.ship.velocity.multiplyScalar(deltatime)
				}
				if(intersections[0].object.residue){
					var ind=rescolliders.indexOf(intersections[0].object)
					if(ind!=-1){
						removeResidue(ind)
					}
				}
				else{
					for(var f=0;f<10;f++){
						addFragment(intersections[0].point)
					}
				}
			}
			ship.fireside*=-1
			ship.fragmentammo=Math.max(0,ship.fragmentammo-1)
			return ship.fragmentammo<=0
		}
	},
	jump:{probability:0.0,
		name:'Jump',
		energy:0.2,
		use:function(ship,hold){
			if(hold){return}
			ship.jumping=1.1
			return true
		}
	},
	rockets:{damage:0.2,
		name:'Rockets',
		probability:0.2,
		energy:0.2,
		use:function(ship,hold){
			if(hold){return}
			for(var dir=-2;dir<=2;dir++){
				var offset=ship.left.clone().multiplyScalar(dir*0.2)
				var missile=ship.up.clone().multiplyScalar(1).add(ship.main.position).add(offset)
				missile.life=1
				missile.owner=ship
				missile.velocity=ship.front.clone().multiplyScalar((ship.control.rearview?-1:1)*(8+1.5*Math.abs(dir)))
				missile.velocity.add(offset)
				missiles.push(missile)
			}
			return true
		}
	},
	shield:{probability:0.1,
		name:'Shield',
		energy:0.2,
		use:function(ship,hold){
			if(hold){return}
			ship.shield.material.map=resource.shieldTex
			ship.shielding=5
			return true
		}
	},
	autopilot:{probability:0.1,
		name:'Autopilot',
		energy:0.2,
		use:function(ship,hold){
			if(hold){return}
			ship.shield.material.map=resource.autopilotTex
			ship.autopiloting=5
			return true
		}
	},
	residue:{probability:0.2,
		name:'Residue',
		energy:0.3,
		use:function(ship,hold){
			if(hold){return}
			ship.dropping=1
			return true
		}
	},
	emp:{probability:0.2,
		name:'EMP',
		energy:0.2,
		damage:0.1,
		use:function(ship,hold){
			if(hold){return}
			emppos.copy(ship.main.position)
			empwave=0
			emphit=[]
			empowner=ship
			for(var r=0;r<residuals.length;r++){
				if(residuals[r].distanceTo(ship.main.position)<emprange){
					removeResidue(r)
					r--
				}
			}
			return true
		}
	}
}
