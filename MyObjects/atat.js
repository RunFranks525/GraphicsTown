
var grobjects = grobjects || [];

var AtAt = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for AtAt
    AtAt = function AtAt(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
    }
    AtAt.prototype.init = function (drawingState) {
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

                        //backBottom Triangle
                        -1.0, -0.5, -0.5,
                        1.0, -0.5, -0.5,
                        1.0, 0.5, -0.5,
                        -1.0, -0.5, -0.5,

                        //backTop Triangle
                        1.0, 0.5, -0.5,
                        -1.0, 0.5, -0.5,    // z = 0
                        -1.0, -0.5, 0.5,
                        1.0, -0.5, 0.5,

                        1.0, 0.5, 0.5,
                        -1.0, -0.5, 0.5,
                        1.0, 0.5, 0.5,
                        -1.0, 0.5, 0.5,    // z = 1

                        -1.0, -0.5, -0.5,
                        1.0, -0.5, -0.5,
                        1.0, -0.5, 0.5,
                        -1.0, -0.5, -0.5,

                        1.0, -0.5, 0.5,
                        -1.0, -0.5, 0.5,    // y = 0
                        -1.0, 0.5, -0.5,
                        1.0, 0.5, -0.5,

                        1.0, 0.5, 0.5,
                        -1.0, 0.5, -0.5,
                        1.0, 0.5, 0.5,
                        -1.0, 0.5, 0.5,      // y = 1

                        -0.5, -0.5, -0.5,
                        -0.5, 0.5, -0.5,
                        -0.5, 0.5, 0.5,
                        -0.5, -0.5, -0.5,

                        -0.5, 0.5, 0.5,
                        -0.5, -0.5, 0.5,    // x = 0
                         0.5, -0.5, -0.5,
                         0.5, 0.5, -0.5,

                         0.5, 0.5, 0.5,
                         0.5, -0.5, -0.5,
                         0.5, 0.5, 0.5,
                         0.5, -0.5, 0.5     // x = 1
                    ]
                },
                vnormal: {
                    numComponents: 3,
                    data: [
                        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
                        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
                        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
                        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }

    };
    AtAt.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        modelM = twgl.m4.rotationY(Math.PI/2);
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

            });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    AtAt.prototype.center = function (drawingState) {
        return this.position;
    }

})();

grobjects.push(new AtAt("rebelBase", [0, 4, 2], 1))

