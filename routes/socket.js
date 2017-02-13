var pather = require('../modules/pather');

module.exports = function(io) {

  var config = require('../config.json');
 // var display = require('../public/javascripts/display.js');
  pather.initialize(config.enemyPathChoices[decideMap()]);
  var roundNum = 0;
  var difficulty = 1;
  var player = [];
  var enemy = [];
  var tower = [];
  var wait = 0;
  var enemiesPushed = 0;
  var lives = config.lives;

  function initializeGame(){
    roundNum = 0;
    difficulty = 1;
    player = [];
    enemy = [];
    tower = [];
    wait = 0;
    enemiesPushed = 0;
    lives = config.lives;
    console.log("Game initialized")
  }
  /*
  tower: owner, x, y, range, damage, level
  */


  io.on('connection', function(socket){

    console.log('New user connected');


    socket.on('register', function(username){
      for (var i = player.length - 1; i >= 0; i--) {
          if(player[i].username === username){
            socket.emit('message', "Ne lopd más személyazonosságát!");
            socket.emit("unauthorized")
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

    socket.on('login', function(username) {
      for (var i = player.length - 1; i >= 0; i--) {
          if(player[i].username == username){
            socket.username = username;
            socket.broadcast.emit('Player logged in' + username);
            io.emit('map', tower);
            console.log("user found")
            return;
          }
      }
      console.log("user not found")
      socket.emit('unauthorized');
    });

    socket.on('logout', function(username) {
      for (var i = player.length - 1; i >= 0; i--) {
          if(player[i].username == username){
            tower.slice().reverse().forEach(function(item, index, object) {
              if (item.owner === username) {
                tower.splice(object.length - 1 - index, 1);
              }
            });
            player.splice(i,1);
            io.emit('map', tower);
            socket.emit('loggedOut');
            if(player.length == 0){
              initializeGame();
            }
            return;
          }
      }
      socket.emit('message', "Nincs ilyen felhasználó");
      socket.disconnect();
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
           io.emit('lives', (lives/config.lives)*100);
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
                player[j].money += Math.floor(tower[i].damage/5);
                player[j].point += Math.floor(tower[i].damage/5);
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
              health: 100 + 10*difficulty
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

    function decideMap() {
      if(process.env.MAP) {
        return process.env.MAP;
      } else {
        return Math.floor(Math.random() * config.enemyPathChoices.length);
      }
    }

}
