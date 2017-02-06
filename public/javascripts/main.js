$(document).ready(function () {
    Input.initialize();
    var socket = io();

    $('#register-form').submit(function() {
        socket.emit('register', $('#username').val());
        fadeInBoard();
        return false;
    });

    socket.on('scoreboard', function (message) {
        $('#scoreboard').text(Scoreboard.update(message));
    });

    socket.on('enemies', function (message) {
        Display.setEnemies(message);
    });

    socket.on('map', function (message) {
        Display.setTowers(message);
    });

    socket.on('message', function (message) {
        $('alert-message').text(message);
    })
});

function fadeInBoard() {
    $('#loginform').fadeOut(1000, function() {
        $('#playarea').fadeIn(1000);
    });
    setInterval(Display.draw, 100);
}
