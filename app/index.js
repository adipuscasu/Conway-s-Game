var Student = /** @class */ (function () {
    function Student(firstName, middleInitial, lastName) {
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    return Student;
}());
var Cell = /** @class */ (function () {
    function Cell(alive, cellSize, myCoords) {
        this.alive = alive;
        this.cellSize = cellSize;
        this.myCoords = myCoords;
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
    return Cell;
}());
function greeter(person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}
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
var user = new Student("Jane", "M.", "User");
//document.body.innerHTML = greeter(user);
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
            ctxt.fillRect(cell.cellCoords.coordX, cell.cellCoords.coordY, cell.cellSize, cell.cellSize);
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
};
