module.exports = {
    MAIN_CANVAS_WIDTH: 500,
    MAIN_CANVAS_HEIGHT: 300,

    MAX_MINIMAP_CANVAS_WIDTH: 300,
    MAX_MINIMAP_CANVAS_HEIGHT: 300,

    WIND_IMG_SRC: "../assets/wind-arrow.png",
    WATER_IMG_SRC: '../assets/water-texture-3.jpg',

    // dimensions of minimap
    mapHeight: 3000,
    mapWidth: 3000,

    frameRate: 30,

    // Scale changes in speed to simulate inertia
    INERTIA: 0.05,  

    // minimap, wind, boat, water,

    // controls
    /*
    stopBtn, resetPosBtn, frameRateDisplay, rudderDisplay, frameRateCtrl, rudderCtrl,
    windCtrl, windDisplay, speedMeter, boatInfoDisplay, mapSizeCtrl, mapSizeDisplay,
    sheetCtrl, sheetDisplay, sheetToggle,
    */
    manualSheet: false,
    sheetInputVal: 0,

    // Time of last animation frame (for controlling framerate)
    lastFrame: Date.now(),
    // curAnimationFrame,
    stopped: true,

    // boatAngleGauge,
    // speedGauge,

    speedAverage: 0,
    speedIdx: 0,
    SPEED_AVG_ENTRIES: 10,
    speedEntries: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    speedSum: 0,
    boatSize: 35,
    mastHeight: 0,
}
