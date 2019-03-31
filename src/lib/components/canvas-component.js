var globs = require('../../sim_globals.js');
var math = require('../math.js');
var { HullComponent } = require('./hull-component.js');
var { SailComponent } = require('./sail-component.js');
/**
 * A graphic primitive component
 */
class CanvasComponent {
    /**
     * Apply this component on the context
     * @param {Context2d Context} ctx 
     */
    draw(ctx, args={width:100, height:100}) {
        throw "CanvasComponent is intended to be a base class only";
    }
}

/**
 * Generic boat hull shape without deps on simulation state
 */
class BoatHull extends CanvasComponent {
    draw(ctx, args={width:100, height:100, boatColor:"#cd4236"}) {
        let boatSize = 40;
        // xy coords of boat facing East.
        let boatCoords = [ 	math.pol2car(boatSize, 0),
            math.pol2car(boatSize/2, math.deg2rad(-70)),
            math.pol2car(boatSize, math.deg2rad(-160)),
            math.pol2car(boatSize, math.deg2rad(160)),
            math.pol2car(boatSize/2, math.deg2rad(70)) ] ;
        let tiltScale = 1;
        ctx.save();
        let width = args.width;
        let height = args.height;
        ctx.translate(width/2, height/2);
		ctx.fillStyle = args.boatColor;
		ctx.strokeStyle = args.boatColor;

		ctx.lineJoin = "round";
		ctx.lineWidth = 1;
        ctx.rotate(-Math.PI/2);
		ctx.beginPath();
		ctx.moveTo (boatCoords[0].x, boatCoords[0].y * tiltScale);
		ctx.lineTo (boatCoords[1].x, boatCoords[1].y * tiltScale);
		ctx.lineTo (boatCoords[2].x, boatCoords[2].y * tiltScale);
		ctx.lineTo (boatCoords[3].x, boatCoords[3].y * tiltScale);
		ctx.lineTo (boatCoords[4].x, boatCoords[4].y * tiltScale);
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}

class WindArrow extends CanvasComponent {
    draw(ctx,args={width: 100, height: 100, relWind: 0}) {
        ctx.save();
        ctx.clearRect(0, 0, args.width, args.height);
        ctx.translate(args.width/2+5, args.height/2);
        let windColor = "rgb(36, 100, 160)";

		ctx.lineJoin = "round";
		ctx.lineWidth = 2;
        ctx.strokeStyle = windColor;
        
        ctx.rotate(math.deg2rad(-90));
        ctx.beginPath();
        
        let mainLineAngle = args.relWind + Math.PI/2;
        let arrowSideAngle = Math.PI/16;
        ctx.rotate(mainLineAngle);
        
        // long arrow line
        ctx.moveTo(0, -20);
        ctx.lineTo(0, -80);
        ctx.moveTo(0, -20);

        // left arrow side
        ctx.rotate(arrowSideAngle);
        ctx.lineTo(0, -30);
        ctx.rotate(-arrowSideAngle);
        ctx.moveTo(0, -20);
        
        // right arrow side
        ctx.rotate(-arrowSideAngle);
        ctx.lineTo(0, -30);
        
        ctx.stroke();
        ctx.restore();
    }
}

class BoomComponent extends CanvasComponent {
    draw(ctx, args={width: 100, height: 100, relBoom: 0}) {
        ctx.save();
        ctx.clearRect(0, 0, args.width, args.height);
        ctx.translate(args.width/2, args.height/2);
        let boomColor = "rgb(137, 73, 9)";

		ctx.lineJoin = "round";
		ctx.lineWidth = 5;
        ctx.strokeStyle = boomColor;
        ctx.rotate(math.deg2rad(90));
        let theBoomAngle = -args.relBoom + Math.PI/2;
        ctx.rotate(theBoomAngle);
        ctx.beginPath();
        
        // long arrow line
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -70);
        
        ctx.stroke();
        ctx.restore();
    }
}

class MiniMapComponent extends CanvasComponent {
    draw(ctx, args={width: 100, height: 100, boatPos: {x: 0, y: 0}, mapWidth: 100, mapHeight: 100, boatSize: 10}) {
        ctx.save();
        ctx.clearRect(0, 0, args.width, args.height);
        let lineWidth = 5;
        ctx.lineWidth = lineWidth;
        let boatScale = args.boatDisplaySize / 35;

        // adjust width of sailing area for boat width and border
        let adjustedWidth = args.width - (2*args.boatDisplaySize) - (2*lineWidth);
        let adjustedHeight = args.height - (2*args.boatDisplaySize) - (2*lineWidth);
        let offsetX = adjustedWidth/2;
        let offsetY = adjustedHeight/2;
        ctx.fillStyle = globs.water.pattern;
        ctx.fillRect(0, 0, args.width, args.height);
       
        ctx.strokeRect(0, 0, args.width, args.height);

        // boat position = pos / max * adjusted map size, normalized to positive vals
        let x = args.boatPos.x/(args.mapWidth/2) * offsetX + offsetX;
        let y = -args.boatPos.y/(args.mapHeight/2) * offsetY + offsetY;
        ctx.save();
        ctx.translate(x + lineWidth + args.boatDisplaySize, y+lineWidth + args.boatDisplaySize);
        ctx.rotate(-globs.boat.angle);
        ctx.scale(boatScale, boatScale);
        HullComponent.draw(ctx);
        SailComponent.draw(ctx);
        ctx.restore();
        ctx.restore();
    }
}

module.exports = {
    CanvasComponent: CanvasComponent,
    WindArrow: WindArrow,
    BoatHull: BoatHull,
    MiniMapComponent: MiniMapComponent,
    BoomComponent: BoomComponent
};