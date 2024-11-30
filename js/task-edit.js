window.assigned = []; 
let assigneds = [];
let isCantactOpen = true;

async function loadTaskEdit(TaskID) {
    let tasks = addedTasks.filter((t) => t["id"] === TaskID);
    if (tasks.length === 0) {
        console.error(`Task with ID ${TaskID} not found.`);
        return;
    }
    let [id, bucket, title, description, prio, category, subtasks, taskAssigneds, dueDate, rawDuedate] = getTaskVariables(tasks, 0);
    assigneds = taskAssigneds;
    document.getElementById("task_overlay_bg").innerHTML = "";
    initEditTask(id, title, description, prio, assigneds, rawDuedate, subtasks);
}

async function updateTaskInBackend(taskID) {
    const task = addedTasks.find(t => t.id === taskID); 
    if (!task) {
        console.error(`Task mit ID ${taskID} nicht gefunden`);
        return;
    }
    const updatedTaskData = {
        title: task.title,
        description: task.description,
        assigned: task.assigned,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        subtask: task.subtask
    };
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${taskID}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTaskData),
        });
        if (response.ok) {
            return;
        } else {
            console.error(`Failed to update task: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error updating task:", error);
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
    loadTaskOpen(taskID); 
    renderOpenTask(taskID);  
}

function updateOpenTaskTitle(taskID) {
    let task = addedTasks.find(t => t.id === taskID);  
    if (!task) {
        console.error(`Task mit ID ${taskID} nicht gefunden`);
        return;
    }
    let titleValue = document.getElementById("title_input_ed_task").value;
    if (!titleValue) {
        console.error("Title input is empty");
    }
    task["title"] = titleValue;
}

function updateOpenTaskDesc(taskID) {
    let task = addedTasks.find(t => t.id === taskID); 
    if (!task) {
        console.error(`Task mit ID ${taskID} nicht gefunden.`);
        return; 
    }
    let descValue = document.getElementById("description_ed_task").value;
    task["description"] = descValue; 
}

function updateOpenTaskDueDate(taskID) {
    let task = addedTasks.find(t => t.id === taskID);  
    if (!task) {
        console.error(`Task mit ID ${taskID} nicht gefunden.`);
        return; 
    }
    let dueDateValue = document.getElementById("calendar_edit_task").value;
    task["dueDate"] = dueDateValue;  
}

function updateTaskPriority(taskID) {
    let task = addedTasks.find(t => t.id === taskID);
    if (!task) {
        console.error(`Task mit ID ${taskID} nicht gefunden.`);
        return; 
    }
    let prio = "";
    if (globalPrioButtonID !== "") {
        prio = document.getElementById(globalPrioButtonID).value;
    }
    task["priority"] = prio;
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

async function openContactOverlay(containerID, selectedContactsID) {
    let contactsContainer = document.getElementById(containerID);
    contactsContainer.innerHTML = "";
    if (isCantactOpen) {
        show(containerID);
        await loadDatabaseContacts();
        loadAllUsersForContactOnAssignedTo(contactsData, containerID);  
        setTimeout(() => synchronizeCheckboxes(), 100);
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

function renderAssignedContacts(assigned) {
    contactsData.forEach((contact) => {
        const isChecked = assigned.some(assignedContact => assignedContact.id === contact.id);
        const contactHTML = generateEditTaskAssigmentContactHTML(
            contact.bgcolor, 
            contact.name.charAt(0), 
            contact.name, 
            contact.id, 
            isChecked
        );
    });
}

function loadAllUsersForContactOnAssignedTo(contactsData, containerID, taskID) {
    let contactsContainer = document.getElementById(containerID);
    contactsContainer.innerHTML = "";
    contactsData.forEach((contact, index) => {
        const isAssigned = assigneds.some(assignedContact => assignedContact.id === contact.id);
        const contactHTML = generateEditTaskAssigmentContactHTML(
            contact.bgcolor,
            contact.name.charAt(0),
            contact.name,
            index,
            taskID,
            isAssigned
        );
        contactsContainer.innerHTML += contactHTML;
    });
    synchronizeCheckboxes(taskID);
}

function addContactAsAssigned(checkboxID, i, ID) {
    let checkAssigned = document.getElementById(checkboxID);
    if (checkAssigned) {
        let contact = contactsData[i];
        if (!contact) {
            console.error("Kontakt nicht gefunden:", i);
            return;
        }
        let deleteContactIndex = assigneds.findIndex(c => c.id === contact.id);
        if (checkAssigned.checked) {
            if (deleteContactIndex === -1) {
                assigneds.push({ name: contact.name, id: contact.id, bgcolor: contact.bgcolor });
            }
        } else {
            if (deleteContactIndex !== -1) {
                assigneds.splice(deleteContactIndex, 1);
            }
        }
        loadAssignedOnEditTask(assigneds, "et_selected_contacts");
        synchronizeCheckboxes(ID);
    }
}

function synchronizeCheckboxes(taskID) {
    contactsData.forEach((contact, index) => {
        let checkbox = document.getElementById(`checkbox_${taskID}_${index}`);
        if (checkbox) {
            checkbox.checked = assigneds.some(a => a.id === contact.id);
        }
    });
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