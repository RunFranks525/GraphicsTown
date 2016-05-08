
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
            image2.src = "https://lh3.googleusercontent.com/e0TCSjYRByJkv2fbOQSBrfUHLy6fdzgEVSr3P-fa4UVNQ73RYpUC7PPi3NnYHT7QvRSVb8J4yhusvYAjAJJCIlsy42j_9PUfsBjzPYhLsLWF4gdPatQ_Cd6LK1x-eAD2JAky5eyYbkguc-OGeKiWM0M-y9dnYQwaHsiGGJUbTfaWWycC5mJiQCo6VT0M0nHOulr-pWdouKG8PK0Swkz7w7z5rs46jaRAi0qYMqyj0A_QbIKiGFQYzGCThDEElHoK4YvYSBS8kMpr5wstiN17Jq-yrruysi-EhVFVq8W0SMGx-pv2DA87LL-2Wp1A7B3YfF4R7KMzzlc35YDACjF30hcBLrqAuF7Ts_waxa19Mgu1-RbTaO3N2DTwsT1CSLUPuVrepUHsecF4pxSOJ0x8lCC2g9WPxGvXuKATzD4kRQfRJHt1nqwwOnh5oKNrpCUdLyx1EKaFBOO-Q3J-aZTm4KWe01sW4wcF4RPx6UVZDn132dDZCaLP9-R3MWM3DPelQLY-1UVpl4n365JAHKfKoAl3ZVnHDCJlBublvIiOwYIXojgvftI71c_ecTXzFRUr1_sgrhYvX3BjwEqHI5sD4tN9-x9aOg=s256-no";
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

grobjects.push(new mountain("mountain1", [6, 0, -6], 5, [0.25,0.25,0.25]));
grobjects.push(new mountain("mountain2", [3, 0, -6], 3, [0.25, 0.25, 0.25]));
grobjects.push(new mountain("mountain3", [-6, 0, -5], 4, [0.25, 0.25, 0.25]));
grobjects.push(new mountain("mountain3", [-4, 0, -6], 5, [0.25, 0.25, 0.25]));
grobjects.push(new mountain("mountain3", [-6, 0, -3], 2, [0.25, 0.25, 0.25]));



