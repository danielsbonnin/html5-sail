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

class WindArrow extends CanvasComponent {
    draw(ctx,args={width: 100, height: 100, relWind: 0}) {
        ctx.save();
        ctx.clearRect(0, 0, args.width, args.height);
        ctx.translate(args.width/2+5, args.height/2);
        let windColor = "rgb(36, 100, 160)";

		ctx.lineJoin = "round";
		ctx.lineWidth = 2;
        ctx.strokeStyle = windColor;
        
        ctx.rotate(deg2rad(-90));
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
        ctx.rotate(deg2rad(90));
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
    constructor() {
        super();
        this.boatComponent = new BoatComponent();
    }
    draw(ctx, args={width: 100, height: 100, boatPos: {x: 0, y: 0}, mapWidth: 100, mapHeight: 100, boatSize: 10}) {
        ctx.clearRect(0, 0, args.height, args.width);
        ctx.lineWidth = 5;

        let adjustedWidth = args.width - args.boatSize;
        let adjustedHeight = args.height - args.boatSize;

        let offsetX = adjustedWidth/2;
        let offsetY = adjustedHeight/2;
        
        // ctx.strokeRect(0, 0, args.height, args.width);
        this.boatComponent.draw(ctx, args.boatInfo);
        let x = args.boatPos.x/(args.mapWidth/2) * offsetX + offsetX;
        let y = -args.boatPos.y/(MAP_HEIGHT/2);
        ctx.fillRect(x, offsetY + offsetY*y, args.boatSize, args.boatSize);
    }
}