
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
                        1.0, 0.0, 0.0,//bottom left
                        1.0, 1.0, 0.0,//top left
                        3.0, 0.0, 0.0,//bottom right

                        1.0, 1.0, 0.0,//top left
                        3.0, 0.0, 0.0,//bottom right
                        3.0, 1.0, 0.0,//top right,

                        1.0, 0.0, 2.0,//bottom left
                        1.0, 1.0, 2.0,//top left
                        1.0, 0.0, 0.0,//bottom right

                        1.0, 1.0, 0.0,//top right
                        1.0, 0.0, 0.0,//bottom right
                        1.0, 1.0, 2.0,//top left,



                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0.5, 0,
                        .5, 1,
                        1, 0,

                        .5, 0,
                        0, 1,
                        0, 0,

                        1, 1,
                        1, 0,
                        0, 1,

                        0, 0,
                        0, 1,
                        1, 0,
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
            mountainImage.src = "https://lh3.googleusercontent.com/Nz3gbFjWlBIgfjGhplYInwr-HRcvS4P8wjXwlSWd8yusPmXZ4pS5J-bXVN61qb6waSRKNstVxlX_tRV7s7961ymHGUnVtXdnbeO5m3uT_ij2bG-Ce95376687ReZLUDAX6x217gUf_RPRP8jNhMWUzNRInZscvyWaToKwONiJFeTWLnxG1afPEbhndJxUuMWgD4trneLfy2lQJjeuhQBaF_Mo78Wdu7TH8RG07nWRmHOcxvaPClgxl0EIDVN9tY2Ll26M9W_BEibosjFDxXs-TPPCa1VxbK4fi2tImN2J6ZPBUQBVoEHblCk9eCqtJSjNCTvH1KNOXH0M3EsCirDYRSN3A6Qd2zOtkZXkTH2OdgSY88iQH6TySMzdHrh5IVkKvZn9KXRrIrqriOAca5sjfNBSznIyiWjdDUcousxRpkPvwEqJXyA9-k5KEEj6n7XhrxpGYBpyd91R__rGtxoxPh3SF0bwZgjWk_cV-SyGM_sncfOova1pc4VquIUc_P88oU8vkgDD6mfpzEeN2zxDPXX29hHzkznuVF50gRl0sEpMARZQ0djoE5VCzkUjVLW5jg=w256-h128-no";
            mountainImage.onload = function () {
                gl.activeTexture(gl.TEXTURE2);
                gl.bindTexture(gl.TEXTURE_2D, texture3);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mountainImage);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
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

    function LoadTextureWall(gl, image, texture) {

    }
})();

grobjects.push(new wall("wall", [-10, 0, -5], 5));



