import globs from './sim_globals';
import { SpeedGauge } from './lib/components/speed-gauge';
import { Wind } from './wind';
import { Water } from './water';
import { MiniMap } from './lib/components/minimap';
import { BoatInfoDisplay } from './lib/components/boat-info-display';
import { Boat } from './boat';
import math from './lib/math';

window.onload = init;

function init() {
    let waterCanvas = document.getElementById("waterCanvas");
    let windCan = document.getElementById("windCanvas");
    let miniMapCanvas = document.getElementById("miniMapCanvas");

    globs.stopBtn = document.getElementById("stopBtn");
    globs.resetPosBtn = document.getElementById("resetPosBtn");

    globs.frameRateCtrl = document.getElementById("frameRateCtrl");
    globs.frameRateDisplay = document.getElementById("frameRateDisplay");
    globs.frameRateDisplay.value = globs.frameRate;
    globs.frameRateDisplay.disabled = true;

    globs.mapSizeCtrl = document.getElementById("mapSizeCtrl");
    globs.mapSizeDisplay = document.getElementById("mapSizeDisplay");
    globs.mapSizeDisplay.value = globs.mapHeight;

    globs.rudderCtrl = document.getElementById("rudderCtrl");
    globs.rudderDisplay = document.getElementById("rudderDisplay");
    globs.rudderDisplay.disabled = true;
    globs.rudderDisplay.value = 0;

    globs.windCtrl = document.getElementById("windCtrl");
    globs.windDisplay = document.getElementById("windDisplay");
    globs.windDisplay.value = 0;
    globs.windDisplay.disabled = true;

    globs.sheetCtrl = document.getElementById("sheetCtrl");
    globs.sheetDisplay = document.getElementById("sheetDisplay");
    globs.sheetToggle = document.getElementById("sheetToggle");
    globs.sheetDisplay.value = 0;
    globs.sheetDisplay.disabled = true;

    globs.boatAngleGauge = document.getElementById("boatAngleGauge");
    globs.speedGauge = new SpeedGauge("speedGauge");
    globs.boatInfoDisplay = new BoatInfoDisplay("boatInfoDisplay");
    waterCanvas.width = globs.MAIN_CANVAS_WIDTH;
    waterCanvas.height = globs.MAIN_CANVAS_HEIGHT;
    windCan.width = globs.MAIN_CANVAS_WIDTH;
    windCan.height = globs.MAIN_CANVAS_HEIGHT;

    globs.wind = new Wind(windCan);

    let mapAspectRatio = globs.mapWidth / globs.mapHeight;
    let minimapCanvasWidth, minimapCanvasHeight;
    if (mapAspectRatio > 1) {
        minimapCanvasWidth = globs.MAX_MINIMAP_CANVAS_WIDTH; 
        minimapCanvasHeight = minimapCanvasWidth / mapAspectRatio;
    } else {
        minimapCanvasHeight = globs.MAX_MINIMAP_CANVAS_HEIGHT;
        minimapCanvasWidth = minimapCanvasHeight * mapAspectRatio;
    }
    globs.minimap = new MiniMap(minimapCanvasWidth, minimapCanvasHeight, miniMapCanvas, {x: 0,y:0});
    globs.boat = new Boat();
    globs.water = new Water(waterCanvas);

    waterCanvas.addEventListener("keydown", onKeyDown, false);
    waterCanvas.addEventListener("wheel", onMouseWheel, false);
    globs.stopBtn.addEventListener("click", toggleLoop, false);
    globs.resetPosBtn.addEventListener("click", resetPos, false);
    globs.frameRateCtrl.addEventListener("input", onFrameRateInput, false);
    globs.rudderCtrl.addEventListener("input", onRudderInput, false);
    globs.rudderCtrl.addEventListener("mouseup", onRudderMouseup);
    globs.windCtrl.addEventListener("input", onWindInput, false);
    globs.mapSizeCtrl.addEventListener("input", onMapSizeInput, false);
    globs.mapSizeDisplay.addEventListener("change", onMapSizeInput, false);
    globs.sheetCtrl.addEventListener("input", onSheetInput, false);
    globs.sheetToggle.addEventListener("input", onSheetToggle, false);
    
    if (!globs.manualSheet) {
        globs.sheetDisplay.value = "AUTO";
        globs.sheetCtrl.disabled  = !globs.manualSheet;
    }
    
    toggleLoop();
}

