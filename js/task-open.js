async function fetchTaskDetails(taskID) {
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${taskID}/`);
        if (response.ok) {
            const task = await response.json();
            console.log("Fetched task details:", task); 
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                assigned: task.assigned || [],
                dueDate: task.dueDate,
                priority: task.priority || "Medium",
                category: task.category,
                subtask: (task.subtask || []).map(sub => ({
                    title: sub.title || sub,
                    subdone: sub.subdone !== undefined ? sub.subdone : false,
                })),
                bucket: task.bucket,
            };
        } else {
            console.error("Fehler beim Abrufen der Task-Details:", response.statusText);
        }
    } catch (error) {
        console.error("Netzwerkfehler beim Laden der Task-Details:", error);
    }
    return null; 
}

async function loadTaskOpen(taskID) {
    const task = await fetchTaskDetails(taskID);
    if (task) {
        document.getElementById("task_overlay_bg").innerHTML = "";
        showFrame("task_overlay_bg");
        addOverlayBg("task_overlay_bg");
        renderOpenTask(task); 
        frameSlideIn("task_open_overlay_frame");
    } else {
        console.error("Task konnte nicht geladen werden.");
    }
}

async function renderOpenTask(task) {
    if (!task.id) {
        console.error("Fehler: Task-ID ist undefined!");
        return;
    }
    const updatedTask = await fetchTaskDetails(task.id);
    if (updatedTask) {
        let { id, title, description, priority, category, subtask, assigned, dueDate } = updatedTask;
        loadTask(id, title, description, priority, category, subtask, assigned, dueDate);
    } else {
        console.error("Task konnte nicht geladen werden.");
    }
}

async function fetchTaskDetails(taskID) {
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${taskID}/`);
        if (response.ok) {
            const task = await response.json();
            return task;
        } else {
            console.error("Fehler beim Abrufen der Task-Details:", response.statusText);
        }
    } catch (error) {
        console.error("Netzwerkfehler beim Laden der Task-Details:", error);
    }
    return null; 
}

function loadTask(taskID, title, description, priority, category, subtask, assigned, dueDate) {
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
    loadAssignedsOpenTask(assigned, taskID);
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
    assignedElement.innerHTML = ""; 
 
    if (assigneds && assigneds.length > 0) {
        assigneds.forEach(assigned => {
            const badgeColor = getUserColors([assigned])[0]; 
            const userBadge = generateUserBadge(assigned); 
            assignedElement.innerHTML += generateAssigmentHTML(userBadge, badgeColor, assigned.name, taskID);
        });
    } else {
        assignedElement.innerHTML = "<p>Keine Zuweisungen vorhanden</p>";
    }
}
 
function loadSubtasks(subtasks, elementID, taskID) {
    const subtasksContainer = document.getElementById(elementID);
    if (!subtasksContainer) {
        console.error("Subtasks-Container nicht gefunden:", elementID);
        return;
    }
    if (!subtasks || !Array.isArray(subtasks)) {
        console.error("Subtasks ist undefined oder kein Array:", subtasks);
        subtasksContainer.innerHTML = "<p>Keine Subtasks vorhanden</p>";
        return;
    }
    subtasksContainer.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        const { subdone, title } = subtask;
        subtasksContainer.innerHTML += checkSubtask(subdone, title, index, taskID);
    });
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
    let task = addedTasks.find((task) => task.id === taskID);
 
    if (task) {
        let subtask = task.subtask[subtaskNumber];
        subtask.subdone = checkSubtask.checked;
        let done = task.subtask.filter(sub => sub.subdone).length;
        let allSubtasks = task.subtask.length;
        document.getElementById(`subtasks_container_${taskID}`).innerHTML = generateSubtaskProgressHTML(allSubtasks, done);
    }
}
 
function getUserColors(assignedNames) {
    return assignedNames.map(assignedName => {
        const name = assignedName.name;  
        const user = contactsData.find(contact => contact.name.toLowerCase() === name.toLowerCase());
        return user ? user.bgcolor : "#000000";
    });
}

// // eingeloggter user...
// function getUserColor(assigned, assignedName, id) {
//     let filteredUser = users.filter((user) => user.name === assignedName);
//     if (filteredUser.length > 0) {                             
//         return filteredUser[0].bgcolor;
//     }
// }
