{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "Track.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 3,
	"geometries"    : 3,
	"materials"     : 1,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Buildings" : {
		"geometry"  : "geo_Buildings.001",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ -268.681, 24.2674, -909.469 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 131.976, 131.976, 240.744 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Track" : {
		"geometry"  : "geo_Track",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, -7.56651, 1.01663e-06 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Collider" : {
		"geometry"  : "geo_Collider",
		"groups"    : [  ],
		"material"  : "Material",
		"position"  : [ 0, -7.0459, 9.46678e-07 ],
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
	"geo_Buildings.001" : {
		"type" : "ascii",
		"url"  : "Track.Buildings.001.js"
	},

	"geo_Track" : {
		"type" : "ascii",
		"url"  : "Track.Track.js"
	},

	"geo_Collider" : {
		"type" : "ascii",
		"url"  : "Track.Collider.js"
	}
},


"materials" :
{
	"Material" : {
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
