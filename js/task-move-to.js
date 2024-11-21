let currentDraggedElement;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("find_task").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            //searchTask();
        }
    });
    // window.addEventListener("resize", updateHeight);
});

/**
 * Saves the current task ID
 * @param {int} id - ID from the drag elements
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Handles the "dragover" event, allowing the dropping of dragged elements.
 *
 * @param {Event} ev - The "dragover" event object.
 * @returns {void} - No return value.
 *
 * @description
 * This function prevents the default behavior of the dragover event, allowing the dropping of dragged elements.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * The position of the column is changed in the array and the board is reloaded
 * @param {String} bucket - HTML Id from the drop zone
 */
async function moveTo(bucket) {
    addedTasks[currentDraggedElement]["bucket"] = bucket;
    loadBoard();
    await setItem("addedTasks", JSON.stringify(addedTasks));
}

/**
 * The target dropzone is highlighted when draging
 * @param {int} id - ID from the drag elements
 */
function highlight(id) {
    document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * The target dropzone remove highlighted when element ist drop
 * @param {int} id - ID from the drag elements
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("drag-area-highlight");
}
