module.exports = function(io) {

  var config = require('../config.json');
  var waveNum = 0;
  var player = [];
  var enemy = [];


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

   // socket.on

    setInterval(function(){
        io.emit('scoreboard', player);
    }, 1000);

    var sendEnemies = setInterval(function(){
       // forEach(e in enemy){
          //TODO enemy mozgatása
        //  forEach(p in player){
         //   forEach(t in p.tower){
        //        var isInRange = e.x
        //        if(){

        //        }
        //    }
        //  }          
       // }
        io.emit('enemy', enemy);
    }, 500);

    //New enemy
    var enemyTimer = setInterval(function(){
        var newEnemy = {
          created: Date.getTime(),
          x: config.entry_point.x,
          y: config.entry_point.y,
          health: 100
        };
        enemy.push(newEnemy);
        io.emit('newenemy', newEnemy)
    }, 1000);

  });
}
