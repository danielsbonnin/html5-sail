class BoatComponent extends CanvasComponent {
    constructor() {
        super();
        this.hullComponent = new BoatHull();
        this.sailComponent = new SailComponent();
    }

    draw(ctx, args) {
        let hullArgs = {...args, ...
        {
            originOffset: {x:0,y:0},
            rotation: 0,
            boatColor: BOAT_COLOR, 
            tiltScale: Math.cos (args.tilt), 
            lineWidth: Math.abs( args.tilt / 20 ) + 5, 
            boatSize: 40
        }};
        
        let sailArgs = {...args,...
        {
            originOffset: 
            {
                x: 0,
                y: 0
            },
            rotation: -Math.PI/2,
            boatColor: BOAT_COLOR,
            tiltScale: 1,
            lineWidth: 1,
            boatSize: boatSize,
            sailColor: "#fff"
        }};
        ctx.save();
        ctx.rotate(args.rotation);
        this.hullComponent.draw(ctx, hullArgs);
        this.sailComponent.draw(ctx, sailArgs);
        ctx.restore();
    }
}

class SailComponent extends CanvasComponent {
    draw(ctx, args=boatArgs) {
        let mastHeight = args.boatSize*1.8;
        let mastBase = { x: args.boatSize/3, y: 0 };
        let sailHeight = mastHeight * 0.95;
        let boomLength = args.boatSize*1.2;
        let boomHeight = mastHeight * 0.1;

        // calculate positions
		let mastTop = { x: mastBase.x, y: mastBase.y - mastHeight * Math.sin(args.tilt) };
		let mastHead = { x: mastBase.x, y: mastBase.y - sailHeight * Math.sin(args.tilt) };
		let tack = { x: mastBase.x, y: mastBase.y - boomHeight * Math.sin(args.tilt) };
		let clew = { x: mastBase.x - boomLength * Math.cos(-args.boom), 
					y: mastBase.y - boomLength * Math.sin(-args.boom) * Math.cos(args.tilt)
								- boomHeight * Math.sin(args.tilt) }

		// boom
		ctx.strokeStyle = "#590000";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo (tack.x, tack.y);
		ctx.lineTo (clew.x, clew.y);
		ctx.closePath();	
		ctx.stroke();

		// sail
		ctx.fillStyle = args.sailColor;
		ctx.strokeStyle = args.sailColor;
		ctx.lineWidth = args.lineWidth;
		ctx.beginPath();
		ctx.moveTo (tack.x, tack.y);
		ctx.lineTo (clew.x, clew.y);
		ctx.lineTo (mastHead.x, mastHead.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// mast
		ctx.strokeStyle = "#590000";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo (mastBase.x, mastBase.y);
		ctx.lineTo (mastTop.x, mastTop.y);
		ctx.closePath();
		ctx.stroke(); 
    }
}

class BoatHull extends CanvasComponent {
    draw(ctx, args={originOffset: {x:0,y:0}, rotation: -Math.PI/2, boatColor:"#cd4236", tiltScale: 1, lineWidth: 1, boatSize: 40 }) {
        let boatCoords = [ 	pol2car(args.boatSize, 0),
            pol2car(args.boatSize/2, deg2rad(-70)),
            pol2car(args.boatSize, deg2rad(-160)),
            pol2car(args.boatSize, deg2rad(160)),
            pol2car(args.boatSize/2, deg2rad(70)) ]
        ctx.save();
        ctx.translate(args.originOffset.x, args.originOffset.y);
		ctx.fillStyle = args.boatColor;
		ctx.strokeStyle = args.boatColor;

		ctx.lineJoin = "round";
		ctx.lineWidth = args.lineWidth;
        ctx.rotate(args.rotation);
		ctx.beginPath();
		ctx.moveTo (boatCoords[0].x, boatCoords[0].y * args.tiltScale);
		ctx.lineTo (boatCoords[1].x, boatCoords[1].y * args.tiltScale);
		ctx.lineTo (boatCoords[2].x, boatCoords[2].y * args.tiltScale);
		ctx.lineTo (boatCoords[3].x, boatCoords[3].y * args.tiltScale);
		ctx.lineTo (boatCoords[4].x, boatCoords[4].y * args.tiltScale);
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}