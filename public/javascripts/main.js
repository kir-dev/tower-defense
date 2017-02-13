$(document).ready(function () {
    var socket = io();
    Input.initialize(socket);

    $('#register-form').submit(function() {
        socket.emit('register', $('#username').val());
        fadeInBoard();
        return false;
    });

    socket.on('scoreboard', function (message) {
        $('#scoreboard').html(Scoreboard.update(message));
    });

    socket.on('enemies', function (message) {
        Display.setEnemies(message);
    });

    socket.on('map', function (message) {
        Display.setTowers(message);
    });

    socket.on('path', function (message) {
        Display.setPath(message);
    });

    socket.on('message', function (message) {
        $('#alert-message').text(message);
        $('#alert-message').show(function() {
            $('#alert-message').fadeOut(3000);
        });
    });

    socket.on('shoot', function (message) {
        Display.shoot(message);
    })
});

function fadeInBoard() {
    $('#loginform').fadeOut(1000, function() {
        $('#playarea').fadeIn(1000);
    });
    //Display.setTowers([{x:6, y:6}]);
    //setInterval(function() {Display.shoot({enemy: {x: Math.random() * 10,y: Math.random() * 10}, tower:{x: 6, y: 6}})}, 800);
    setInterval(Display.draw, 100);
}
