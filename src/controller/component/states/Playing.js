import React, { Component } from 'react';
import Box from 'react-layout-components'
import Button from 'react-toolbox/lib/button'; 

export default class Playing extends Component {
    state = { 
        leftPressed: false,
        rightPressed: false
    }
    constructor(props) {
    	super(props);

    }

    handleLeftDown() {
        this.setState( { leftPressed: true });
        this.props.onLeftDown();
    }

    handleLeftUp() {
        this.setState( { leftPressed: false });
        this.props.onLeftUp();
    }
    
    handleRightDown() {
        this.setState( { rightPressed: true });
        this.props.onRightDown();
    }

    handleRightUp() {
        this.setState( { rightPressed: false });
        this.props.onRightUp();
    }

    handleKeyDown(e) {
        if(e.code == 'ArrowLeft' && !this.state.leftPressed){
            this.handleLeftDown();
        }
        if(e.code == 'ArrowRight'&& !this.state.rightPressed){
            this.handleRightDown();
        }
    }

    handleKeyUp(e){
        if(e.code == 'ArrowLeft'){
            this.handleLeftUp();
        }
        if(e.code == 'ArrowRight'){
            this.handleRightUp();
        }
    }

componentDidMount() {
  window.addEventListener("keydown", this.handleKeyDown.bind(this));
  window.addEventListener("keyup", this.handleKeyUp.bind(this));
}
componentWillUnmount() {
  window.removeEventListener("keydown", this.handleKeyDown.bind(this));
  window.removeEventListener("keyup", this.handleKeyUp.bind(this));
}

    render() {
        return <Box 
                    onKeyDown= { this.handleKeyDown.bind(this) }
                    onKeyUp= { this.handleKeyUp.bind(this) }
                >

                <Box flex = { 1 }>
                    <div icon='keyboard_arrow_left' 
                        style={{ 
                            width: 256, 
                            height: 256, 
                            backgroundColor: 'green',
                            boxSizing: 'content-box',
                            border: this.state.leftPressed ? '3px solid red' : '' 
                        }} 
                        onTouchStart = { this.handleLeftDown.bind(this) }
                        onTouchEnd = { this.handleLeftUp.bind(this) }
                        onMouseDown  = { this.handleLeftDown.bind(this) }
                        onMouseUp = { this.handleLeftUp.bind(this) }
                    />
                </Box>
                <Box flex="1">
                    <div icon='keyboard_arrow_right' 
                        style={{ 
                            width: 256, 
                            height: 256, 
                            backgroundColor: 'orange', 
                            boxSizing: 'content-box',
                            border: this.state.rightPressed ? '3px solid red' : '' ,
                            position: 'absolute',
                            right: 0
                        }} 
 
                        onTouchStart = { this.handleRightDown.bind(this) }
                        onTouchEnd = { this.handleRightUp.bind(this) }
                        onMouseDown  = { this.handleRightDown.bind(this) }
                        onMouseUp = { this.handleRightUp.bind(this) }
                    />
                </Box>
        </Box> 
    }
}

Playing.defaultProps = {
	onRightUp: () => {},
	onRightDown: () => {},
	onLeftUp: () => {},
	onLeftDown: () => {}
}
