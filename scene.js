var canvas = document.getElementById("drawing");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var sizeX = 30;
var sizeY = 15;

var gridWidth = 30;
var gridHeight = 30;

// Which grid your mouse is in now
var xGrid = 0;
var yGrid = 0;

var drawPathCount = 0;
var pathChanged = true;

function fillGrid(x, y, color) {
    context.fillStyle = color || "#1fa";
    context.fillRect(x * (gridWidth+1), y * (gridHeight + 1), gridWidth+1, gridHeight +1);
}

var map = new Graph(sizeX, sizeY);
var mapState = [];
for (var i = 0; i < sizeX; i++) {
    mapState[i] = [];
    for (var j = 0; j < sizeY; j++) {
        mapState[i][j] = 0;
    }
}

//var walls = [[1, 7], [1, 8],
//    [2, 7], [2, 8],
//    [3, 7], [3, 8],
//    [0,0],
//    [6,2], [6,3], [6,4]];
var walls =[[4, 3],[4, 4],[4, 5],[4, 6],[4, 7],[4, 8],[4, 9],[4, 10],[4, 11],[4, 12],[4, 2],
    [5, 2],[6, 2],[7, 2],[8, 2],[9, 2],[9, 3],[9, 4],[9, 5],[9, 6],[8, 7],[7, 7],[6, 7],
    [5, 7],[9, 7],[9, 8],[9, 9],[9, 10],[9, 11],[9, 12],[8, 12],[7, 12],[6, 12],[5, 12],
    [13, 2],[14, 2],[15, 2],[16, 2],[17, 2],[18, 2],[13, 3],[13, 4],[13, 5],[13, 6],
    [13, 7],[13, 8],[13, 9],[13, 10],[13, 11],[13, 12],[14, 7],[15, 7],[16, 7],[17, 7],
    [18, 7],[22, 2],[23, 2],[24, 2],[25, 2],[26, 2],[27, 2],[22, 3],[22, 4],[22, 5],
    [22, 6],[22, 7],[23, 7],[24, 7],[25, 7],[26, 7],[27, 7],[27, 8],[27, 9],[27, 10],
    [27, 11],[26, 12],[27, 12],[25, 12],[24, 12],[23, 12],[22, 12]
];
for (i = 0; i < walls.length; i++) {
    map.walls.push(walls[i]);
    mapState[walls[i][0]][walls[i][1]] = 1;
}

drawWalls();

function drawWalls() {
    for (i = 0; i < map.walls.length; i++) {
        fillGrid(map.walls[i][0], map.walls[i][1], "#808080");
    }
}

var target = [0, 1];
var begin = [20, 12];

var moveState = 0;

var search1 =new BreadthFirstSearch(map, target);
var path1 = search1.findPath(begin);
pathChanged = true;
drawPath(path1);


function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle = "#d0d0d0";
    // Draw vertical lines
    for (var i = 0; i < sizeX + 1; i++) {
        context.moveTo(i * (gridWidth + 1), 0);
        context.lineTo(i * (gridWidth + 1), sizeY * (gridHeight + 1));
    }
    context.stroke();

    // Draw horizontal lines
    for (i = 0; i < sizeY + 1; i++) {
        context.moveTo(0, i * gridWidth + i);
        context.lineTo(sizeX * (gridWidth + 1), i * gridWidth + i);
    }
    context.stroke();
}


function mouseDown(e) {

    if (xGrid < sizeX && yGrid < sizeY) {

        if (begin[0] === xGrid && begin[1] === yGrid) {
            moveState = 1;      // Change begin (green) point's position
        } else if (target[0] === xGrid && target[1] === yGrid) {
            moveState = 2;      // Change target (red) point's position
        } else if (map.walls.hasArray([xGrid, yGrid])) {
            moveState = 3;      // Turn walls to blank
        } else {
            moveState = 4;      // Turn blank to walls
        }
    }
}


// TODO: Not finished
function mouseClick(e) {

    //if (xGrid < sizeX && yGrid < sizeY) {
    //
    //    if (begin[0] === xGrid && begin[1] === yGrid) {
    //        moveState = 1;      // Change begin (green) point position
    //    } else if (target[0] === xGrid && target[1] === yGrid) {
    //        moveState = 2;      // Change target (red) point position
    //    } else if (map.walls.hasArray([xGrid, yGrid])) {
    //        moveState = 3;      // Turn walls to blank
    //    } else {
    //        moveState = 4;      // Turn blank to walls
    //    }
    //}
}


function mouseUp(e) {
    moveState = 0;  // move and do nothing
}

function mouseMove(e) {
    var mouseX, mouseY;

    if(e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if(e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    // Calculate which grid mouse is in
    xGrid = Math.floor(mouseX / (gridWidth+1));
    yGrid = Math.floor(mouseY / (gridHeight+1));
    if (xGrid < sizeX && yGrid < sizeY) {
        if (moveState === 0) {
            return;
        } else if (moveState === 1) {
            begin = [xGrid, yGrid];
            search1 = new BreadthFirstSearch(map, target);
            path1 = search1.findPath(begin);
        } else if (moveState === 2) {
            target = [xGrid, yGrid];
            search1 = new BreadthFirstSearch(map, target);
            path1 = search1.findPath(begin);
        }


        else if (moveState === 3) {   // Turn walls to blank
            map.walls.removeArray([xGrid, yGrid]);
            mapState[xGrid][yGrid] = Math.abs(mapState[xGrid][yGrid] - 1);
        } else if (moveState === 4) {
            if (!map.walls.hasArray([xGrid, yGrid])) {
                map.walls.push([xGrid, yGrid]);
                mapState[xGrid][yGrid] = Math.abs(mapState[xGrid][yGrid] - 1);
            }
        }
        search1 = new BreadthFirstSearch(map, target);
        if (search1.came_from[begin[0]][begin[1]] === null) {
            path1 = [];
            pathChanged = true;
        } else {
            path1 = search1.findPath(begin);
            pathChanged = true;
        }
        //console.log(map.walls.length);
    }
}


function drawPath(path) {

    for (i = 0; i < path.length; i++) {
        fillGrid(path[i][0], path[i][1], "#98fb98");
    }

}

function drawPathAnimation(path) {

    if (drawPathCount >= path.length) {
        drawPathCount = 0;
        pathChanged = false;
    } else {
        drawPathCount ++;
        for (i = 0; i < drawPathCount; i++) {
            fillGrid(path[i][0], path[i][1], "#98fb98");
        }
    }
}


requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000/30);
        };
})();
requestAnimationFrame(draw);

function draw() {
    requestAnimationFrame(draw);

    drawBoard();

    drawWalls();
    if (path1 !== [] && moveState === 0) {
        //if (drawPathCount === path1.length) {
        //    drawPath(path1);
        //} else {
        //    drawPathAnimation(path1);
        //}
        if (pathChanged ) {
            drawPathAnimation(path1);
        }
        else {
            drawPath(path1);
        }
    }
    fillGrid(target[0], target[1], "#ee4400");
    fillGrid(begin[0], begin[1], "green");
}

function printWallsPos() {
    var posInfo = "";
    for (i = 0; i < map.walls.length; i++) {
        posInfo += "[" + map.walls[i][0] + ", " + map.walls[i][1] + "],";
    }
    console.log(posInfo);
}