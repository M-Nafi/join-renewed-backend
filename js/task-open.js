// function loadTaskOpen(taskID) {
//     let tasks = addedTasks.filter((t) => t["id"] === taskID);
//     document.getElementById("task_overlay_bg").innerHTML = "";
//     for (let index = 0; index < tasks.length; index++) {
//         let task = tasks[index];
//         let title = task["title"];
//         let description = task["description"];
//         let prio = task["prio"];
//         let duedate = formatDueDate(task["duedate"]);
//         let category = task["category"];
//         let subtasks = task["subtask"];
//         let assigneds = task["assigned"];
//         showFrame("task_overlay_bg");
//         addOverlayBg("task_overlay_bg");
//         loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate);
//         frameSlideIn("task_open_overlay_frame");
//     }
// }

function loadTaskOpen(taskID) {
    let tasks = addedTasks.filter((t) => t["id"] === taskID);
    // console.log("Gefilterte Tasks:", tasks); // Überprüfe die Struktur
    document.getElementById("task_overlay_bg").innerHTML = "";
    for (let index = 0; index < tasks.length; index++) {
        let task = tasks[index];
        let title = task["title"];
        let description = task["description"];
        let prio = task["prio"];
        let duedate = formatDueDate(task["duedate"]);
        let category = task["category"];
        let subtasks = task["subtask"];
        let assigneds = task["assigned"]; 
        showFrame("task_overlay_bg");
        addOverlayBg("task_overlay_bg");
        loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate);
        frameSlideIn("task_open_overlay_frame");
    }
}


function renderOpenTask(taskID) {
    let tasks = addedTasks.filter((t) => t["id"] === taskID);
    document.getElementById("task_overlay_bg").innerHTML = "";
    for (let index = 0; index < tasks.length; index++) {
        let [taskID, bucket, title, description, prio, category, subtasks, assigneds, duedate] = getTaskVariables(
            tasks,
            index
        );

        loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate);
    }
}

function loadTask(taskID, title, description, prio, category, subtasks, assigneds, duedate) {
    let categoryColor = loadCategoryColor(category);
    document.getElementById("task_overlay_bg").innerHTML = generateOpenTaskHTML(
        taskID,
        title,
        description,
        category,
        categoryColor,
        duedate
    );
    loadTaskOpenPrio(prio, "task_open_prio");
    loadAssignedsOpenTask(assigneds, taskID);
    loadSubtasks(subtasks, "task_overlay_subtasks_container", taskID);
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

// function loadAssignedsOpenTask(assigneds, taskID) {
//     let assigned = document.getElementById("assigned_to_contacts_task_open");
//     assigned.innerHTML = "";
//     for (let i = 0; i < assigneds.length; i++) {
//         let badgeColor = getUserColor(assigneds, i);
//         let assignedUserName = assigneds[i];
//         let userBadge = generateUserBadge(assignedUserName);
//         assigned.innerHTML += generateAssigmentHTML(userBadge, badgeColor, assignedUserName, taskID);
//     }
// }

function loadAssignedsOpenTask(assigneds, taskID) {
    if (assigneds && assigneds.length > 0) {
        let assigned = document.getElementById("assigned_to_contacts_task_open");
        assigned.innerHTML = "";

        for (let i = 0; i < assigneds.length; i++) {
            let badgeColor = getUserColor(assigneds, i);
            let assignedUserName = assigneds[i];
            let userBadge = generateUserBadge(assignedUserName);
            assigned.innerHTML += generateAssigmentHTML(userBadge, badgeColor, assignedUserName, taskID);
        }
    } else {
        let assigned = document.getElementById("assigned_to_contacts_task_open");
        assigned.innerHTML = "<p>Keine Zuweisungen vorhanden</p>";
    }
}








function loadSubtasks(subtasks, elementID, taskID) {
    let subtasksContainer = document.getElementById(elementID);
    subtasksContainer.innerHTML = "";
    if (subtasks.length > 0) {
        for (let i = 0; i < subtasks.length; i++) {
            let subtask = subtasks[i];
            let subdone = subtask["subdone"];
            let subtitle = subtask["subtitle"];
            subtasksContainer.innerHTML += checkSubtask(subdone, subtitle, i, taskID);
        }
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
    if (checkSubtask.checked) {
        subtask["subdone"] = true;
    } else if (!checkSubtask.checked) {
        subtask["subdone"] = false;
    }
}

function getUserColor(assigneds, index) {
    let assignedName = assigneds[index];
    let filteredUser = users.filter((t) => t["name"] === assignedName);
    if (filteredUser.length > 0) {
        return filteredUser[0]["bgcolor"];
    }
}
