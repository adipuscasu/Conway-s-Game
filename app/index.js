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
    var elmButton = document.getElementById("startGame");
    var drawingSurface = document.getElementById("drawingSurface");
    var elemLeft = drawingSurface.offsetLeft;
    var elemTop = drawingSurface.offsetTop;
    var ctxt = drawingSurface.getContext("2d");
    var isGameStarted = false;
    var noOfGenerations = 0;
    var counter = 0;
    var evt = new Event("startGame", { "bubbles": true, "cancelable": true });
    var cancelled = false;
    var cellSize = 80;
    // watch for triggering the startGame event
    document.addEventListener("startGame", function (e) {
        console.log("test", e);
        iterationStarted();
    });
    var myArray = new Array();
    var nextGenerationArray = new Array();
    initGame(myArray, cellSize);
    drawGame(myArray);
    if (elmButton) {
        elmButton.addEventListener("click", function (event) {
            isGameStarted = !isGameStarted;
            // Trigger the gameStart event here
            cancelled = !document.dispatchEvent(evt);
        });
    }
    drawingSurface.addEventListener("click", function (event) {
        var x = event.pageX - elemLeft, y = event.pageY - elemTop;
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
    function inverseCellLiveStatus(coords) {
        myArray.forEach(function (cell) {
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
            }
        });
    }
    function getCellNeighbours(cell, cellArray) {
        var liveCellsCount = 0;
        // set the 8 neighbours coords
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
    function iterationStarted() {
        // process the next generation array
        nextGenerationArray = getNextGeneration(myArray);
        // replace the game array with the new generation array
        myArray = nextGenerationArray;
        drawGame(myArray);
        noOfGenerations++;
        writeIterationsNumber(noOfGenerations);
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
        var elmLabel = document.getElementById("iterationsNumber");
        if (elmLabel) {
            elmLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }
};
