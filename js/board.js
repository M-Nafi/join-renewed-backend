let addedTasks = [];
let storageTasks = [];
let filteredTasks = [];


async function initBoard() {
    await loadDatabaseContacts();
    await loadAddedTasksFromStorage();
    loadBoard();
    loadCurrentUser();
    loadUserBadge();
}

async function clearAddedTasksRemoteSTRG() {
    addedTasks = [];
    await setItem("addedTasks", JSON.stringify(addedTasks));
}

async function loadAddedTasksFromStorage() {
    try {
        const response = await fetch('http://localhost:8000/api/tasks/');
        if (response.ok) {
            const tasks = await response.json();
            addedTasks = tasks.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                assigned: task.assigned || [],
                dueDate: task.dueDate,
                priority: task.priority || "Medium",
                category: task.category,
                subtask: (task.subtask || []).map(sub => ({
                    title: sub.title || sub,
                    subdone: sub.subdone !== undefined ? sub.subdone : false 
                })),
                bucket: task.bucket,
            }));
            loadBoard(); 
        } else {
            console.error("Fehler beim Laden der Tasks: Response nicht ok");
        }
    } catch (e) {
        // console.error("Fehler beim Abrufen der Tasks:", e);
    }
}

function loadBoard() {
    for (let i = 0; i < buckets.length; i++) {
        let bucket = buckets[i];
        updateBoard(bucket);
        loadNoTasksLabel(bucket);
    }
}

function updateBoard(currentBucket) {
    let tasks = getTasksPerBucket(currentBucket);
    for (let index = 0; index < tasks.length; index++) {
        let [id, bucket, title, description, priority, category, subtasks, assigneds, dueDate, rawDuedate] = getTaskVariables(tasks, index);
        loadCard(id, bucket, title, description, priority, category, subtasks, assigneds);
    }
}


function getTasksPerBucket(currentBucket) {
    let tasks = [];
    if (filteredTasks.length == 0) {
        tasks = addedTasks.filter((t) => t["bucket"] == currentBucket);
    } else {
        tasks = filteredTasks.filter((t) => t["bucket"] == currentBucket);
    }
    document.getElementById(currentBucket).innerHTML = "";
    return tasks;
}

function getTaskVariables(tasks, index) {
    let task = tasks[index];
    let id = task["id"];
    let bucket = task["bucket"];
    let title = task["title"];
    let description = task["description"];
    let priority = task["priority"]; 
    let category = task["category"];
    let subtasks = task["subtask"]; 
    let assigneds = task["assigned"]; 
    let duedate = formatDueDate(task["dueDate"]); 
    let rawDuedate = task["dueDate"]; 
    return [id, bucket, title, description, priority, category, subtasks, assigneds, duedate, rawDuedate];
}



function loadCard(id, bucket, title, description, priority, category, subtasks, assigneds) {
    let categoryColor = loadCategoryColor(category);
    document.getElementById(bucket).innerHTML += generateCardHTML(id, title, description, category, categoryColor);
    loadSubtaskProgressBar(subtasks, id); 
    addAssignedsBadgesToCard(assigneds, id);
    loadCardPriorityIcon(priority, id);
}

function loadNoTasksLabel(bucket) {
    let taskColumn = document.getElementById(bucket);
    if (taskColumn.innerHTML === "") {
        let formatBucket = formatNoTaskLabelString(bucket);
        taskColumn.innerHTML = generateNoTaskHTML(formatBucket);
    }
}

function loadSubtaskProgressBar(subtasks, id) {
    let allSubtask = subtasks.length;
    let done = loadSubtaskAreDone(subtasks);
    if (allSubtask > 0) {
        document.getElementById(`subtasks_container_${id}`).innerHTML = generateSubtaskProgressHTML(allSubtask, done);
    } else {
        document.getElementById(`subtasks_container_${id}`).innerHTML = "Keine Subtasks";
    }
}

function addAssignedsBadgesToCard(assigneds, id) {
    if (Array.isArray(assigneds) && assigneds.length > 0) {
        for (let i = 0; i < assigneds.length; i++) {
            let [badgeColor, userBadge, assignedLimit, addLimit] = getVariableForAssignedsUserBadge(assigneds, i);
            if (i <= addLimit) {
                renderAssignedBadge(userBadge, badgeColor, id);
            } else if (i == assignedLimit && assigneds.length > 6) {
                renderAssignedBadgeWithLimit(id, assigneds, assignedLimit);
            }
        }
    } else {
        // console.warn('assigneds ist entweder undefined oder leer, keine Kontakte vorhanden.');
    }
}

