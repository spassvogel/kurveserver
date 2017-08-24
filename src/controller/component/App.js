import React, { Component } from 'react';
import Playing from './states/Playing';
import Box from 'react-layout-components'
import PurpleAppBar from './PurpleAppBar.js';      // AppBar with simple overrides
import SuccessButton from './SuccessButton.js';    // A button with complex overrides
import Button from 'react-toolbox/lib/button'; 
import Input from 'react-toolbox/lib/input';
import inputTheme from './form/Input.css';
import AppBar from 'react-toolbox/lib/app_bar';
import css from './App.css';
import purbleBarTheme from './PurpleAppBar.css';
import Label from './common/Label.js';
import ColorPicker from './form/ColorPicker'
import uid from 'uid';
import merge from 'lodash.merge';
import io from 'socket.io-client';

  const labelStyle = { 
    fontFamily: 'Roboto', 
    fontSize: '1.5em' 
  };
  const formLabelStyle = Object.assign({ 
    width: '100%', 
    lineHeight: '1.5em', 
    textAlign: 'right', 
    margin: '20px 20px auto auto' 
  }, 
  labelStyle);


const STATUS_LOBBY = 'lobby';
const STATUS_WAITING = 'waiting';
const STATUS_PLAYING = 'playing';

const CONTROL_LEFT_UP = 'leftUp';
const CONTROL_LEFT_DOWN = 'leftDown';
const CONTROL_RIGHT_UP = 'rightUp';
const CONTROL_RIGHT_DOWN = 'rightDown';

export default class App extends Component {
    state = {
        connected: false,       // connected to servr
        joined: false,          // player is ready to join game
        status: STATUS_LOBBY,   // status of this player [lobby, waiting, playing]
        inputName: '',          // name input in field
        inputColor: '',         // color chosen
        players: []             // all players in game
    }
    playerUID = uid();
    socket = null;
    addressBackend = window.location.host.replace(location.port, '3000');

    /** 
     * Returns current player data. Only available after player clicked 'join'  */
    get player() {
        for(const player of this.state.players){
            if(player.uid === this.playerUID){
                return player;
            }
        }
        return null;
    }

    /** 
     * Status of current player [lobby, playing ] */
    get status() {
        const player = this.player;
        if(!player){
            // No player yet, means we're in the lobby
            return STATUS_LOBBY;
        }
        return player.status;
    }

    constructor(props) {
    	super(props);


        this.socket = io.connect(this.addressBackend, { reconnect: true });
        this.socket.on('connect', () => {
            this.setState({
                connected: true
            })
            navigator.vibrate([100, 100]);
        });
        this.socket.on('disconnect', () => {
            this.setState({
                connected: false
            })
        });

        this.socket.on('update', (payload) => {
            this.setState({
                players: payload
            })
            console.log('update: ' + JSON.stringify(payload))
        });
  	}

    componentDidUpdate(prevProps, prevState) {
        if (this.state.joined > prevState.joined) {
            // Player clicked join button
            this.socket.emit('addPlayer', {
                uid: this.playerUID,
                name: this.state.inputName,
                color: this.state.inputColor
            });

        }
        if (this.state.joined < prevState.joined) {
            // Player no longer ready to join, remove it
            this.socket.emit('removePlayer', this.playerUID);
        }
        console.log("the status is " + this.status)
    }
    
    handleJoinClick() {
        this.setState({
            joined: !this.state.joined
        })
    }

    handleNameChange(value) {
        this.setState({
            inputName: value
        });
    }

    handleColorChange(value) {
        this.setState({
            inputColor: value
        });
    }
    
    handleRightUp() {
        console.log(this.playerUID + ' right up')
        this.socket.emit('control', CONTROL_RIGHT_UP);
    }
    
    handleRightDown() {
        console.log(this.playerUID + ' right down')
        this.socket.emit('control', CONTROL_RIGHT_DOWN);

    }

    handleLeftUp() {
        console.log(this.playerUID + ' left up')
        this.socket.emit('control', CONTROL_LEFT_UP);
    }
	
    handleLeftDown() {
        console.log(this.playerUID + ' left down')
        this.socket.emit('control', CONTROL_LEFT_DOWN);
    } 


    render() {
        const canJoin = 
            this.state.connected && 
            this.state.inputName != '' &&
            this.state.inputColor != '';

        let status;
        if (this.state.connected){
            const count = this.state.players.length;
            const firstPart = `${count} player${count != 1 ? 's' : ''} in game.`;
            if(!this.state.joined){
                status = `${firstPart} Click 'join' to join.`
            }
            else if (count < 2) {
                status = `${firstPart} Waiting for more players.`
            }
            else {
                status = `${firstPart} Waiting for next round to start.`
            }
        }


        switch(this.status){
            case STATUS_LOBBY:
                return <div> 
                    <AppBar title='Kurve2: Join game' 
                        theme={purbleBarTheme} 
                        rightIcon={ this.state.connected ? 'cloud_done' : null }
                    />
                    <Box style={{ margin: '0 20px 0 20px' }}>
                    <Box flex={.5}>
                        <Label style={ formLabelStyle }>
                        Name
                        </Label>
                    </Box>
                    <Box flex={1}>
                        <Input 
                            type='text' 
                            style={ labelStyle } 
                            name='name' 
                            maxLength={30} 
                            theme={inputTheme} 
                            onChange = { this.handleNameChange.bind(this) }
                        />
                    </Box>
                    </Box>
                    <Box style={{ margin: '0 20px 0 20px'  }}>
                    <Box flex={.5} >
                        <Label style = {{
                            width: '100%', 
                            lineHeight: '1.5em', 
                            textAlign: 'right', 
                            margin: '2px 20px auto auto',
                            fontFamily: 'Roboto', 
                            fontSize: '1.5em'
                        }}>
                            Color
                        </Label>
                    </Box>
                    <Box flex={1}>
                        <ColorPicker 
                            selectedColor = { this.state.inputColor }
                            onChange = { this.handleColorChange.bind(this) }
                            players = { this.state.players }
                        />
                    </Box>
                    </Box>
                    <Box style={{ margin: '10px 20px 0 20px'  }}>
                    <Box flex={1} >
                    <Label style={ labelStyle }>
                            { status } 
                        </Label>
                    </Box>
                    <Box>
                        <Button 
                            label='Join' 
                            disabled = { !canJoin }
                            icon = { this.state.joined ? 'done' : ''} 
                            raised primary= { this.state.joined } 
                            onClick={ this.handleJoinClick.bind(this) }/>
                    </Box>
                    </Box>
                </div>;
            case STATUS_PLAYING:
                return <Playing 
                    onRightUp = { this.handleRightUp.bind(this) }
                    onRightDown = { this.handleRightDown.bind(this) }
	                onLeftUp = { this.handleLeftUp.bind(this) }
	                onLeftDown = { this.handleLeftDown.bind(this) }
                />;
            
            default:
                return <div>`Invalid status ${this.status}`</div>

        }



    }
};

/*
<div className='formFields' style={{display: 'flex'}}>
      <div style={{flex: '1 0 auto'}}>
        name
      </div>
      <div style={{flex: '1 0 auto'}}>
      </div>
    </div>*/