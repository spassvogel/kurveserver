import 'yuki-createjs';
import Player from './Player';

const START_POS_MARGIN = 20;	// Player can never start in this area around the edges


const canvas = document.getElementById('canvas');
const stage = new createjs.Stage(canvas);


const gameAreaWidth = canvas.width;
const gameAreaHeight = canvas.height;
let gameArea;


stage.addEventListener("stagemousedown", handleMouseDown);
function handleMouseDown(event) {
     var p = gameArea.globalToLocal(stage.mouseX, stage.mouseY);
     var hit = gameArea.hitTest(p.x, p.y);
	 //console.log(hit)
}

const player1 = new Player({
	name: 'player1',
	color: "#88aaEE"
});

const player2 = new Player({
	name: 'player2',
	color: "#2288EE"
});

const players= [player1, player2]

const init = () => {
	gameArea = new createjs.Shape();
	//gameArea.graphics
	//	.beginFill("#000")
	//	.drawRect(0, 0, gameAreaWidth, gameAreaHeight);
	stage.addChild(gameArea);

	document.addEventListener("click", start);
	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(30);

	start();
}

const start = () => {
	gameArea.graphics.clear();

	players.forEach((player) => {
		player.alive = true;
		
		let x, y;
		do {
			// Keep trying to find a location not too close to another player
			x = (gameAreaWidth - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
			y = (gameAreaHeight - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
		}
		while(tooCloseToOtherPlayer(x, y));

		player.pos = new createjs.Point(x, y);		
		// Rotate to face the middle, this way we won't go offscreen so easily
		player.rotation = Math.PI / 2 + Math.atan2(gameAreaHeight / 2 - y, gameAreaWidth / 2 - x);

	});

};

const SPAWN_DISTANCE_TRESHOLD = 100;
/**
 * Returns true if the given coordinates are within SPAWN_DISTANCE_TRESHOLD of the position of another player
 * @param {*} x 
 * @param {*} y  */
const tooCloseToOtherPlayer = (x, y) => {
	// return true if at least one of the players has a position too close
	return players.some((player) => (player.pos && Math.hypot(player.pos.x - x, player.pos.y -y) < SPAWN_DISTANCE_TRESHOLD));
}

const handleTick = (event) => {

    if (!event.paused) {

		players.filter(p => p.alive).forEach((player) => {
			// Randomly open the line
			if(Math.random() * 100 < .5 && !player.isOpen){
				player.open = true;
			}

			// Determine new position
			player.update(event);

			if(gameArea.hitTest(player.pos.x, player.pos.y)){
				console.log(player.name + " dies")
				player.alive = false;
			}

			if(!player.open){
				gameArea.graphics
					.setStrokeStyle(player.stroke, 'round', 'round')
					.beginStroke(player.color).moveTo(player.midPoint.x, player.midPoint.y)
					.curveTo(player.prevPos.x, player.prevPos.y, player.prevMidPoint.x, player.prevMidPoint.y);
			}



		});

		stage.update();
	}
}

if (process.env.NODE_ENV !== 'production') {

}

init();
