/**
 * battleship.js
 *  
 */
var OFFSET = 550; // Where the cpuGrid starts

var canvas, context;
var squareHeight, squareWidth;
var radioButton;

var userGrid, cpuGrid;

function ship(name, size) {
    this.name = name;
    this.size = size;
    this.sank = false;
}

/**
 * This function initializes the game and its variables.
 * @returns {undefined}
 */
function start() {
    var container = document.getElementById("gameContainer");
    radioButton = document.getElementsByName("ship");

    canvas = document.createElement("canvas");
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMove);
    context = canvas.getContext("2d");
    context.strokeStyle = "black";

    canvas.height = 500;
    canvas.width = 1050;
    squareHeight = 50;
    squareWidth = 50;

    initializeGrid();
    container.appendChild(canvas);
}


function handleMove(e) {
    // Since in Firefox e.offsetX/Y is undefined...
    xpos = e.offsetX === undefined ? e.layerX : e.offsetX;
    ypos = e.offsetY === undefined ? e.layerY : e.offsetY;
    console.log("Canvas Move: (" + xpos + ", " + ypos + ")");

    xCoord = Math.floor((xpos - canvas.getBoundingClientRect().left) / squareWidth) * squareWidth;
    yCoord = Math.floor((ypos - canvas.getBoundingClientRect().top) / squareHeight) * squareHeight;

    // Carrier 5
    var carrier = new ship("Carrier", 5);
    // Battleship 4
    var battleship = new ship("Battleship", 4);
    // Submarine 3
    var submarine = new ship("Submarine", 3);
    // Cruiser 3
    var cruiser = new ship("Cruiser", 3);
    // Patrol 2
    var patrol = new ship("Patrol", 2);

    // Update the multple squares on the grid when ship is not placed
    // and the radio button is selected
    for (var i = 0; i < radioButton.length; i++) {
        if (radioButton[i].checked) {
            if (radioButton[i].value === "Battleship") {
                for (var k = 0; k < battleship.size; k++) {
                    updateGrid("gray", xCoord + (k * squareWidth), yCoord);
                }
            } else if (radioButton[i].value === "Carrier") {
                for (var k = 0; k < carrier.size; k++) {
                    updateGrid("gray", xCoord + (k * squareWidth), yCoord);
                }
            } else if (radioButton[i].value === "Cruiser") {
                for (var k = 0; k < cruiser.size; k++) {
                    updateGrid("gray", xCoord + (k * squareWidth), yCoord);
                }
            } else if (radioButton[i].value === "Patrol") {
                for (var k = 0; k < patrol.size; k++) {
                    updateGrid("gray", xCoord + (k * squareWidth), yCoord);
                }
            } else if (radioButton[i].value === "Submarine") {
                for (var k = 0; k < submarine.size; k++) {
                    updateGrid("gray", xCoord + (k * squareWidth), yCoord);
                }
            }
        }

    }

}

/**
 * This function is the click event listener for the canvas.
 * @param {type} e
 * @returns {undefined}
 */
function handleClick(e) {
    // Since in Firefox e.offsetX/Y is undefined...
    xpos = e.offsetX === undefined ? e.layerX : e.offsetX;
    ypos = e.offsetY === undefined ? e.layerY : e.offsetY;
    console.log("Canvas Click: (" + xpos + ", " + ypos + ")");

    xCoord = Math.floor((xpos - canvas.getBoundingClientRect().left) / squareWidth) * squareWidth;
    yCoord = Math.floor((ypos - canvas.getBoundingClientRect().top) / squareHeight) * squareHeight;

    var placeShip = false;
    /** Place ship **/
    for (var i = 0; i < radioButton.length; i++) {
        if (radioButton[i].checked) {
            radioButton[i].checked = false;
            radioButton[i].disabled = true;
            placeShip = true;
        }
    }
    
    /** Attack **/
    if (placeShip === false) {
        if (xCoord >= OFFSET) {
            cpuGrid[(xCoord - OFFSET) / 50][yCoord / 50] = "2";
            drawGrid(cpuGrid, OFFSET);
        } else if (xCoord < OFFSET) {
            userGrid[xCoord / 50][yCoord / 50] = "2";
            drawGrid(userGrid, 0);
        }
    }
}

function updateGrid(color, xCoord, yCoord) {
    context.fillStyle = color;
    context.fillRect(xCoord, yCoord, squareWidth, squareHeight);
    context.strokeRect(xCoord, yCoord, squareWidth, squareHeight);
}

/**
 * This function initializes the grid.
 * @returns {undefined}
 */
function initializeGrid() {
    userGrid = new Array(10);
    cpuGrid = new Array(10);
    for (var i = 0; i < 10; i++) {
        userGrid[i] = new Array(10);
        cpuGrid[i] = new Array(10);

        for (var j = 0; j < 10; j++) {
            userGrid[i][j] = "0";
            cpuGrid[i][j] = "0";

        }
    }

    drawGrid(userGrid, 0);
    drawGrid(cpuGrid, OFFSET);

    // Enables the radiobuttons
    for (var i = 0; i < radioButton.length; i++) {
        radioButton[i].disabled = false;
    }
}

/**
 * Helper method that draws rectangles based on grid.
 * @param {type} grid 2d Array
 * @param {type} offset Horizontal offset
 * @returns {undefined}
 */
function drawGrid(grid, offset) {

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if (grid[i][j] === "0") {
                context.fillStyle = "blue";
            } else if (grid[i][j] === "1") {
                context.fillStyle = "gray";
            } else if (grid[i][j] === "2") {
                context.fillStyle = "red";
            } else if (grid[i][j] === "3") {
                context.fillStyle = "black";
            }
            context.fillRect(i * squareWidth + offset, j * squareHeight, squareWidth, squareHeight);
            context.strokeRect(i * squareWidth + offset, j * squareHeight, squareWidth, squareHeight);
        }
    }
}

window.addEventListener("load", start, false);


