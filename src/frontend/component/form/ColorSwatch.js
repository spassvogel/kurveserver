import React, { Component } from 'react';
import reactCSS from 'reactcss'

export const ColorSwatch = ({ color, count, selected, style, onClick, title = color }) => {
    this.state = { 
        selected: false 
    };
    const size = `calc(${100 / count}% - 6px)`;
    const styles = reactCSS({
        'default': {
            swatch: {
                width: size,
                paddingBottom: size,
                float: 'left',
                borderRadius: '10px',
                margin: '0 6px 6px 0',
                //boxSizing: 'border-box',
        
                background: color,
                cursor: 'pointer',
                position: 'relative'
            },
            selected: {
                fill: '#fff',
                position: 'absolute'
            }
        },
        'custom': {
            swatch: style,
        },
    }, 
    'custom')

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

export default ColorSwatch