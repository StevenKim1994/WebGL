main();


function mouseEnter()
{
    console.log("enter %d , %d", event.clientX, event.clientY);
}

function mouseLeave()
{
    console.log("leave %d , %d", event.clientX, event.clientY);
}

function mouseBegan()
{
    console.log("Began %d , %d", event.clientY, event.clientY);
    mousing = true;
}

var mousing = false;

function mouseMove()
{
    if(mousing == true)
    console.log("Moved %d , %d", event.clientY, event.clientY);
}

function mouseEnded()
{
    if(mousing == true)
    {
        mousing = false;
	    console.log("Ended %d , %d", event.clientY, event.clientY);
    }
}

function keyboardDown()
{
    console.log("keyboardDown! %d", event.keyCode);
}
function keyboardUp()
{
    console.log("keyboardUp! %d", event.keyCode);
}
function keyboardPress()
{
    console.log("keyboardPress! %d", event.keyCode);
}

var canvas;
function main()
{
    //const canvas = document.querySelector("#glCanvas");
	canvas = document.getElementById("glcanvas");
    
	canvas.onmouseenter = mouseEnter;
	canvas.onmouseleave = mouseLeave;
	canvas.onmousedown = mouseBegan;
	canvas.onmousemove = mouseMove;
	canvas.onmouseup = mouseEnded;
    
    window.onkeydown = keyboardDown;
    window.onkeypress = keyboardPress;
    window.onkeyup = keyboardUp;

	const gl = canvas.getContext("webgl");

	const programID = createProgram(gl);
	const vbo = createVBO(gl);
	const vbe = createVBE(gl);

	drawGame(gl, programID, vbo, vbe);
}

function createProgram(gl)
{
	const strVert = `

		#if GL_ES
		precision highp float;
		#endif

		attribute vec4 position;
		attribute vec4 color;
		varying vec4 vColor;

		void main()
		{
			vColor = color;
			gl_Position = position;
		}
	`;

	const strFrag = `
		#if GL_ES
		precision highp float;
		#endif

		varying vec4 vColor;

		void main()
		{
			gl_FragColor = vColor;
		}
	`;

	const vertID = createShader(gl, strVert, gl.VERTEX_SHADER);
	const fragID = createShader(gl, strFrag, gl.FRAGMENT_SHADER);
	const id = gl.createProgram();
	gl.attachShader(id, vertID);
	gl.attachShader(id, fragID);
	gl.linkProgram(id);
	gl.detachShader(id, vertID);
	gl.detachShader(id, fragID);
	gl.deleteShader(vertID);
	gl.deleteShader(fragID);

	var msg = gl.getProgramInfoLog(id);
	if( msg.length > 0 )
	{
		alert(msg);
		gl.deleteProgram(id);
	}
	return id;
}

function createShader(gl, str, flag)
{
	const id = gl.createShader(flag);
	gl.shaderSource(id, str);
	gl.compileShader(id);

	var msg = gl.getShaderInfoLog(id);
	if( msg.length > 0 )
	{
		alert(msg);
		gl.deleteShader(id);
	}

	return id; 
}

function createVBO(gl)
{
	const vbo = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	var p = [
		-0.5, 0.5, 1,0,0,1, 0.5, 0.5, 0,1,0,1,
		-0.5,-0.5, 0,0,1,1, 0.5,-0.5, 1,1,1,1
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(p), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return vbo;
}

function createVBE(gl)
{
	const vbe = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
	var indices = [0, 1, 2,  1, 2, 3];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	return vbe;
}


function reshape(gl)
{
    const w = window.innerWidth;
    const h = window.innerHeight;

    if(canvas.width != w ||  canvas.height != h)
    {
        canvas.width= w;
        canvas.height = h;

        gl.viewport(0,0,w,h);
    }
  
}

function drawGame(gl, programID, vbo, vbe)
{
    reshape(gl);

	//gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.useProgram(programID);

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	const pID = gl.getAttribLocation(programID, "position");
	gl.enableVertexAttribArray(pID);
	gl.vertexAttribPointer(pID, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
	const cID = gl.getAttribLocation(programID, "color");
	gl.enableVertexAttribArray(cID);
	gl.vertexAttribPointer(cID, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT)

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbe);
	gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.disableVertexAttribArray(pID);
	gl.disableVertexAttribArray(cID);

	window.requestAnimationFrame(function (currtime) {
		
		// 걸린 시간
		var delta = (currtime - prevtime)/1000.0;
		prevtime = currtime;
		//console.log("걸린 시간 = %f", delta);
		
		drawGame(gl, programID, vbo, vbe);
	});
}
var prevtime = 0;
