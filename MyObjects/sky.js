
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
                        0.0, 3.0, -1.0,//bottom left
                        0.0, 3.0, 3.0,//top left
                        4.0, 3.0, -1.0,//bottom right

                        4.0, 3.0, 3.0,//top left
                        0.0, 3.0, 3.0,//bottom right
                        4.0, 3.0, -1.0,//top right,

                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0, 0,
                        0, 2,
                        2, 2,

                        2, 2,
                        2, 0,
                        0, 0,
                    ]
                }
            };

            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
            var texture4 = gl.createTexture();
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, texture4);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var skyImage = new Image();
            skyImage.crossOrigin = "anonymous";
            skyImage.src = "https://lh3.googleusercontent.com/l2dttIZyaAm7H5XlNGdsjxaDddclFyFQOclI-KD26dn2i_2PmO9OY-Ixzr7sKl6W9VXfnVK5ttDCF99DRH1JVtlJ_3JQnCrRNgPNlVkyUlo_vhWaCnCr63qcJ8CyFRL3aT_ZqWNS3OVo5GXJPnMplAcZC-jCOB6zZjKSqnewA2qmHnHpU4xHruNOZmblgns9-Oz765erBxspAzxgXjphxbzVGQQHplmEhpT7Ugsoo6WefQqEdyULvP7zqa_Tgx43Md4rYMuTQv8jqSGCADGbOttn6ndMyj7DTi136jVDp3wECYHXaBwMbubJGAJh58mIRJ1QxiA1Y1ee-K1ktUcCxR5YpBsPDVs4jjDqqTZRCa_7CcS_7rpfLbj9qMEU1RexMiJcCTCSqFtQ5dTNOip6gvxXZECboVXqVDigpjalgUBD5Dj7Bp53UTt4VNW6tEb04i6DZZ8LxmrOFgkQUUbOkI35aFVOhScAqQrdcm0_EKQubCgh0jw7M4G_Cp07Bi80b-qP9qSFCTXJWR3JYe6_PPiD5FxKJt_-mALTLErWXSNgPSOB90OAcbs9WJ_Gw8TkHCVZ31yCBSqWovd4OBjTG66ze91UhQ=s256-no";
            skyImage.onload = function () {
                gl.activeTexture(gl.TEXTURE3);
                gl.bindTexture(gl.TEXTURE_2D, texture4);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skyImage);
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
        gl.uniform1i(shaderProgram.program.texSampler3, 3);

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    wall.prototype.center = function (drawingState) {
        return this.position;
    }

})();

grobjects.push(new wall("sky", [-10, 0, -5], 5));



