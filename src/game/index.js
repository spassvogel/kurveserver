import 'yuki-createjs';
import Player from './Player';

const START_POS_MARGIN = 20;	// Player can never start in this area around the edges


const canvas = document.getElementById('canvas');
const stage = new createjs.Stage(canvas);
const gameAreaWidth = canvas.width;
const gameAreaHeight = canvas.height;
let gameArea;

const player1 = new Player({
	color: "#88aaEE"
});

const player2 = new Player({
	color: "#2288EE"
});

const players= [player1, player2]

const start = () => {
	players.forEach((player) => {
		const x = (gameAreaWidth - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
		const y = (gameAreaHeight - 2 * START_POS_MARGIN) * Math.random() + START_POS_MARGIN;
		
		// todo see if too close
		console.log(Math.hypot(gameAreaWidth / 2 - x,gameAreaHeight / 2 -y))
		player.pos = new createjs.Point(x, y);
		
		// Rotate to face the middle, this way we won't go offscreen so easily
		player.rotation = Math.PI / 2 + Math.atan2(gameAreaHeight / 2 - y, gameAreaWidth / 2 - x);

	});

	gameArea = new createjs.Shape();
	gameArea.graphics
		.beginFill("#000")
		.drawRect(0, 0, gameAreaWidth, gameAreaHeight);
	stage.addChild(gameArea);

	createjs.Ticker.addEventListener("tick", handleTick);
	createjs.Ticker.setFPS(30);
};


const handleTick = (event) => {

    if (!event.paused) {

		players.forEach((player) => {

			if(Math.random() * 100 < .5 && !player.isOpen){
				player.open = true;
			}

			player.update(event);

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

start();
