var pather = require('../modules/pather');

module.exports = function(io) {

  var config = require('../config.json');
 // var display = require('../public/javascripts/display.js');
  pather.initialize(config.enemyPath);
  var roundNum = 0;
  var difficulty = 1;
  var player = [];
  var enemy = [];
  var tower = [];
  var wait = 0;
  var enemiesPushed = 0;
  var lives = config.lives;

  /*
  tower: owner, x, y, range, damage, level
  */


  io.on('connection', function(socket){

    console.log('New user connected');


    socket.on('register', function(username){
      for (var i = player.length - 1; i >= 0; i--) {
          if(player[i].username === username){
            socket.emit('message', "Ne lopd más személyazonosságát!");
            socket.disconnect();
            console.log("User disconnected");

            return;
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
      io.emit('map', tower);
      socket.emit('path', pather.getPathTiles());
    });

    socket.on('action', function(x, y){
      var isNewTower = true;
      for (var i = 0; i < player.length; i++) {
        if(player[i].username==socket.username){
          if(config.towercost <= player[i].money){
             tower.forEach(function(t){
              if(t.x == x && t.y == y){
                if(t.owner == socket.username){

                  player[i].money -= config.towercost;
                  t.level += 1;
                  t.range += 1;
                  t.damage += 1;
                  console.log('Tower level up ' + socket.username);
                  socket.emit('message', "Nagyobb lett");
                }
                isNewTower = false;
              }
            });

            if(isNewTower){
              player[i].money -= config.towercost;
              tower.push({
                x: x,
                y: y,
                owner: socket.username,
                range: config.range,
                damage: config.damage,
                level: 1
              });
              console.log('New tower ' + socket.username);
              socket.emit('message', "Új tornyod van");
            }
          }
          else{
            socket.emit('message', "Csóró vagy :(");
          }

        }
      }

      io.emit('map', tower);
    });

  });

    setInterval(function(){
        io.emit('scoreboard', player);
    }, 1000);

    var sendEnemies = setInterval(function(){
      enemy.forEach(function(e){

        e.age += 0.05;
        var position = pather.calculatePosition(e.age);
        e.x = position.x;
        e.y = position.y;
        e.facing = position.facing;
        //A magic konstans a canvas mérete az index.html fájlból (500), 
        //a display.js translate függvényének inverze alkalmazása után => 10.5
        //Ha van valami szebb módja, hogy a node hogyan tudja DOM-ból, vagy valahonnan elkérni
        //akkor szóljatok
        if(e.x >= 10.5){
          removeEnemy(e);
           lives--;
           io.emit('message', "Vesztettetek egy életet :( Hátralévő életek száma:" + lives);
           if(lives <=0){
            //Ez valszeg lehetne egy külön esemény is
            io.emit('message', "Game over :(");
           }
       }
        

      });
      io.emit('enemies', enemy);
    }, 50);

    setInterval(function() {
      for (var i = 0; i < tower.length; i++){
        enemy.some(function(e){
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
              removeEnemy(e);
            }
            io.emit('shoot', {tower:tower[i],enemy:e}) ;
                return true;
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
              age: 0,
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

    function removeEnemy(e){
        for (var k = enemy.length - 1; k >= 0; k--) {
                if(enemy[k] === e){
                  enemy.splice(k,1);
                  return;
                }
              }
    }

}
