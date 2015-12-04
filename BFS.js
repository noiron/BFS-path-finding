function Graph(w, h) {
    this.width = w;
    this.height = h;
    this.walls = [];

}

/**
 * @param id: [x, y]
 * @returns {boolean}
 */
Graph.prototype.inBounds = function(id) {

    return (0 <= id[0] && id[0]< this.width &&
        0 <= id[1] && id[1] < this.height);
};

Graph.prototype.passable = function(id) {

    for (var i = 0; i < this.walls.length; i++) {
        if (this.walls[i][0] === id[0] && this.walls[i][1] === id[1]) {
            return false;
        }
    }
    return true;
};

Graph.prototype.neighbors = function(id) {
        var x = id[0];
        var y = id[1];
        var results = [[x+1, y], [x,y-1], [x-1,y], [x,y+1]];

        results = results.filter(this.passable, this);
        results = results.filter(this.inBounds, this);
        return results;
    };

Graph.prototype.print = function() {
    var info = "";
    for (var j = 0; j < this.height; j++) {
        for (var i = 0; i < this.width; i++) {
            if (this.walls.hasArray([i, j])) {
                info += "#";
            }
            else {
                info += ".";
            }
        }
        info += "\n";
    }
    console.log(info);
};

function Queue() {
    this.elements = [];

    this.empty = function() {
        return elements.length === 0;
    };

    this.put = function(x) {
        this.elements.push(x);
    };

    this.get = function() {
        return this.elements.shift();
    };
}

function BreadthFirstSearch(graph, start) {
    this.graph = graph;
    this.width = graph.width;
    this.height = graph.height;
    this.start = start;

    var frontier = new Queue;
    frontier.put(start);

    var visited = [start];

    this.came_from = [];

    for (var i = 0; i < this.width; i++) {
        this.came_from[i] = [];
        for (var j = 0; j < this.height; j++) {
            this.came_from[i][j] = null;
        }
    }

    this.distance = [];
    for (i = 0; i < this.width; i++) {
        this.distance[i] = [];
        for (j = 0; j < this.height; j++) {
            this.distance[i][j] = -1;
        }
    }

    var current;
    var curNeighbors = [];

    while (frontier.elements.length !== 0) {
        current = frontier.get();
        // console.log(current[0], current[1]);

        curNeighbors = graph.neighbors(current);
        for (i = 0; i < curNeighbors.length; i++) {
            var next = curNeighbors[i];
            if (! visited.hasArray(next)) {
                frontier.put(next);
                visited.push(next);
                this.came_from[next[0]][next[1]]= current;
                this.distance[next[0]][next[1]] = this.distance[current[0]][current[1]] + 1;
            }
        }
    }
}

BreadthFirstSearch.prototype.showPath = function(id) {
    var info = "";
    for (var j = 0; j < this.height; j++) {
        for (var i = 0; i < this.width; i++) {
            if (this.graph.walls.hasArray([i, j])) {
                info += "#\t\t";
            }
            else {
                info += this.came_from[i][j]+"\t\t";
            }
        }
        info += "\n";
    }
    console.log(info);
};

BreadthFirstSearch.prototype.showDistance = function() {
    var info = "";
    for (var j = 0; j < this.graph.height; j++) {
        for (var i = 0; i < this.graph.width; i++) {
            if (this.graph.walls.hasArray([i, j])) {
                info += "#\t";
            }
            else {
                info += this.distance[i][j]+"\t";
            }
        }
        info += "\n";
    }
    console.log(info);
};

// This path includes both start and end point
BreadthFirstSearch.prototype.findPath = function(id) {
    var ret = [];
    var curX = id[0];
    var curY = id[1];
    if (this.came_from[curX][curY] === null) {return [];}
    ret.push(id);
    while(curX !== this.start[0] || curY !== this.start[1]) {
        var x = this.came_from[curX][curY][0];
        var y = this.came_from[curX][curY][1];
        ret.push([x, y]);
        curX = x;
        curY = y;
    }
    return ret;
};

Array.prototype.hasArray = function(arr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][0] === arr[0] && this[i][1] === arr[1]) {
            return true;
        }
    }
    return false;
};

Array.prototype.removeArray = function(arr) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][0] === arr[0] && this[i][1] === arr[1]) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};

g = new Graph(10, 10);
var walls = [[1, 7], [1, 8], [2, 7], [2, 8], [3, 7], [3, 8], [0,0],[6,2],
            [6,3], [6,4]];
for (var i = 0; i < walls.length; i++) {
    g.walls.push(walls[i]);
}
g.print();

//var bfs =new BreadthFirstSearch(g, [5,8]);
//bfs.showDistance();
//bfs.showPath();
//var path11 = bfs.findPath([1,1]);
