$(document).ready(function () {
	var socket = io();

	$('#register-form').submit(function() {
		socket.emit('register', $('username').val());
		return false;
	});

	socket.on('scoreboard', function(message) {
		$('scoreboard').innerText = stringifyScoreboard(message);
		console.log(message);
	});
});

function fadeInBoard() {
	$('#loginform').fadeOut(1000);
	setTimeout(function() {
		$('#playarea').fadeIn(1000);
	}, 1000);
}

function stringifyScoreboard(message) {
	var scoreboardText = "";
	message.forEach(function(user) {
		scoreboardText = scoreboardText + "\n" 
		+ user.username + ": " + user.point + " pont, " + user.money + "$";
	});
}