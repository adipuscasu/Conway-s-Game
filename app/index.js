var Cell = /** @class */ (function () {
    function Cell(alive, cellSize, myCoords) {
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
    return Cell;
}());
function initGame(cellArray) {
    var i = 0;
    while (i < 400) {
        var j = 0;
        while (j < 400) {
            cellArray.push(new Cell(false, 4, { coordX: j, coordY: i }));
            j += 4;
        }
        i += 4;
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
    // watch for triggering the startGame event
    document.addEventListener("startGame", function (e) {
        console.log("test", e);
        iterationStarted();
    });
    var myArray = new Array();
    initGame(myArray);
    drawGame(myArray);
    if (elmButton) {
        elmButton.addEventListener("click", function (event) {
            isGameStarted = !isGameStarted;
            // Trigger the gameStart event
            cancelled = !document.dispatchEvent(evt);
        });
    }
    drawingSurface.addEventListener("click", function (event) {
        var x = event.pageX - elemLeft, y = event.pageY - elemTop;
        console.log("clicked at: ", x, y);
        setCell({ coordX: Math.floor(x / 4) * 4, coordY: Math.floor(y / 4) * 4 });
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
    function setCell(coords) {
        myArray.forEach(function (cell) {
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
                console.log(cell.isAlive);
            }
        });
        drawGame(myArray);
    }
    function getCellNeighbours(cell) {
        var liveCellsCount = 0;
        myArray.forEach(function (element, index) {
            if (!element) {
                return;
            }
            var cX = element.cellCoords.coordX;
            var cY = element.cellCoords.coordY;
            switch (cX, cY) {
                case (cell.cellCoords.coordX, cell.cellCoords.coordY - 4):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX, cell.cellCoords.coordY + 4):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY - 4):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY + 4):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX - 4, cell.cellCoords.coordY + 4):
                    liveCellsCount++;
                    break;
                case (cell.cellCoords.coordX + 4, cell.cellCoords.coordY - 4):
                    liveCellsCount++;
                    break;
                default:
                    liveCellsCount = 0;
                    break;
            }
        });
        return liveCellsCount;
    }
    function iterationStarted() {
        //while (cancelled === false) {
        myArray = getNextGeneration();
        drawGame(myArray);
        noOfGenerations++;
        writeIterationsNumber(noOfGenerations);
        //}
    }
    function getNextGeneration() {
        var newGeneration = myArray.slice(0);
        newGeneration.forEach(function (cellEllement, index) {
            if (!cellEllement) {
                return;
            }
            var neighbours = getCellNeighbours(cellEllement);
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
    function writeIterationsNumber(iterationsNumber) {
        var elmLabel = document.getElementById("iterationsNumber");
        if (elmLabel) {
            elmLabel.innerHTML = "Number of iterations : " + iterationsNumber;
        }
    }
};
