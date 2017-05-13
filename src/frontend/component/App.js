import React from 'react';
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

const App = () => {

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

  return <div>
    <AppBar title='Kurve2: Join game' theme={purbleBarTheme}/>
    <Box style={{ margin: 20 }}>
      <Box flex={.5}>
        <Label style={ formLabelStyle }>
          Name
        </Label>
      </Box>
      <Box flex={1}>
        <Input type='text' style={ labelStyle } name='name' maxLength={30} theme={inputTheme} />
      </Box>
    </Box>
    <Box style={{ margin: 20 }}>
      <Box flex={.5} >
        <Label style={ formLabelStyle }>
          Color
        </Label>
      </Box>
      <Box flex={1}>
        <Input type='text' name='name' maxLength={30} theme={inputTheme} />
      </Box>
    </Box>
    <section style={{ padding: 20 }}>
      <SuccessButton label='Success' primary raised />
      <Button label='Primary Button' primary />
    </section>
  </div> 
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