import globs from '../../sim_globals';
import { MiniMapComponent } from './minimap-component';

export class MiniMap {
    constructor(width, height, canvasElement, boatPos) {
        this.height = height;
        this.width = width;
        this.canvasElement = canvasElement;
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.context = canvasElement.getContext("2d");
        this.component = new MiniMapComponent();
    }

    setBoatPos(pos) {
        this.component.draw(this.context, 
            {
                width: this.width,
                height: this.height,
                boatPos: pos,
                mapWidth: globs.mapWidth,
                mapHeight: globs.mapHeight,
                boatDisplaySize: Math.max(10, 35 * 150 / Math.max(globs.mapWidth, globs.mapHeight))
            });
    }
}