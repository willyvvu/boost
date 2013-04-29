{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "World.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 5,
	"geometries"    : 5,
	"materials"     : 2,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Auto" : {
		"geometry"  : "geo_Auto",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Ground" : {
		"geometry"  : "geo_Ground.001",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Collide" : {
		"geometry"  : "geo_Collide.002",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ 1.5708, -3.14159, 1.50729e-14 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, -5.33851e-08 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Backup" : {
		"geometry"  : "geo_Backup",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ 1.5708, -3.14159, 1.50729e-14 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, -5.33851e-08 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Track" : {
		"geometry"  : "geo_Track",
		"groups"    : [  ],
		"material"  : "Material.003",
		"position"  : [ 0, 0, 0 ],
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
	"geo_Auto" : {
		"type" : "ascii",
		"url"  : "World.Auto.js"
	},

	"geo_Ground.001" : {
		"type" : "ascii",
		"url"  : "World.Ground.001.js"
	},

	"geo_Collide.002" : {
		"type" : "ascii",
		"url"  : "World.Collide.002.js"
	},

	"geo_Backup" : {
		"type" : "ascii",
		"url"  : "World.Backup.js"
	},

	"geo_Track" : {
		"type" : "ascii",
		"url"  : "World.Track.js"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "vertexColors": "vertex", "blending": "NormalBlending" }
	},

	"Material.003" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "NormalBlending" }
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
