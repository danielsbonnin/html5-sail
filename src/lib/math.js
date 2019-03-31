module.exports = {};

module.exports.dist = function(pos1, pos2) {
return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.y - pos2.y, 2) )
}	

module.exports.rrnd = function(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min
}

//! make rgb string
module.exports.rgbString = function(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}

/**
 * @param {*} n 
 * @param {*} min 
 * @param {*} max 
 */
module.exports.clip = function(n, min, max) {
    return Math.min( Math.max (n, min), max )
}

//modulo function that behaves like the lisp modulo (properly, i'd say, with negative numbers)
module.exports.modulo = function(n, d) {
    if (n < 0)
         { return d - Math.abs(n % d) }
        else { 
            return n % d; 
        } 
}

module.exports.scale = function(num, minin, minout, maxin, maxout) {
    return maxin + ( (num - minin) * ( (maxout-maxin) / (minout-minin) ) );
}

module.exports.pol2car=function(dist, azi) {   
    return { 
        x:dist*Math.cos(azi),
        y:dist*Math.sin(azi)  
    }  
}

module.exports.car2pol = function(xy)
{   return { dist: dist( { x:0, y:0 }, xy), azi: Math.atan2(xy.y, xy.x) } }

module.exports.deg2rad = function(deg) { return deg / 180 * Math.PI }

module.exports.rad2deg = function(rad) { return rad / Math.PI * 180 }

module.exports.radDiff = function(rad1, rad2) 
{ return module.exports.modulo( (rad1-rad2)+Math.PI, 2*Math.PI ) - Math.PI }

/**
 * Modulus for heading system based on 0-180 -> -180-0
 *   ex: -181 -> 179; 190->-170
 */
module.exports.radModPosNeg = function(rad) {
    let absAngle = Math.abs(rad);
    let result = rad;
    if (absAngle > Math.PI) {
        if (rad > 0) {
            result = -(Math.PI - (absAngle % Math.PI));
        } else {
            result = Math.PI - (absAngle % Math.PI);
        }
    }
    return result;    
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
module.exports.hslToRgb = function(h, s, l){
    var r, g, b;
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}