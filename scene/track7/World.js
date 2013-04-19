{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "World.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 3,
	"geometries"    : 3,
	"materials"     : 2,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Plane.001" : {
		"geometry"  : "geo_Plane.001",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 0.0135896, -3.37767, -2.11199 ],
		"rotation"  : [ 1.5708, -3.14159, 1.00486e-14 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, -5.33851e-08 ],
		"scale"     : [ 30, 30, 30 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube.001" : {
		"geometry"  : "geo_Cube.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, -1.84115, -6.302e-08 ],
		"rotation"  : [ 1.5708, -3.14159, 2.00972e-14 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, -5.33851e-08 ],
		"scale"     : [ 0.92047, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube" : {
		"geometry"  : "geo_Cube",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, -1.95686, -6.69804e-08 ],
		"rotation"  : [ 1.5708, -3.14159, 1.50729e-14 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, -5.33851e-08 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_Plane.001" : {
		"type" : "ascii",
		"url"  : "World.Plane.001.js"
	},

	"geo_Cube.001" : {
		"type" : "ascii",
		"url"  : "World.Cube.001.js"
	},

	"geo_Cube" : {
		"type" : "ascii",
		"url"  : "World.Cube.js"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "NormalBlending" }
	},

	"Material.001" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 36, "opacity": 1, "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ -1.5708, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : ""
}

}
