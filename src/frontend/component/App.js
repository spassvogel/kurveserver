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

class App extends Component {
    state = {
        ready: false,
        name: '',
        selectedColor: ''
    }

    constructor(props) {
    	super(props);

  	}
    
    handleReadyClick() {
        this.setState({
            ready: !this.state.ready
        })
    }

    handleNameChange(value) {
        this.setState({
            name: value,
            ready: false
        });
    }

    handleColorChange(value) {
        this.setState({
            selectedColor: value,
            ready: false
        });
    }

    render() {
        const canBeReady = this.state.name != '' &&
            this.state.selectedColor != '';

        return <div>
            <AppBar title='Kurve2: Join game' theme={purbleBarTheme}/>
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
                    selectedColor = { this.state.selectedColor }
                    onChange = { this.handleColorChange.bind(this) }
                />
            </Box>
            </Box>
            <Box style={{ margin: '0 20px 0 20px'  }}>
            <Box flex={1} >
                <Label style={ labelStyle }>
                tralala
                </Label>
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