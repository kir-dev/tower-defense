$(document).ready(function () {
	var socket = io();

	$('#register-form').submit(function() {
		socket.emit('register', $('#username').val());
		fadeInBoard();
		return false;
	});

	var elem = document.getElementById('playcanvas'),
	elemLeft = elem.offsetLeft,
	elemTop = elem.offsetTop;
	elem.addEventListener('click', function(event) {
	    var x = event.pageX - elemLeft,
	        y = event.pageY - elemTop;
	    socket.emit('action', decideClick(x), decideClick(y));
    });

	socket.on('scoreboard', function (message) {
		$('#scoreboard').text(stringifyScoreboard(message));
		console.log(stringifyScoreboard(message));
	});

	socket.on('enemies', function (message) {
		//message.created = new Date(message.created);
		console.log(message);
		Game.setEnemies(message);
	});

	socket.on('map', function (message) {
		console.log(message);
		Game.setTowers(message);
	});
});

function fadeInBoard() {
	$('#loginform').fadeOut(1000, function() {
		$('#playarea').fadeIn(1000);
	});
	setInterval(Game.draw, 100);
}

function stringifyScoreboard(message) {
	var scoreboardText = "";
	message.forEach(function(user) {
		scoreboardText = scoreboardText + "\n" 
		+ user.username + ": " + user.point + " pont, " + user.money + "$";
	});
	return scoreboardText;
}

var Game = (function() {
	var module = {};

	var enemies = [];
	var towers = [];
	var imageCache = {};
	
	module.addEnemy = function (enemy) {
		enemies.push(enemy);
	}

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

function translate (coord) {
	return (coord - 0.5) * 50 - 32;
}

function decideClick (coord) {
	var worldCoord = coord / 50 + 0.5;
	return Math.round(worldCoord);
}
