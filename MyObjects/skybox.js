var MATRIX_ID = (
  [1, 0, 0, 0,
   0, 1, 0, 0,
   0, 0, 1, 0,
   0, 0, 0, 1
  ]
 );


var MATRIX_P45 = (
[2.4, 0, 0, 0,
 0, 2.4, 0, 0,
 0, 0, -1, -1,
 0, 0, -0.2, 0
]
);


var MATRIX_P60 = (
[1.732, 0, 0, 0,
 0, 1.732, 0, 0,
 0, 0, -1, -1,
 0, 0, -0.2, 0
]
);


var MATRIX_P90 = (
[1, 0, 0, 0,
 0, 1, 0, 0,
 0, 0, -1, -1,
 0, 0, -0.2, 0
]
);


var nDiv = Math.PI * 2 / 512;
var nMiddle = Number(256);
var nLoaded = Number(0);
var aImages = null;

var matrixY;
var matrixX;
var matrixYX;
var matrixFinal;
var matrixPerspective;
var texture;


var gl = null;
var program = null;


var uMatrixTransform = null;


var canvas, bb, mXOffset, mYOffset, eDebug, eCanvas, eContent;

var sVertex = "attribute vec3 a_position;" +
"uniform mat4 um4_matrix;" +
"varying vec3 v_tex_coord;" +
"void main()" +
"{" +
" gl_Position = um4_matrix * vec4(a_position, 1.0);" +
" v_tex_coord = a_position;" +
"} ";

var sFragment = "precision mediump float;" +
"varying vec3 v_tex_coord;" +
"uniform samplerCube s_c;" +
"void main()" +
"{" +
" gl_FragColor = textureCube(s_c, v_tex_coord);" +
"}";


var sImagePrefix = null;

var bufferIndices;
var bufferVertices;
var bTile = false;

function loadTile(sI, m) {
    bTile = true;
    loadModel(sI, m);
}

function loadModel(sI, m) {
    sImagePrefix = sI;
    matrixY = MATRIX_ID;

    matrixX = MATRIX_ID;
    matrixPerspective = m;

    getElements();
    gl = getGLContext();
    if (gl == null) {
        viewError("Error initializing WebGL.");
        return;
    }
    getBuffers();

    program = getProgram();
    if (program == null) {
        return;
    }

    getProgramVariables();
    if (bTile == false) {
        getCubeMaps();
    }
    else {
        getCubeTile();
    }
}

function loadReset() {
    loadModel(sImagePrefix, matrixPerspective);
    eDebug.innerHTML = "reset context";
}

function getBuffers() {
    var aIndices = new Uint16Array([

    3, 2, 0,
    0, 2, 1,


    2, 6, 1,
    1, 6, 5,


    0, 1, 4,
    4, 1, 5,

    5, 6, 4,
    6, 7, 4,


    4, 7, 0,
    7, 3, 0,


    6, 2, 7,
    2, 3, 7
    ]);

    var aVertices = new Float32Array(
    [


      -1.0, 1.0, 1.0,

      1.0, 1.0, 1.0,

      1.0, -1.0, 1.0,

      -1.0, -1.0, 1.0,


      -1.0, 1.0, -1.0,

      1.0, 1.0, -1.0,

      1.0, -1.0, -1.0,

      -1.0, -1.0, -1.0,
    ]
    );

    bufferVertices = gl.createBuffer();

    gl.bindBuffer
    (
     gl.ARRAY_BUFFER,
     bufferVertices
     );


    gl.bufferData
    (
     gl.ARRAY_BUFFER,
     aVertices,
     gl.STATIC_DRAW
    );


    var bufferIndices = gl.createBuffer();
    gl.bindBuffer
    (
      gl.ELEMENT_ARRAY_BUFFER,
      bufferIndices
    );
    gl.bufferData
    (
      gl.ELEMENT_ARRAY_BUFFER,
      aIndices,
      gl.STATIC_DRAW
    );


}



