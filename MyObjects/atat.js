
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
            shaderProgram = twgl.createProgramInfo(gl, ["atat-vs", "atat-fs"]);
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
    AtAt.prototype.draw = function (drawingState) {
        // we make a model matrix to place the RebelBase in the world
        //advance(this, drawingState);
        var mScale = twgl.m4.scaling([this.size, this.size, this.size]);
        if(drawingState.realtime < 25000) {
            var mTrans = twgl.m4.translation(curveValue(drawingState.realtime * 0.00008, this.position));
            var mRot = twgl.m4.lookAt([0, 0, 0], curveTangent(drawingState.realtime * 0.00072), [0, 1, 0]);
        } else {
            var mTrans = twgl.m4.translation(this.position);
            var mRot = twgl.m4.lookAt([0, 0, 0], curveTangent(drawingState.realtime * 0.00072), [0, 1, 0]);
        }

        var modelM = twgl.m4.multiply(mRot, mTrans);
        modelM = twgl.m4.multiply(modelM, mScale);

        //var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        ///delM = twgl.m4.rotationY(Math.PI / 2);
        //gl.m4.setTranslation(modelM, this.position, modelM);
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
    AtAt.prototype.center = function (drawingState) {
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
        var result = [-1, 0, 0];
        return result;
    }

    function curveValue(t, position) {
        
        var p0 = [-position[0], 2, 5];
        var p1 = [-position[0], 2, 3];
        var p2 = [-position[0], 2, 3];
        var p3 = [-position[0], 2, 2];

        var b0 = (1 - t) * (1 - t) * (1 - t);
        var b1 = 3 * t * (1 - t) * (1 - t);
        var b2 = 3 * t * t * (1 - t);
        var b3 = t * t * t;


        var result = [p0[0] * b0 + p1[0] * b1 + p2[0] * b2 + p3[0] * b3,
                      p0[1] * b0 + p1[1] * b1 + p2[1] * b2 + p3[1] * b3,
                      p0[2] * b0 + p1[2] * b1 + p2[2] * b2 + p3[2] * b3];
        return result;
    }

    
    function curveTangent(t) {
        var result = [-1,0,0];
        return result;
    }

    function LoadTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

})();

grobjects.push(new AtAt("AT-AT1", [-3, 2, 3], 1));
grobjects.push(new AtAt("AT-AT2", [2, 2, 2], 1));

