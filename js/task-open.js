function loadTaskOpen(taskID) {
    let tasks = addedTasks.filter((t) => t.id === taskID);
    document.getElementById("task_overlay_bg").innerHTML = "";
    tasks.forEach(task => {
        let { title, description, priority, category, subtask, assigneds, dueDate } = task;
        showFrame("task_overlay_bg");
        addOverlayBg("task_overlay_bg");
        loadTask(taskID, title, description, priority, category, subtask, assigneds, dueDate);
        frameSlideIn("task_open_overlay_frame");
    });
}

function renderOpenTask(taskID) {
    let tasks = addedTasks.filter((t) => t.id === taskID);
    document.getElementById("task_overlay_bg").innerHTML = "";
    tasks.forEach(task => {
        let { id, title, description, priority, category, subtask, assigneds, dueDate } = task;
        loadTask(id, title, description, priority, category, subtask, assigneds, dueDate);
    });
}

function loadTask(taskID, title, description, priority, category, subtask, assigneds, dueDate) {
    let categoryColor = loadCategoryColor(category);
    document.getElementById("task_overlay_bg").innerHTML = generateOpenTaskHTML(
        taskID,
        title,
        description,
        category,
        categoryColor,
        formatDueDate(dueDate)
    );
    loadTaskOpenPrio(priority, "task_open_prio");
    loadAssignedsOpenTask(assigneds, taskID);
    loadSubtasks(subtask, "task_overlay_subtasks_container", taskID);
}

function loadTaskOpenPrio(prio, taskID) {
    let taskPrioIcon = document.getElementById(taskID);
    if (prio === "Urgent") {
        taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateUrgentPrioIcon()}`;
    } else if (prio === "Medium") {
        taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateMediumPrioIcon()}`;
    } else if (prio === "Low") {
        taskPrioIcon.innerHTML = `<div>${prio}</div> ${generateLowPrioIcon()}`;
    }
}

function loadAssignedsOpenTask(assigneds, taskID) {
    const assignedElement = document.getElementById("assigned_to_contacts_task_open");
    assignedElement.innerHTML = ""; // Vorherige Inhalte löschen

    if (assigneds && assigneds.length > 0) {
        assigneds.forEach(assignedName => {
            const badgeColor = getUserColor(assignedName);
            const userBadge = generateUserBadge(assignedName); // Initialen generieren
            assignedElement.innerHTML += generateAssigmentHTML(userBadge, badgeColor, assignedName, taskID);
        });
    } else {
        assignedElement.innerHTML = "<p>Keine Zuweisungen vorhanden</p>";
    }
}


function loadSubtasks(subtasks, elementID, taskID) {
    let subtasksContainer = document.getElementById(elementID);
    subtasksContainer.innerHTML = "";
    if (subtasks.length > 0) {
        subtasks.forEach((subtask, i) => {
            let { subdone, title } = subtask;
            subtasksContainer.innerHTML += checkSubtask(subdone, title, i, taskID);
        });
    } else {
        clearElement("label_task_open_subtask");
    }
}

function checkSubtask(subdone, subtitle, subtaskNumber, taskID) {
    if (subdone) {
        return generateSubtasksCheckedHTML(subtitle, subtaskNumber, taskID);
    } else {
        return generateSubtasksHTML(subtitle, subtaskNumber, taskID);
    }
}

function clearElement(id) {
    document.getElementById(id).innerHTML = "";
}

function changeSubtaskConfirmation(elementID, subtaskNumber, taskID) {
    let checkSubtask = document.getElementById(elementID);
    let subtask = addedTasks[taskID].subtask[subtaskNumber];
    subtask.subdone = checkSubtask.checked;
}

function getUserColor(assignedNames) {
    console.log(assignedNames);
    for (const assignedName of assignedNames) {
        const name = assignedName.name;  
        const user = contactsData.find(contact => contact.name.toLowerCase() === name.toLowerCase());
        if (user) {
            return user.bgcolor; 
        }
    }
}

// // eingeloggter user...
// function getUserColor(assigned, assignedName, id) {
//     let filteredUser = users.filter((user) => user.name === assignedName);
//     if (filteredUser.length > 0) {                             
//         return filteredUser[0].bgcolor;
//     }
// }
