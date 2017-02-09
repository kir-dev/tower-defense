var Display = (function() {
    var module = {};

    var enemies = [];
    var towers = [];
    var imageCache = {};
    var shots = [];

    module.setEnemies = function (message) {
        enemies = message;
    }

    module.setTowers = function (message) {
        towers = message;
    }

    module.shoot = function (message) {
        getTowerAt(message.tower.x, message.tower.y).target = {x: message.enemy.x, y: message.enemy.y};
        shots.push(message);
    }

    module.draw = function () {
        var canvas = document.getElementById('playcanvas');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.beginPath();
        // draw vertical lines
        for (var x = 0; x <= canvas.width; x += 50) {
            context.moveTo( 0.5 + x, 0 );
            context.lineTo( 0.5 + x, canvas.height);
        }

        // draw horizontal lines
        for (var y = 0; y <= canvas.height; y += 50) {
            context.moveTo( 0.5, 0.5 + y);
            context.lineTo( canvas.width, 0.5 + y);
        }

        context.strokeStyle = "grey";
        context.stroke();

        enemies.forEach(function (enemy) {
            context.drawImage(imageCache.greenplane, translate(enemy.x), translate(enemy.y));
        });
        towers.forEach(function (tower) {
            if(tower.target) {
                tower.angle = Math.atan2(tower.y - tower.target.y, tower.x - tower.target.x) - Math.PI / 2;
            }
            rotateAndPaintImage(context, imageCache.doublerocket, tower.angle, translate(tower.x), translate(tower.y), 32, 32);
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
        return (coord - 0.5) * 50 - 32;
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
    cacheImage('doublerocket', 206);

    return module;
})();
