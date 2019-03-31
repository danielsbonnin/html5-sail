var globs = require('./sim_globals.js');
var math = require('./lib/math.js');

export class Water {
    constructor (canvasElement) {
        this.element = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.image = new Image();
        this.image.src = globs.WATER_IMG_SRC;
        this.pattern = null;
        
        this.image.onload = () => { this.init(); }; 
    }

    init() {
        this.ctx.clearRect(-this.element.width/2, -this.element.height/2, this.element.width, this.element.height);
        this.ctx.translate(this.element.width/2, this.element.height/2);
        this.pattern = this.ctx.createPattern(this.image,'repeat');
        this.ctx.strokeRect(0, 0, globs.mapWidth, globs.mapHeight);
        this.element.focus();
        globs.redraw();
    }

    clearCanvas(event) {
        this.ctx.clearRect(-this.element.width/2, -this.element.height/2, this.element.width, this.element.height);
    }

    drawBG(boatPos) {
        this.ctx.save();
        let w = this.image.width; 
        let h = this.image.height;
        let offset = { x: math.modulo( -boatPos.x, w ),
                    y: math.modulo(  boatPos.y, h )  };	
        let boatSize = 40;
        this.ctx.translate( offset.x, offset.y);  // changes reference for water pattern
        this.ctx.fillStyle = this.pattern;
        
        // coords adjusted to correspond to canvas
        this.ctx.fillRect(-this.element.width/2 - offset.x, -this.element.height/2 - offset.y, 
            this.element.width + offset.x, this.element.height + offset.y);  
        
        this.ctx.restore();

        // Add boundary line in zoom view
        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(-((globs.mapWidth/2) + boatPos.x) - boatSize, -((globs.mapHeight/2)-boatPos.y) - boatSize, 
        globs.mapWidth+boatSize*2, globs.mapHeight+boatSize*2);
    }
}