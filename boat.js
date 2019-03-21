// BOAT CLASS //

var boatSize = 35; // boat size

var mastHeight = boatSize*1.8;
var sailHeight = mastHeight * 0.95;
var boomLength = boatSize*1.2;
var boomHeight = mastHeight * 0.1;

// xy coords of boat facing East.
var boatCoords = [ 	pol2car(boatSize, 0),
					pol2car(boatSize/2, deg2rad(70)),
					pol2car(boatSize, deg2rad(160)),
					pol2car(boatSize, deg2rad(-160)),
					pol2car(boatSize/2, deg2rad(-70)) ] ;

var mastBase = { x: boatSize/3, y: 0 };

const MAX_RUDDER = Math.PI/4;

// Change in heading at full rudder, speed: 1
const HEADING_DELTA_MAX_RUDDER = Math.PI / 32;

function Boat()
{
	this.angle = 0;
	this.speed = 0;
	this.pos = { x:0, y:0 };
	this.tilt = 0;
	this.color = "#cd4236"
	this.boom = 0;
	this.sheet = 0; // The rope controlling the boom 
}

Boat.prototype.updatePos = function() {

	// set the boom angle to the opposite of the boat angle restricted by sheet
	this.boom = clip(-boat.angle, -this.sheet, this.sheet);

    this.tilt = Math.cos(boat.boom) * Math.sin(boat.angle + boat.boom) * 0.8;

	this.speed = -(Math.sin(boat.boom) * Math.sin(boat.angle + boat.boom)) * 15;   // wind is always 0

	this.pos.x += Math.cos(this.angle)*this.speed;
	this.pos.y += Math.sin(this.angle)*this.speed;
}


Boat.prototype.drawSail = function (ctx) {
	// calculate positions
	var mastTop = { x: mastBase.x, y: mastBase.y - mastHeight * Math.sin(this.tilt) };
	var mastHead = { x: mastBase.x, y: mastBase.y - sailHeight * Math.sin(this.tilt) };
    var tack = { x: mastBase.x, y: mastBase.y - boomHeight * Math.sin(this.tilt) };
	var clew = { x: mastBase.x - boomLength * Math.cos(-this.boom), 
		         y: mastBase.y - boomLength * Math.sin(-this.boom) * Math.cos(this.tilt)
		        	           - boomHeight * Math.sin(this.tilt) }


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

Boat.prototype.drawHull = function (ctx) {

	var tiltScale = Math.cos (this.tilt);

	ctx.fillStyle = boat.color;
	ctx.strokeStyle = boat.color;

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

Boat.prototype.draw = function (ctx) {
	ctx.save();
	ctx.rotate(-this.angle);
	this.drawHull(ctx);
	this.drawSail(ctx);
	ctx.restore();
}

Boat.prototype.calculateSheet = function(boatAngle) {
	return relWindToRelBoom(boatAngle);
}

function relWindToRelBoom(relWind) {
    return (3- 3 * Math.cos(relWind))/4;
}

function updateHeading(rudder, speed) {
	return rudderPercent * speed * HEADING_DELTA_MAX_RUDDER;
}

function rudderPercent(rudder) {
	return (MAX_RUDDER / rudder) * 100;
}

