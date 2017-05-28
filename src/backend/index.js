import merge from 'lodash.merge';
import express from 'express';

import http from 'http';
import SocketIO from 'socket.io';

const playerData = [];
const CONTROL_LEFT_UP = 'leftUp';
const CONTROL_LEFT_DOWN = 'leftDown';
const CONTROL_RIGHT_UP = 'rightUp';
const CONTROL_RIGHT_DOWN = 'rightDown';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;


io.on('connection', function(socket){
    let playerUID = null;
    console.log('a client connected from ' + socket.request.connection.remoteAddress);
  
    socket.on('disconnect', () => {
        if(playerUID){
            console.log('removed' + playerUID);

            removePlayer(playerUID);
            playerUID = null;
        }
    });


    socket.on('addPlayer', (player) => {
        addPlayer(merge({
            status: 'lobby'
        }, player));
        playerUID = player.uid;
        console.log('added ' + playerUID)


        // temp
        if(playerData.length == 2){
            setTimeout(() => {
                console.log('playing!!')
                playerData.forEach((value) => {
                    value.status = 'playing';
                })
                update();

            }, 20);
        }
    });

    socket.on('control', (action) => {
        console.log(`control ${playerUID} ${action}`);
    });

    socket.on('removePlayer', (playerUID) => {
        removePlayer(playerUID)
    });
    update();

});


/** Informs the client that the players in game have changed */
function update() {
    io.emit('update', playerData);
}

function addPlayer(player) {
    playerData.push(player);
    update();
}

function removePlayer(playerUID) {
    playerData.splice(playerData.findIndex((p) => p.uid != playerUID), 1);
    update();
}


server.listen(port, function(){
  console.log('listening on *:' + port);
});

