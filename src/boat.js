import globs from './sim_globals';
import { HullComponent } from './lib/components/hull-component';
import { SailComponent } from './lib/components/sail-component';
import math from './lib/math';

// BOAT CLASS //

globs.mastHeight = globs.boatSize*1.8;
globs.sailHeight = globs.mastHeight * 0.95;
globs.boomLength = globs.boatSize*1.2;
globs.boomHeight = globs.mastHeight * 0.1;

// xy coords of boat facing East.
globs.boatCoords = [ 	math.pol2car(globs.boatSize, 0),
	math.pol2car(globs.boatSize/2, math.deg2rad(70)),
	math.pol2car(globs.boatSize, math.deg2rad(160)),
	math.pol2car(globs.boatSize, math.deg2rad(-160)),
	math.pol2car(globs.boatSize/2, math.deg2rad(-70)) ] ;

globs.mastBase = { x: globs.boatSize/3, y: 0 };

globs.MAX_RUDDER = Math.PI/4;
globs.BOAT_COLOR = "#cd4236";
// Change in heading at full rudder, speed: 1
globs.HEADING_DELTA_MAX_RUDDER = Math.PI / 128;

export class Boat {
	constructor() {
		this.angle = Math.PI;
		this.speed = 1;
		this.pos = { x:0, y:0 };
		this.tilt = 0;
		this.boom = 0;
		this.sheet = Math.PI/2; // The rope controlling the boom
		this.rudder = 0; 
		this.relativeWind = calculateRelativeWind(globs.wind.angle, this.angle);
	}

	updatePos () {
		// resolve boat angle (heading) based on speed and rudder angle
		let newAngle = this.angle + headingDelta(this.rudder, Math.max(0.1, this.speed));
		let absAngle = Math.abs(newAngle);
		if (absAngle > Math.PI) {
			if (newAngle > 0) {
				newAngle = -(Math.PI - (absAngle % Math.PI));
			} else {
				newAngle = Math.PI - (absAngle % Math.PI);
			}
		}
		this.angle = newAngle;

		this.relativeWind = calculateRelativeWind(globs.wind.angle, this.angle);

		if (globs.manualSheet) {
			this.sheet = globs.sheetInputVal;
		} else {
			this.sheet = this.calculateSheet(this.relativeWind);
		}
		globs.sheetCtrl.value = this.sheet;
		globs.sheetDisplay.value = Math.round(Math.min(1, (math.rad2deg(this.sheet))/90) * 100);

		// set the boom angle to the opposite of the boat angle restricted by sheet
		this.boom = math.clip(-this.relativeWind, -this.sheet, this.sheet);
		this.tilt = Math.cos(this.boom) * Math.sin(this.relativeWind + this.boom) * 0.8;
		let newSpeed = -(Math.sin(this.boom) * Math.sin(this.relativeWind + this.boom)) * 15;

		// inertia
		let speedDelta = newSpeed - this.speed;
		this.speed += speedDelta * globs.INERTIA;
		
		this.pos.x = math.clip(this.pos.x + Math.cos(this.angle)*this.speed, -globs.mapWidth/2, globs.mapWidth/2);
		this.pos.y = math.clip(this.pos.y + Math.sin(this.angle)*this.speed, -globs.mapHeight/2, globs.mapHeight/2);
	}

	draw(ctx) {
		ctx.save();
		ctx.rotate(-this.angle);
		HullComponent.draw(ctx);
		SailComponent.draw(ctx);
		ctx.restore();
	}

	/**
	 * @returns Optimized sheet value
	 */
	calculateSheet(boatAngle) {
		return Math.abs(relWindToRelBoom(boatAngle));
	}

	/**
	 * Update rudder position
	 */
	moveRudder (rudderDelta) {
		let newRudder = this.rudder + rudderDelta;	
		if (newRudder < -globs.MAX_RUDDER) {
			newRudder = -globs.MAX_RUDDER;
		} else if (newRudder > globs.MAX_RUDDER) {
			newRudder = globs.MAX_RUDDER;
		}
		this.rudder = math.clip(this.rudder + rudderDelta, -globs.MAX_RUDDER, globs.MAX_RUDDER);
	}
}

/**
 * Change in heading (radians) given rudder and speed 
 * @param {Number} rudder 
 * @param {Number} speed 
 */
function headingDelta(rudder, speed) {
	return (rudderPercent(rudder)/100) * speed * globs.HEADING_DELTA_MAX_RUDDER;
}

/**
 * Return percent of max/min rudder, given a rudder input 
 * @param {Number} rudder 
 */
function rudderPercent(rudder) {
	if (Math.abs(rudder) < 0.001) {
		rudder = 0.001;
	}
	return (rudder / globs.MAX_RUDDER) * 100;
}

/**
 * Optimal relative boom angle given relative wind angle 
 * @param {Number} relWind 
 */
function relWindToRelBoom(relWind) {
    return (3- 3 * Math.cos(relWind))/4;
}

function calculateRelativeWind(wind, heading) {
	let newAngle = (heading - wind);
    if (newAngle < -Math.PI) {
        newAngle = Math.PI + (newAngle % Math.PI);
    } else if (newAngle > Math.PI) {
        newAngle = -Math.PI + (newAngle % Math.PI); 
    } 
    return newAngle;
}

