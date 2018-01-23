var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var ent = require('ent');
var io = require('socket.io').listen(server);

app.use("/", express.static(__dirname + "/public"));

io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('newUser', function(pseudo) {
        socket.pseudo = ent.encode(pseudo);
        socket.broadcast.emit('newUser', pseudo);
    });

    // Réception et envoi du message à tous
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 

    // Réception et envoi sur la page de l'envoyeur
    socket.on('myMessage', function (message) {
        myMessage = ent.encode(message);
        socket.emit('myMessage', {pseudo: socket.pseudo, message: myMessage});
    }); 

    // Message de déconnexion envoyé à tout le monde
    socket.on('disconnect', function(pseudo){
    	logoutMessage = {text:  "<p><em>" + socket.pseudo + " a quitté le Chat!</em></p>",type: 'logout'};
      	socket.broadcast.emit('logout', logoutMessage);
    });
});


server.listen(8080);
