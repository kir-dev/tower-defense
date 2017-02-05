module.exports = function(io) {

  var config = require('../config.json');
  var player = [];

  io.on('connection', function(socket){

    console.log('New user connected');

    socket.on('register', function(username){
      player.push({
        username: username,
        point: 0,
        money: config.money,
        tower: []
      });
      console.log('New player' + username);
      socket.broadcast.emit('New player: ' + username);
    });

    setInterval(function(){
        socket.broadcast.emit('scoreboard', player);
    }, 1000);

  });
}
