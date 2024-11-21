/**
 * Slides in a frame by removing the "slide-out" class and adding the "slide-in" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function frameSlideIn(id) {
    document.getElementById(id).classList.remove("slide-out");
    document.getElementById(id).classList.add("slide-in");
}

/**
 * Slides out a frame by removing the "slide-in" class and adding the "slide-out" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function frameSlideOut(id) {
    document.getElementById(id).classList.remove("slide-in");
    document.getElementById(id).classList.add("slide-out");
}

/**
 * Adds an overlay background to a frame by adding the "slider-bg" class and removing the "slider-center" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function addOverlayBg(id) {
    document.getElementById(id).classList.add("slider-bg");
    document.getElementById(id).classList.remove("slider-center");
}

/**
 * Removes the overlay background from a frame by removing the "slider-bg" class and adding the "slider-center" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function removeOverlayBg(id) {
    document.getElementById(id).classList.remove("slider-bg");
    document.getElementById(id).classList.add("slider-center");
}

/**
 * Adds a fixed background to main content by adding the "pos-fixed" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function addFixedBackround(id) {
    document.getElementById(id).classList.add("pos-fixed");
}

/**
 * Removes the fixed background from main content by removing the "pos-fixed" class.
 *
 * @param {string} id - The ID of the HTML element representing the frame.
 * @returns {void}
 */
function removeFixedBackround(id) {
    document.getElementById(id).classList.remove("pos-fixed");
}

/**
 * Asynchronously hides a task by performing several actions:
 * - Reloads the board.
 * - Slides out a frame using the frameSlideOut function.
 * - Removes the fixed background from the main container using removeFixedBackround function.
 * - Removes the overlay background using removeOverlayBg function.
 * - Delays hiding the task overlay background with a setTimeout function.
 * - Saves the updated addedTasks using setItem function.
 *
 * @param {string} id - The ID of the HTML element representing the task.
 * @returns {Promise<void>} - A promise that resolves when the task is hidden and data is saved.
 */
async function hideTaskOpen(id) {
    loadBoard();
    frameSlideOut(id);
    removeFixedBackround("main_container_board");
    show("sub_menu");
    removeOverlayBg("task_overlay_bg");

    setTimeout(function () {
        hide("task_overlay_bg");
    }, 400);
    await setItem("addedTasks", JSON.stringify(addedTasks));
}