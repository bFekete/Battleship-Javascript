/**
 * battleship.js
 *  
 */
window.addEventListener("load", start, false);

var isGameStarted = false;
var userShipCount = 0;
var OFFSET = 550; // Where the cpuGrid starts
var canvas, context, shipRadioButton, orientationRadioButton;
var squareHeight, squareWidth;

var userGrid, cpuGrid;

//Variables to keep track of the Cpu's moves.
var attackingShip = false;
var indexPointX = 0;
var indexPointY = 0;
var directionToGo = "up";
var nextPointToGoX = 0;
var nextPointToGoY = 0;
var indexPointX, indexPointY;
var verticalSuccesful = false;


/**
 * This function initializes the game and its variables.
 * @returns {undefined}
 */
function start() {
    var container = document.getElementById("gameContainer");
    shipRadioButton = document.getElementsByName("ship");
    orientationRadioButton = document.getElementsByName("orientation");

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
    var xpos = e.offsetX === undefined ? e.layerX : e.offsetX;
    var ypos = e.offsetY === undefined ? e.layerY : e.offsetY;
    //console.log("Canvas Move: (" + xpos + ", " + ypos + ")");

    xCoord = Math.floor((xpos - canvas.getBoundingClientRect().left) / squareWidth) * squareWidth;
    yCoord = Math.floor((ypos - canvas.getBoundingClientRect().top) / squareHeight) * squareHeight;
}

/**
 * This function is the click event listener for the canvas.
 * @param {type} e
 * @returns {undefined}
 */
