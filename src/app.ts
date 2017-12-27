export default class Cell {
    isAlive: boolean;
    cellWidth: number;
    cellCoords: Coords;
    constructor(alive: boolean, cellSize: number, myCoords: Coords){
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
}

export interface Coords {
    coordX: number;
    coordY: number;
}

export function initGame(cellArray: Array<Cell>){
    let i = 0;
    while (i < 400){
        let j = 0;
        while ( j < 400 ) {
            cellArray.push(new Cell(false, 4, {coordX: j, coordY: i}));
            j += 4;
        }
        i += 4;
    }
}