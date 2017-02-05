$(document).ready(function () {
	var socket = io();

	$('#register-form').submit(function() {
		socket.emit('register', $('#username').val());
		fadeInBoard();
		return false;
	});

	socket.on('scoreboard', function (message) {
		$('#scoreboard').text(stringifyScoreboard(message));
		console.log(stringifyScoreboard(message));
	});

	socket.on('addenemy', function (message) {
		Game.addEnemy(message);
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

	module.setTowers = function (enemy) {
		enemies.push(enemy);
	}

	module.draw = function () {
		var canvas = document.getElementById('playcanvas');
		var context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);
		enemies.forEach(function (enemy) {
			context.drawImage(imageCache.greenplane, (new Date() - enemy.created) / 30, 118);
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

	return module;
})();
