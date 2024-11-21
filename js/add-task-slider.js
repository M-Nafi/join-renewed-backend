let isClicked = false;
let fillColor = "";
let isActive = false;
let globalPrioButtonID = "";
let newTask = {};

/**
 * Changes the color of the priority button and updates the global priority button ID.
 *
 * @param {string} prioButtonID - The ID of the priority button to change the color.
 * @param {boolean} isClicked - A flag indicating whether the button is clicked.
 * @param {number} taskID - The ID of the task associated with the priority button.
 * @param {string} prio - The priority value associated with the button.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. If the button is not clicked (initial state), sets the color and updates the global priority button ID.
 * 2. If the button is clicked, updates the global priority button ID.
 * 3. Checks if the button is active and has the same ID as the global priority button.
 *    - If true, resets the button color.
 *    - If false, sets the color and updates the global priority button ID.
 */
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

/**
 * Resets the priority button color and related flags and variables.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Clears the priority button color using the clearPrioButtonColor function.
 * 2. Sets the isActive flag to false.
 * 3. Sets the isClicked flag to false.
 * 4. Sets the globalPrioButtonID to an empty string.
 */
function resetButtonColor() {
	clearPrioButtonColor();
	isActive = false;
	isClicked = false;
	globalPrioButtonID = "";
}

/**
 * Sets the color for the specified priority button.
 *
 * @param {string} prioButtonID - The ID of the priority button to set the color for.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Clears the priority button color using the clearPrioButtonColor function.
 * 2. Constructs the SVG IDs for the priority button.
 * 3. Retrieves the SVG paths using the constructed IDs.
 * 4. Gets the fill color from one of the SVG paths.
 * 5. Changes the color of both SVG paths using the changeSVGPathColor function.
 * 6. Changes the color classes of the priority button using the changeColorClasses function.
 */
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

/**
 * Sets the global priority button ID if it is currently empty.
 *
 * @param {string} prioButtonID - The ID of the priority button to set as the global ID.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the global priority button ID is currently empty.
 * 2. If empty, sets the global priority button ID to the provided prioButtonID.
 */
function setGlobalPrioButtonID(prioButtonID) {
	if (globalPrioButtonID == "") {
		globalPrioButtonID = prioButtonID;
	}
}

/**
 * Changes the color of an SVG path based on the current fill color.
 *
 * @param {Element} path - The SVG path element to change the color of.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks the current fill color of the SVG path.
 * 2. If the fill color is "white," sets the fill color to the stored fillColor and activates the element.
 * 3. If the fill color is not "white," sets the fill color to "white" and deactivates the element.
 */
function changeSVGPathColor(path) {
	if (fillColor == "white") {
		path.setAttribute("fill", fillColor);
		isActive = true;
	} else {
		path.setAttribute("fill", "white");
		isActive = false;
	}
}

/**
 * Changes the color classes of a button based on the current state and priority.
 *
 * @param {Element} button - The button element to change the color classes of.
 * @param {string} prioButtonID - The ID of the priority button.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the button is clicked or the fill color is not "white".
 * 2. If true, sets the button text color to white and updates the background color based on the priority.
 * 3. If false, resets the button background and text color to default values.
 */
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

/**
 * Clears the color of the priority button by resetting background and SVG colors.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Resets the background color for the "Add Task" priority buttons.
 * 2. Resets the SVG colors for the "Add Task" priority buttons.
 */
function clearPrioButtonColor() {
	resetBgColorAddTask();
	resetSVGColorAddTask();
}

/**
 * Resets the background color for the "Add Task" priority buttons.
 *
 * @returns {void} - No return value.
 */
function resetBgColorAddTask() {
	document.getElementById("urgent-btn").style.backgroundColor = "#ffffff";
	document.getElementById("urgent-btn").style.color = "#000000";
	document.getElementById("medium-btn").style.backgroundColor = "#ffffff";
	document.getElementById("medium-btn").style.color = "#000000";
	document.getElementById("low-btn").style.backgroundColor = "#ffffff";
	document.getElementById("low-btn").style.color = "#000000";
}

/**
 * Resets the SVG color for the "Add Task" priority buttons.
 *
 * @returns {void} - No return value.
 */
function resetSVGColorAddTask() {
	document.getElementById("low-btn-svg1").setAttribute("fill", "#7AE229");
	document.getElementById("low-btn-svg2").setAttribute("fill", "#7AE229");
	document.getElementById("medium-btn-svg1").setAttribute("fill", "#FFA800");
	document.getElementById("medium-btn-svg2").setAttribute("fill", "#FFA800");
	document.getElementById("urgent-btn-svg1").setAttribute("fill", "#FF3D00");
	document.getElementById("urgent-btn-svg2").setAttribute("fill", "#FF3D00");
}

/**
 * Sets the minimum date for a calendar input to the current date.
 *
 * @param {string} id - The ID of the calendar input element.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the current date in ISO format (yyyy-mm-dd).
 * 2. Set the "min" attribute of the calendar input with the provided ID to the current date.
 */
function setTodayDateForCalendar(id) {
	let today = new Date().toISOString().split("T")[0];
	document.getElementById(id).setAttribute("min", today);
}