function handleClick(e) {
    // Since in Firefox e.offsetX/Y is undefined...
    var xpos = e.offsetX === undefined ? e.layerX : e.offsetX;
    var ypos = e.offsetY === undefined ? e.layerY : e.offsetY;

    xCoord = Math.floor((xpos - canvas.getBoundingClientRect().left) / squareWidth) * squareWidth;
    yCoord = Math.floor((ypos - canvas.getBoundingClientRect().top) / squareHeight) * squareHeight;

    var placeShip = false;
    var radioButtonIndex;
    var shipSize;
    var isVertical;
    /** Place ship **/
    for (var i = 0; i < shipRadioButton.length; i++) {
        if (shipRadioButton[i].checked) {
            if (shipRadioButton[i].value === "Battleship") {
                shipSize = "4";
            } else if (shipRadioButton[i].value === "Carrier") {
                shipSize = "5";
            } else if (shipRadioButton[i].value === "Cruiser") {
                shipSize = "3";
            } else if (shipRadioButton[i].value === "Patrol") {
                shipSize = "2";
            } else if (shipRadioButton[i].value === "Submarine") {
                shipSize = "3";
            }
            radioButtonIndex = i;
            placeShip = true;
        }
    }
    for (var i = 0; i < orientationRadioButton.length; i++) {
        if (orientationRadioButton[i].checked) {
            if (orientationRadioButton[i].value === "Vertical") {
                isVertical = true;
            } else {
                isVertical = false;
            }
        }
    }
    if (placeShip === true) {
        if (isValidShipPlacement(userGrid, xCoord / 50, yCoord / 50, isVertical, shipSize)) {
            if (isVertical) {
                for (var j = 0; j < shipSize; j++) {
                    userGrid[xCoord / 50][yCoord / 50 + j] = "1";
                }
            } else {
                for (var j = 0; j < shipSize; j++) {
                    userGrid[(xCoord / 50) + j][yCoord / 50] = "1";
                }
            }
            drawGrid(userGrid, 0);
            shipRadioButton[radioButtonIndex].checked = false;
            shipRadioButton[radioButtonIndex].disabled = true;
            userShipCount++;
        }
    }
    if (userShipCount === 5 && isGameStarted === false) { //Start the game
        isGameStarted = true;
    }

    if (isGameStarted === true) {
        if (makePlayerMove((xCoord - OFFSET) / 50, yCoord / 50) === true) {
            drawGrid(cpuGrid, OFFSET);
            if (didUserWin() === true) {
                isGameStarted = false;
            }
            makeComputerMove()
            drawGrid(userGrid, 0);
            if(didCPUWin() === true){
                isGameStarted = false;
            }
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
    randomizeComputerShips();
    drawGrid(userGrid, 0);
    drawGrid(cpuGrid, OFFSET);

    // Enables the radiobuttons
    for (var i = 0; i < shipRadioButton.length; i++) {
        shipRadioButton[i].disabled = false;
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
            if (grid[i][j] === "0") { //Open Water - Player
                context.fillStyle = "blue";
            } else if (grid[i][j] === "1") { // Ship - Player
                context.fillStyle = "gray";
            } else if (grid[i][j] === "2") { //Hit - Player/CPU
                context.fillStyle = "red";
            } else if (grid[i][j] === "3") { //Miss - Player/CPU
                context.fillStyle = "white";
            } else if (grid[i][j] === "4") { //Ship sunk - Player/CPU
                context.fillStyle = "black";
            } else if (grid[i][j] === "-1") { //Ship In background - CPU
                context.fillStyle = "blue";
            }

            context.fillRect(i * squareWidth + offset, j * squareHeight, squareWidth, squareHeight);
            context.strokeRect(i * squareWidth + offset, j * squareHeight, squareWidth, squareHeight);
        }
    }
}

function isValidShipPlacement(grid, x, y, isVertical, shipSize) {
    if (isVertical === true) {
        for (var i = 0; i < shipSize; i++) {
            if (grid[x][i + y] !== "0" || grid[x][i + y] !== "0") {
                alert("Not a valid move!");
                console.log("NOT VALID - VERTICAL");
                return false;
            }
        }
        console.log("VALID - VERTICAL");
        return true;
    } else { // Horizontal
        //Checking in a right direction if any spots are taken
        console.log("X:" + x);
        console.log("Y:" + y);
        for (var i = 0; i < shipSize; i++) {
            console.log("i=" + i + " | x=" + x);
            if (grid[x + i][y] !== "0" || grid[x + i][y] !== "0") {
                console.log("NOT VALID - HORIZONTAL");
                return false;
            }
        }
        console.log("VALID - HORIZONTAL");
        return true;
    }

}

/**
 * Function that will handle the Computers move, based off a random number until
 * the computer finds a ship. The move then will be based off an algorithim for
 * the best possible move.
 * 
 * 
 */
function makeComputerMove() {

    if (attackingShip === false) {
        //Trying to make a random move
        while (true) {
            //Getting random x and y coordinate
            var xCordinate = Math.floor((Math.random() * 10));
            var yCordinate = Math.floor((Math.random() * 10));

            //Place already was hit or missed
            if (userGrid[xCordinate][yCordinate] === "2" ||
                    userGrid[xCordinate][yCordinate] === "3") {
                //Try again
                continue;
            }//Hit
            else if (userGrid[xCordinate][yCordinate] === "1") {
                userGrid[xCordinate][yCordinate] = "2";
                drawGrid(userGrid, 0);
                attackingShip = true;
                indexPointX = xCordinate;
                indexPointY = yCordinate;
            }//Miss
            else if (userGrid[xCordinate][yCordinate] === "0") {
                userGrid[xCordinate][yCordinate] = "3";
                drawGrid(userGrid, 0);
                return;
            }
            if (attackingShip === true) {
                //Seting Next Point
                //Going Up
                if (yCordinate - 1 >= 0
                        && userGrid[xCordinate][yCordinate - 1] !== "2"
                        && userGrid[xCordinate][yCordinate - 1] !== "3") {
                    directionToGo = "up";
                    nextPointToGoX = xCordinate;
                    nextPointToGoY = yCordinate - 1;
                    console.log(nextPointToGoX + ", " + nextPointToGoY);
                    return;
                }//Going Down 
                else if (yCordinate + 1 < 10
                        && userGrid[xCordinate][yCordinate + 1] !== "2"
                        && userGrid[xCordinate][yCordinate + 1] !== "3") {
                    verticalSuccesful = false;
                    directionToGo = "down";
                    nextPointToGoX = xCordinate;
                    nextPointToGoY = yCordinate + 1;
                    return;

                }//Going right 
                else if (xCordinate + 1 < 10
                        && userGrid[xCordinate + 1][yCordinate] !== "2"
                        && userGrid[xCordinate + 1][yCordinate] !== "3") {
                    verticalSuccesful = false;
                    directionToGo = "right";
                    nextPointToGoX = xCordinate + 1;
                    nextPointToGoY = yCordinate;
                    return;

                }//Going left
                else if (xCordinate - 1 >= 0
                        && userGrid[xCordinate - 1][yCordinate] !== "2"
                        && userGrid[xCordinate - 1][yCordinate] !== "3") {
                    verticalSuccesful = false;
                    directionToGo = "left";
                    nextPointToGoX = xCordinate - 1;
                    nextPointToGoY = yCordinate;
                    return;
                }
                else {
                    alert("NEVER SHOULD HAPPEN");
                    directionToGo = "up";
                    return;
                }
            }
        }
    } else {
        if (directionToGo === "up") {
            if (userGrid[nextPointToGoX][nextPointToGoY] === "1") { //Hit
                console.log("i got here")
                verticalSuccesful = true;
                userGrid[nextPointToGoX][nextPointToGoY] = "2";
                if (nextPointToGoY - 1 >= 0
                        && userGrid[nextPointToGoX][nextPointToGoY - 1] !== "2"
                        && userGrid[nextPointToGoX][nextPointToGoY - 1] !== "3") {
                    directionToGo = "up";
                    nextPointToGoX = nextPointToGoX;
                    nextPointToGoY = nextPointToGoY - 1;
                    console.log(nextPointToGoX + ", " + nextPointToGoY);
                    return;
                }
            } else if (userGrid[nextPointToGoX][nextPointToGoY] === "0") {
                userGrid[nextPointToGoX][nextPointToGoY] = "3";
            }
            //Checking to go down
            if (indexPointY + 1 < 10
                    && userGrid[indexPointX][indexPointY + 1] !== "2"
                    && userGrid[indexPointX][indexPointY + 1] !== "3") {
                verticalSuccesful = false;
                directionToGo = "down";
                nextPointToGoX = indexPointX;
                nextPointToGoY = indexPointY + 1;
                return;

            }//Going right
            else if (indexPointX + 1 < 10
                    && userGrid[indexPointX + 1][indexPointY] !== "2"
                    && userGrid[indexPointX + 1][indexPointY] !== "3") {
                verticalSuccesful = false;
                directionToGo = "right";
                nextPointToGoX = indexPointX + 1;
                nextPointToGoY = indexPointY;
                return;

            }//Going left
            else if (indexPointX - 1 >= 0
                    && userGrid[indexPointX - 1][indexPointY] !== "2"
                    && userGrid[indexPointX - 1][indexPointY] !== "3") {
                verticalSuccesful = false;
                directionToGo = "left";
                nextPointToGoX = indexPointX - 1;
                nextPointToGoY = indexPointY;
                return;

            }
            attackingShip = false;
        } else if (directionToGo === "down") {
            if (userGrid[nextPointToGoX][nextPointToGoY] === "1") {
                verticalSuccesful = true;
                userGrid[nextPointToGoX][nextPointToGoY] = "2";
                if (nextPointToGoY + 1 < 10
                        && userGrid[nextPointToGoX][nextPointToGoY + 1] !== "2"
                        && userGrid[nextPointToGoX][nextPointToGoY + 1] !== "3") {
                    verticalSuccesful = true;
                    directionToGo = "down";
                    nextPointToGoX = nextPointToGoX;
                    nextPointToGoY = nextPointToGoY + 1;
                    return;
                }
            } else if (userGrid[nextPointToGoX][nextPointToGoY] === "0") {
                userGrid[nextPointToGoX][nextPointToGoY] = "3";
            }
            if (indexPointX + 1 < 10
                    && userGrid[indexPointX + 1][indexPointY] !== "2"
                    && userGrid[indexPointX + 1][indexPointY] !== "3"
                    && verticalSuccesful === false) {
                verticalSuccesful = false;
                directionToGo = "right";
                nextPointToGoX = indexPointX + 1;
                nextPointToGoY = indexPointY;
                return;
            }//Going left
            else if (indexPointX - 1 >= 0
                    && userGrid[indexPointX - 1][indexPointY] !== "2"
                    && userGrid[indexPointX - 1][indexPointY] !== "3"
                    && verticalSuccesful === false) {
                verticalSuccesful = false;
                directionToGo = "left";
                nextPointToGoX = indexPointX - 1;
                nextPointToGoY = indexPointY;
                return;
            }
            attackingShip = false;
            //Going Right  
        } else if (directionToGo === "right") {
            //Next Point Was successful
            if (userGrid[nextPointToGoX][nextPointToGoY] === "1") {
                userGrid[nextPointToGoX][nextPointToGoY] = "2";
                //Try going right again
                if (nextPointToGoX + 1 < 10
                        && userGrid[nextPointToGoX + 1][nextPointToGoY] !== "2"
                        && userGrid[nextPointToGoX + 1][nextPointToGoY] !== "3") {
                    verticalSuccesful = false;
                    directionToGo = "right";
                    nextPointToGoX = nextPointToGoX + 1;
                    nextPointToGoY = nextPointToGoY;
                    return;
                }
            } else if (userGrid[nextPointToGoX][nextPointToGoY] === "0") {
                userGrid[nextPointToGoX][nextPointToGoY] = "3";
            }
            //Try going left
            if (indexPointX - 1 >= 0
                    && userGrid[indexPointX - 1][indexPointY] !== "2"
                    && userGrid[indexPointX - 1][indexPointY] !== "3") {
                verticalSuccesful = false;
                directionToGo = "left";
                nextPointToGoX = indexPointX - 1;
                nextPointToGoY = indexPointY;
                return;
            }
            attackingShip = false;
            return;
        } else {
            if (userGrid[nextPointToGoX][nextPointToGoY] === "1") {
                userGrid[nextPointToGoX][nextPointToGoY] = "2";
                if (nextPointToGoX - 1 >= 0
                        && userGrid[nextPointToGoX - 1][nextPointToGoY] !== "2"
                        && userGrid[nextPointToGoX - 1][nextPointToGoY] !== "3") {
                    verticalSuccesful = false;
                    directionToGo = "left";
                    nextPointToGoX = nextPointToGoX - 1;
                    nextPointToGoY = nextPointToGoY;
                    return;
                }
            }
            else if (userGrid[nextPointToGoX][nextPointToGoY] === "0") {
                userGrid[nextPointToGoX][nextPointToGoY] = "3";
            }
            attackingShip = false;
            return;
        }
    }
}



/**
 * Handles a players move and draws on the grid based on whether the move was
 * successful or not
 * @param {type} x X cordinate of the player's move.
 * @param {type} y Y cordinate of the player's move.
 * @returns {undefined}
 */
function makePlayerMove(x, y) {
    if (cpuGrid[x][y] === "0") { //Player has missed
        cpuGrid[x][y] = "3";
        drawGrid(cpuGrid, OFFSET);
        return true;
    } else if (cpuGrid[x][y] === "-1") { //Player has hit ship
        cpuGrid[x][y] = "2";
        drawGrid(cpuGrid, OFFSET);
        return true;
    } else {
        return false;
    }

}
/**
 * Function to return whether the user won or not
 * 
 * @returns {Boolean} Returns true if the user has won the game, False if not
 */
function didUserWin() {
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (cpuGrid[i][j] === "-1") {
                return false;
            }
        }
    }
    alert("You won!");
    return true;
}

