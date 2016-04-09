/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var canvas, context;
var squareHeight, squareWidth;

var ship = {
    
}

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

function handleClick(e) {
    // Since in Firefox e.offsetX/Y is undefined...
    xpos = e.offsetX === undefined ? e.layerX : e.offsetX;
    ypos = e.offsetY === undefined ? e.layerY : e.offsetY;

    //document.write("<h1>"+canvas.getBoundingClientRect().top+"</h1>");
    xCoord = Math.floor((xpos - canvas.getBoundingClientRect().left) / 50) * 50;
    yCoord = Math.floor((ypos - canvas.getBoundingClientRect().top) / 50) * 50;
    context.fillStyle = "red";
    context.fillRect(xCoord, yCoord, squareWidth, squareHeight);
    context.strokeRect(xCoord, yCoord, squareWidth, squareHeight);
}

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


