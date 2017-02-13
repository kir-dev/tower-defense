
// Path format is: [{x: , y: }, {x: , y: }, ...]
exports.initialize = function (path) {
    for(var i = 0; i < path.length - 1; i++) {
        if(i == 0) {
            path[i].start = 0;
        } else {
            path[i].start = path[i - 1].start + 
                Math.abs(path[i - 1].x - path[i].x) + 
                Math.abs(path[i - 1].y - path[i].y);
        }
        path[i].length = distanceBetween(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
    }
    this.path = path;
}

// Gets the current position {x: , y: } of the enemy from the distance
// travelled from the entry point
exports.calculatePosition = function (distance) {
    for(var i = this.path.length - 2; i >= 0; i--) {
        if(distance >= this.path[i].start) {
            var scaledDistance = (distance - this.path[i].start) / this.path[i].length;
            var position = lerp(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y, scaledDistance);
            position.facing = getFacing(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y);
            return position;
        }
    }
}

// Returns each road-tile in the format of: [{x:, y: }, {x: , y: }, ...]
exports.getPathTiles = function () {
    var tiles = [];
    for(var i = 0; i < this.path.length - 1; i++) {
        for(var j = 0; j <= this.path[i].length; j++) {
            tiles.push(lerp(this.path[i].x, this.path[i].y, this.path[i + 1].x, this.path[i + 1].y, j / this.path[i].length));
        }
    }
    return tiles;
}

function getFacing(x1, y1, x2, y2) {
    if(x1 < x2) {
        return "right";
    } else if(x2 < x1) {
        return "left";
    } else if(y1 < y2) {
        return "down";
    } else if(y2 < y1) {
        return "up";
    }
}

// Linear interpolation
function lerp(x1, y1, x2, y2, t) {
    return {x: (x1 + t * (x2 - x1)), y: (y1 + t * (y2 - y1))};
}

function distanceBetween(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
