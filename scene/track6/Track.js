{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "Track.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 5,
	"geometries"    : 5,
	"materials"     : 1,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Collider" : {
		"geometry"  : "geo_Collider",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, -0.546937, 7.34859e-08 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Track" : {
		"geometry"  : "geo_Track",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, -0.546937, 7.34859e-08 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Hole" : {
		"geometry"  : "geo_Hole.001",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ -1.53351, 3.12945e-05, 117.353 ],
		"rotation"  : [ -1.5708, 7.7037e-15, 3.14159 ],
		"quaternion": [ -5.33851e-08, 0.707107, 0.707107, 5.33851e-08 ],
		"scale"     : [ 12.5155, 209.475, 12.5155 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Building" : {
		"geometry"  : "geo_Building",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 32.6926, -18.4268, 152.427 ],
		"rotation"  : [ -1.5708, 6.96274e-12, 3.13362 ],
		"quaternion": [ -0.00282052, 0.707101, 0.707101, 0.00282052 ],
		"scale"     : [ 52.1671, 52.1671, 52.1671 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Ship" : {
		"geometry"  : "geo_Ship",
		"groups"    : [  ],
		"material"  : "Material.003",
		"position"  : [ 0.0180169, 0.00647671, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.534169, 0.534169, 0.534169 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_Collider" : {
		"type" : "ascii",
		"url"  : "Track.Collider.js"
	},

	"geo_Track" : {
		"type" : "ascii",
		"url"  : "Track.Track.js"
	},

	"geo_Hole.001" : {
		"type" : "ascii",
		"url"  : "Track.Hole.001.js"
	},

	"geo_Building" : {
		"type" : "ascii",
		"url"  : "Track.Building.js"
	},

	"geo_Ship" : {
		"type" : "ascii",
		"url"  : "Track.Ship.js"
	}
},


"materials" :
{
	"Material.003" : {
		"type": "MeshBasicMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "AdditiveBlending" }
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
