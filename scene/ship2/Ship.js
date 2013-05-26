{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "Ship.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 5,
	"geometries"    : 5,
	"materials"     : 2,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Engine" : {
		"geometry"  : "geo_Hull.000",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, -3.76514e-10, 0.011 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Plane" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 0, -1.56308, -5.35021e-08 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 26.4521, 26.4521, 26.4521 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Hull" : {
		"geometry"  : "geo_Hull.001",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Shield" : {
		"geometry"  : "geo_Shield",
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

	"Absorb" : {
		"geometry"  : "geo_Absorb",
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
	}
},


"geometries" :
{
	"geo_Hull.000" : {
		"type" : "ascii",
		"url"  : "Ship.Hull.000.js"
	},

	"geo_Plane" : {
		"type" : "ascii",
		"url"  : "Ship.Plane.js"
	},

	"geo_Hull.001" : {
		"type" : "ascii",
		"url"  : "Ship.Hull.001.js"
	},

	"geo_Shield" : {
		"type" : "ascii",
		"url"  : "Ship.Shield.js"
	},

	"geo_Absorb" : {
		"type" : "ascii",
		"url"  : "Ship.Absorb.js"
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
