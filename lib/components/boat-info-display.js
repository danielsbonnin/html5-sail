class BoatInfoDisplay {
    constructor(selector) {
        this.containerDiv = null;
        this.hullElement = null;
        this.hullCtx = null;
        this.hullComponent = new BoatHull();
        this.windComponent = new WindArrow();
        this.boomComponent = new BoomComponent();
        this.relWindElement = null;
        this.relWindCtx = null;
        this.relBoomElement = null;
        this.relBoomCtx = null;
        this.init(selector);
        this.relWind = 0;
        this.relBoom = 3.14;
        this.drawBoat();
        this.ctx.save();
    }

    init(selector) {
        this.containerDiv = document.getElementById(selector);
        this.hullElement = document.getElementById("hull");
        this.ctx = this.hullElement.getContext("2d");
        this.relWindElement = document.getElementById("relWind");
        this.relWindCtx = this.relWindElement.getContext("2d");
        this.relBoomElement = document.getElementById("relBoom");
        this.relBoomCtx = this.relBoomElement.getContext("2d");
        this.hullElement.width = 170;
        this.hullElement.height = 170;
        this.relWindElement.width = 170;
        this.relWindElement.height = 170;
        this.relBoomElement.width = 170;
        this.relBoomElement.height = 170;
    }

    draw(boatInfo) {
        this.relWind = boatInfo.relWind;
        this.relBoom = boatInfo.relBoom;
        this.drawBoat();
        this.drawRelWind();
        this.drawRelBoom();
    }

    drawBoat() {
        this.hullComponent.draw(this.ctx, 
            {
                originOffset: {
                    x: this.hullElement.width/2,
                    y: this.hullElement.height/2
                },
                rotation: -Math.PI/2,
                boatColor: BOAT_COLOR,
                tiltScale: 1,
                lineWidth: 1,
                boatSize: 45
            });
    }

    drawRelWind() {
        this.windComponent.draw(this.relWindCtx, 
            {
                width: this.relWindElement.width,
                height: this.relWindElement.height,
                relWind: this.relWind
            });
    }

    drawRelBoom() {
        this.boomComponent.draw(this.relBoomCtx, 
            {
                width: this.relBoomElement.width,
                height: this.relBoomElement.height,
                relBoom: this.relBoom
            });
    }
}