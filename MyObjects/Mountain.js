
var grobjects = grobjects || [];

var mountain = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for AtAt
    mountain = function mountain(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
    }
    mountain.prototype.init = function (drawingState) {
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
        -0.5, 0.0, -0.5,    // triangle 1
         0.5, 0.0, -0.5,
         0.0, 1.0,  0.0,
         0.5, 0.0, -0.5,    // triangle 2
         0.5, 0.0,  0.5,
         0.0, 1.0,  0.0,
         0.5, 0.0,  0.5,    // triangle 3
        -0.5, 0.0,  0.5,
         0.0, 1.0,  0.0,
        -0.5, 0.0,  0.5,    // triangle 4
        -0.5, 0.0, -0.5,
         0.0, 1.0,  0.0,
                    ]
            // make each triangle be a 
                },
                vnormal: {
                    numComponents: 3,
                    data: [
        0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5,    // tri 1 = yellow
        0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9,    // tri 2 = cyan
        0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9,    // tri 3 = magenta
        0.5, 0.9, 0.5, 0.5, 0.9, 0.5, 0.5, 0.9, 0.5,    // tri 4 = green
                    ]
                }

            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }

    };
    mountain.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
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
    mountain.prototype.center = function (drawingState) {
        return this.position;
    }

})();

grobjects.push(new mountain("mountain1", [4, 0, -4], 2));
grobjects.push(new mountain("mountain2", [3, 0, -4], 1.5));
grobjects.push(new mountain("mountain3", [-3.5, 0, -2], 2.5));


