window.onload = init;

var can;
var ctx;
var waterImage;
var zoom = 1;
var boat;
var bgPatt = null;

function init() {
    waterImage = new Image();
    waterImage.src = 'lib/water-texture-3.jpg';
    can = document.getElementById("myCanvas");
    ctx = can.getContext("2d");
    boat = new Boat();
    ctx.clearRect(-can.width/2, -can.height/2, can.width, can.height);
    ctx.translate(can.width/2, can.height/2);
    waterImage.onload = waterImageLoaded; 
    windImage.onload = windImageLoaded;
    can.addEventListener("mousemove", doMouse, false);
    can.addEventListener("mousedown", clearCanvas, false);
    can.addEventListener("mouseup", doRelease, false);
    can.addEventListener("keydown", doKeyDown, false);
    can.addEventListener("mousewheel", doMouseWheel, false);
    setInterval(doIdle, 50);
    //make border
    //ctx.strokeStyle = "#000000";
    //ctx.strokeRect(-can.width/2, -can.height/2, can.width, can.height);	
}
    
function waterImageLoaded() {
    bgPatt = ctx.createPattern(waterImage,'repeat');
    can.focus();
    redraw();
}

function windImageLoaded() {
    windPatt = ctx.createPattern(windImage,'repeat');
    redraw();
}

function doIdle(event) {
    boat.updatePos();
    redraw();	
}

function clearCanvas(event) {
    ctx.clearRect(-can.width/2, -can.height/2, can.width, can.height);
    //make border
    //ctx.strokeStyle = "#000000";
    //ctx.strokeRect(-can.width/2, -can.height/2, can.width, can.height);	
}

function redraw() {
    clearCanvas();
    drawBG();
    drawWind(ctx);
    boat.draw(ctx);
    displayInfo(); 
}

function drawBG() {
    ctx.save();
    var w = waterImage.width; var h = waterImage.height;
    var offset = { x: modulo( -boat.pos.x, w ),
                    y: modulo(  boat.pos.y, h )  };	
    ctx.translate( offset.x, offset.y );  // changes reference for water pattern
    ctx.fillStyle = bgPatt;

    // coords adjusted to correspond to canvas
    ctx.fillRect(-can.width/2 - offset.x, -can.height/2 - offset.y, 
                    can.width   + offset.x,  can.height   + offset.y);  
    ctx.restore();
}

function displayInfo() {
    str = "boat angle: " + Math.round( rad2deg( boat.angle )) + 
            "\n | tilt: " + Math.round(rad2deg( boat.tilt )) + 
            "\n | boom-to-wind: " + Math.round(rad2deg( radDiff( boat.angle + boat.boom, windAngle ))) + 
            "\n | forward thrust " + Math.sin (boat.boom) * Math.sin (boat.angle + boat.boom) +
            "\n | speed: " + boat.speed + 
            "\n | pos: (" + Math.round(boat.pos.x) + ", " + Math.round(boat.pos.y) + ")";
    document.getElementById("footer").innerText = str;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    } 
};

function doMouse(event)
{
    var pos = getMousePos(can, event);
    var polar = car2pol( { x: pos.x - (can.width/2), 
                            y: -( pos.y - (can.height/2) ) });
    // boat.angle = polar.azi;
    // boat.speed = polar.dist / 10;
}

function doClick(event)
{
    var pos = getMousePos(can, event);
}

function doRelease(event) {}

function doKeyDown(event) {
    switch(event.keyCode) {
        case 37: // left arrow
        boat.angle = modulo(boat.angle + 0.15 + Math.PI, Math.PI*2) - Math.PI;
        //boat.tilt += -0.1;
        break;

        case 39: // right arrow
        boat.angle = modulo(boat.angle - 0.15 + Math.PI, Math.PI*2) - Math.PI;
        //boat.tilt += 0.1;
        break;	
        
        case 38: // up arrow
        //boat.speed += 5; 
        boat.sheet = clip(boat.sheet+0.1, 0, 1.4);
        break;
        
        case 40: // down arrow
        boat.sheet = clip(boat.sheet-0.1, 0, 1.4);
        break;	
    }
}

function doMouseWheel(event) {
    accel = event.wheelDelta / 50;
    boat.speed = Math.round( Math.max(0, boat.speed + accel) );
}