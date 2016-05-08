var grobjects = grobjects || [];

var groundPlaneSize = groundPlaneSize || 10;


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
            image1.src = "https://lh3.googleusercontent.com/Zv4eap6ouXkMOc_yBzoCS8ekU0CHSDn-J-Zr1lqujRLKO0vkYsydXKDgCYNAN85PGN6Mi8QcLL3Y1b-J4TdUSDUGUsyFJ4Gdi744sSEqpmRPjHGgx16FH_T2I2Jsaklgy2JaoJh34B9B0H8ez0NSz5Wraz0y2GewYSobvy_hzU-nxIuMnjYTXboQgZubfRoeT8fazSvf6e1hKTgeKxazzyoRCRwm-V-PKB9jvkSA3c7tcWEBfcik_FFd-yPVrqSGBEOH5sxltHgfhrIc89qRgRJIBYQusyrXfzfTB-ShqC9lZHH7zOfYP-tnQuc6uV-3qVoNW2gSu1DqHqQcpwV9eewo7aeCUPjAcj4omEOZx0TMnayf5OTNSsGgU4qEl8Wp-5SWIEDmoHjtQPbrcBx3tUn2gAv1KgHYgH-gz7rY9yjkkRvXne1Cya8ONvHH0nwM4MDxs1nea7831HOXYShnPQEcwCIvVfgVK_wJ5HHM02gEiDHu9V7A2Wj6nrgD_4DB_E6Izx9VSQj_f27Ss1FeSqCmOahSmKmQsU8HIGvJlPR1SaD_62UzIHZ_RFlFy5JTQ_QiHtaN8jwSj428snrkQTKJAkuumQ=s256-no";
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