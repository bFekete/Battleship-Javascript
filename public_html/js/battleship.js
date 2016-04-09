/**
 * battleship.js
 *  
 */
var canvas, context;
var squareHeight, squareWidth;

/**
 * This function initializes the game and its variables.
 * @returns {undefined}
 */
function start() {
    var container = document.getElementById("gameContainer");

    canvas = document.createElement("canvas");
    canvas.addEventListener('click', handleClick);
    context = canvas.getContext("2d");

    canvas.height = 500;
    canvas.width = 500;
    squareHeight = canvas.height / 10;
    squareWidth = canvas.width / 10;
    initializeGrid();

    container.appendChild(canvas);
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
        }
    }
}

window.addEventListener("load", start, false);


