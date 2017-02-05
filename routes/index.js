var express = require('express');
var router = express.Router();
var http = require('http').createServer();
var io = require('socket.io')(http);
var config = require('../config.json');

var player = [];
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index');
  res.sendFile('index.html');
});

io.on('connection', function(socket){

  console.log('New user connected');

  socket.on('register', function(username){
    player.push({
      username: username,
      point: 0,
      money: config.money,
      tower: array()
    });
    console.log('New player' + username);
    socket.broadcast.emit('New player: ' + username);
  });

  setInterval(function(){
      socket.broadcast.emit('scoreboard', player);
  }, 1000);

});





module.exports = router;
