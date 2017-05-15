import React, { PropTypes } from 'react';

const Label = (props) => {
	const { children, ...other } = props;
	return <span {...other}> 
		{ children }
	</span>;
};

export default Label;