$(document).ready(function () {
    var socket = io();
    Input.initialize(socket);

    var username = localStorage.getItem("username");
    if(username){
      login(username);
    }

    function register(username){
      localStorage.setItem("username",username);
      socket.emit('register', username);
    }

    function login(username){
      localStorage.setItem("username",username);
      console.log("HELlo")
      socket.emit('login', username);
    }

    function logout(){
      var username = localStorage.getItem("username");
      socket.emit('logout', username);
    }

    $("#logout-btn").click(function(){
      logout();
    });

    $('#register-form > .register-btn').click(function() {
      var username = $('#username').val();
      register(username);
    });

    $('#register-form > .login-btn').click(function() {
      var username = $('#username').val();
      login(username);
    });

    socket.on('scoreboard', function (message) {
        $('#scoreboard').html(Scoreboard.update(message));
    });

    socket.on('lives', function (message) {
         $('#lives').width(message + "%");
     });

    socket.on('enemies', function (message) {
        Display.setEnemies(message);
    });

    socket.on('map', function (message) {
        Display.setTowers(message);
        fadeInBoard();
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

    socket.on('unauthorized',function(){
      localStorage.removeItem('username');
      fadeOutBoard();
    })

    socket.on('loggedOut',function(){
      localStorage.removeItem("username")
      fadeOutBoard();
    });

    socket.on('shoot', function (message) {
        Display.shoot(message);
    })
});



function fadeOutBoard(){
  $('#playarea').fadeOut(1000, function() {
    $('#loginform').fadeIn(1000);
  });
}

function fadeInBoard() {
    $('#loginform').fadeOut(1000, function() {
        $('#playarea').fadeIn(1000);
    });
    //Display.setTowers([{x:6, y:6}]);
    //setInterval(function() {Display.shoot({enemy: {x: Math.random() * 10,y: Math.random() * 10}, tower:{x: 6, y: 6}})}, 800);
    setInterval(Display.draw, 100);
}
