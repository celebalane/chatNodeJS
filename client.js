    var socket = io.connect('http://localhost:8080'); //Connexion au serveur
    // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
    if($('#loginForm') != ''){
        $('#loginForm').submit(function(e){
            e.preventDefault();
            var pseudo = $('#pseudo').val().trim();
            socket.emit('newUser', pseudo);
            document.title = pseudo + ' - ' + document.title;
        });     
    }

    // Insère un message dans la page
    function insereMessage(pseudo,message){
        $('#zone_chat').prepend('<p><strong>' + pseudo + '</strong> ' + message + '</p>');
    }

    // Affichage du message à tout le monde sauf à l'envoyeur
    socket.on('message', function(message){
        insereMessage(message.pseudo, message.message);
    });
    // Affichage du message à l'envoyeur
    socket.on('myMessage', function(myMessage){
        insereMessage(myMessage.pseudo, myMessage.message);
    });

    // Envoi d'un message à tous
    $('#formulaire_chat').submit(function(e){
        e.preventDefault();
        var message = $('#message').val();
        socket.emit('message', message); // Transmet le message aux autres
        socket.emit('myMessage', message);
        $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    });

    // Message Connexion
    socket.on('newUser', function(pseudo) {
        $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat!</em></p>');
    });
    // Message Déconnexion
    socket.on('logout', function(message){
        $('#zone_chat').prepend(message.text);
    });