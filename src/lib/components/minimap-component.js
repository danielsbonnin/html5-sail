import globs from '../../sim_globals';
import CanvasComponent from './canvas-component';
import { HullComponent } from './hull-component';
import { SailComponent } from './sail-component';

export class MiniMapComponent extends CanvasComponent {
    draw(ctx, args={width: 100, height: 100, boatPos: {x: 0, y: 0}, mapWidth: 100, mapHeight: 100, boatSize: 10}) {
        ctx.save();
        ctx.clearRect(0, 0, args.width, args.height);
        let lineWidth = 5;
        ctx.lineWidth = lineWidth;
        let boatScale = args.boatDisplaySize / 35;

        // adjust width of sailing area for boat width and border
        let adjustedWidth = args.width - (2*args.boatDisplaySize) - (2*lineWidth);
        let adjustedHeight = args.height - (2*args.boatDisplaySize) - (2*lineWidth);
        let offsetX = adjustedWidth/2;
        let offsetY = adjustedHeight/2;
        ctx.fillStyle = globs.water.pattern;
        ctx.fillRect(0, 0, args.width, args.height);
       
        ctx.strokeRect(0, 0, args.width, args.height);

        // boat position = pos / max * adjusted map size, normalized to positive vals
        let x = args.boatPos.x/(args.mapWidth/2) * offsetX + offsetX;
        let y = -args.boatPos.y/(args.mapHeight/2) * offsetY + offsetY;
        ctx.save();
        ctx.translate(x + lineWidth + args.boatDisplaySize, y+lineWidth + args.boatDisplaySize);
        ctx.rotate(-globs.boat.angle);
        ctx.scale(boatScale, boatScale);
        HullComponent.draw(ctx);
        SailComponent.draw(ctx);
        ctx.restore();
        ctx.restore();
    }
}