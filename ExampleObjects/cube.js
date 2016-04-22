/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function () {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0, 0, 0];
        this.size = size || 1.0;
        this.color = color || [.7, .8, .9];
    }
    Cube.prototype.init = function (drawingState) {
        var gl = drawingState.gl;
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cubeTest-vs", "cubeTest-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: [
                        -.5, -.5, -.5,
                        .5, -.5, -.5,
                        .5, .5, -.5,

                        -.5, -.5, -.5,
                        .5, .5, -.5,
                        -.5, .5, -.5,

                        -.5, -.5, .5,
                        .5, -.5, .5,
                        .5, .5, .5,

                        -.5, -.5, .5,
                        .5, .5, .5,
                        -.5, .5, .5,

                        // z = 1
                        -.5, -.5, -.5,
                        .5, -.5, -.5,
                        .5, -.5, .5,

                        -.5, -.5, -.5,
                        .5, -.5, .5,
                        -.5, -.5, .5,

                        // y = 0
                        -.5, .5, -.5,
                        .5, .5, -.5,
                        .5, .5, .5,

                        -.5, .5, -.5,
                        .5, .5, .5,
                        -.5, .5, .5,

                        // y = 1
                        -.5, -.5, -.5,
                        -.5, .5, -.5,
                        -.5, .5, .5,

                        -.5, -.5, -.5,
                        -.5, .5, .5,
                        -.5, -.5, .5,

                        // x = 0
                         .5, -.5, -.5,
                         .5, .5, -.5,
                         .5, .5, .5,

                         .5, -.5, -.5,
                         .5, .5, .5,
                         .5, -.5, .5     // x = 1
                    ]
                },
                vTex: {
                    numComponents: 2,
                    data: [
                        0, 0,
                        1, 0,
                        1, 1,

                        0, 1,
                        1, 0,
                        1, 1,

                        0, 1,
                        0, 0,
                        0, 1,

                        0, 0,
                        1, 0,
                        1, 1,

                        0, 0,
                        1, 0,
                        1, 1,

                        0, 1,
                        1, 1,
                        0, 1,

                        0, 0,
                        1, 0,
                        1, 1,

                        0, 1,
                        0, 0,
                        1, 0,

                        1, 1,
                        0, 1,
                        0, 0,

                        0, 0,
                        1, 0,
                        1, 1,

                        0, 1,
                        1, 0,
                        0, 0,

                        1, 1,
                        0, 1,
                        1,0

                    ]
                }

            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
            window.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            window.image = new Image();
            image.onload = LoadTexture;
            image.crossOrigin = "anonymous";
            image.src = "https://lh3.googleusercontent.com/-xX-m9F-ax7c/ViSDMRbutoI/AAAAAAAABWs/A3L33oEWBCw/s512-Ic42/spirit.jpg";

        }

    };
    Cube.prototype.draw = function (drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
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

            });

        shaderProgram.program.texSampler = gl.getUniformLocation(shaderProgram.program, "texSampler");
        gl.uniform1i(shaderProgram.program.texSampler, 0);

        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    Cube.prototype.center = function (drawingState) {
        return this.position;
    }


    function LoadTexture() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // Option 1 : Use mipmap, select interpolation mode
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
//Cube(name, position, size, color)
grobjects.push(new Cube("cube1", [0, 0, 0], 5, [1, 0, 0]));
//grobjects.push(new Cube("cube2",[ 2,0.5,   0],1, [1,1,0]));
//grobjects.push(new Cube("cube3",[ 0, 0.5, -2],1 , [0,1,1]));
//grobjects.push(new Cube("cube4",[ 0,0.5,   2],1));

//grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
//grobjects.push(new SpinningCube("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
//grobjects.push(new SpinningCube("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
//grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));
