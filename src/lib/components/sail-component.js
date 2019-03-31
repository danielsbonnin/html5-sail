import globs from '../../sim_globals';

export class SailComponent {
    static draw(ctx) {
		// calculate positions
		var mastTop = { x: globs.mastBase.x, y: globs.mastBase.y - globs.mastHeight * Math.sin(globs.boat.tilt) };
		var mastHead = { x: globs.mastBase.x, y: globs.mastBase.y - globs.sailHeight * Math.sin(globs.boat.tilt) };
		var tack = { x: globs.mastBase.x, y: globs.mastBase.y - globs.boomHeight * Math.sin(globs.boat.tilt) };
		var clew = { x: globs.mastBase.x - globs.boomLength * Math.cos(-globs.boat.boom), 
					y: globs.mastBase.y - globs.boomLength * Math.sin(-globs.boat.boom) * Math.cos(globs.boat.tilt)
								- globs.boomHeight * Math.sin(globs.boat.tilt) }

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
		ctx.moveTo (globs.mastBase.x, globs.mastBase.y);
		ctx.lineTo (mastTop.x, mastTop.y);
		ctx.closePath();
		ctx.stroke(); 
    }
}