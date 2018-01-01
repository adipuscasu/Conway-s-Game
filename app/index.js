var Cell = /** @class */ (function () {
    function Cell(alive, cellSize, myCoords) {
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
    return Cell;
}());
function initGame(cellArray, cellSize) {
    var i = 0;
    while (i < 400) {
        var j = 0;
        while (j < 400) {
            cellArray.push(new Cell(false, cellSize, { coordX: j, coordY: i }));
            j += cellSize;
        }
        i += cellSize;
    }
}
window.onload = function () {
    var elmIterationsNumberLabel = document.getElementById("iterationsNumber");
    var cellSurface = document.getElementById("cellSurface");
    var browserCellSize = $("input#cellSize") ? $("input#cellSize").val() : 0;
    var inputElement = document.getElementById("cellSize");
    var elmStartGameButton = document.getElementById("startGame");
    var drawingSurface = document.getElementById("drawingSurface");
    var elemCanvasCoordLeft = drawingSurface.offsetLeft;
    var elemCanvasCoordTop = drawingSurface.offsetTop;
    var ctxt = drawingSurface.getContext("2d");
    var noOfGenerations = 0;
    var isGameStarted = false;
    var evt = new Event("startGame", { "bubbles": true, "cancelable": true });
    var cancelled = false;
    var cellSize = parseInt(browserCellSize, 10) > 0 ? parseInt(browserCellSize, 10) : 80;
    var myArray = new Array();
    var nextGenerationArray = new Array();
    var buttonText = "Start game";
    // watch for triggering the startGame event a
    document.addEventListener("startGame", function (e) {
        if (isGameStarted) {
            iterationStarted(continueIterations);
        }
    });
    document.addEventListener("onchange", function () {
        setCanvasCoords();
    });
    if (inputElement) {
        inputElement.addEventListener("click", function (e) {
            browserCellSize = $("input#cellSize") ? $("input#cellSize").val() : 0;
            cellSize = parseInt(browserCellSize, 10) > 0 ? parseInt(browserCellSize, 10) : 80;
            writeCellSize(cellSize);
            setCanvasCoords();
            init();
        });
    }
    if (elmStartGameButton) {
        elmStartGameButton.addEventListener("click", function (event) {
            isGameStarted = !isGameStarted;
            buttonText = isGameStarted ? "Stop " : "Start ";
            buttonText += "game";
            writeStartButtonLabel(buttonText);
            // Trigger the gameStart event here
            cancelled = !document.dispatchEvent(evt);
        });
    }
    drawingSurface.addEventListener("click", function (event) {
        var x = event.pageX - elemCanvasCoordLeft, y = event.pageY - elemCanvasCoordTop;
        inverseCellLiveStatus({ coordX: Math.floor(x / cellSize) * cellSize, coordY: Math.floor(y / cellSize) * cellSize });
        drawGame(myArray);
    });
    function drawGame(drawArray) {
        if (!drawArray) {
            return;
        }
        drawArray.forEach(function (cell) {
            if (ctxt) {
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
    function inverseCellLiveStatus(coords) {
        myArray.forEach(function (cell) {
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
            }
        });
    }
    function getCellNeighbours(cell, cellArray) {
        var liveCellsCount = 0;
        // set coords for the 8 neighbours
        var neighboursArray = new Array;
        neighboursArray.push([cell.cellCoords.coordX, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX, cell.cellCoords.coordY + cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY - cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX - cell.cellWidth, cell.cellCoords.coordY + cell.cellWidth]);
        neighboursArray.push([cell.cellCoords.coordX + cell.cellWidth, cell.cellCoords.coordY + cell.cellWidth]);
        // get live status for every neighbour
        neighboursArray.forEach(function (coordsArray) {
            cellArray.forEach(function (cellToCheck) {
                if (coordsArray[0] === cellToCheck.cellCoords.coordX
                    && coordsArray[1] === cellToCheck.cellCoords.coordY
                    && cellToCheck.isAlive) {
                    liveCellsCount++;
                }
            });
        });
        return liveCellsCount;
    }
    function iterationStarted(callBack) {
        // process the next generation array
        nextGenerationArray = getNextGeneration(myArray);
        // replace the game array with the new generation array
        myArray = nextGenerationArray;
        drawGame(myArray);
        noOfGenerations++;
        writeIterationsNumber(noOfGenerations);
        // continue the game iterations
        if (typeof callBack === "function") {
            callBack();
        }
    }
    function getNextGeneration(cellArray) {
        var innerArray = new Array();
        var aliveStatus = false;
        cellArray.forEach(function (cellArrayElement) {
            var neighbours = getCellNeighbours(cellArrayElement, cellArray);
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
            var innerElement = new Cell(aliveStatus, cellSize, cellArrayElement.cellCoords);
            innerArray.push(innerElement);
        });
        return innerArray;
    }
    function writeIterationsNumber(iterationsNumber) {
        if (elmIterationsNumberLabel) {
            elmIterationsNumberLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }
    function writeCellSize(cellSizeValue) {
        var cellSizeLabel = document.getElementById("cellSizeLabel");
        if (cellSizeLabel) {
            cellSizeLabel.innerHTML = "Current cell size : " + cellSizeValue;
        }
    }
    function writeStartButtonLabel(textToWrite) {
        if (elmStartGameButton) {
            elmStartGameButton.innerHTML = textToWrite;
        }
    }
    function reDrawRectangle(cellSizeValue) {
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
        setCanvasCoords();
        drawGame(myArray);
        writeStartButtonLabel(buttonText);
    }
    function continueIterations() {
        setTimeout(function () {
            if (isGameStarted) {
                iterationStarted(continueIterations);
            }
        }, 100);
    }
};
