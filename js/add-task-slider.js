let isClicked = false;
let fillColor = "";
let isActive = false;
let globalPrioButtonID = "";
let newTask = {};

function changePrioBtnColor(prioButtonID, isClicked, taskID, prio) {
	if (!isClicked) {
		setButtonColor(prioButtonID);
		globalPrioButtonID = prioButtonID;
	} else {
		setGlobalPrioButtonID(prioButtonID);
		if (isActive && prioButtonID == globalPrioButtonID) {
			resetButtonColor();
		} else {
			setButtonColor(prioButtonID);
			globalPrioButtonID = prioButtonID;
		}
	}
}

function resetButtonColor() {
	clearPrioButtonColor();
	isActive = false;
	isClicked = false;
	globalPrioButtonID = "";
}

function setButtonColor(prioButtonID) {
	clearPrioButtonColor();
	let proSVG1 = prioButtonID + "-svg1";
	let proSVG2 = prioButtonID + "-svg2";
	let path1 = document.getElementById(proSVG1);
	let path2 = document.getElementById(proSVG2);
	fillColor = path1.getAttribute("fill");
	let button = document.getElementById(prioButtonID);
	changeSVGPathColor(path1);
	changeSVGPathColor(path2);
	changeColorClasses(button, prioButtonID);
}

function setGlobalPrioButtonID(prioButtonID) {
	if (globalPrioButtonID == "") {
		globalPrioButtonID = prioButtonID;
	}
}

function changeSVGPathColor(path) {
	if (fillColor == "white") {
		path.setAttribute("fill", fillColor);
		isActive = true;
	} else {
		path.setAttribute("fill", "white");
		isActive = false;
	}
}

function changeColorClasses(button, prioButtonID) {
	if (isClicked || fillColor !== "white") {
		button.style.color = "#ffffff";
		if (prioButtonID.includes("low")) {
			button.style.backgroundColor = "#7AE229";
		} else if (prioButtonID.includes("medium")) {
			button.style.backgroundColor = "#FFA800";
		} else if (prioButtonID.includes("urgent")) {
			button.style.backgroundColor = "#FF3D00";
		}
		isActive = true;
	} else {
		button.style.backgroundColor = "#fffff";
		button.style.color = "#000000";
		isActive = false;
	}
}

function clearPrioButtonColor() {
	resetBgColorAddTask();
	resetSVGColorAddTask();
}

function resetBgColorAddTask() {
	document.getElementById("urgent-btn").style.backgroundColor = "#ffffff";
	document.getElementById("urgent-btn").style.color = "#000000";
	document.getElementById("medium-btn").style.backgroundColor = "#ffffff";
	document.getElementById("medium-btn").style.color = "#000000";
	document.getElementById("low-btn").style.backgroundColor = "#ffffff";
	document.getElementById("low-btn").style.color = "#000000";
}

function resetSVGColorAddTask() {
	document.getElementById("low-btn-svg1").setAttribute("fill", "#7AE229");
	document.getElementById("low-btn-svg2").setAttribute("fill", "#7AE229");
	document.getElementById("medium-btn-svg1").setAttribute("fill", "#FFA800");
	document.getElementById("medium-btn-svg2").setAttribute("fill", "#FFA800");
	document.getElementById("urgent-btn-svg1").setAttribute("fill", "#FF3D00");
	document.getElementById("urgent-btn-svg2").setAttribute("fill", "#FF3D00");
}

function setTodayDateForCalendar(id) {
	let today = new Date().toISOString().split("T")[0];
	document.getElementById(id).setAttribute("min", today);
}

function loadAddTaskSlider(boardColumnID) {
	let taskOverlay = document.getElementById("task_overlay_bg");
	let taskID = createNewTaskID();
	taskOverlay.innerHTML = "";
	createNewTask(boardColumnID, taskID);
	showFrame("task_overlay_bg");
	addOverlayBg("task_overlay_bg");
	taskOverlay.innerHTML = generateAddTaskSliderHTML(taskID);
	setTodayDateForCalendar("calendar_edit_task");
	initAddTaskSlider(taskID);
	frameSlideIn("task_open_overlay_frame");
	loadPrioOnEditTask("Medium");
}

function initAddTaskSlider(taskID) {
	let assigneds = newTask["assigned"];
	loadAllUsersForContactOnAssignedTo(assigneds, "et_contact_overlay", taskID);
}

function createNewTaskID() {
	let newTaskID;
	if (addedTasks.length !== 0) {
		newTaskID = addedTasks.length;
	} else {
		newTaskID = 0;
	}
	return newTaskID;
}

function createNewTask(boardColumnID, taskID) {
	newTask = {
		id: taskID,
		bucket: boardColumnID,
		title: "",
		description: "",
		assigned: [],
		duedate: "",
		prio: "",
		category: "",
		subtask: [],
	};
}

function isNewTaskEmpty(obj) {
	return Object.keys(obj).length === 0;
}

function deleteNewTask(taskID) {
	addedTasks.splice(taskID, 1);
}

function submitForm(taskID) {
	getRequiredFields(taskID);
}

function getRequiredFields(taskID) {
	let titleInput = document.getElementById("title_input_ed_task").value;
	let dueDateInput = document.getElementById("calendar_edit_task").value;
	let categoryInput = document.getElementById("select_category").value;
	checkRequiredFields(titleInput, dueDateInput, categoryInput, taskID);
}

function checkRequiredFields(titleInput, dueDateInput, categoryInput, taskID) {
	if (titleInput !== "" && dueDateInput !== "" && categoryInput !== "") {
		addedTasks.push(newTask);
		updateNewTask(taskID);
	} else {
		if (titleInput === "") {
			show("title_error_slider");
			document.getElementById("title_input_ed_task").classList.add("required-border");
		}
		if (dueDateInput === "") {
			show("date_error_slider");
			document.getElementById("calendar_edit_task").classList.add("required-border");
		}
		if (categoryInput === "") {
			show("category_error_slider");
			document.getElementById("select_category").classList.add("required-border");
		}
	}
}

function updateNewTask(taskID) {
	show("task_added_to_board");
	updateOpenTaskTitle(taskID);
	updateOpenTaskDesc(taskID);
	updateOpenTaskDueDate(taskID);
	updateTaskPriority(taskID);
	updateTaskCategory(taskID);
	hideTaskOpen("task_open_overlay_frame");
	setTimeout(function () {
		hide("task_added_to_board");
	}, 350);
}

function updateTaskCategory(taskID) {
	let categoryValue = document.getElementById("select_category").value;
	addedTasks[taskID]["category"] = categoryValue;
}