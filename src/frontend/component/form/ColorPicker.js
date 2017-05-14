import React, { Component } from 'react';
import ColorSwatch from './ColorSwatch'


class ColorPicker extends Component {
	constructor(props) {
    	super(props);

		this.handleChange = this.handleChange.bind(this);
  	}

	render() {
		return <div style={{ width: '100%' }}>
			{ 
				this.props.colors.map(c => 
					<ColorSwatch
						color = { c }
						count = { this.props.colors.length }
						selected = { this.props.selectedColor == c }
			//              style={ styles.swatch }
						onClick = { this.handleChange }
						key = { c} 
					/>
				)
			}
			</div>;
	}

	handleChange(color){
		this.props.onChange(color);		
	}
};

ColorPicker.defaultProps = {
	selectedColor: null,
	colors: ['#b80000', '#db3e00', '#fccb00', '#008b02', '#006b76', '#1273de',
           '#004dcf', '#5300eb', '#9900ef', '#eb144c']
}


export default ColorPicker;