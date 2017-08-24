import 'yuki-createjs';
import Player from './Player';
import io from 'socket.io-client';


const CONTROLLER_PATH = "controller.html";
const START_POS_MARGIN = 20;	// Player can never start in this area around the edges
const GAME_AREA_MARGIN = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 20
}
const GAME_STATES = {
    playing: 0,             // We be playin'
    waitingForRound: 1,     // We wait three seconds and start the next round
    waitingForGame: 2       // We wait for at least two players to be there and be ready
}
const SPAWN_DISTANCE_TRESHOLD = 100;


const player1 = new Player({
	name: 'player1',
	color: "#88aaEE"
});

const player2 = new Player({
	name: 'player2',
	color: "#2288EE"
});


export default class Game {
    _gameState = null;
    _players = [];
    addressBackend = window.location.host.replace(location.port, '3000');

    constructor(canvas){

        this.init(canvas);

        //this.playerJoined(player1);
       // this.playerJoined(player2);
    }

    init(canvas){
        this.stage = new createjs.Stage(canvas);
        this.gameArea = new createjs.Shape();
        this.gameAreaDimensions = new createjs.Rectangle(
            GAME_AREA_MARGIN.left, 
            GAME_AREA_MARGIN.top, 
            canvas.width - GAME_AREA_MARGIN.left - GAME_AREA_MARGIN.right, 
            canvas.height - GAME_AREA_MARGIN.top - GAME_AREA_MARGIN.bottom);

        this.gameArea.x = this.gameAreaDimensions.x;
        this.gameArea.y = this.gameAreaDimensions.y;
        this.stage.addChild(this.gameArea);

        this.hud = new createjs.Container();
        this.stage.addChild(this.hud);
            
        createjs.Ticker.addEventListener("tick", this.gameLoop.bind(this));
        createjs.Ticker.setFPS(30);
        
        this.socket = io.connect(this.addressBackend, { 
            reconnect: true
        });
        this.socket.emit('gameInit', {}, (response) => {
            console.log(`point your browser at: http://${response.ip}:${location.port}/${CONTROLLER_PATH}`);
        });
        this.socket.on('update', (payload) => {
           
            console.log('update: ' + JSON.stringify(payload))
        });
        this.socket.on('addPlayer', (playerData) => {
            // Player is added from remote controller
            this.playerJoined(playerData);
        }); 

        this.gameState = GAME_STATES.waitingForGame;
    }

    startRound(){
        if(this._players.length < 2){
            console.error(`Cannot start round with ${this._players.length} players! Need at least 2`)
        }
        this.gameArea.graphics.clear();
        this.gameArea.graphics
            .setStrokeStyle(2)
            .beginStroke("#fff")
        //	.beginFill("#000"1)
        	//.drawRect(this.gameAreaDimensions.x, this.gameAreaDimensions.y, this.gameAreaDimensions.width, this.gameAreaDimensions.height);
        	.drawRect(0, 0, this.gameAreaDimensions.width, this.gameAreaDimensions.height);
        /**
         * Returns true if the given coordinates are within SPAWN_DISTANCE_TRESHOLD of the position of another player
         * @param {*} x 
         * @param {*} y  */
        const tooCloseToOtherPlayer = (x, y) => {
            // return true if at least one of the players has a position too close
            return this._players.some((player) => (player.pos && Math.hypot(player.pos.x - x, player.pos.y -y) < SPAWN_DISTANCE_TRESHOLD));
        }

        this._players.forEach((player) => {
            player.alive = true;

            let x, y;
            do {
                // Keep trying to find a location not too close to another player
                x = (this.gameAreaDimensions.width - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
                y = (this.gameAreaDimensions.height - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
            }
            while(tooCloseToOtherPlayer(x, y));

            player.pos = new createjs.Point(x, y);		
            // Rotate to face the middle, this way we won't go offscreen so easily
            player.rotation = Math.PI / 2 + Math.atan2(this.gameAreaDimensions.height / 2 - y, this.gameAreaDimensions.width / 2 - x);

        });

    }

    gameLoop(event) {
        
        const playerHitSomething = (player) => {
            return this.gameArea.hitTest(player.pos.x, player.pos.y) ||
                player.pos.x < 0 ||
                player.pos.y < 0 ||
                player.pos.x > this.gameAreaDimensions.width ||
                player.pos.y > this.gameAreaDimensions.height
        }

        if(this._gameState == GAME_STATES.playing){
            if (!event.paused) {

                this._players.filter(p => p.alive).forEach((player) => {
                    // Randomly open the line
                    if(Math.random() * 100 < .5 && !player.isOpen){
                        player.open = true;
                    }

                    // Determine new position
                    player.update(event);

                    if(playerHitSomething(player)){
                        console.log(player.name + " dies")
                        player.alive = false;
                    }

                    // Draw new segment
                    if(!player.open){
                        this.gameArea.graphics
                            .setStrokeStyle(player.stroke, 'round', 'round')
                            .beginStroke(player.color).moveTo(player.midPoint.x, player.midPoint.y)
                            .curveTo(player.prevPos.x, player.prevPos.y, player.prevMidPoint.x, player.prevMidPoint.y);
                    }
                });

            }
        }

        this.stage.update();
    }

    set gameState(val){
        if(val == this._gameState){
            return;
        }

        this._gameState = val;
        switch(val){
            case GAME_STATES.playing:
                break;

            case GAME_STATES.waitingForRound:

                break;

            case GAME_STATES.waitingForGame:
                
                break;
        }
    }

    playerJoined(playerData){
        this._players.push(new Player(playerData));
        
        this.updateControllers();
        this.socket.emit('gameInit', {}, (response) => {
            console.log(`point your browser at: http://${response.ip}:${location.port}/${CONTROLLER_PATH}`);
        });

        switch(this._gameState){
            case GAME_STATES.playing:
                break;

            case GAME_STATES.waitingForRound:

                break;

            case GAME_STATES.waitingForGame:
                this.gameArea.graphics.clear();
                this.hud.removeAllChildren();
                
                const playerTextX = 100;
                const playerTextY = 100;
                const playerTextHeight = 80;
                for(let i = 0; i < this._players.length; i++){

                    var text = new createjs.Text(`${this._players[i].ready ? '✓': '  '} ${this._players[i].name}`, "60px Arial", "#ffffff");
                    text.x = playerTextX;
                    text.y = playerTextY + i * playerTextHeight;
                    this.hud.addChild(text);
                }
                break;
        }   
    }

    /**
     * Updates the controller backend with current game data */
    updateControllers() {
        this.socket.emit('gameUpdate', this.playerData);
    }

    

}






