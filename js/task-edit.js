
function loadTaskEdit(TaskID) {
	let tasks = addedTasks.filter((t) => t["id"] === TaskID);
	document.getElementById("task_overlay_bg").innerHTML = "";

	for (let index = 0; index < tasks.length; index++) {
		let [id, bucket, title, description, prio, category, subtasks, assigneds, duedate, rawDuedate] = getTaskVariables(tasks, index);
		initEditTask(id, title, description, prio, assigneds, rawDuedate);
	}
}


function initEditTask(id, title, description, prio, assigneds, duedate) {
	document.getElementById("task_overlay_bg").innerHTML = generateEditTaskHTML(id, title, description, duedate);
	loadAllUsersForContactOnAssignedTo(assigneds, "et_contact_overlay", id);
	loadAssignedOnEditTask(assigneds, "et_selected_contacts");
	setTodayDateForCalendar("calendar_edit_task");
	loadPrioOnEditTask(prio);
	loadSubtasksEditTask("subtask_lists", id);
}


function updateOpenTask(taskID) {
	updateOpenTaskTitle(taskID);
	updateOpenTaskDesc(taskID);
	updateOpenTaskDueDate(taskID);
	updateTaskPriority(taskID);
	renderOpenTask(taskID);
}


function updateOpenTaskTitle(taskID) {
	let titleValue = document.getElementById("title_input_ed_task").value;
	addedTasks[taskID]["title"] = titleValue;
}


function updateOpenTaskDesc(taskID) {
	let descValue = document.getElementById("description_ed_task").value;
	addedTasks[taskID]["description"] = descValue;
}


function updateOpenTaskDueDate(taskID) {
	let dueDateValue = document.getElementById("calendar_edit_task").value;
	addedTasks[taskID]["duedate"] = dueDateValue;
}


function updateTaskPriority(taskID) {
	let prio = "";
	if (globalPrioButtonID !== "") {
		prio = document.getElementById(globalPrioButtonID).value;
	}
	addedTasks[taskID]["prio"] = prio;
}


function loadPrioOnEditTask(prio) {
	if (prio === "Urgent") {
		isActive = true;
		changePrioBtnColor("urgent-btn", false);
	} else if (prio === "Medium") {
		isActive = true;
		changePrioBtnColor("medium-btn", false);
	} else if (prio === "Low") {
		isActive = true;
		changePrioBtnColor("low-btn", false);
	}
}


let isCantactOpen = true;async function openContactOverlay(containerID, selectedContactsID) {
    let contactsContainer = document.getElementById(containerID);
    // Verhindere das wiederholte Hinzufügen von Kontakten
    contactsContainer.innerHTML = "";  // Container leeren

    if (isCantactOpen) {
        show(containerID);
        // Lade die Kontakte aus der Datenbank (wenn sie noch nicht geladen sind)
        await loadDatabaseContacts();
        // Kontakte im Container laden
        loadAllUsersForContactOnAssignedTo(contactsData, containerID);  // Hier übergibst du die Kontakte

        hide(selectedContactsID);
        hide("select-contacts_down");
        show("select-contacts_up");

        isCantactOpen = false;
    } else {
        hide(containerID);
        show(selectedContactsID);
        show("select-contacts_down");
        hide("select-contacts_up");
        isCantactOpen = true;
    }
}


// ab hier drei funktionen

function loadAllUsersForContactOnAssignedTo(assigneds, containerID, ID) {
    let contactsContainer = document.getElementById(containerID);
    contactsContainer.innerHTML = ""; 

    for (let i = 0; i < contactsData.length; i++) { 
        let userName = contactsData[i]["name"];
        let userBadge = generateUserBadge(userName);
        let badgeColor = contactsData[i]["bgcolor"];
        if (assigned.some(c => c.name === userName)) {
            contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, userName, i, ID);
        } else {
            contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, userName, i, ID);
        }
    }
    synchronizeCheckboxes(); 
}

window.assigned = []; 

function addContactAsAssigned(id, i, j) {
    let checkAssigned = document.getElementById(id);  
    let contact = contactsData[i];  
    let deleteContactIndex = assigned.findIndex(c => c.id === contact.id);  
    if (checkAssigned.checked) {  
        assigned.push({ name: contact.name, id: contact.id, bgcolor: contact.bgcolor }); 
    } else if (!checkAssigned.checked && deleteContactIndex !== -1) {  
        assigned.splice(deleteContactIndex, 1);
    }
    loadAssignedOnEditTask(assigned, "et_selected_contacts");
    synchronizeCheckboxes(); 
}

