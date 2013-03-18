{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "Ship.blend",
	"generatedBy"   : "Blender 2.65 Exporter",
	"objects"       : 3,
	"geometries"    : 3,
	"materials"     : 3,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"Cube.002" : {
		"geometry"  : "geo_Cube.002",
		"groups"    : [  ],
		"material"  : "Material.002",
		"position"  : [ 0.0180169, 0.00647671, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.534169, 0.534169, 0.534169 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"Cube.001" : {
		"geometry"  : "geo_Cube.004",
		"groups"    : [  ],
		"material"  : "Material.001",
		"position"  : [ 0.0180169, 0.00647671, 0.49585 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 0.534169, 0.534169, 0.534169 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : true
	},

	"Cube" : {
		"geometry"  : "geo_Cube.005",
		"groups"    : [  ],
		"material"  : "Material",
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
	"geo_Cube.002" : {
		"type" : "embedded",
		"id"  : "emb_Cube.002"
	},

	"geo_Cube.004" : {
		"type" : "embedded",
		"id"  : "emb_Cube.004"
	},

	"geo_Cube.005" : {
		"type" : "embedded",
		"id"  : "emb_Cube.005"
	}
},


"materials" :
{
	"Material" : {
		"type": "MeshBasicMaterial",
		"parameters": { "color": 10724259, "opacity": 1, "blending": "AdditiveBlending" }
	},

	"Material.001" : {
		"type": "MeshBasicMaterial",
		"parameters": { "color": 13421772, "opacity": 1, "transparent": true, "blending": "AdditiveBlending" }
	},

	"Material.002" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 6066339, "opacity": 0, "transparent": true, "blending": "AdditiveBlending" }
	}
},


"embeds" :
{
"emb_Cube.003": {	"scale" : 1.000000,

	"materials" : [	{
		"DbgColor" : 15658734,
		"DbgIndex" : 0,
		"DbgName" : "Material.002",
		"blending" : "AdditiveBlending",
		"colorAmbient" : [0.3645437771758999, 0.565676363791173, 0.6400000190734865],
		"colorDiffuse" : [0.3645437771758999, 0.565676363791173, 0.6400000190734865],
		"colorSpecular" : [0.5, 0.5, 0.5],
		"depthTest" : true,
		"depthWrite" : true,
		"shading" : "Lambert",
		"specularCoef" : 50,
		"transparency" : 0.0,
		"transparent" : true,
		"vertexColors" : false
	}],

	"vertices" : [-0.332341,-2.36085,-0.146902,0,-2.39027,0.303567,0.332341,-2.36085,-0.146902,0,-7.60304,-0.0161358],

	"morphTargets" : [],

	"normals" : [0.875546,-0.067415,-0.478347,0,-0.06119,0.998108,0,-0.999969,-0.003784,-0.875546,-0.067415,-0.478347],

	"colors" : [],

	"uvs" : [[1,0.375,1,0.625,-0.097656,0.5]],

	"faces" : [42,2,1,3,0,0,1,2,0,1,2,42,0,2,3,0,0,1,2,3,0,2,42,1,0,3,0,0,1,2,1,3,2],

	"bones" : [],

	"skinIndices" : [],

	"skinWeights" : [],

	"animation" : {}
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
