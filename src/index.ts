class Cell {
    isAlive: boolean;
    cellWidth: number;
    cellCoords: Coords;
    constructor(alive: boolean, cellSize: number, myCoords: Coords) {
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
}

interface Coords {
    coordX: number;
    coordY: number;
}

function initGame(cellArray: Array<Cell>, cellSize: number) {
    let i = 0;
    while (i < 400){
        let j = 0;
        while ( j < 400 ) {
            cellArray.push(new Cell(false, cellSize, {coordX: j, coordY: i}));
            j += cellSize;
        }
        i += cellSize;
    }
}

window.onload = function () {
    let elmButton = document.getElementById("startGame");
    let drawingSurface = <HTMLCanvasElement> document.getElementById("drawingSurface");
    let elemLeft = drawingSurface.offsetLeft;
    let elemTop = drawingSurface.offsetTop;
    let ctxt = drawingSurface.getContext("2d");
    let isGameStarted : boolean = false;
    let noOfGenerations : number = 0;
    let counter : number = 0;
    let evt = new Event("startGame", {"bubbles": true, "cancelable": true});
    let cancelled : boolean = false;
    const cellSize: number = 80;
    // watch for triggering the startGame event
    document.addEventListener("startGame", function(e) {
        console.log("test", e);
        iterationStarted();
    });

    let myArray : Array<Cell> = new Array();
    let nextGenerationArray : Array<Cell> = new Array();
    initGame(myArray, cellSize);
    drawGame(myArray);

    if (elmButton) {
        elmButton.addEventListener("click", function(event){
            isGameStarted = !isGameStarted;
            // Trigger the gameStart event here
            cancelled = !document.dispatchEvent(evt);
        });
    }


    drawingSurface.addEventListener("click", function(event){
        let x = event.pageX - elemLeft,
            y = event.pageY - elemTop;
        console.log("clicked at: ", x, y);
        setCell({coordX: Math.floor(x / cellSize) * cellSize, coordY: Math.floor(y / cellSize) * cellSize});
    });

    function drawGame(drawArray : Array<Cell>) {
        if (!drawArray) {
            return;
        }
        drawArray.forEach(function(cell){
            if (ctxt){
                if (!cell) {
                    return;
                }
                ctxt.fillStyle = cell.isAlive ? "#000000" : "#FFFFFF";
                ctxt.fillRect(cell.cellCoords.coordX, cell.cellCoords.coordY, cell.cellWidth, cell.cellWidth);
            }
        });
    }

    function setCell(coords: Coords){
        myArray.forEach(function(cell){
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
                console.log(cell.isAlive);
            }
        });
        drawGame(myArray);
    }

    function getCellNeighbours (cell : Cell, cellArray: Array<Cell>) : number  {
        let liveCellsCount : number = 0;
        // set the 8 neighbours coords
        let neighboursArray : Array<any> = new Array;
        neighboursArray.push([cell.cellCoords.coordX, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX, cell.cellCoords.coordY + cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY + cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY + cell.cellWidth]);
        // get live status for every neighbour
        neighboursArray.forEach( function (coordsArray) {
            cellArray.forEach(function(cellToCheck){
                if (coordsArray[0] === cellToCheck.cellCoords.coordX
                    && coordsArray[1] === cellToCheck.cellCoords.coordY
                    && cellToCheck.isAlive
                ) {
                    liveCellsCount ++;
                }
            })
        } );

        return liveCellsCount;
    }

    function iterationStarted(){
        //while (cancelled === false) {
            // process the next generation array
            nextGenerationArray = getNextGeneration(myArray);
            // replace the game array with the new generation array
            myArray = nextGenerationArray;

            drawGame(myArray);

            noOfGenerations ++;
            writeIterationsNumber(noOfGenerations);
        //}
    }

    function getNextGeneration (cellArray: Array<Cell>){
        let innerArray : Array<Cell> = new Array();
        let aliveStatus : boolean = false;

        cellArray.forEach( function(cellArrayElement){
            const neighbours : number = getCellNeighbours(cellArrayElement, cellArray);
            switch (neighbours) {
                case 2:
                    aliveStatus = cellArrayElement.isAlive;
                    break;
                case 3:
                    aliveStatus = true;
                    break;
                default:
                    aliveStatus = false;
                    break;
            }
            const innerElement : Cell = new Cell(aliveStatus, cellSize, cellArrayElement.cellCoords);

            innerArray.push(innerElement);
        });
        console.log(cellArray, innerArray);
        return innerArray;
    }

    function writeIterationsNumber (iterationsNumber : number) {
        const elmLabel = document.getElementById("iterationsNumber");
        if (elmLabel) {
            elmLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }

};
