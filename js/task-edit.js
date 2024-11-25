function loadTaskEdit(TaskID) {
    let tasks = addedTasks.filter((t) => t["id"] === TaskID);
    if (tasks.length === 0) {
        console.error(`Task with ID ${TaskID} not found.`);
        return;
    }
    console.log("Task loaded for editing:", tasks[0]); // Debugging

    let [id, bucket, title, description, prio, category, subtasks, assigneds, dueDate, rawDuedate] = getTaskVariables(tasks, 0);
    console.log("Subtasks passed to initEditTask:", subtasks); // Debugging

    document.getElementById("task_overlay_bg").innerHTML = "";
    initEditTask(id, title, description, prio, assigneds, rawDuedate, subtasks); // Subtasks weitergeben
}


async function updateTaskInBackend(taskID) {
    const task = addedTasks.find(t => t.id === taskID);

    const response = await fetch(`http://localhost:8000/api/tasks/${taskID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: task.title,
            description: task.description,
            assigned: task.assigned,
            dueDate: task.duedate,
            priority: task.prio,
            category: task.category,
            subtask: task.subtask,
            bucket: task.bucket,
        }),
    });

    if (response.ok) {
        console.log("Task successfully updated!");
    } else {
        console.error("Failed to update task:", response.statusText);
    }
}

function initEditTask(id, title, description, prio, assigneds, duedate, subtasks) {
    document.getElementById("task_overlay_bg").innerHTML = generateEditTaskHTML(id, title, description, duedate);
    loadAllUsersForContactOnAssignedTo(assigneds, "et_contact_overlay", id);
    loadAssignedOnEditTask(assigneds, "et_selected_contacts");
    setTodayDateForCalendar("calendar_edit_task");
    loadPrioOnEditTask(prio);
    loadSubtasksEditTask("subtask_lists", id, subtasks);
}


function updateOpenTask(taskID) {
    updateOpenTaskTitle(taskID);
    updateOpenTaskDesc(taskID);
    updateOpenTaskDueDate(taskID);
    updateTaskPriority(taskID);
	updateTaskInBackend(taskID);
    renderOpenTask(taskID);
}

function updateOpenTaskTitle(taskID) {
    let titleValue = document.getElementById("title_input_ed_task").value;
    task["title"] = titleValue;
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
    contactsContainer.innerHTML = "";  

    if (isCantactOpen) {
        show(containerID);
        await loadDatabaseContacts();
        loadAllUsersForContactOnAssignedTo(contactsData, containerID);  

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
}

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

function loadSubtasksEditTask(subtaskListID, ID, subtasks) {
    let subtaskContainer = document.getElementById(subtaskListID);
    subtaskContainer.innerHTML = "";

    if (!Array.isArray(subtasks)) {
        console.error("Subtasks are undefined or not an array:", subtasks);
        return;
    }

    for (let i = 0; i < subtasks.length; i++) {
        let subtitle = subtasks[i]["title"];
        let isDone = subtasks[i]["subdone"];
        subtaskContainer.innerHTML += generateSubtaskListItemHTML(subtitle, i, ID, isDone);
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