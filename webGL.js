main();

function main()
{
    // loading

    //const canvas = document.querySelector("#glCanvas");
    const canvas = document.getElementById("glcanvas");
    //console.log(canvas);
    const gl = canvas.getContext("webgl");
    //console.log(gl);

    
    drawGame(gl);    
}

var prevtime = 0;

function drawGame(gl)
{
    //gl.clearColor(Math.random, Math.random(), Math.random(), 1.0);
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    // to do
    
    window.requestAnimationFrame(function(currtime){

        var delta = (currtime - prevtime) / 1000.0;
        prevtime = currtime;
        console.log("걸린시간 =%f", delta);
        drawGame(gl);

    });
}
