    var socket = io.connect('http://localhost:8080'); //Connexion au serveur
    // On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
    if($('#loginForm') != ''){
        $('#loginForm').submit(function(e){
            e.preventDefault();
            var pseudo = $('#pseudo').val().trim();
            socket.emit('newUser', pseudo);
            document.title = pseudo + ' - ' + document.title;
            $('#title').html("<span>"+ pseudo + '</span> bienvenue sur le Chat');
            $('section').removeClass('invisible');
            $('#login').remove();
        });     
    }

    // Insère un message dans la page
    function insereMessage(pseudo,message,date){
        $('#zone_chat').append('<p><strong>['+date+'] ' + pseudo + ' : </strong> ' + message + '</p>');
        scrollToBottom();
    }

    // Affichage du message à tout le monde sauf à l'envoyeur
    socket.on('message', function(message){
        insereMessage(message.pseudo, message.message, message.date);
    });
    // Affichage du message à l'envoyeur
    socket.on('myMessage', function(myMessage){
        insereMessage(myMessage.pseudo, myMessage.message, myMessage.date);
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
        $('#zone_chat').append('<p><em>' + pseudo + ' a rejoint le Chat!</em></p>');
    });
    // Message Déconnexion
    socket.on('logout', function(message){
        $('#zone_chat').append(message.text);
    });

    function scrollToBottom() { // A faire fonctionner
        if ($('#zone_chat').scrollTop() + $('#zone_chat').height() + 2 * $('#zone_chat p').last().outerHeight() >= $(document).height()) {
            $("html, body").animate({ scrollTop: $(document).height() }, 0);
        }
    }