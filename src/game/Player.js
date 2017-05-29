import KeyboardController from './KeyboardController';


const SECOND = 1000;

const MOVE_SPEED = 150; // amount of pixels per second
const TURN_SPEED = 0.1; // increment in radians
const HOLE_SIZE = 25;       //

const LEFT = -1;
const STRAIGHT = 0;
const RIGHT = 1;

export default class Player {
    _pos = null;
    _rotation = Math.PI / 2;
    _openDist = 0;

    alive = true;
    name = null;
	midPoint = null;
    prevPos = null;
    prevMidPoint = null;

    controller = new KeyboardController();
	stroke = 5;

    constructor(settings) {
        Object.assign(this, settings);
    }

    update(event) {
        this.prevPos = this.pos;
        this.prevMidPoint = this.midPoint;

        this._rotation += this.controller.direction * TURN_SPEED;

        /*switch(this.controller.direction) {
            case LEFT:
                break;
            case STRAIGHT:
                break;
            case RIGHT:
                break;
        }*/

        const displacement = event.delta / SECOND * MOVE_SPEED;
        this.pos = new createjs.Point(
            this.pos.x + Math.sin(this._rotation) * displacement, 
            this.pos.y - Math.cos(this._rotation) * displacement
        );
        this.midPoint = new createjs.Point(this.pos.x + this.prevPos.x >> 1, this.pos.y + this.prevPos.y >> 1);

        if(this.open){
            this._openDist -= displacement;
        }
    }

    set open(val) {
        this._openDist = val ? HOLE_SIZE : 0;
    }

    get open() {
        return this._openDist >= 0;
    }

    set pos(point) {
        this._pos = point;
        this.midPoint = this._pos.clone();
    }
    
    get pos() {
        return this._pos;
    }

    set rotation(rad) {
        this._rotation = rad;
    }
    
    get rotation() {
        return this._rotation;
    }
}