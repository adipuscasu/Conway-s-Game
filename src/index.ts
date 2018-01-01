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
    const elmIterationsNumberLabel = document.getElementById("iterationsNumber");
    let cellSurface = <HTMLCanvasElement> document.getElementById("cellSurface");
    let browserCellSize: any = $( "input#cellSize" ) ? $( "input#cellSize" ).val()  : 0;
    let inputElement = document.getElementById("cellSize");
    let elmStartGameButton = document.getElementById("startGame");
    let drawingSurface = <HTMLCanvasElement> document.getElementById("drawingSurface");
    let elemCanvasCoordLeft = drawingSurface.offsetLeft;
    let elemCanvasCoordTop = drawingSurface.offsetTop;
    let ctxt = drawingSurface.getContext("2d");
    let noOfGenerations : number = 0;
    let isGameStarted : boolean = false;

    let evt = new Event("startGame", {"bubbles": true, "cancelable": true});

    let cancelled : boolean = false;
    let cellSize: number = parseInt(browserCellSize, 10) > 0 ? parseInt(browserCellSize, 10) : 80;

    let myArray : Array<Cell> = new Array();
    let nextGenerationArray : Array<Cell> = new Array();
    let buttonText: string = "Start game";

    // watch for triggering the startGame event a
    document.addEventListener("startGame", function(e) {
        if (isGameStarted) {
            iterationStarted(continueIterations);
        }
    });

    document.addEventListener("onchange", function () {
        setCanvasCoords();
    });

    if (inputElement) {
        inputElement.addEventListener("click", function (e) {
            browserCellSize = $( "input#cellSize" ) ? $( "input#cellSize" ).val()  : 0;
            cellSize = parseInt(browserCellSize, 10) > 0 ? parseInt(browserCellSize, 10) : 80;
            console.log("click", cellSize);
            writeCellSize(cellSize);
            setCanvasCoords();
            init();
        });
    }

    if (elmStartGameButton) {
        console.log("there is elmButton", elmStartGameButton);
        elmStartGameButton.addEventListener("click", function(event){
            isGameStarted = !isGameStarted;
            buttonText = isGameStarted ? "Stop " : "Start ";
            buttonText += "game";
            writeStartButtonLabel(buttonText);
            // Trigger the gameStart event here
            cancelled = !document.dispatchEvent(evt);
        });
    }

    drawingSurface.addEventListener("click", function(event){
        let x = event.pageX - elemCanvasCoordLeft,
            y = event.pageY - elemCanvasCoordTop;
        inverseCellLiveStatus({coordX: Math.floor(x / cellSize) * cellSize, coordY: Math.floor(y / cellSize) * cellSize});
        drawGame(myArray);
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

    setCanvasCoords();

    init();

    function inverseCellLiveStatus(coords: Coords) {
        myArray.forEach(function(cell){
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
            }
        });
    }

    function getCellNeighbours (cell : Cell, cellArray: Array<Cell>) : number  {
        let liveCellsCount : number = 0;
        // set coords for the 8 neighbours
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

    function iterationStarted(callBack: () => void) {
            // process the next generation array
            nextGenerationArray = getNextGeneration(myArray);
            // replace the game array with the new generation array
            myArray = nextGenerationArray;

            drawGame(myArray);

            noOfGenerations ++;
            writeIterationsNumber(noOfGenerations);
            // continue the game iterations
            if (typeof callBack === "function") {
                callBack();
            }
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
        return innerArray;
    }

    function writeIterationsNumber (iterationsNumber : number) {
        if (elmIterationsNumberLabel) {
            elmIterationsNumberLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }

    function writeCellSize(cellSizeValue: number) {
        const cellSizeLabel = document.getElementById("cellSizeLabel");
        if (cellSizeLabel) {
            cellSizeLabel.innerHTML = "Current cell size : " + cellSizeValue;
        }
    }

    function writeStartButtonLabel(textToWrite: string){
        if (elmStartGameButton) {
            elmStartGameButton.innerHTML = textToWrite;
        }
    }

    function reDrawRectangle(cellSizeValue: number){
        if (cellSizeValue) {
            $("#square").css("width", cellSizeValue);
            $("#square").css("height", cellSizeValue);
            $("#square").css("background", "black");
        }
    }

    function setCanvasCoords() {
        elemCanvasCoordLeft = drawingSurface.offsetLeft;
        elemCanvasCoordTop = drawingSurface.offsetTop;
    }

    function init() {
        myArray = new Array();
        writeCellSize(cellSize);
        reDrawRectangle(cellSize);
        initGame(myArray, cellSize);
        console.log(myArray, "elemLeft: ", elemCanvasCoordLeft, "elemTop: ", elemCanvasCoordTop);
        setCanvasCoords();
        drawGame(myArray);
        writeStartButtonLabel(buttonText);
    }

    function continueIterations(){
        setTimeout(function(){
            if (isGameStarted) {
                iterationStarted(continueIterations);
            }
        }, 100);
    }

};
