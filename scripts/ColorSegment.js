// @ts-nocheck

export const Diagnostics = require('Diagnostics');

// How to load in modules
const Scene = require('Scene');
const Textures = require("Textures");
const CameraInfo = require("CameraInfo");
const R = require('Reactive');
const Materials = require('Materials');
const Shaders = require('Shaders');
const Patches = require('Patches');

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

let mathIfElse = function(x, y) {
    return R.div( R.add(R.sign(R.add(y,  R.neg(x))), R.val(1)), R.val(2));
}

let color1 = R.pack4(0.06, 0.368, 0.6 ,1);
let color2 = R.pack4(72 / 255, 153 / 255, 140 /255 ,1);
let color3 = R.pack4(130 / 255, 153 / 255, 132 /255 ,1);

const segmentSet = [R.val(0), R.val(0.33), R.val(0.66)];
const colorSet = [color1, color2, color3];
const segmentCount = segmentSet.length;

let LuminanceRed = 0.2126;
let LuminanceGreen =0.7152;
let LuminanceBlue = 0.0722;
let LuminanceMultiplier = R.pack4(LuminanceRed,LuminanceGreen,LuminanceBlue ,0);

var sampled = Shaders.textureSampler(cameraColor, texcoords);
    //sampled = R.mul(sampled, LuminanceMultiplier);

let grayValue = R.dot( LuminanceMultiplier, sampled);
let pickValue = colorSet[0];

let colorNum = 3;
//let index = R.div( R.floor( R.mul(grayValue, colorNum) ), colorNum);
// let shaderColor = R.mul(mathIfElse(segmentSet[0], grayValue), color1);
//     shaderColor = R.add(R.mul(mathIfElse(segmentSet[1], grayValue), color2), shaderColor);
//     shaderColor = R.add(R.mul(mathIfElse(segmentSet[2], grayValue), color3), shaderColor);

let shaderColor = R.mul(mathIfElse(segmentSet[0], grayValue), color1);
for (let i = 1 ; i < segmentCount; i++) {
    shaderColor = R.add(R.mul(mathIfElse(segmentSet[i],grayValue), colorSet[i]), shaderColor);
}

// let color2Compare = color1Reselt.le(segmentSet[1]).ifThenElse(color3, color1Reselt);

// for (let i = segmentCount -1 ; i >= 0; i--) {
//     if (R.ge(grayValue, segmentSet[i])) {
//         pickValue = colorSet[i];
//     }
// }
//let grayOutTex = color1;
//let grayOutTex = R.pack4(color1, color1, color1,1);

// var step = 1;
// for (var x = 0; x < 3; x++) {
// 	for (var y = 0; y < 3; y++) {
//     	const offsetX = R.div((-1 + x * 1) * step, CameraInfo.previewSize.width);
//     	const offsetY = R.div((-1 + y * 1) * step, CameraInfo.previewSize.height);
//     	const movecoords = R.add(texcoords, R.pack2(offsetX,offsetY));
//     	var sampled = Shaders.textureSampler(cameraColor, movecoords);
//         sampled = R.mul(R.div(sampled, 16), kernel[x][y]);
//     	blurColor = R.add(blurColor, sampled);
//     }
// }


//blurMat.setTexture(shaderColor, {textureSlotName: "diffuseTexture"});
