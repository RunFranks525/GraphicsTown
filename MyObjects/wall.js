
var grobjects = grobjects || [];

var wall = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for AtAt
    wall = function wall(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
        this.orientation = 0;
    }
    wall.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["wall-vs", "wall-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        0.0, 0.0, -1.0,//bottom left
                        0.0, 3.0, -1.0,//top left
                        4.0, 0.0, -1.0,//bottom right

                        0.0, 3.0, -1.0,//top left
                        4.0, 0.0, -1.0,//bottom right
                        4.0, 3.0, -1.0,//top right,

                        0.0, 0.0, 3.0,//bottom left
                        0.0, 3.0, 3.0,//top left
                        0.0, 0.0, -1.0,//bottom right

                        0.0, 3.0, -1.0,//top right
                        0.0, 0.0, -1.0,//bottom right
                        0.0, 3.0, 3.0,//top left

                        4.0, 0.0, 3.0,//bottom left
                        4.0, 3.0, 3.0,//top left
                        4.0, 0.0, -1.0,//bottom right

                        4.0, 3.0, -1.0,//top right
                        4.0, 0.0, -1.0,//bottom right
                        4.0, 3.0, 3.0,

                        0.0, 0.0, 3.0,//bottom left
                        0.0, 3.0, 3.0,//top left
                        4.0, 0.0, 3.0,//bottom right

                        0.0, 3.0, 3.0,//top left
                        4.0, 0.0, 3.0,//bottom right
                        4.0, 3.0, 3.0
                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        .5,1,
                        0, 0,
                        1, 1,

                        .5, 0,
                        0, 1,
                        0, 0,

                        1, 1,
                        1, 0,
                        0, 1,

                        0, 0,
                        0, 1,
                        1, 0,

                        .5, 1,
                        1, 0,
                        0, 1,

                        0, 0,
                        0, 1,
                        1, 0,

                        .5, 1,
                        0, 0,
                        1, 1,

                        .5, 0,
                        0, 1,
                        0, 0,
                    ]
                }
            };

            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
            var texture3 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, texture3);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var mountainImage = new Image();
            mountainImage.crossOrigin = "anonymous";
            mountainImage.src = "https://lh3.googleusercontent.com/6Rj-XLp9d754C2bbvXhHIeumYziQYoE1ZjuT2lz04EbXPVcxPb3kJJVv92ZiBmCKJGaTvLeG719u0wCY6BmYpDrxgmEo9zxsNPf--63js3OaXNv3lHaAg5CqC54MwkKCv4a2RcgWYjnIQdTyh2IWPvK7FOBg58xYOcaZ_nm35KvvyvrH-mbk-ltbQn2TibYbGeBVCBwF88myUkFXfpfIJbX82C1lewQ_5aSefP8ZhG3dV6q2pnNnlZ-ZKjlk4fKZvcl4DOPqOfRRICmQ1e8B41_Hp0Njx-_mes2SOgA46-tF96JOHw0OlxOYXRJOQmHm71p8X7ggsaopLh9mdnSh5kV3bLCfHulO91vhiTSg4uE8PcjHbkvxYUFs2j1bsOjzL5pVm3_wjPq7dJF97Kbr92VqeGB9f9zL4cj3wraD8D_uSplkWQZyYi7t-NYGnuL3s2k37TSLEGusP2XxO8Wd-A1ug1ddVWO_BG_bF2KVFqKy-jSigcVRj9sAdMnuDYyeS33UAcnSYxKmIXNFxCbkkqTRJloLiK09WETcsBLBPNvmxJRBoBkRIhX1kQ-abM7uYlw35-ZlbLb7Jy_BMkzwv9ATru3CWA=w256-h128-no";
            mountainImage.onload = function () {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture3);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mountainImage);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
            }
        }

    };
    wall.prototype.draw = function (drawingState) {
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
        shaderProgram.program.texSampler3 = gl.getUniformLocation(shaderProgram.program, "texSampler2");
        gl.uniform1i(shaderProgram.program.texSampler3, 2);

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    wall.prototype.center = function (drawingState) {
        return this.position;
    }



})();

grobjects.push(new wall("wall", [-10, 0, -5], 5));



