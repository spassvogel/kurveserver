import merge from 'lodash.merge';
import express from 'express';

import http from 'http';
import SocketIO from 'socket.io';
import ip from "ip";

const playerData = [];
const CONTROL_LEFT_UP = 'leftUp';
const CONTROL_LEFT_DOWN = 'leftDown';
const CONTROL_RIGHT_UP = 'rightUp';
const CONTROL_RIGHT_DOWN = 'rightDown';

const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = process.env.PORT || 3000;

let gameInitialized = false;


server.listen(port, function(){
  console.log('listening on *:' + port);
});

var gameSocket = null;
io.on('connection', function(socket){
    let playerUID = null;
    console.log('a client connected from ' + socket.request.connection.remoteAddress);

    socket.on('disconnect', () => {
        if(playerUID){
            console.log('removed' + playerUID);

            removePlayer(playerUID);
            playerUID = null;
        }
        if(socket == gameSocket){
            gameSocket = null;
            console.log('disconnected game');
            // todo: inform controller clients
        }
    });

    /** The 'game client' sends this  */
    socket.on('gameInit', (data, callback) => {
        console.log('game client connected!');
        gameInitialized = true;

        gameSocket = socket;
        socket.on('gameUpdate', (players) => {
            console.log('game is updated' + JSON.stringify(players))
        });
        callback({
            ip: ip.address()
        });
    });

    socket.on('addPlayer', (player) => {
        if (!gameSocket) {
            console.warn('addPlayer: No game present')
        }
        else {
            gameSocket.emit('addPlayer', player);
        }
        
        /*addPlayer(merge({
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
        }*/
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



