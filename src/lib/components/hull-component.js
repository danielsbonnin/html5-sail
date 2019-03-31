import globs from '../../sim_globals';

export class HullComponent {
    static draw(ctx) {
			let tiltScale = Math.cos (globs.boat.tilt);

			ctx.fillStyle = globs.BOAT_COLOR;
			ctx.strokeStyle = globs.BOAT_COLOR;

			ctx.lineJoin = "round";
			ctx.lineWidth = Math.abs( globs.boat.tilt / 20 ) + 5;
			ctx.save();
			ctx.beginPath();

			ctx.moveTo (globs.boatCoords[0].x, globs.boatCoords[0].y * tiltScale);
			ctx.lineTo (globs.boatCoords[1].x, globs.boatCoords[1].y * tiltScale);
			ctx.lineTo (globs.boatCoords[2].x, globs.boatCoords[2].y * tiltScale);
			ctx.lineTo (globs.boatCoords[3].x, globs.boatCoords[3].y * tiltScale);
			ctx.lineTo (globs.boatCoords[4].x, globs.boatCoords[4].y * tiltScale);

			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			ctx.restore();
    }
}