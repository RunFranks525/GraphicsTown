
var grobjects = grobjects || [];

var AtSt = undefined;
(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for AtAt
    AtSt = function AtSt(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 0.5;
        this.color = color || [.7, .8, .9];
    }
    AtSt.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["atat-vs", "atat-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        //body
                        //backBottom Triangle
                        -0.35, -0.5, -0.5,
                        0.35, -0.5, -0.5,
                        0.35, 0.5, -0.5,
                        -0.35, -0.5, -0.5,

                        //backTop Triangle
                        0.35, 0.5, -0.5,
                        -0.35, 0.5, -0.5,    // z = 0
                        -0.35, -0.5, 0.5,
                        0.35, -0.5, 0.5,

                        0.35, 0.5, 0.5,
                        -0.35, -0.5, 0.5,
                        0.35, 0.5, 0.5,
                        -0.35, 0.5, 0.5,    // z = 1

                        -0.35, -0.5, -0.5,
                        0.35, -0.5, -0.5,
                        0.35, -0.5, 0.5,
                        -0.35, -0.5, -0.5,

                        0.35, -0.5, 0.5,
                        -0.35, -0.5, 0.5,    // y = 0
                        -0.35, 0.5, -0.5,
                        0.35, 0.5, -0.5,

                        0.35, 0.5, 0.5,
                        -0.35, 0.5, -0.5,
                        0.35, 0.5, 0.5,
                        -0.35, 0.5, 0.5,      // y = 1

                        -0.35, -0.5, -0.5,
                        -0.35, 0.5, -0.5,
                        -0.35, 0.5, 0.5,
                        -0.35, -0.5, -0.5,

                        -0.35, 0.5, 0.5,
                        -0.35, -0.5, 0.5,    // x = 0
                         0.35, -0.5, -0.5,
                         0.35, 0.5, -0.5,

                         0.35, 0.5, 0.5,
                         0.35, -0.5, -0.5,
                         0.35, 0.5, 0.5,
                         0.35, -0.5, 0.5,

                         // leg back right
                        -0.35, -2.0, .5,
                        -0.35, -0.5, 0.5,
                         -0.35, -0.5, 0.2,

                         -0.35, -2.0, 0.2,
                         -0.35, -2.0, 0.5,
                         -0.35, -0.5, 0.2,



                         //leg back left
                         -0.35, -2.0, -.5,
                         -0.35, -0.5, -0.5,
                         -0.35, -0.5, -0.2,

                         -0.35, -2.0, -0.2,
                         -0.35, -2.0, -0.5,
                         -0.35, -0.5, -0.2,
                       

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

                        
  
                    ]
                },
                vTex: {
                    numComponents: 3,
                    data:
                        [
                            0, 0,
                            1, 0,
                            1, 1,
                            0, 1
                        ]
                }
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            //window.texture = gl.createTexture();
            //gl.bindTexture(gl.TEXTURE_2D, texture);
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            //window.image = new Image();
            //image.onload = LoadTexture;
            //image.crossOrigin = "anonymous";
            //image.src = "/Images/snow_texture1551.jpg";
        }

    };
    AtSt.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        //advance(this, drawingState);

        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        modelM = twgl.m4.rotationY(Math.PI / 2);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var normalMatrix = [1, 1, 0, 0, 1, 1, 1, 0, 1];
        //var normalMatrix = twgl.m4.transpose(twgl.m4.inverse(modelM));
        // the drawing code is straightforward - since twgl deals with the GL stuff for us
        window.gl = drawingState.gl;
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
        // shaderProgram.program.texSampler = gl.getUniformLocation(shaderProgram.program, "texSampler");
        //gl.uniform1i(shaderProgram.program.texSampler, 0);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    AtSt.prototype.center = function (drawingState) {
        return this.position;
    }


    function LoadTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

})();

grobjects.push(new AtSt("AT-ST1", [0, 1, 3], .1));
grobjects.push(new AtSt("AT-ST2", [2, 1, 2], 1));

