import React, { PropTypes } from 'prop-types';

const Label = (props) => {
	const { children, ...other } = props;
	return <p {...other}> 
		{ children }
	</p>;
};

export default Label;