import React from "react";
import PropTypes from "prop-types";
import { CheckBox } from "./CheckBox.jsx";

export const Task = props => {
	return (
		<li className="d-flex">
			{props.inputTask}
			<CheckBox
				updateTaskList={props.updateTaskList}
				position={props.position}
				isChecked={props.isChecked}
			/>
			<i
				className="far fa-trash-alt"
				onClick={() => {
					props.removeCallBack(props.position);
				}}></i>
			<hr className="mt-0" />
		</li>
	);
};

Task.propTypes = {
	inputTask: PropTypes.string,
	position: PropTypes.number,
	removeCallBack: PropTypes.func,
	updateTaskList: PropTypes.func,
	isChecked: PropTypes.bool
};
