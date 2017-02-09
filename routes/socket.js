module.exports = function(io) {

  var config = require('../config.json');
  var roundNum = 0;
  var difficulty = 1;
  var player = [];
  var enemy = [];
  var tower = [];
  var wait = 0;
  var enemiesPushed = 0;

  /*
  tower: owner, x, y, range, damage, level
  */


  io.on('connection', function(socket){

    console.log('New user connected');


    socket.on('register', function(username){
      for (var i = player.length - 1; i >= 0; i--) {
          if(player[i].username === username){
            io.emit('message', "Ne lopd más személyazonosságát!");
            socket.disconnect();
            console.log("User disconnected");
            
            
          }   
      }
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
            io.emit('message', "Csóró vagy :(");
          }
          
        }
      }

      socket.broadcast.emit('map', tower);
    });

  });

    setInterval(function(){
        io.emit('scoreboard', player);
    }, 1000);

    var sendEnemies = setInterval(function(){
      enemy.forEach(function(e){

        e.x += 0.05;
        //TODO enemy mozgatása

      });
      io.emit('enemies', enemy);
    }, 50);

    setInterval(function() {
      for (var i = 0; i < tower.length; i++){
        enemy.forEach(function(e){
          var isInRange = Math.sqrt( (e.x-tower[i].x)*(e.x-tower[i].x) + (e.y-tower[i].y)*(e.y-tower[i].y) ) < tower[i].range;
          if(isInRange){
            for (var j = 0; j < player.length; j++){
              if(player[j].username==tower[i].owner){
                player[j].money += tower[i].damage;
                player[j].point += tower[i].damage;
              }
            }
            e.health -= tower[i].damage;
            if(e.health <= 0){
              for (var k = enemy.length - 1; k >= 0; k--) {
                if(enemy[k] === e){
                  enemy.splice(k,1);
                  break;
                }
              }
            }
            io.emit('shoot', {tower:tower,enemy:e}) ;
                return;
           // console.log("Enemy is in range");
          }
          
        });
      }
    }, 1000);

    //New enemy
    var enemyTimer = setInterval(function(){
        if(player.length > 0){
          roundNum++;
          if(roundNum % 10 == 0){
            difficulty++;
          }
          if(wait == 0){

            var newEnemy = {
              created: new Date(),
              x: config.entry_point.x,
              y: config.entry_point.y,
              health: 100 + difficulty
            };
            enemy.push(newEnemy);
            enemiesPushed ++;
            io.emit('newenemy', newEnemy);
            if(enemiesPushed == (difficulty*player.length)){
              enemiesPushed = 0;
              wait+= config.waitTime;
            }
          }else{
            wait--;
          }
        }

    }, 1000);

}
