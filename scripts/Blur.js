// @ts-nocheck
/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//==============================================================================

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');

// How to load in modules
const Scene = require('Scene');
const Textures = require("Textures");
const CameraInfo = require("CameraInfo");
const R = require('Reactive');
const Materials = require('Materials');
const Reactive = require('Reactive');
const Shaders = require('Shaders');

//Assets
const blurMat = Materials.get("CameraMat");
const cameraTex = Textures.get("cameraTexture0");

const cameraColor = cameraTex.signal;
const texcoords = Shaders.fragmentStage(Shaders.vertexAttribute({'variableName': Shaders.VertexAttribute.TEX_COORDS}));

const kernel = [
    [1,2,1],
    [2,4,2],
    [1,2,1]
];

var blurColor = R.pack4(0,0,0,1);
var step = 1;
for (var x = 0; x < 3; x++) {
	for (var y = 0; y < 3; y++) {
    	const offsetX = R.div((-1 + x * 1) * step, CameraInfo.previewSize.width);
    	const offsetY = R.div((-1 + y * 1) * step, CameraInfo.previewSize.height);
    	const movecoords = R.add(texcoords, R.pack2(offsetX,offsetY));
    	var sampled = Shaders.textureSampler(cameraColor, movecoords);
        sampled = R.mul(R.div(sampled, 16), kernel[x][y]);
    	blurColor = R.add(blurColor, sampled);
    }
}

//blurMat.setTexture(blurColor, {textureSlotName: "diffuseTexture"});
