class Student {
    fullName: string;
    constructor(public firstName: string, public middleInitial: string, public lastName: string) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
}

class Cell {
    isAlive: boolean;
    cellWidth: number;
    cellCoords: Coords;
    constructor(public alive: boolean, public cellSize: number, public myCoords: Coords){
        this.isAlive = alive;
        this.cellWidth = cellSize;
        this.cellCoords = myCoords;
    }
}

interface Coords {
    coordX: number;
    coordY: number;
}


interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

function initGame(cellArray: Array<Cell>){
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



let user = new Student("Jane", "M.", "User");

//document.body.innerHTML = greeter(user);
window.onload = function () {
    let drawingSurface = <HTMLCanvasElement> document.getElementById("drawingSurface");
    let elemLeft = drawingSurface.offsetLeft;
    let elemTop = drawingSurface.offsetTop;
    let ctxt = drawingSurface.getContext("2d");
    let isGameStarted = false;

    drawingSurface.addEventListener("click", function(event){
        let x = event.pageX - elemLeft,
            y = event.pageY - elemTop;
        console.log("clicked at: ", x,y);
        setCell({coordX: Math.floor(x / 4) * 4, coordY: Math.floor(y / 4) * 4});
    });
    let myArray = new Array();
    initGame(myArray);
    drawGame();

    function drawGame(){
        myArray.forEach(function(cell){
            ctxt.fillStyle = cell.isAlive ? "#000000" : "#FFFFFF";
            ctxt.fillRect(cell.cellCoords.coordX, cell.cellCoords.coordY, cell.cellSize, cell.cellSize);
        });
    }

    function setCell(coords: Coords){
        myArray.forEach(function(cell){
            if (cell.cellCoords.coordX === coords.coordX && cell.cellCoords.coordY === coords.coordY) {
                cell.isAlive = !cell.isAlive;
                console.log(cell.isAlive);
                drawGame();
            }
        });
    }

};
