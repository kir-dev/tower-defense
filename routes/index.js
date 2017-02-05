var express = require('express');
var router = express.Router();
var http = require('http').createServer();
var io = require('socket.io')(http);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

module.exports = router;
