import React, { PropTypes } from 'react';

const Label = (props) => {
	const { children, ...other } = props;
	return <p {...other}> 
		{ children }
	</p>;
};

export default Label;