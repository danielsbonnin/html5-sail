import globs from './sim_globals';
import math from './lib/math';

const INERTIA = 0.05;

// Change in heading at full rudder, speed: 1
const HEADING_DELTA_MAX_RUDDER = Math.PI / 128;

/**
 * Models changes in heading, boom, forward speed, tilt
 * ->given: relative wind, sheet, heading, rudder position
 */
export default class BoatSimulation {
    /**
     * Change in heading (radians) given rudder and speed 
     * @param {Number} rudder 
     * @param {Number} speed 
     */
    static calculateHeading(rudder, speed, angle) {
        let delta = (rudderPercent(rudder)/100) * speed * HEADING_DELTA_MAX_RUDDER;
        return math.radModPosNeg(angle + delta);
    }

    static calculateSpeed(boom, relativeWind, currentSpeed) {
        let newSpeed = -(Math.sin(boom) * Math.sin(relativeWind + boom)) * 15;

        // inertia
		let speedDelta = newSpeed - currentSpeed;
		return currentSpeed + speedDelta * INERTIA;
    }

    /**
     * Return the opposit of the wind, restricted by sheet length
     * @param {*} relativeWind 
     * @param {*} sheet 
     */
    static calculateBoom(relativeWind, sheet) {
        let boomRads = math.radModPosNeg(relativeWind);
        if (boomRads < 0) {
            return Math.min(sheet, -boomRads);
        } else {
            return -Math.min(sheet, boomRads);
        }
    }

    static calculateTilt(relativeWind, boom) {
        return Math.cos(boom) * Math.sin(relativeWind + boom) * 0.8;
    }
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