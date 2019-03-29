class SailComponent extends CanvasComponent {
    static draw(ctx, args) {
		// calculate positions
		var mastTop = { x: mastBase.x, y: mastBase.y - mastHeight * Math.sin(boat.tilt) };
		var mastHead = { x: mastBase.x, y: mastBase.y - sailHeight * Math.sin(boat.tilt) };
		var tack = { x: mastBase.x, y: mastBase.y - boomHeight * Math.sin(boat.tilt) };
		var clew = { x: mastBase.x - boomLength * Math.cos(-boat.boom), 
					y: mastBase.y - boomLength * Math.sin(-boat.boom) * Math.cos(boat.tilt)
								- boomHeight * Math.sin(boat.tilt) }

		// boom
		ctx.strokeStyle = "#590000";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo (tack.x, tack.y);
		ctx.lineTo (clew.x, clew.y);
		ctx.closePath();	
		ctx.stroke();

		// sail
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 2;
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