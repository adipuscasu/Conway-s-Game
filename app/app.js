"use strict";
exports.__esModule = true;
var Cell = /** @class */ (function () {
    function Cell(alive, cellSize, myCoords) {
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
    return Cell;
}());
exports["default"] = Cell;
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
exports.initGame = initGame;
