/**
 * battleship.js
 *  
 */
var canvas, context;
var squareHeight, squareWidth;
var radioButton;

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
    context.fillStyle = "red";

    if (xCoord !== 500) { // So it doesn't set the seperator between the boards
        context.fillRect(xCoord, yCoord, squareWidth, squareHeight);
        context.strokeRect(xCoord, yCoord, squareWidth, squareHeight);
    }

    for (var i = 0; i < radioButton.length; i++) {
        if (radioButton[i].checked) {
            radioButton[i].checked = false;
            radioButton[i].disabled = true;
        }
    }
}

function updateGrid(color, xCoord, yCoord) {
    context.fillStyle = color;
    context.strokeStyle = "black";
    context.fillRect(xCoord, yCoord, squareWidth, squareHeight);
    context.strokeRect(xCoord, yCoord, squareWidth, squareHeight);
}

/**
 * This function initializes the grid.
 * @returns {undefined}
 */
function initializeGrid() {
    for (var i = 0; i < 10; i++) {
        for (var k = 0; k < 10; k++) {
            context.fillStyle = "blue";
            context.strokeStyle = "black";
            context.fillRect(i * squareWidth, k * squareHeight, squareWidth, squareHeight);
            context.strokeRect(i * squareWidth, k * squareHeight, squareWidth, squareHeight);

            context.fillStyle = "blue";
            context.strokeStyle = "black";
            context.fillRect(i * squareWidth + 550, k * squareHeight, squareWidth, squareHeight);
            context.strokeRect(i * squareWidth + 550, k * squareHeight, squareWidth, squareHeight);
        }
    }

    for (var i = 0; i < radioButton.length; i++) {
        radioButton[i].disabled = false;
    }
}

window.addEventListener("load", start, false);


