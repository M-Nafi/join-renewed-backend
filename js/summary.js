/**
 * Renders summary data including counts of various task buckets and urgent tasks.
 */
function renderSummaryData() {
    showTodo();
    showDone();
    showAllTask();
    showTaskInProgress();
    showAwaitingFeedback();
    showUrgentTask();
}

/**
 * Displays the count of tasks in 'to-do' bucket.
 */
function showTodo() {
    let todo = document.getElementById('sm_todo');
    let toDoCount = addedTasks.filter(task => task.bucket === 'to-do');
    todo.innerHTML = toDoCount.length;
}

/**
 * Displays the count of tasks in 'done' bucket.
 */
function showDone() {
    let done = document.getElementById('sm_done');
    let doneCount = addedTasks.filter(task => task.bucket === 'done');
    done.innerHTML = doneCount.length;
}

/**
 * Displays the count of all tasks.
 */
function showAllTask() {
    let allTasks = document.getElementById('sm_all_task');
    allTasks.innerHTML = addedTasks.length;
}

/**
 * Displays the count of tasks in 'in-progress' bucket.
 */
function showTaskInProgress() {
    let task = document.getElementById('progress_task');
    let progressTask = addedTasks.filter(task => task.bucket === 'in-progress');
    task.innerHTML = progressTask.length;
}

/**
 * Displays the count of tasks in 'await-feedback' bucket.
 */
function showAwaitingFeedback() {
    let awaiting = document.getElementById('sm_awaiting_fb');
    let task = addedTasks.filter(task => task.bucket === 'await-feedback');
    awaiting.innerHTML = task.length;
}

/**
 * Displays the count of urgent tasks and the nearest due date of an urgent task.
 */
function showUrgentTask() {
    let urgent = document.getElementById('sm_urgent');
    let dateDiv = document.getElementById('sm_duedate');
    let task = addedTasks.filter(task => task.prio === 'Urgent');
    if (task.length === 0) {
        urgent.innerHTML = 0;
    } else {
        let sortedTask = task.sort((a, b) => {
            const dateA = new Date(a.duedate);
            const dateB = new Date(b.duedate);
            return dateA - dateB;
        });
        let date = new Date(sortedTask[0].duedate);
        date = formatCustomDate(date);
        dateDiv.innerHTML = date;
        urgent.innerHTML = task.length;
    }
}

/**
 * Formats a given date into a custom string format.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatCustomDate(date) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${months[monthIndex]} ${day}, ${year}`;
}
