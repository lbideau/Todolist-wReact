import React, { useState } from "react";
import PropTypes from "prop-types";

export const CheckBox = props => {
	//const [checked, setChecked] = useState(false);
	return (
		<label>
			<input
				type="checkbox"
				defaultChecked={props.isChecked}
				onClick={() => {
					//	setChecked(!checked);
					props.updateTaskList(props.position, !props.isChecked);
				}}
			/>
		</label>
	);
};
CheckBox.propTypes = {
	isChecked: PropTypes.bool,
	position: PropTypes.number,
	updateTaskList: PropTypes.func
};