function synchronizeCheckboxes() {
    for (let i = 0; i < contactsData.length; i++) {
        const contact = contactsData[i];
        const checkbox = document.getElementById(`checkbox_${contact.id}`);
        if (checkbox) {
            checkbox.checked = assigned.some(c => c.id === contact.id);
        }
    }
}

function loadAssignedOnEditTask(assigneds, containerID) {
    let selectedContactsContainer = document.getElementById(containerID);
    selectedContactsContainer.innerHTML = "";

    for (let i = 0; i < assigneds.length; i++) {
        let assigned = assigneds[i];  
        let badgeColor = assigned.bgcolor;  
        let assignedName = assigned.name;  

        let userBadge = generateUserBadge(assignedName);  
        selectedContactsContainer.innerHTML += generateAssigmentBadgeEditTaskHTML(userBadge, badgeColor, i);
    }
	console.log(assigned); 
}


// bis hier



function filterUserOnAssignedTo(inputID, searchContainerID, id) {
	let searchTerm = document.getElementById(inputID).value;
	let assigneds = [];
	isNewTaskEmpty(newTask) ? (assigneds = addedTasks[id]["assigned"]) : (assigneds = newTask["assigned"]);
	searchTerm = searchTerm.toLowerCase();
	let contactsContainer = document.getElementById(searchContainerID);
	contactsContainer.innerHTML = "";
	if (searchTerm == "") {
		loadAllUsersForContactOnAssignedTo(assigneds, searchContainerID, id);
	} else {
		renderFilterdUsersOnAssignedTo(assigneds, searchTerm, id, contactsContainer);
	}
}

function renderFilterdUsersOnAssignedTo(assigneds, searchTerm, id, contactsContainer) {
	for (let i = 0; i < users.length; i++) {
		let userName = users[i]["name"];
		if (userName.toLowerCase().includes(searchTerm)) {
			let userBadge = generateUserBadge(userName);
			let badgeColor = users[i]["bgcolor"];
			if (assigneds.includes(userName)) {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, userName, i, id);
			} else {
				contactsContainer.innerHTML += generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, userName, i, id);
			}
		}
	}
}

function showSubtaskInput(addSubtaskID, checkSubtaskID) {
	hide(addSubtaskID);
	show(checkSubtaskID);
}

function cancelAddSubtask(addSubtaskID, checkSubtaskID) {
	show(addSubtaskID);
	hide(checkSubtaskID);
	document.getElementById("subtask_input").value = "";
}

function loadSubtask(taskID) {
	let tasks = [];
	if (isNewTaskEmpty(newTask)) {
		tasks = addedTasks.filter((t) => t["id"] === taskID);
		for (let index = 0; index < tasks.length; index++) {
			let task = tasks[index];
			let subtask = task["subtask"];
			return subtask;
		}
	} else {
		return newTask["subtask"];
	}
}

function loadSubtasksEditTask(subtaskListID, ID) {
	let subtaskContainer = document.getElementById(subtaskListID);
	subtaskContainer.innerHTML = "";
	let subtask = loadSubtask(ID);
	for (let i = 0; i < subtask.length; i++) {
		let subtitle = subtask[i]["subtitle"];
		subtaskContainer.innerHTML += generateSubtaskListItemHTML(subtitle, i, ID, "subtask_listitem_", "subtask_edit_container", "subtask_edit_input", "subtask_lists");
	}
}

function addSubtask(taskID, subtaskListItemID) {
	let subtask = loadSubtask(taskID);
	if (subtask_input.value == "") {
	} else {
		subtask.push({
			subdone: false,
			subtitle: subtask_input.value,
		});
		cancelAddSubtask("add_subtask", "check_subtask_icons");
		loadSubtasksEditTask(subtaskListItemID, taskID);
	}
}

function deleteSubtask(taskID, subTaskID, subtaskListItemID) {
	let subTask = loadSubtask(taskID);
	subTask.splice(subTaskID, 1);
	loadSubtasksEditTask(subtaskListItemID, taskID);
}

function showSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID) {
	hide(subtaskListItemID);
	show(subtaskEditFrameID);
}

function closeSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID) {
	hide(subtaskEditFrameID);
	show(subtaskListItemID);
}

function updateSubtask(taskID, subtaskListItemID, subtaskEditInputID, subtaskID, subtaskEditFrameID, subtaskList) {
	let subtask = loadSubtask(taskID);
	let subtaskEditInput = document.getElementById(subtaskEditInputID).value;
	if (subtaskEditInput.length !== 0) {
		subtask[subtaskID]["subtitle"] = subtaskEditInput;
		subtask[subtaskID]["subdone"] = false;
		closeSubtaskEditInputFrame(subtaskListItemID, subtaskEditFrameID);
		loadSubtasksEditTask(subtaskList, taskID);
	}
}