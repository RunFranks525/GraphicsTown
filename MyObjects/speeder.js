
var grobjects = grobjects || [];

var speeder = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for AtAt
    speeder = function speeder(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
        this.orientation = 0;
    }
    speeder.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        //body
                        //backBottom Triangle
                        -1.0, -0.25, -0.5,
                        1.0, -0.25, -0.5,
                        1.0, 0.25, -0.5,
                        -1.0, -0.25, -0.5,

                        //backTop Triangle
                        1.0, 0.25, -0.5,
                        -1.0, 0.25, -0.5,    // z = 0
                        -1.0, -0.25, 0.5,
                        1.0, -0.25, 0.5,

                        1.0, 0.25, 0.5,
                        -1.0, -0.25, 0.5,
                        1.0, 0.25, 0.5,
                        -1.0, 0.25, 0.5,    // z = 1

                        -1.0, -0.25, -0.5,
                        1.0, -0.25, -0.5,
                        1.0, -0.25, 0.5,
                        -1.0, -0.25, -0.5,

                        1.0, -0.25, 0.5,
                        -1.0, -0.25, 0.5,    // y = 0
                        -1.0, 0.25, -0.5,
                        1.0, 0.25, -0.5,

                        1.0, 0.25, 0.5,
                        -1.0, 0.25, -0.5,
                        1.0, 0.25, 0.5,
                        -1.0, 0.25, 0.5,      // y = 1

                        -1.0, -0.25, -0.5,
                        -1.0, 0.25, -0.5,
                        -1.0, 0.25, 0.5,
                        -1.0, -0.25, -0.5,

                        -1.0, 0.25, 0.5,
                        -1.0, -0.25, 0.5,    // x = 0
                         1.0, -0.25, -0.5,
                         1.0, 0.25, -0.5,

                         1.0, 0.25, 0.5,
                         1.0, -0.25, -0.5,
                         1.0, 0.25, 0.5,
                         1.0, -0.25, 0.5,     // x = 1

                         //wing
                         -1.0, 0.25, .5,
                         -.75, 0.0, 1.25,
                         1.0, 0.25, .5,

                         -.75, 0.0, 1.25,
                         .75, 0.0, 1.25,
                         1.0, 0.25, .5,

                         //wing
                         -1.0, 0.25, -.5,
                         -.75, 0.0, -1.25,
                         1.0, 0.25, -.5,

                         -.75, 0.0, -1.25,
                         .75, 0.0, -1.25,
                         1.0, 0.25, -.5




                    ]
                },
                vnormal: {
                    numComponents: 3,
                    data: [
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1, 0, 0, -1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,

                        1, 1, 0,
                        1, 1, 0,
                        1, 1, 0,

                        1, 1, 0,
                        1, 1, 0,
                        1, 1, 0,

                        1, 1, 0,
                        1, 1, 0,
                        1, 1, 0,

                        1, 1, 0,
                        1, 1, 0,
                        1, 1, 0,


                    ]
                }

            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }

    };
    speeder.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        advance(this, drawingState);
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        //console.log(this.orientation);
        //modelM = twgl.m4.multiply(modelM, twgl.m4.axisRotation([1,0,0], this.orientation));
        twgl.m4.setTranslation(modelM, this.position, modelM);
        //var normalMatrix = [1, 1, 0, 0, 1, 1, 1, 0, 1];
        var normalMatrix = modelM;
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram,
        {
                view: drawingState.view,
                proj: drawingState.proj,
                lightdir: drawingState.sunDirection,
                cubecolor: this.color,
                model: modelM,
                normalMatrix: normalMatrix
        });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    speeder.prototype.center = function (drawingState) {
        return this.position;
    }
    var flyingSpeed = 3 / 1000;
    
    function advance(speeder, drawingState) {
        var time = Number(drawingState.realtime);
        speeder.position[0] = Math.sin(time * flyingSpeed) * 3;
        speeder.position[2] = Math.cos(time * flyingSpeed) * 2;
    }

})();

grobjects.push(new speeder("snowSpeeder", [1,1, 3], 0.5, [1.0, 1.0, 1.0]));



