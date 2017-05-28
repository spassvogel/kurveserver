export default class KeyboardController {
    _leftPressed = false;        // to base class
	_rightPressed = false;       // to base class
    direction = 0;              // -1: left, 0: straight, 1: right

    constructor() {
        window.addEventListener("keydown", keydown.bind(this));
        window.addEventListener("keyup", keyup.bind(this));

        function keydown(event){
            switch(event.key){
                case "ArrowLeft":
                    this.pressLeft();
                    break;
                case "ArrowRight":
                    this.pressRight();
                    break;
            }
        }

        function keyup(event){
            switch(event.key){
                case "ArrowLeft":
                    this.releaseLeft();
                    break;
                case "ArrowRight":
                    this.releaseRight();
                    break;
            }
            
        }

    }

    /** 
     * Call this when the left button is presssed */
    pressLeft() {
        this._leftPressed = true;
        this.direction = -1;
    }

    /** 
     * Call this when the left button is released */
    releaseLeft() {
        this._leftPressed = false;
        this.direction = this._rightPressed ? 1 : 0;
    }

    /** 
     * Call this when the right button is pressed */
    pressRight() {
        this._rightPressed = true;
        this.direction = 1;
    }

    /** 
     * Call this when the right button is released */
    releaseRight() {
        this._rightPressed = false;
        this.direction = this._leftPressed ? -1 : 0;
    }

    /** 
     * Gets a value indicating the left button is pressed  */
    get leftPressed() {
        return this._leftPressed;
    }

    /** 
     * Gets a value indicating the right button is pressed  */
    get rightPressed() {
        return this._leftPressed;
    }

}