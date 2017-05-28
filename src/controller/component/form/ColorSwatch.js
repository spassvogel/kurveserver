import React, { Component } from 'react';
import reactCSS from 'reactcss'

export const ColorSwatch = ({ color, count, selected, disabled, style, onClick, title = color }) => {

    const margin = 6;
    const disabledBorderSize = 4;
    const size = `calc(${100 / count}% - ${margin}px)`;
    const disabedSize = `calc(${100 / count}% - ${margin}px - ${disabledBorderSize * 2}px)`;

    const styles = reactCSS({
        'default': {
            swatch: {
                width: size,
                paddingBottom: size,
                float: 'left',
                borderRadius: '10px',
                marginLeft: `${margin}px`,
        
                background: color,
                cursor: 'pointer',
                position: 'relative'
            },
            selected: {
                fill: '#fff',
                position: 'absolute'
            }
        },
        'disabled': {
            swatch: {
                background: 'none',
                width: disabedSize,
                paddingBottom: disabedSize,
                cursor: 'default',
                // boxSizing: 'border-box',
                border: `${disabledBorderSize}px solid ${color}`
            }
        },
        'custom': {
            swatch: style,
        },
    }, { 'disabled': disabled })

    const handleClick = (e) => onClick(color, e)
    

    return (
        <div style={ styles.swatch } onClick={ handleClick } title={ title } >
            {
                selected ? 
                    <svg style={ styles.selected } viewBox="0 0 24 24">
                        <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                : null
            }
        </div>
  )
}
ColorSwatch.defaultProps = {
	disabled: false
}

export default ColorSwatch