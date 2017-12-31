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

function initGame(cellArray: Array<Cell>) {
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
    // watch for triggering the startGame event
    document.addEventListener("startGame", function(e) {
        console.log("test", e);
        iterationStarted();
    });

    let myArray = new Array();
    initGame(myArray);
    drawGame(myArray);

    if (elmButton) {
        elmButton.addEventListener("click", function(event){
            isGameStarted = !isGameStarted;
            // Trigger the gameStart event
            cancelled = !document.dispatchEvent(evt);
        });
    }


    drawingSurface.addEventListener("click", function(event){
        let x = event.pageX - elemLeft,
            y = event.pageY - elemTop;
        console.log("clicked at: ", x, y);
        setCell({coordX: Math.floor(x / 4) * 4, coordY: Math.floor(y / 4) * 4});
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

    function getCellNeighbours (cell : Cell) : number  {
        let liveCellsCount : number = 0;
        myArray.forEach(function(element, index) {
            if (!element) {
                return;
            }
                const cX : number = element.cellCoords.coordX;
                const cY : number = element.cellCoords.coordY;

                switch (cX, cY) {
                    case (cell.cellCoords.coordX, cell.cellCoords.coordY - 4):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX, cell.cellCoords.coordY + 4):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY - 4):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY + 4):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY + 4):
                        liveCellsCount ++;
                        break;
                    case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY - 4):
                        liveCellsCount ++;
                        break;
                    default:
                        liveCellsCount = 0;
                        break;
            }


        });
        return liveCellsCount;
    }

    function iterationStarted(){
        //while (cancelled === false) {
            myArray = getNextGeneration();
            drawGame(myArray);
            noOfGenerations ++;
            writeIterationsNumber(noOfGenerations);
        //}
    }

    function getNextGeneration (){
        let newGeneration = myArray.slice(0);
        newGeneration.forEach(function (cellEllement, index){
            if (!cellEllement) {
                return;
            }
            const neighbours : number = getCellNeighbours(cellEllement);
            switch (neighbours) {
                case 2:
                    cellEllement.isAlive = cellEllement.isAlive;
                    break;
                case 3:
                    cellEllement.isAlive = true;
                    break;
                default:
                    cellEllement.isAlive = false;
                    break;
            }
        });
        return newGeneration;
    }

    function writeIterationsNumber (iterationsNumber : number) {
        const elmLabel = document.getElementById("iterationsNumber");
        if (elmLabel) {
            elmLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }

};
