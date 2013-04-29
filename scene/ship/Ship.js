{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "Ship.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 3,
	"geometries"    : 3,
	"materials"     : 1,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Hull" : {
		"geometry"  : "geo_Hull.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0.0180169, 0.00647663, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.534169, 0.534169, 0.534169 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Absorb" : {
		"geometry"  : "geo_Absorb.001",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0.0180169, 0.00647663, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.534169, 0.534169, 0.534169 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Shield" : {
		"geometry"  : "geo_Shield",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0.0180169, 0.00647663, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1.71428, 1.71428, 1.71428 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	}
},


"geometries" :
{
	"geo_Hull.001" : {
		"type" : "ascii",
		"url"  : "Ship.Hull.001.js"
	},

	"geo_Absorb.001" : {
		"type" : "ascii",
		"url"  : "Ship.Absorb.001.js"
	},

	"geo_Shield" : {
		"type" : "ascii",
		"url"  : "Ship.Shield.js"
	}
},


"materials" :
{
	"Material" : {
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
