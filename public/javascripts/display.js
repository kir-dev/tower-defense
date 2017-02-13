var Display = (function() {
    var module = {};

    var enemies = [];
    var towers = [];
    var imageCache = {};
    var shots = [];
    var path = [];

    module.setEnemies = function (message) {
        enemies = message;
    }

    module.setTowers = function (message) {
        towers = message;
    }

    module.setPath = function (message) {
        path = message;
    }

    module.shoot = function (message) {
        getTowerAt(message.tower.x, message.tower.y).target = {x: message.enemy.x, y: message.enemy.y};
        shots.push(message);
    }

    module.draw = function () {
        var canvas = document.getElementById('playcanvas');
        var context = canvas.getContext('2d');
        var username = localStorage.getItem("username");

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        // draw vertical lines
        for (var x = 0; x <= canvas.width; x += 64) {
            context.moveTo( 0.5 + x, 0 );
            context.lineTo( 0.5 + x, canvas.height);
        }

        // draw horizontal lines
        for (var y = 0; y <= canvas.height; y += 64) {
            context.moveTo( 0.5, 0.5 + y);
            context.lineTo( canvas.width, 0.5 + y);
        }

        context.strokeStyle = "grey";
        context.stroke();


        path.forEach(function (pathElement) {
            context.drawImage(imageCache.ground, translateImage(pathElement.x), translateImage(pathElement.y));
        })

        // draw enemies
        enemies.forEach(function (enemy) {
            rotateAndPaintImage(context, imageCache.greenplane, facingToAngle(enemy.facing), translate(enemy.x), translate(enemy.y), 32, 32);
        });
        towers.forEach(function (tower) {
            if(tower.target) {
                tower.angle = Math.atan2(tower.y - tower.target.y, tower.x - tower.target.x) - Math.PI / 2;
            }
            var imageName = 'rocket' + (tower.level<4 ? tower.level : '4');

            rotateAndPaintImage(context, imageCache[ (tower.owner == username ? imageName : imageName + 'Own')], tower.angle, translate(tower.x), translate(tower.y), 32, 32);
        });
        shots.forEach(function (shot) {
            context.beginPath();
            context.moveTo(translate(shot.tower.x), translate(shot.tower.y));
            context.lineTo(translate(shot.enemy.x), translate(shot.enemy.y));
            context.strokeStyle = '#ff0000';
            context.stroke();
        });
        shots = [];
    }

    function translate (coord) {
        return (coord - 0.5) * 64;
    }

    function translateImage (coord) {
        return (coord - 0.5) * 64 - 32;
    }

    function getTowerAt(x, y) {
        var ret = null;
        towers.forEach(function (tower) {
            if(tower.x === x && tower.y === y) {
                ret = tower;
            }
        });
        return ret;
    }

    function facingToAngle(facing) {
        if(facing == "right") {
            return 0;
        } else if(facing == "left") {
            return Math.PI;
        } else if(facing == "down") {
            return Math.PI / 2;
        } else if(facing == "up") {
            return 3 * Math.PI / 2;
        }
    }

    function rotateAndPaintImage (context, image, angleInRad , positionX, positionY, axisX, axisY) {
        context.translate(positionX, positionY);
        context.rotate(angleInRad);
        context.drawImage(image, -axisX, -axisY);
        context.rotate(-angleInRad);
        context.translate(-positionX, -positionY);
    }

    function cacheImage(name, tileId) {
        var imageObj = new Image();
        imageObj.src = 'images/game/towerDefense_tile' + tileId + '.png';
        imageObj.onload = function() {
            imageCache[name] = imageObj;
        };
    }

    cacheImage('greenplane', 270);
    cacheImage('rocket1', 206);
    cacheImage('rocket1Own','206_own');
    cacheImage('rocket2', 205);
    cacheImage('rocket2Own','205_own');
    cacheImage('rocket3', 249);
    cacheImage('rocket3Own','249_own');
    cacheImage('rocket4', 250);
    cacheImage('rocket4Own','250_own');
    cacheImage('ground', '055');

    return module;
})();
