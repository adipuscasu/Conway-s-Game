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
    var drawingSurface = document.getElementById("drawingSurface");
    var elemLeft = drawingSurface.offsetLeft;
    var elemTop = drawingSurface.offsetTop;
    var ctxt = drawingSurface.getContext("2d");
    var isGameStarted = false;
    drawingSurface.addEventListener("click", function (event) {
        var x = event.pageX - elemLeft, y = event.pageY - elemTop;
        console.log("clicked at: ", x, y);
        setCell({ coordX: Math.floor(x / 4) * 4, coordY: Math.floor(y / 4) * 4 });
    });
    var myArray = new Array();
    initGame(myArray);
    drawGame();
    function drawGame() {
        myArray.forEach(function (cell) {
            ctxt.fillStyle = cell.isAlive ? "#000000" : "#FFFFFF";
            ctxt.fillRect(cell.cellCoords.coordX, cell.cellCoords.coordY, cell.cellWidth, cell.cellWidth);
        });
    }
    function setCell(coords) {
        myArray.forEach(function (cell) {
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
                console.log(cell.isAlive);
                drawGame();
            }
        });
    }
    function getCellNeighbours(cell) {
        var liveCellsCount = 0;
        myArray.forEach(function (element) {
            switch (element.cellCoords) {
                case { coordX: cell.cellCoords.coordX, coordY: cell.cellCoords.coordY - 4 }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX, coordY: cell.cellCoords.coordY + 4 }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX + 4, coordY: cell.cellCoords.coordY }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX - 4, coordY: cell.cellCoords.coordY }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX - 4, coordY: cell.cellCoords.coordY - 4 }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX + 4, coordY: cell.cellCoords.coordY + 4 }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX - 4, coordY: cell.cellCoords.coordY + 4 }:
                    liveCellsCount++;
                    break;
                case { coordX: cell.cellCoords.coordX + 4, coordY: cell.cellCoords.coordY - 4 }:
                    liveCellsCount++;
                    break;
                default:
                    liveCellsCount = 0;
                    break;
            }
            return liveCellsCount;
        });
    }
};