/**
 * Function to return whether the CPU won or not
 * 
 * @returns {Boolean} Returns true if the CPU has won the game, False if not
 */
function didCPUWin() {
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (userGrid[i][j] === "1") {
                return false;
            }
        }
    }
    alert("You lost!");
    return true;
}

function  randomizeComputerShips() {

    var xCordinate = 0;
    var yCordinate = 0;
    var verticalOrHorizontal = 0;
    var placeingShip = true;
    var canPlace = false;
    var sizeOfShips = [5, 4, 3, 3, 2];
    var sizeOfShip;
    //Iterating for the number of ships on the board

    for (a = 0; a < 5; a++) {

        sizeOfShip = sizeOfShips[a];
        //Placeing the cruisuer
        while (placeingShip === true) {

            xCordinate = Math.floor((Math.random() * 10));
            yCordinate = Math.floor((Math.random() * 10));
            verticalOrHorizontal = Math.floor((Math.random() * 10) + 1);



            if (verticalOrHorizontal > 5) { //Vertical 

                if (!(yCordinate + sizeOfShip > 10)) {
                    //Checking in a downwords direction if any spots are taken
                    for (i = yCordinate; i < yCordinate + sizeOfShip; i++) {
                        if (cpuGrid[xCordinate][i] === "-1") {
                            canPlace = false;
                            break;
                        }
                        canPlace = true;
                    }
                    if (canPlace === true) {
                        //Filling the values out for the ship
                        for (j = yCordinate; j < yCordinate + sizeOfShip; j++) {
                            cpuGrid[xCordinate][j] = "-1";
                            //  console.log(xCordinate + ", " + yCordinate);
                        }
                        placeingShip = false;
                        canPlace = false;
                    }
                }




                if (!(yCordinate - sizeOfShip < 0)) {
                    if (placeingShip === true) {
                        //Checking in a upwards direction if any spots are taken
                        for (i = yCordinate; i > yCordinate - sizeOfShip; i--) {
                            if (cpuGrid[xCordinate][i] === "-1") {
                                canPlace = false;
                                break;
                            }
                            canPlace = true;
                        }
                        if (canPlace === true) {
                            //Filling the values out for the ship
                            for (j = yCordinate; j > yCordinate - sizeOfShip; j--) {
                                cpuGrid[xCordinate][j] = "-1";
                                console.log(xCordinate + ", " + yCordinate);
                            }
                            placeingShip = false;
                            canPlace = false;
                        }

                    }

                }
            } else { //Place the ship in the horizontal direction
                if (!(xCordinate + sizeOfShip > 10)) {
                    if (placeingShip === true) {

                        //Checking in a right direction if any spots are taken
                        for (i = xCordinate; i < xCordinate + sizeOfShip; i++) {
                            if (cpuGrid[i][yCordinate] === "-1") {
                                canPlace = false;
                                break;
                            }
                            canPlace = true;
                        }
                        if (canPlace === true) {
                            //Filling the values out for the ship
                            for (j = xCordinate; j < xCordinate + sizeOfShip; j++) {
                                cpuGrid[j][yCordinate] = "-1";
                                console.log(xCordinate + ", " + yCordinate);
                            }
                            placeingShip = false;
                            canPlace = false;
                        }

                    }
                }
                if (!(xCordinate - sizeOfShip < 0) && placeingShip === true) {



                    //Checking in a left direction if any spots are taken
                    for (i = xCordinate; i > xCordinate - sizeOfShip; i--) {
                        if (cpuGrid[i][yCordinate] === "-1") {
                            canPlace = false;
                            break;
                        }
                        canPlace = true;
                    }

                    if (canPlace === true) {
                        //Filling the values out for the ship
                        for (j = xCordinate; j > xCordinate - sizeOfShip; j--) {
                            cpuGrid[j][yCordinate] = "-1";
                            console.log(xCordinate + ", " + yCordinate);
                        }
                        placeingShip = false;
                        canPlace = false;
                    }
                }

            }
        }
        placeingShip = true;
    }


}



