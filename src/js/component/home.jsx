import { event } from "jquery";
import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { Task } from "./Task.jsx";
//create your first component
const url = "https://assets.breatheco.de/apis/fake/todos/user/";

const Home = () => {
	const [todoTask, setTask] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [userName, setUserName] = useState("");

	useEffect(() => {
		if (localStorage.getItem("userName") === null) {
			alert("Create a new user to use this app");
		} else {
			const fetchUser = async () => {
				const response = await fetch(
					url + localStorage.getItem("userName")
				);
				if (response.ok) {
					const body = await response.json();
					setTask(body);
					setUserName(localStorage.getItem("userName"));
				} else if (response.status == 404) {
					localStorage.removeItem("userName");
					setUserName("");
				}
			};
			fetchUser();
		}
	}, [userName]);

	const updateTask = async (pos, checked) => {
		let _user = localStorage.getItem("userName");

		let result = todoTask.map((task, index) => {
			let newTask = { ...task };
			if (index === pos) {
				newTask.done = checked;
			}

			return newTask;
		});

		const response = await fetch(url + _user, {
			method: "PUT",
			body: JSON.stringify(result),
			headers: {
				"Content-Type": "application/json"
			}
		});
		if (response.ok) {
			const getResponse = await fetch(url + _user);
			const body = await getResponse.json();
			setTask(body);
		}
	};

	const deleteUser = async () => {
		let _user = localStorage.getItem("userName");
		const response = await fetch(url + _user, {
			method: "DELETE"
		});
		if (response.ok) {
			alert("User deleted");
			const body = await response.json();
			if (body.result.toString().includes("ok")) {
				localStorage.removeItem("userName");
				setUserName("");
				setTask([]);
			}
		}
	};
	/* 	const deleteUser = async user => {
		const response = await fetch(url + user, {
			method: "DELETE"
		});
		if (response.ok) {
			setUserName("");
			localStorage.removeItem("userName");
			setTask([]);
		}
	}; */
	const deleteTask = async pos => {
		let _user = localStorage.getItem("userName");
		let result = todoTask.filter((task, index) => index !== pos);
		let _method = "";
		if (result.length == 0) {
			deleteUser();
		} else {
			_method = "PUT";
			result = JSON.stringify(result);
			const response = await fetch(url + _user, {
				method: _method,
				body: result,
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (response.ok) {
				const getResponse = await fetch(url + _user);
				const body = await getResponse.json();
				setTask(body);
			}
		}
	};
	return (
		<div className="container">
			<div className="row d-flex justify-content-center">
				<h1>
					{userName == ""
						? "My ToDo List"
						: `Welcome ${userName} | My ToDo List`}
				</h1>
				{userName == "" ? (
					""
				) : (
					<button className="ml-3 btn-danger" onClick={deleteUser}>
						Delete User
					</button>
				)}
			</div>

			<div className="row d-flex justify-content-center">
				<div className="col-6 d-flex justify-content-center">
					<div className="form-group">
						<input
							type="text"
							className="form-control-plaintext"
							placeholder="write a task here"
							value={inputValue}
							disabled={userName == "" ? "disabled" : ""}
							onChange={event => {
								setInputValue(event.target.value);
							}}
							onKeyPress={event => {
								if (event.key == "Enter") {
									if (event.target.value == "") {
										alert("Please add some task's");
										return;
									}
									/* setTask(prevTask => [
										...prevTask,
										inputValue
									]); */
									const createTask = async () => {
										let _user = localStorage.getItem(
											"userName"
										);
										let newTask = [
											...todoTask,
											{
												label: event.target.value,
												done: false
											}
										];

										const response = await fetch(
											url + _user,
											{
												method: "PUT",
												body: JSON.stringify(newTask),
												headers: {
													"Content-Type":
														"application/json"
												}
											}
										);
										if (response.ok) {
											const getResponse = await fetch(
												url + _user
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
			{userName == "" ? (
				<>
					<div className="row">
						<div className="col">
							<p>
								Let&apos;s go to create a new user to use this
								app&apos;s
							</p>
							<br />
							<div className="form-group">
								<input
									type="text"
									className="form-control-plaintext"
									placeholder="Please write your username here"
									onKeyPress={event => {
										if (event.key == "Enter") {
											if (event.target.value == "") {
												alert(
													"Please create a new user, choose a unique Username for you :-)"
												);
												return;
											}
											let _user = event.target.value;
											const createUser = async () => {
												const response = await fetch(
													url + event.target.value,
													{
														method: "POST",
														headers: {
															"Content-Type":
																"application/json"
														},
														body: JSON.stringify([])
													}
												);
												if (response.ok) {
													const getResponse = await fetch(
														url + _user
													);
													const body = await getResponse.json();
													setTask(body);
													setUserName(_user);
													localStorage.setItem(
														"userName",
														_user
													);

													alert(
														"Done, your new user is " +
															_user
													);
												} else if (
													response.status == 400
												) {
													const body = await response.json();
													if (
														body.msg
															.toString()
															.includes(
																"This user already has a list of todos, use PUT instead to update it"
															)
													) {
														alert(
															"User already exists"
														);
													}
												}
											};
											createUser();
										}
									}}
								/>
							</div>
						</div>
					</div>
				</>
			) : (
				""
			)}
		</div>
	);
};

export default Home;
