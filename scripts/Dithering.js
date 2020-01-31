//@ts-nocheck

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

const _ColourDepth = 3;
const _DitherStrength = 0;

const screenSize = Patches.getPoint2DValue("_ScreenSize");

let mathIfElse = function(x, y) {
    return R.div( R.add(R.sign(R.add(y,  R.neg(x))), R.val(1)), R.val(2));
}

let isEqual = function(x,y) {
    return R.add(R.sign( R.neg(R.pow(R.sub(x,y), R.val(2))) ), R.val(1));
}

const kernel = [
    [-4, 0, -3, 1],
    [2, -2, 3, -1],
    [-3, 1, -4, 0],
    [3, -1, 2, -2],
];

let _ScreenParams = R.pack2(CameraInfo.previewSize.width, CameraInfo.previewSize.height);
var sampled = Shaders.textureSampler(cameraColor, texcoords);
let pixelCoord = R.round(R.mul(texcoords, _ScreenParams));


let ditherColor = R.val(0);
for (var x = 0; x < 1; x++) {
    for (var y = 0; y < 1; y++) {
        let ditherX = isEqual(R.mod(pixelCoord.x, R.val(4)), R.val(x));
        let ditherY = isEqual(R.mod(pixelCoord.y, R.val(4)), R.val(y));

        let isDither = R.floor(R.div(R.add(ditherX, ditherY), R.val(2)));
        ditherColor = R.mul( R.add( R.mul(kernel[x][y],isDither), ditherColor ), R.val(_DitherStrength));
    }
}

let ditherResult = R.pack4(ditherColor,ditherColor,ditherColor, R.val(1));
sampled = R.div( R.round(R.mul(R.add(sampled,ditherResult ), R.val(_ColourDepth) ) ),R.val(_ColourDepth));
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


//blurMat.setTexture(sampled, {textureSlotName: "diffuseTexture"});
