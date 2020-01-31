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

let mathIfElse = function(x, y) {
    return R.ceil(R.div( R.add( R.sign(R.sub(y,  x )), R.val(1)), R.val(2)));
}

let isEqual = function(x,y) {
    return R.add( R.neg( R.abs( R.sign( R.sub(x,y)))), 1);
}

let LuminanceRed = 0.2126;
let LuminanceGreen =0.7152;
let LuminanceBlue = 0.0722;
let LuminanceMultiplier = R.pack4(LuminanceRed,LuminanceGreen,LuminanceBlue ,0);

let _ScreenParams = R.pack2(CameraInfo.previewSize.width, CameraInfo.previewSize.height);
var sampled = Shaders.textureSampler(cameraColor, texcoords);
let pixelCoord = R.floor(R.mul(texcoords, _ScreenParams));

let grayValue = R.dot( LuminanceMultiplier, sampled);
const kernel = [
    [0, 0.25],
    [0.75, 0.5]
];


let ditherColor = R.val(0);

// let ditherX = isEqual( R.floor(R.mod(pixelCoord.x, 2)), 1);
// let ditherY = isEqual( R.floor(R.mod(pixelCoord.y, 2)), 1);

// let isDither = R.floor(R.div(R.add(ditherX, ditherY), 2));

// Diagnostics.watch( "Hello", isDither);

for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
        let ditherX = isEqual( R.round(R.mod(pixelCoord.x, 2)), x);
        let ditherY = isEqual( R.round(R.mod(pixelCoord.y, 2)), y);
        
        let isDither = isEqual(R.add(ditherX, ditherY), 2);
        let ditherFilter = R.mul(kernel[x][y], isDither);

        ditherColor = R.add(  R.mul(mathIfElse(ditherFilter, grayValue), isDither) , ditherColor);
        //ditherColor = R.add(isDither, ditherColor);
    }
}
// Diagnostics.watch( "Hello", ditherColor);


let output = ditherColor;
blurMat.setTexture(output, {textureSlotName: "diffuseTexture"});