function getVariableForAssignedsUserBadge(assigneds, i) {
    const badgeColor = getUserColors([assigneds[i]])[0]; 
    const assignedUserName = assigneds[i];
    const userBadge = generateUserBadge(assignedUserName);
    const assignedLimit = assigneds.length - 1;
    const addLimit = 5;
    return [badgeColor, userBadge, assignedLimit, addLimit];
}


function renderAssignedBadge(userBadge, badgeColor, id) {
    document.getElementById(`task_assignment_container_${id}`).innerHTML += generateAssignedBadgeHTML(userBadge, badgeColor);
}

function renderAssignedBadgeWithLimit(id, assigneds) {
    let limit = assigneds.length - 6;
        document.getElementById(`task_assignment_container_${id}`).innerHTML += `<div class="assigned-limit">+${limit}</div>`;
}

function loadCardPriorityIcon(priority, id) { 
    let taskPrioIcon = document.getElementById(`task_prio_img_${id}`);
    if (priority === "Urgent") {
        taskPrioIcon.innerHTML = generateUrgentPrioIcon();
    } else if (priority === "Medium") {
        taskPrioIcon.innerHTML = generateMediumPrioIcon();
    } else if (priority === "Low") {
        taskPrioIcon.innerHTML = generateLowPrioIcon();
    }
}


function loadSubtaskAreDone(subtasks) {
    let doneSubtask = 0;
    subtasks.forEach(subtask => {
        if (subtask.subdone) { 
            doneSubtask++;
        }
    });
    return doneSubtask;
}



function loadCategoryColor(category) {
    if (category === "Technical Task") {
        return "#1fd7c1";
    } else if (category === "User Story") {
        return "#0038FF";
    }
}

function show(id) {
    document.getElementById(id).classList.remove("d-none");
}

function hide(id) {
    document.getElementById(id).classList.add("d-none");
}

function showFrame(id) {
    hide("sub_menu");
    addFixedBackround("main_container_board");
    addOverlayBg(id);
    show(id);
}

async function deleteTask(TaskID) {
    try {
        const response = await fetch(`http://localhost:8000/api/tasks/${TaskID}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            addedTasks = addedTasks.filter((task) => task.id !== TaskID);
            updateTaskID();  
            loadBoard();
            console.log('Task wurde erfolgreich gelöscht.');
        } else {
            const errorData = await response.text();
            console.error('Fehler beim Löschen der Aufgabe:', response.statusText);
        }
    } catch (error) {
        console.error('Netzwerkfehler:', error);
    }
    hideTaskOpen("task_open_overlay_frame");
}

function updateTaskID() {
    for (let i = 0; i < addedTasks.length; i++) {
        let task = addedTasks[i];
        task["id"] = i;
    }
}

function generatePercentInWidth(allSubtask, done) {
    let percentInWidth = (done / allSubtask) * 100;
    return percentInWidth;
}

function formatNoTaskLabelString(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    let formattedStr = str.replace("-", " ");
    return formattedStr;
}

function formatDueDate(dueDate) {
    if (dueDate && typeof dueDate === 'string' && dueDate.includes("-")) {
        let dateParts = dueDate.split("-");
        let formattedDate = dateParts[2] + "/" + dateParts[1] + "/" + dateParts[0]; 
        return formattedDate;
    }
    return dueDate; 
}


async function clearRemoteStorage() {
    users = [];
    await setItem("users", JSON.stringify(users));
}

function searchTask() {
    let searchTerm = find_task.value;
    clearBoard();
    filteredTasks = addedTasks.filter(
        (t) => t["title"].toLowerCase().includes(searchTerm.toLowerCase()) || t["description"].toLowerCase().includes(searchTerm.toLowerCase())
    );
    loadBoard();
    errorNoteSearchTask("no_task_found");
}

function searchTaskMobile() {
    let searchTerm = find_task_mobile.value;
    clearBoard();
    filteredTasks = addedTasks.filter(
        (t) => t["title"].toLowerCase().includes(searchTerm.toLowerCase()) || t["description"].toLowerCase().includes(searchTerm.toLowerCase())
    );
    loadBoard();
    errorNoteSearchTask("no_task_found_mobile");
}

function errorNoteSearchTask(searchID) {
    if (filteredTasks.length == 0) {
        document.getElementById(searchID).style.display = "block";
    }
}

function clearBoard() {
    for (let i = 0; i < buckets.length; i++) {
        let bucket = buckets[i];
        document.getElementById(bucket).innerHTML = "";
    }
}

function closeFilter() {
    let searchTerm = find_task.value;
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm.length == 0) {
        document.getElementById("no_task_found").style.display = "none";
        filteredTasks = [];
        loadBoard();
    }
}

function doNotForward(event) {
    event.stopPropagation();
}