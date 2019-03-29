class HullComponent extends CanvasComponent {
    static draw(ctx) {
		var tiltScale = Math.cos (boat.tilt);

		ctx.fillStyle = BOAT_COLOR;
		ctx.strokeStyle = BOAT_COLOR;

		ctx.lineJoin = "round";
		ctx.lineWidth = Math.abs( boat.tilt / 20 ) + 5;

		ctx.beginPath();

		ctx.moveTo (boatCoords[0].x, boatCoords[0].y * tiltScale);
		ctx.lineTo (boatCoords[1].x, boatCoords[1].y * tiltScale);
		ctx.lineTo (boatCoords[2].x, boatCoords[2].y * tiltScale);
		ctx.lineTo (boatCoords[3].x, boatCoords[3].y * tiltScale);
		ctx.lineTo (boatCoords[4].x, boatCoords[4].y * tiltScale);

		ctx.closePath();
		ctx.fill();
		ctx.stroke();
    }
}