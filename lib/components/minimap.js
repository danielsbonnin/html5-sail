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

    setBoatPos(pos) {
        this.component.draw(this.context, 
            {
                width: this.width,
                height: this.height,
                boatPos: pos,
                mapWidth: MAP_WIDTH,
                mapHeight: MAP_HEIGHT,
                boatSize: 40 * Math.max(MAP_WIDTH, MAP_HEIGHT) / 100
            });
    }
}