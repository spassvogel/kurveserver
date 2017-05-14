import React, { Component } from 'react';
import Box from 'react-layout-components'
import PurpleAppBar from './PurpleAppBar.js';      // AppBar with simple overrides
import SuccessButton from './SuccessButton.js';    // A button with complex overrides
import Button from 'react-toolbox/lib/button'; // Bundled component import
import Input from 'react-toolbox/lib/input';
import inputTheme from './form/Input.css';
import AppBar from 'react-toolbox/lib/app_bar';
import css from './App.css';
import purbleBarTheme from './PurpleAppBar.css';
import Label from './common/Label.js';
import ColorPicker from './form/ColorPicker'
import uid from 'uid';

  const labelStyle = { 
    fontFamily: 'Roboto', 
    fontSize: '1.5em' 
  };
  const formLabelStyle = Object.assign({ 
    width: '100%', 
    lineHeight: '1.5em', 
    textAlign: 'right', 
    marginRight: 20 
  }, 
  labelStyle);

import io from 'socket.io-client';



class App extends Component {
    state = {
        connected: false,       // connected to servr
        ready: false,           // player is ready to join game
        inputName: '',          // name input in field
        inputColor: '', // color chosen
        players: []             // all players in game
    }
    playerUID = uid()
    socket = null;

    constructor(props) {
    	super(props);


        this.socket = io.connect(window.location.host.replace('8080', '3000'), { reconnect: true });
        this.socket.on('connect', () => {
            this.setState({
                connected: true
            })
        });
        this.socket.on('disconnect', () => {
            this.setState({
                connected: false
            })
        });

        this.socket.on('playersChanged', (payload) => {
            this.setState({
                players: payload
            })
            console.log('playerschanged: ' + payload)
        });
  	}

    componentDidUpdate(prevProps, prevState) {
        if (this.state.ready > prevState.ready) {
            // Player clicked ready button
            this.socket.emit('addPlayer', {
                uid: this.playerUID,
                name: this.state.inputName,
                color: this.state.inputColor
            });

        }
        if (this.state.ready < prevState.ready) {
            // Player no longer ready, remove it
            this.socket.emit('removePlayer', this.playerUID);
        }
    }
    
    handleReadyClick() {
        this.setState({
            ready: !this.state.ready
        })
    }

    handleNameChange(value) {
        this.setState({
            inputName: value,
            ready: false
        });
    }

    handleColorChange(value) {
        this.setState({
            inputColor: value,
            ready: false
        });
    }

    render() {
        const canBeReady = 
            this.state.connected && 
            this.state.inputName != '' &&
            this.state.inputColor != '';

        return <div>
            <AppBar title='Kurve2: Join game' 
                theme={purbleBarTheme} 
                rightIcon={ this.state.connected ? 'wifi' : null }
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
                <Label style={ formLabelStyle }>
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
            <Box style={{ margin: '0 20px 0 20px'  }}>
            <Box flex={1} >
                {
                    this.state.connected ?
                        <Label style={ labelStyle }>
                        { this.state.players.length } player in game
                        </Label>
                    : null
                }
            </Box>
            <Box>
                <Button 
                    label='Ready' 
                    disabled = { !canBeReady }
                    icon = { this.state.ready ? 'done' : ''} 
                    raised primary= { this.state.ready } 
                    onClick={ this.handleReadyClick.bind(this) }/>
            </Box>
            </Box>
        </div> 
    }
};

export default App;

/*
<div className='formFields' style={{display: 'flex'}}>
      <div style={{flex: '1 0 auto'}}>
        name
      </div>
      <div style={{flex: '1 0 auto'}}>
      </div>
    </div>*/