function getElements() {
    canvas = document.getElementById('cv');
    eDebug = document.getElementById('eDebug');
    eContent = document.getElementById('eContent');
    eCanvas = document.getElementById('eCanvas');
}

function getProgramVariables() {

    var aPosition = gl.getAttribLocation(program, "a_position");

    uMatrixTransform = gl.getUniformLocation(program, "um4_matrix");

    gl.enableVertexAttribArray
    (
     aPosition
    );

    gl.vertexAttribPointer(
     aPosition,
     3,
     gl.FLOAT,
     false,
     0,
     0
    );
}

function getGLContext() {

    var a3D = [
  'webgl',
  'experimental-webgl',
  'webkit-3d',
  'moz-webgl'
    ];
    var glContext = null;

    try {
        for (var i = 0; i < a3D.length; i++) {
            glContext = canvas.getContext(a3D[i]);

            if (glContext != null) {
                break;
            }
        }


    } catch (err) {
        viewError(err);
    }

    return glContext;
}

function getProgram() {
    // Create the fragment shader. 
    var shaderF = getShader(sFragment, gl.FRAGMENT_SHADER);

    if (shaderF == null)
        return;

    //Create the vertex shader.
    var shaderV = getShader(sVertex, gl.VERTEX_SHADER);
    if (shaderV == null)
        return;

    // Create the program, with
    // a WebGL call into OpenGL ES. 
    var p = gl.createProgram();

    //Attach the vertex shader,
    // to the program.  
    // The same shader can be
    // attached to multiple programs,
    // however only one frgament shader 
    // can be attached to this 
    // program.    
    gl.attachShader
    (
     p,
     shaderF
    );

    // Attach the fragment shader,
    // to the program.
    // You may detach and attach
    // different shaders.
    gl.attachShader
    (
     p,
     shaderV
    );

    // Link the 
    // program. 
    gl.linkProgram
    (
     p
    );

    //Obtain the
    // status of linking
    // the fragment
    // and vertex shaders.
    var linked = gl.getProgramParameter(p, gl.LINK_STATUS);
    //We have a problem
    // if linked == false. 
    if (!linked) {
        // Display error
        // messages.
        var linkError = gl.getProgramInfoLog(p);

        viewError("Error while linking program:" + linkError);

        // Free resources
        // for the program.
        gl.deleteProgram(p);

        // Signal to loadModel()
        // there was an error.
        return null;
    }
    // Return a valid
    // program!
    return p;
}


