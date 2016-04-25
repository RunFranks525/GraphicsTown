var grobjects = grobjects || [];

var groundPlaneSize = groundPlaneSize || 5;


(function () {
    "use strict";

    // putting the arrays of object info here as well
    var vertexPos = [
        -groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0, groundPlaneSize,
        -groundPlaneSize, 0, -groundPlaneSize,
         groundPlaneSize, 0, groundPlaneSize,
        -groundPlaneSize, 0, groundPlaneSize
    ];

    var texPos =
           [
               0, 0,
               1, 0,
               1, 1,
               1, 0,
               0, 1, 
               1, 1         
           ];

    // since there will be one of these, just keep info in the closure
    var shaderProgram = undefined;
    var buffers = undefined;
    var ground = {
        name: "Ground Plane",
        init: function (drawingState) {
            var gl = drawingState.gl;
            if (!shaderProgram) {
                shaderProgram = twgl.createProgramInfo(gl, ["ground-vs", "ground-fs"]);
            }
            var arrays = {
                vpos: {
                    numComponents: 3,
                    data: vertexPos
                },
                vtex: {
                    numComponents: 2,
                    data: texPos
                }
            };
            buffers = twgl.createBufferInfoFromArrays(gl, arrays);
            
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            var image1 = new Image();
            image1.crossOrigin = "anonymous";
            image1.src = "https://lh3.googleusercontent.com/MKfii4FAj0r_nYjjyc5kM6U3NYnRKMGMNdhWUxTp3P4AAZxEQ7KfWFf_hEw7xXbyMpnACZkrg7V0PBc6LkezfqOy982P084rCblEq1F77Pc7b6Uy-GJqR-MPjU1c3pZ-NM_cLBdNKzhDj7MKJn_nRQgEmpSImHUmqRuCWX-XLulk7xxUJRVjjMfeaU_1wlt3a73uxq1e1-cOUKJDzT9wMLV7h1irZKlYfzdl2CZI2MRXNEJx4KnLFeGnE48wfAcxSJnr9MZkEMHh5EWIR2XDzNDROU8GV0AR-mM0EJoY0zKG33RAsEDikBiZcmN91mjkK4xpFxEqPxhHr8NlZrdeCtmM5kl4mKVUawFaUHXpvovMKLIYH5X2km_JQT2JjMhdtxuEWNpH4u44OWud8Vcv7wz2o-vSfTPklTyq9CLoo-SikI0Q8HqF--LpLFGNfI2gT0YY-6pat9vWB7bD7G4i7L5RNokS11DQajU5eqIwfuQ3ntjce2ZLIavpIC2VQtmUImIDl4qF9DISRTJbuLS5lTSyX3h-T2FZ27EUqZeaaG-ENbTKtFVH3AtU5lcclkzZB9s=s256-no";
            image1.onload = function () {
                var texture1 = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            }
        },
        draw: function (drawingState) {
            var gl = drawingState.gl;
            gl.useProgram(shaderProgram.program);
            twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
            twgl.setUniforms(shaderProgram,
                {
                view: drawingState.view,
                proj: drawingState.proj
                }
            );
            shaderProgram.program.texSampler1 = gl.getUniformLocation(shaderProgram.program, "texSampler1");
            gl.uniform1i(shaderProgram.program.texSampler1, 0);
            twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        },
        center: function (drawingState) {
            return [0, 0, 0];
        }
    };


    grobjects.push(ground);
})();