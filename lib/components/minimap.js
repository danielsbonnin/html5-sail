class MiniMap {
    constructor(width, height, canvasElement, boatPos) {
        this.height = height;
        this.width = width;
        this.canvasElement = canvasElement;
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        this.context = canvasElement.getContext("2d");
        this.component = new MiniMapComponent();
    }

    setBoatPos(args) {

        this.component.draw(this.context, 
            {...args, ...{
                width: this.width,
                height: this.height,
                boatPos: args.pos,
                mapWidth: MAP_WIDTH,
                mapHeight: MAP_HEIGHT,
                boatSize: 10,
                boatInfo: args.boatInfo
            }});
    }
}