function getShader(s, t) {

    var shader = gl.createShader(t);

    gl.shaderSource(shader, s);


    gl.compileShader(shader);


    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        viewError("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


function getPerspectiveMatrix() {
    var m = new Float32Array(
    [2.4, 0, 0, 0,
    0, 2.4, 0, 0,
    0, 0, -1, -1,
    0, 0, -0.2, 0]
   );
    return m;
}

function getOffsets() {
    var nXScroll = Number(0);
    var nYScroll = Number(0);
    mXOffset = mYOffset = Number(0);

    bb = canvas.getBoundingClientRect();

    if (bb != null) {


        if (window.pageXOffset != null) {
            nXScroll = window.pageXOffset;
        }

        if (window.pageYOffset != null) {
            nYScroll = window.pageYOffset;
        }


        if (bb.left > 0) {
            mXOffset = bb.left + nXScroll;
        }

        else if (nXScroll > 0) {
            mXOffset = nXScroll + bb.left;
        }

        if (bb.top > 0) {
            mYOffset = bb.top + nYScroll;
        }

        else if (nYScroll > 0) {
            mYOffset = nYScroll + bb.top;
        }
    }
}




function getCubeMaps() {
    aImages = new Array(6);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    aImages[0] = new Image();
    aImages[0].face = gl.TEXTURE_CUBE_MAP_POSITIVE_X;
    aImages[0].onload = function () { setCubeImageLoaded(); };
    aImages[0].src = sImagePrefix + "xpos.png";

    aImages[1] = new Image();
    aImages[1].face = gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
    aImages[1].onload = function () { setCubeImageLoaded(); };
    aImages[1].src = sImagePrefix + "xneg.png";

    aImages[2] = new Image();
    aImages[2].face = gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
    aImages[2].onload = function () { setCubeImageLoaded(); };
    aImages[2].src = sImagePrefix + "ypos.png";

    aImages[3] = new Image();
    aImages[3].face = gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
    aImages[3].onload = function () { setCubeImageLoaded(); };
    aImages[3].src = sImagePrefix + "yneg.png";

    aImages[4] = new Image();
    aImages[4].face = gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
    aImages[4].onload = function () { setCubeImageLoaded(); };
    aImages[4].src = sImagePrefix + "zpos.png";

    aImages[5] = new Image();
    aImages[5].face = gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
    aImages[5].onload = function () { setCubeImageLoaded(); };
    aImages[5].src = sImagePrefix + "zneg.png";
}

function getCubeTile() {
    aImages = new Array(3);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    aImages[0] = new Image();
    aImages[0].onload = function () { setCubeTileLoaded(); };
    aImages[0].src = sImagePrefix + "xz.png";

    aImages[1] = new Image();
    aImages[1].onload = function () { setCubeTileLoaded(); };
    aImages[1].src = sImagePrefix + "ypos.png";

    aImages[2] = new Image();
    aImages[2].onload = function () { setCubeTileLoaded(); };
    aImages[2].src = sImagePrefix + "yneg.png";
}

function setCubeTileLoaded() {
    nLoaded++;
    if (nLoaded == 3) {
        if (aImages[0].complete && aImages[1].complete && aImages[2].complete) {

            try {
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[0]
                );
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[0]
                );
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[0]
                );
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[0]
                );
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[1]
                );
                gl.texImage2D(
                    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,
                    aImages[2]
                );
                setProgramVariables();
                setListeners();
            }
            catch (err) {
                viewError("Error setCubeTileLoaded():" + err.toString());
            }
        }
    }
}

function setCubeImageLoaded() {
    nLoaded++;
    if (nLoaded == 6) {
        setCubeSides();
        setProgramVariables();
        setListeners();
    }
}



function setCubeSides() {
    try {
        for (var i = 0; i < 6; i++) {
            gl.texImage2D(aImages[i].face, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, aImages[i]);
        }
    }
    catch (err) {
        viewError("Error setCubeSides():" + err.toString());
    }
}

function setListeners() {
    if ("ontouchstart" in window) {

        canvas.addEventListener
        (
         'touchmove',
          listenerMoveTouch,
          false
        );
    }
    else {
        canvas.addEventListener
       (
       'mousemove',
        listenerMoveMouse,
        false
       );
    }

    window.addEventListener
    (
     'scroll',
      listenerResize
    );

    window.addEventListener(
     'resize',
      listenerResize
    );

    canvas.addEventListener(
     "webglcontextlost",
     function (event) {
         event.preventDefault();
         eDebug.innerHTML = "lost context";
     },
     false
    );

    canvas.addEventListener(
      "webglcontextrestored",
      loadReset,
      false
    );

    listenerResize(null);
}

function setProgramVariables() {

    gl.activeTexture(gl.TEXTURE0);

    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        var validateError = gl.getProgramInfoLog(program);
        viewError("Error while compiling the program:" + validateError);
        gl.deleteProgram(program);
        return;
    }

    gl.useProgram
    (
     program
    );
}

function setWidths(nCD, nDD) {
    nMiddle = nCD / 2;
    nDiv = Math.PI * 2 / nCD;
    var sCanvasDim = nCD.toString() + "px";
    eCanvas.style.width = sCanvasDim;
    eCanvas.style.height = sCanvasDim;
    canvas.width = nCD;
    canvas.height = nCD;
    eDebug.style.width = nDD.toString() + "px";
}

