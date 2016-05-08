
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
        var mScale = twgl.m4.scaling([this.size, this.size, this.size]);
        if (drawingState.realtime < 1570) {
            var mTrans = twgl.m4.translation(initialCurve(drawingState.realtime * 0.0008));
            var mRot = twgl.m4.lookAt([0, 0, 0], initialTangent(drawingState.realtime * 0.0007), [0, 1, 0]);
        } else {
            var mTrans = twgl.m4.translation(curveValue(drawingState.realtime * 0.0008));
            var mRot = twgl.m4.lookAt([0, 0, 0], curveTangent(drawingState.realtime * 0.00072), [0, 1, 0]);
        } 

        var modelM = twgl.m4.multiply(mRot, mTrans);
        modelM = twgl.m4.multiply(mScale, modelM);
        var normalMatrix = modelM;
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

    function initialCurve(t) {
        var p0 = [0, 0, -5];
        var p1 = [-1, 4, -3];
        var p2 = [-1, 4, -3];
        var p3 = [-1, 3, -2];

        var b0 = (1 - t) * (1 - t) * (1 - t);
        var b1 = 3 * t * (1 - t) * (1 - t);
        var b2 = 3 * t * t * (1 - t);
        var b3 = t * t * t;


        var result = [p0[0] * b0 + p1[0] * b1 + p2[0] * b2 + p3[0] * b3,
                      p0[1] * b0 + p1[1] * b1 + p2[1] * b2 + p3[1] * b3,
                      p0[2] * b0 + p1[2] * b1 + p2[2] * b2 + p3[2] * b3];
        return result;
    }

    function initialTangent(time) {
        var result = [-3 * Math.sin(Math.PI * time), 0, 0];
        return result;
    }

    function curveValue(time) {
        var result = [Math.cos(Math.PI * -time) * 3 + 1, 3, Math.sin(Math.PI *- time) * 2];
        return result;
    }

    function curveTangent(t) {
        var result = [-3 * Math.PI * Math.sin(Math.PI * t), 0, -2 * Math.PI * Math.cos(Math.PI * t)];
        return result;
    }

})();

grobjects.push(new speeder("snowSpeeder", [0, 0, 0], 0.5, [1.0, 1.0, 1.0]));