/**
 * Loads and displays the add task slider on the task overlay background.
 *
 * @param {string} boardColumnID - The ID of the board column to which the task will be added.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the task overlay background element.
 * 2. Create a new task ID using the createNewTaskID function.
 * 3. Clear the task overlay content.
 * 4. Create a new task in the specified board column with the generated task ID using createNewTask.
 * 5. Show the task overlay frame.
 * 6. Add an overlay background to the task overlay.
 * 7. Generate and set the HTML for the add task slider with the generated task ID.
 * 8. Set the minimum date for the calendar input in the slider using setTodayDateForCalendar.
 * 9. Initialize the add task slider with the generated task ID using initAddTaskSlider.
 * 10. Slide in the add task overlay frame.
 * 11. Load the default priority "Medium" using loadPrioOnEditTask.
 */
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

/**
 * Initializes the add task slider with the specified task ID.
 *
 * @param {string} taskID - The ID of the task being added.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Get the assigned contacts for the task from the addedTasks array.
 * 2. Load all users for contact on assigned to using loadAllUsersForContactOnAssignedTo.
 */
function initAddTaskSlider(taskID) {
	let assigneds = newTask["assigned"];
	loadAllUsersForContactOnAssignedTo(assigneds, "et_contact_overlay", taskID);
}

/**
 * Creates a new task ID for a newly added task.
 *
 * @returns {number} - The new task ID.
 *
 * @description
 * This function performs the following steps:
 * 1. Check if there are existing tasks in the addedTasks array.
 * 2. If tasks exist, set the new task ID to the length of the addedTasks array.
 * 3. If no tasks exist, set the new task ID to 0.
 * 4. Return the new task ID.
 */
function createNewTaskID() {
	let newTaskID;
	if (addedTasks.length !== 0) {
		newTaskID = addedTasks.length;
	} else {
		newTaskID = 0;
	}
	return newTaskID;
}

/**
 * Creates a new task with the specified board and task IDs.
 *
 * @param {number} boardColumnID - The ID of the board column to which the task is assigned.
 * @param {number} taskID - The ID of the new task.
 *
 * @returns {Object} - The newly created task object.
 *
 * @description
 * This function creates a new task object with the following properties:
 * 1. `id`: The ID of the task.
 * 2. `bucket`: The ID of the board column.
 * 3. `title`: The title of the task (initially empty).
 * 4. `description`: The description of the task (initially empty).
 * 5. `assigned`: An array of assigned users (initially empty).
 * 6. `duedate`: The due date of the task (initially empty).
 * 7. `prio`: The priority of the task (initially empty).
 * 8. `category`: The category of the task (initially empty).
 * 9. `subtask`: An array of subtasks (initially empty).
 */
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

/**
 * Checks if a new task object is empty.
 *
 * @param {Object} obj - The task object to be checked.
 * @returns {boolean} - True if the object is empty, otherwise false.
 *
 * @description
 * This function performs the following steps:
 * 1. Uses Object.keys() to get an array of all own enumerable properties of the object.
 * 2. Checks the length of this array.
 * 3. Returns true if the length is 0 (the object is empty), otherwise false.
 */
function isNewTaskEmpty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * Deletes a new task from the addedTasks array.
 *
 * @param {number} taskID - The ID of the task to delete.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Removes the task with the specified ID from the addedTasks array.
 */
function deleteNewTask(taskID) {
	addedTasks.splice(taskID, 1);
}

/**
 * Submits a form for the specified task.
 *
 * @param {number} taskID - The ID of the task for which the form is submitted.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves and processes the required fields for the specified task.
 */
function submitForm(taskID) {
	getRequiredFields(taskID);
}

/**
 * Retrieves and processes the required fields for the specified task.
 *
 * @param {number} taskID - The ID of the task for which to check required fields.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the title, due date, and category inputs for the specified task.
 * 2. Calls the checkRequiredFields function with the retrieved inputs and the task ID.
 */
function getRequiredFields(taskID) {
	let titleInput = document.getElementById("title_input_ed_task").value;
	let dueDateInput = document.getElementById("calendar_edit_task").value;
	let categoryInput = document.getElementById("select_category").value;
	checkRequiredFields(titleInput, dueDateInput, categoryInput, taskID);
}

/**
 * Checks if the required fields are filled for the specified task and takes appropriate actions.
 *
 * @param {string} titleInput - The value of the title input for the task.
 * @param {string} dueDateInput - The value of the due date input for the task.
 * @param {string} categoryInput - The value of the category input for the task.
 * @param {number} taskID - The ID of the task to check and update.
 * @returns {void}
 *
 * @description
 * This function performs the following steps:
 * 1. Checks if the title, due date, and category inputs are filled.
 * 2. If all required fields are filled:
 *    a. Adds the newTask to the addedTasks array.
 *    b. Calls the updateNewTask function with the task ID.
 * 3. If any required field is not filled:
 *    a. Displays corresponding error messages.
 *    b. Adds 'required-border' class to the empty input elements.
 */
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

/**
 * Updates the properties of a new task and hides the add task overlay frame.
 *
 * @param {number} taskID - The ID of the task to update.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Displays a confirmation message ("task_added_to_board") temporarily.
 * 2. Calls functions to update the title, description, due date, priority, and category of the task.
 * 3. Hides the add task overlay frame using the hideTaskOpen function.
 * 4. Sets a timeout to hide the confirmation message after a delay.
 */
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

/**
 * Updates the category of a task.
 *
 * @param {number} taskID - The ID of the task to update.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the selected category value from the "select_category" element.
 * 2. Updates the category property of the task in the addedTasks array.
 */
function updateTaskCategory(taskID) {
	let categoryValue = document.getElementById("select_category").value;
	addedTasks[taskID]["category"] = categoryValue;
}