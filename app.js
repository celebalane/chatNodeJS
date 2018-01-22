var app = require('express')();
var server = require('http').createServer(app);
var fs = require('fs');
var ent = require('ent');
var io = require('socket.io').listen(server);

app.get('/', function (req, res) {   //Index
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('newUser', function(pseudo) {
    	console.log(pseudo);
        socket.pseudo = ent.encode(pseudo);
        socket.broadcast.emit('newUser', pseudo);
    });

    // Réception et envoi du message à tous
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 

    socket.on('disconnect', function(pseudo){
    	logoutMessage = {text:  socket.pseudo + " s'est déconnecté",type: 'logout'};
      	socket.broadcast.emit('logout', logoutMessage);
    });
});


server.listen(8080);
