
var grobjects = grobjects || [];

var mountain = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Mountain
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
            shaderProgram = twgl.createProgramInfo(gl, ["mountain-vs", "mountain-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        -0.5, 0.0, -0.5,    // triangle 1
                         0.5, 0.0, -0.5,    //back triangle
                         0.0, 1.0, 0.0,

                        0.5, 0.0, -0.5,    // triangle 2
                        0.5, 0.0, 0.5,  //right tri
                        0.0, 1.0, 0.0,


                        0.5, 0.0, 0.5,    // triangle 3
                        -0.5, 0.0, 0.5,     //front tri
                        0.0, 1.0, 0.0,

                        -0.5, 0.0, 0.5,    // triangle 4
                        -0.5, 0.0, -0.5,   //left tri
                        0.0, 1.0, 0.0,
                    ]
                    // make each triangle be a 
                },
                vnormal: {
                    numComponents: 3,
                    data: [
        0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5,    
        0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9,    
        0.9, 0.5, 0.9, 0.9, 0.5, 0.9, 0.9, 0.5, 0.9,    
        0.5, 0.9, 0.5, 0.5, 0.9, 0.5, 0.5, 0.9, 0.5,    
                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0, 0,
                        0, 1,
                        1, 1,

                        0, 0,
                        0, 1,
                        1, 1,

                        0, 0,
                        0, 1,
                        1, 1,

                        0, 0,
                        0, 1,
                        1, 1          
                    ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            var texture2 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, texture2);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var image2 = new Image();
            image2.crossOrigin = "anonymous";
            image2.src = "https://lh3.googleusercontent.com/I-9WQ3GxntdSwcNvUh7lpGTWBG_Ow_Vk9r5aLrelpFrNKhLp5ulLoVN7zjUU3J42AMZiFeF5n4B2nXbxSuLtFcaq6_DKuOHGo4v8Vp9H-XmuP_flZS1Hb3_nTKbWZqpijzvp1vSTlbZ7wqwKkXVGwFEYwIJga1lJ_aiWjCLueHKlmyQ3PlmLkWPwm5bDtqmntqrTp-cd7oavS5Gts5mV_-uphOn8vsLxhMbwcbUVbgBSdL4bELqpeF9CpI3zqp8VC_2jam3Ihe3JKlT_IHIFobJ6Hel70DZgJWV7jfHjxzPG3Oc7BvFOMW72jSP3Q-qrSno8jxEGZbqVwzf3YQwbOe489L-232h7aYYkBSdnPjbKcFdyE6e67li-3d0hLzXRwfFjt_nht_LHf2OhoumJQMmVkEyHJFr4hmoiTg8sniMe7s8NFuNV9aUN-UKrtsTrdvin6gu6LU4pEmLSuTyZBCzLs7dzyl_J3NFS4ZmZ-w_Vz55kqqUnvwbbDSvCa0xj-KCGNUWIQ2Wz7-pmlffSFrgeP-gmNu9OCclWqsCh10d_8o0vd76JlFQUBHlSu5RHuZw=s256-no";
            image2.onload = function () {
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, texture2);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            }
        }
    };
    mountain.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
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
        shaderProgram.program.texSampler2 = gl.getUniformLocation(shaderProgram.program, "texSampler2");
        gl.uniform1i(shaderProgram.program.texSampler2, 1);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    mountain.prototype.center = function (drawingState) {
        return this.position;
    }

})();

grobjects.push(new mountain("mountain1", [4, 0, -4], 2, [0.25,0.25,0.25]));
grobjects.push(new mountain("mountain2", [3, 0, -4], 1.5, [0.25, 0.25, 0.25]));
grobjects.push(new mountain("mountain3", [-3.5, 0, -2], 2.5, [0.25, 0.25, 0.25]));