function setElementStyles(sECanvas, sEDebug, sAlign) {
    eDebug.style.cssFloat = sEDebug;
    eDebug.style.textAlign = sAlign;
    eCanvas.style.cssFloat = sECanvas;
    canvas.style.cssFloat = sECanvas;
}

function listenerResize(ev) {

    if (ev != null) {
        ev.preventDefault();
    }

    var nW = eContent.clientWidth;
    var nH = window.innerHeight;
    var nCanvasDim = Number(0);
    var nDebugDim = Number(0);

    if (nW > nH) {
        nCanvasDim = Math.floor(nW * 0.6);
        nDebugDim = Math.floor(nW * 0.34);
        setWidths(nCanvasDim, nDebugDim);
        setElementStyles("left", "right", "left");
    }
    else {
        nCanvasDim = Math.floor(nW);
        nDebugDim = nCanvasDim;
        setWidths(nCanvasDim, nDebugDim);
        setElementStyles("none", "none", "center");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    getOffsets();

    drawGraphic(nMiddle, nMiddle);

}

function listenerMoveTouch(ev) {

    ev.preventDefault();

    if (ev.targetTouches.length >= 1) {


        var t1 = ev.targetTouches[0];


        var nX = t1.pageX - mXOffset;
        var nY = t1.pageY - mYOffset;


        drawGraphic
        (
         nX,
         nY
        );
    }
}

function listenerMoveMouse(ev) {
    try {

        ev.preventDefault();

        var nX = ev.clientX - bb.left;
        var nY = ev.clientY - bb.top;

        drawGraphic(nX, nY);
    }
    catch (er) {
        viewError(er);
    }
}





function matrixRotationX(x) {
    var c = Math.cos(x);
    var s = Math.sin(x);

    return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1,
    ];
}


function matrixRotationY(y) {

    var c = Math.cos(y);
    var s = Math.sin(y);

    return [
     -c, 0, -s, 0,
     0, 1, 0, 0,
     s, 0, -c, 0,
     0, 0, 0, 1,
    ];
}

function matrixMultiply(A, B) {
    var a = Number(0);
    var b = Number(0);
    var k = Number(1);
    var M = MATRIX_ID;

    for (var m = 0; m < 16; m++) {

        M[m] = A[a] * B[b] + A[a + 1] * B[b + 4] + A[a + 2] * B[b + 8] + A[a + 3] * B[b + 12];
        b++;

        if (k % 4 == 0) {
            a += 4;
            b = 0;

        }
        k++;
    }
    return M;
}

function drawGraphic(pX, pY) {
    try {

        var rY = pX * nDiv;
        var rX = Number(0);
        if (pY > nMiddle) {
            var nY = pY - nMiddle;
            rX = -1 * nY * nDiv / 2;
        }
        else {
            nY = nMiddle - pY;
            rX = nY * nDiv / 2;

        }

        matrixX = matrixRotationX
        (
          rX
         );

        matrixY = matrixRotationY
        (
          rY
         );

        matrixYX = matrixMultiply(matrixY, matrixX);
        matrixFinal = matrixMultiply(matrixYX, matrixPerspective);

        gl.uniformMatrix4fv
        (
          uMatrixTransform,
          false,
          new Float32Array
          (
            matrixFinal
          )
        );

        gl.drawElements
        (
          gl.TRIANGLES,
          36,
          gl.UNSIGNED_SHORT,
          0
        );

    }
    catch (err) {
        viewError(err);
    }
}

function viewError(err) {
    eDebug.innerHTML = "Your browser might not support WebGL.<br />";
    eDebug.innerHTML += "For more information see <a href='http://get.webgl.org'>http://get.webgl.org</a>.<br />" + err.toString();
}
