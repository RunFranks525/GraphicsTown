﻿
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
                        //body
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

                        -1.0, -0.5, -0.5,
                        -1.0, 0.5, -0.5,
                        -1.0, 0.5, 0.5,
                        -1.0, -0.5, -0.5,

                        -1.0, 0.5, 0.5,
                        -1.0, -0.5, 0.5,    // x = 0
                         1.0, -0.5, -0.5,
                         1.0, 0.5, -0.5,

                         1.0, 0.5, 0.5,
                         1.0, -0.5, -0.5,
                         1.0, 0.5, 0.5,
                         1.0, -0.5, 0.5,

                         // leg back right
                        -1.0, -2.0, .5,
                        -1.0, -0.5, 0.5,
                         -1.0, -0.5, 0.2,

                         -1.0, -2.0, 0.2,
                         -1.0, -2.0, 0.5,
                         -1.0, -0.5, 0.2,



                         //leg back left
                         -1.0, -2.0, -.5,
                         -1.0, -0.5, -0.5,
                         -1.0, -0.5, -0.2,

                         -1.0, -2.0, -0.2,
                         -1.0, -2.0, -0.5,
                         -1.0, -0.5, -0.2,

                         //leg front right
                         1.0, -2.0, .5,
                         1.0, -0.5, 0.5,
                         1.0, -0.5, 0.2,

                         1.0, -2.0, 0.2,
                         1.0, -2.0, 0.5,
                         1.0, -0.5, 0.2,

                         //leg front left
                         1.0, -2.0, -.5,
                         1.0, -0.5, -0.5,
                         1.0, -0.5, -0.2,

                         1.0, -2.0, -0.2,
                         1.0, -2.0, -0.5,
                         1.0, -0.5, -0.2,

                         //head
                         1.0, 0.5, -.25,
                         1.0, 0.5, 0.25,
                         1.6, 0.5, -.25,

                         1.6, 0.5, 0.25,
                         1.6, 0.5, -.25,
                         1.0, 0.5, 0.25,

                         1.0, 0.25, -.25,
                         1.0, 0.25, 0.25,
                         1.6, 0.25, -.25,

                         1.6, 0.25, 0.25,
                         1.6, 0.25, -.25,
                         1.0, 0.25, 0.25,

                         1.6, 0.25, -.25,
                         1.6, 0.25, 0.25,
                         1.6, 0.5, -.25,

                         1.6, 0.5, 0.25,
                         1.6, 0.5, -.25,
                         1.6, 0.25, 0.25,

                         1.0, 0.25, -0.25,
                        1.6, 0.25, -0.25,
                        1.6, 0.5, -0.25,

                        1.0, 0.5, -0.25,
                        1.0, 0.25, -0.25,
                        1.6, 0.5, -0.25,

                        1.0, 0.25, 0.25,
                        1.6, 0.25, 0.25,
                        1.6, 0.5, 0.25,

                        1.0, 0.5, 0.25,
                        1.0, 0.25, 0.25,
                        1.6, 0.5, 0.25,





                    ]
                },
                vnormal: {
                    numComponents: 3,
                    data: [
                        //0,1,0 - Normal up
                        //0,-1,0 -Normal Down
                        //1,0,0 - Normal "ahead"
                        //-1,0,0 - Normal "back"
                        //0,0,1 - Normal 
                        //0,0,-1 - Normal
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
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

                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,
                        -1, 0, 0,

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

                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,

                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,
                        0, 1, 0,

                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,
                        0, -1, 0,

                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,
                        1, 0, 0,


                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,
                        0, 0, -1,

                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,
                        0, 0, 1,

                    ]
                },
                //vTex: {
                //    numComponents: 3,
                //    data:
                //        [
                //            0, 0,
                //            1, 0,
                //            1, 1,
                //            0, 1
                //        ]
                //}

            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }

    };
    AtAt.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        //advance(this, drawingState);
        
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        modelM = twgl.m4.rotationY(Math.PI / 2);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var normalMatrix = [1, 1, 0, 0, 1, 1, 1, 0, 1];
        //var normalMatrix = twgl.m4.transpose(twgl.m4.inverse(modelM));
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        window.gl = drawingState.gl;
        //window.texture = gl.createTexture();
        //gl.bindTexture(gl.TEXTURE_2D, texture);
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        //window.image = new Image();
        //image.onload = loadTexture;
        //image.crossOrigin = "anonymous";
        //image.src = "https://lh3.googleusercontent.com/ZZPdzvlpK9r_Df9C3M7j1rNRi7hhHRvPhlklJ3lfi5jk86Jd1s0Y5wcQ1QgbVaAP5Q=w300";


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
        //shaderProgram.program.texSampler = gl.getUniformLocation(shaderProgram.program, "texSampler");
        //gl.uniform1i(shaderProgram.program.texSampler, 0);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    AtAt.prototype.center = function (drawingState) {
        return this.position;
    }

    var movespeed = 3 / 1000;
    function advance(atat, drawingState) {
        var time = -1* (Number(drawingState.realtime));
        atat.position[2] = time * movespeed;
        if (atat.position[2] < -0.5) {
            atat.position[2] = 0;
        }
    }

    function loadTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
       // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
       // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

})();

grobjects.push(new AtAt("AT-AT1", [-3, 2, 3], 1));
grobjects.push(new AtAt("AT-AT2", [2, 2, 2], 1));

