var Display = (function() {
    var module = {};

    var enemies = [];
    var towers = [];
    var imageCache = {};

    module.setEnemies = function (message) {
        enemies = message;
    }

    module.setTowers = function (message) {
        towers = message;
    }

    module.draw = function () {
        var canvas = document.getElementById('playcanvas');
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);
        enemies.forEach(function (enemy) {
            context.drawImage(imageCache.greenplane, translate(enemy.x), translate(enemy.y));
        });
        towers.forEach(function (tower) {
            context.drawImage(imageCache.doublerocket, translate(tower.x), translate(tower.y));
        });
    }

    function translate (coord) {
        return (coord - 0.5) * 50 - 32;
    }

    function cacheImage(name, tileId) {
        var imageObj = new Image();
        imageObj.src = 'images/game/towerDefense_tile' + tileId + '.png';
        imageObj.onload = function() {
            imageCache[name] = imageObj;
        };
    }

    cacheImage('greenplane', 270);
    cacheImage('doublerocket', 205);

    return module;
})();
