/**
 * battleship.js
 *  
 */
var OFFSET = 550; // Where the cpuGrid starts

var canvas, context;
var squareHeight, squareWidth;
var radioButton;

var userGrid, cpuGrid;

//Variables to keep track of the Cpus move.
var lastMove;
var lastSuccessfulMove;
var lastDirection;
var LastSuccessfulDirection;

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
    //console.log("Canvas Move: (" + xpos + ", " + ypos + ")");

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

//    /** Attack **/
//    if (placeShip === false) {
//        if (xCoord >= OFFSET) {
//            cpuGrid[(xCoord - OFFSET) / 50][yCoord / 50] = "2";
//            drawGrid(cpuGrid, OFFSET);
//        } else if (xCoord < OFFSET) {
//            userGrid[xCoord / 50][yCoord / 50] = "2";
//            drawGrid(userGrid, 0);
//        }
//    }
    x = xCoord / 50 - 11;
    console.log(x);
    y = yCoord / 50;
    //makePlayerMove(x, y);
    //drawGrid(cpuGrid, OFFSET);
    while(didUserWin() === false){
    makeComputerMove();
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
            } else if (grid[i][j] === "1") {//Open Water - Player
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

window.addEventListener("load", start, false);

/**
 * Function that will handle the Computers move, based off a random number until
 * the computer finds a ship. The move then will be based off an algorithim for
 * the best possible move.
 * 
 * 
 */
function makeComputerMove() {
    var tryingToFindValidMove = true;
    while (true) {
        xCordinate = Math.floor((Math.random() * 10));
        yCordinate = Math.floor((Math.random() * 10));
        if(cpuGrid[xCordinate][yCordinate] === "2" || cpuGrid[xCordinate][yCordinate] === "3" ){
            continue;
        }else if(cpuGrid[xCordinate][yCordinate] === "-1"){
              cpuGrid[xCordinate][yCordinate] = "2";
            drawGrid(cpuGrid, OFFSET);
            return;
          
        }else{
            cpuGrid[xCordinate][yCordinate] = "3";
            drawGrid(cpuGrid, OFFSET);
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
    } else if (cpuGrid[x][y] === "-1") { //Player has hit ship
        cpuGrid[x][y] = "2";
        drawGrid(cpuGrid, OFFSET);
    }

    //Checking the board for any ships left to see if the game is over
    if (didUserWin() === true) {
        console.log("you won")
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
            if (userGrid[i][j] === "-1") {
                return false;
            }
        }
    }
    return true;
}

function  randomizeComputerShips() {

    xCordinate = 0;
    yCordinate = 0;
    verticalOrHorizontal = 0;
    placeingShip = true;
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
                            console.log(xCordinate + ", " + yCordinate);
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



