var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const playerData = [];

io.on('connection', function(socket){
    let playerUID = null;
    console.log('a client connected from ' + socket.request.connection.remoteAddress);
  
    socket.on('disconnect', () => {
        console.log('user disconnected');
        if(playerUID){
            removePlayer(playerUID);
            playerUID = null;
        }
    });


    socket.on('addPlayer', (player) => {
        addPlayer(player);
        playerUID = player.uid;
        console.log('we have added ' + playerUID)
    });

    socket.on('removePlayer', (playerUID) => {
        removePlayer(playerUID)
    });
    playersChanged();

});


/** Informs the client that the players in game have changed */
function playersChanged() {
    io.emit('playersChanged', playerData);
}

function addPlayer(player) {
    playerData.push(player);
    playersChanged();
}

function removePlayer(playerUID) {
    playerData.splice(playerData.findIndex((p) => p.uid != playerUID), 1);
    playersChanged();
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});