function onFrameRateInput(ev) {
    globs.frameRate = +ev.srcElement.value;
    globs.frameRateDisplay.value = globs.frameRate;
}

function onMapSizeInput(ev) {
    globs.mapHeight = globs.mapWidth = +ev.srcElement.value;
    globs.mapSizeDisplay.value = globs.mapHeight;
}

function onRudderInput(ev) {
    globs.boat.rudder = -ev.srcElement.value;
    globs.rudderDisplay.value = Math.round(math.rad2deg(globs.boat.rudder));
}

function onWindInput(ev) {
    globs.wind.angle = +ev.srcElement.value;
    globs.windDisplay.value = Math.round(math.rad2deg(globs.wind.angle));
    globs.wind.drawWind();
}

function onRudderMouseup(ev) {
    globs.boat.rudder = 0;
    globs.rudderDisplay.value = 0;
    globs.rudderCtrl.value = 0;
}

function onSheetInput(ev) {
    globs.boat.sheet = ev.srcElement.value;
    globs.sheetInputVal = ev.srcElement.value;
}

function onSheetToggle(ev) {
    globs.manualSheet = !globs.manualSheet;
    globs.sheetCtrl.disabled = !globs.manualSheet;
    if (!globs.manualSheet) {
        // sheetDisplay.value = "AUTO";
    } else {
        globs.sheetInputVal = globs.boat.sheet;
    }
}

function toggleLoop() {
    globs.stopped = !globs.stopped;
    if (globs.stopped) {
        globs.stopBtn.innerText = "Start";
        cancelAnimationFrame(globs.curAnimationFrame);
    } else {
        globs.stopBtn.innerText = "Stop";
        globs.curAnimationFrame = requestAnimationFrame(doIdle);
    }
}

function resetPos() {
    globs.boat.pos = {x: 0, y: 0};
}

function doIdle(event) {
    if (globs.stopped) {
        return;
    }

    if (Date.now() - globs.lastFrame > (1000 / globs.frameRate)) {
        globs.lastFrame = Date.now();
        globs.boat.updatePos();
        globs.minimap.setBoatPos(globs.boat.pos);
        globs.redraw();	
    }
    requestAnimationFrame(doIdle);
}

globs.redraw = function() {
    globs.water.clearCanvas();
    globs.water.drawBG(globs.boat.pos);
    globs.boat.draw(globs.water.ctx);
    globs.displayInfo(); 
}

globs.displayInfo = function() {
    let simInfo = 
    {
        windAngle: globs.wind.angle,
        boat: {
            relBoom: globs.boat.boom,
            relWind: globs.boat.relativeWind,
            speed: globs.boat.speed,
            angle: globs.boat.angle,
            tilt: globs.boat.tilt,
            sheet: globs.boat.sheet,
            boomToWind: math.rad2deg( math.radDiff( globs.boat.angle + globs.boat.boom, globs.wind.angle )),
            position: globs.boat.pos
        }
    }
    globs.speedGauge.updateValue(globs.boat.speed);
    globs.boatAngleGauge.setAttribute("data-value",-math.rad2deg(globs.boat.angle - Math.PI/2));
    globs.boatInfoDisplay.draw(simInfo.boat);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    } 
};

function onKeyDown(event) {
    switch(event.keyCode) {
        case 37: // left arrow
        event.preventDefault();
        globs.boat.moveRudder(Math.PI/128);
        break;

        case 39: // right arrow
        event.preventDefault();
        globs.boat.moveRudder(-Math.PI/128);  
        break;	
        
        case 38: // up arrow
        globs.wind.angle = rotate(globs.wind.angle);
        globs.wind.drawWind();
        break;
        
        case 40: // down arrow
        globs.wind.angle = rotate(globs.wind.angle, -Math.PI/128);
        globs.wind.drawWind();
        break;	
    }
}

function rotate(curAngle, delta=Math.PI/128) {
    let newAngle = (curAngle + delta);
    if (newAngle > Math.PI) {
        newAngle = (newAngle % Math.PI) - Math.PI;
    } else if (newAngle < -Math.PI) {
        newAngle = Math.PI - (newAngle % Math.PI);
    } 
    return newAngle;
}

function onMouseWheel(event) {
    globs.boat.moveRudder(math.deg2rad(event.deltaY/120));
}