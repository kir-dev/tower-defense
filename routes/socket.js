module.exports = function(io) {

  var config = require('../config.json');
  var waveNum = 0;
  var player = [];
  var enemy = [];
  var tower = [];

  /*
  tower: owner, x, y, range, damage, level
  */


  io.on('connection', function(socket){

    console.log('New user connected');

    socket.on('register', function(username){
      socket.username = username;
      player.push({
        username: username,
        point: 0,
        money: config.money
      });
      console.log('New player' + username);
      socket.broadcast.emit('New player: ' + username);
    });

    socket.on('action', function(x, y){
      var isNewTower = true;
      for (var i = 0; i < player.length; i++) {
        if(player[i].username==socket.username){
          if(config.towercost <= player[i].money){
             tower.forEach(function(t){
              if(t.x == x && t.y == y){
                t.level += 1;
                t.range += 1;
                t.damage += 1;
                console.log('Tower level up ' + socket.username);
                io.emit('message', "Nagyobb lett");
                isNewTower = false;
              }
            });

            if(isNewTower){
              tower.push({
                x: x,
                y: y,
                owner: socket.username,
                range: config.range,
                damage: config.damage,
                level: 1
              });
              console.log('New tower ' + socket.username);
              io.emit('message', "Új tornyod van");
            }
            player[i].money -= config.towercost;
          }
          else{
            io.emit('message', "Csoró vagy :(");
          }
          break;
        }
      }

      io.emit('map', tower);
    });


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
        io.emit('enemies', enemy);
    }, 500);

    //New enemy
    var enemyTimer = setInterval(function(){
        var newEnemy = {
          created: new Date(),
          x: config.entry_point.x,
          y: config.entry_point.y,
          health: 100
        };
        enemy.push(newEnemy);
        console.log("New enemy sent");
        io.emit('newenemy', newEnemy);
    }, 1000);

  });
}
