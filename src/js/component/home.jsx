import { event } from "jquery";
import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { Task } from "./Task.jsx";
//create your first component
const url = "https://assets.breatheco.de/apis/fake/todos/user/01bideau";

const Home = () => {
	const [todoTask, setTask] = useState([]);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		const fetchTask = async () => {
			let response = await fetch(url);
			if (response.ok) {
				let body = await response.json();
				setTask(body);
			} else if (response.status == 404) {
				createUser();
			}
		};
		fetchTask();
	}, []);

	const createUser = async () => {
		let response = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify([])
		});
		if (response.ok) {
			let getResponse = await fetch(url);
			let body = await getResponse.json();
			setTask(body);
		}
	};

	const updateTask = async (pos, checked) => {
		let result = todoTask.map((task, index) => {
			let newTask = { ...task };
			if (index === pos) {
				newTask.done = checked;
			}

			return newTask;
		});

		const response = await fetch(url, {
			method: "PUT",
			body: JSON.stringify(result),
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (response.ok) {
			const getResponse = await fetch(url);
			const body = await getResponse.json();
			setTask(body);
		}
	};

	const deleteTask = async pos => {
		let result = todoTask.filter((task, index) => index !== pos);
		let _method = "PUT";

		result = JSON.stringify(result);
		const response = await fetch(url, {
			method: _method,
			body: result,
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (response.ok) {
			const getResponse = await fetch(url);
			const body = await getResponse.json();
			setTask(body);
		}
	};
	return (
		<div className="container">
			<div className="row d-flex justify-content-center">
				<div className="col-6 d-flex justify-content-center">
					<div className="form-group">
						<h3>Todo List With React</h3>
						<input
							type="text"
							className="form-control-plaintext input-task"
							placeholder="Write a task here"
							value={inputValue}
							onChange={event => {
								setInputValue(event.target.value);
							}}
							onKeyPress={event => {
								if (event.key == "Enter") {
									if (event.target.value == "") {
										alert("Please add some task's");
										return;
									}

									const createTask = async () => {
										let newTask = [
											...todoTask,
											{
												label: event.target.value,
												done: false
											}
										];

										const response = await fetch(url, {
											method: "PUT",
											body: JSON.stringify(newTask),
											headers: {
												"Content-Type":
													"application/json"
											}
										});
										if (response.ok) {
											const getResponse = await fetch(
												url
											);
											const body = await getResponse.json();
											setTask(body);
										}
									};
									createTask();
									setInputValue("");
								}
							}}
						/>
					</div>
				</div>
			</div>
			<div className="row d-flex justify-content-center">
				<ul className="list-unstyled">
					{todoTask.map((task, index) => {
						return (
							<Task
								key={index}
								inputTask={task.label}
								isChecked={task.done}
								position={index}
								updateTaskList={(taskPosition, isDone) =>
									updateTask(taskPosition, isDone)
								}
								removeCallBack={_removeTask =>
									deleteTask(_removeTask)
								}
							/>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default Home;
