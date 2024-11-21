/**
 * Checks the current URL path and activates the corresponding links in the desktop and mobile sidebars.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the current URL path using the window.location object.
 * 2. Checks if the path corresponds to specific pages related to tasks, board, and contacts.
 *    - If true, activates the links in both the desktop and mobile sidebars using the activeMenuLink and activeMenuLinkMobile functions.
 * 3. Checks if the path corresponds to pages related to privacy policy or legal notice.
 *    - If true, activates the links related to information using the activeInfoLink function.
 */
function checkPath() {
    let currentPath = window.location.pathname;

    if (
        currentPath === "/Join/summary.html" ||
        currentPath === "/Join/add_task.html" ||
        currentPath === "/Join/board.html" ||
        currentPath === "/Join/contacts.html"
    ) {
        activeMenuLink();
        activeMenuLinkMobile();
    }
    if (currentPath === "/Join/privacy_policy.html" || currentPath === "/Join/legal_notice.html") {
        activeInfoLink();
    }
}

/**
 * Activates the link in the desktop sidebar corresponding to the current page.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Extracts the current page's ID from the URL by manipulating the window.location object.
 * 2. Constructs the ID for the corresponding link in the desktop sidebar.
 * 3. Adds the CSS class "sidebar-button-selected" to highlight the active link.
 */
function activeMenuLink() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link";
    document.getElementById(urlAsId).classList.add("sidebar-button-selected");
}

/**
 * Activates the link in the mobile sidebar corresponding to the current page.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Extracts the current page's ID from the URL by manipulating the window.location object.
 * 2. Constructs the ID for the corresponding link in the mobile sidebar.
 * 3. Adds the CSS class "sidebar-button-selected" to highlight the active link.
 */
function activeMenuLinkMobile() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link_mobile";
    document.getElementById(urlAsId).classList.add("sidebar-button-selected");
}

/**
 * Activates the link in the sidebar corresponding to the current page.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Extracts the current page's ID from the URL by manipulating the window.location object.
 * 2. Constructs the ID for the corresponding link in the sidebar.
 * 3. Adds the CSS class "sidebar-privacy-button-selected" to highlight the active link.
 */
function activeInfoLink() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link";
    document.getElementById(urlAsId).classList.add("sidebar-privacy-button-selected");
}

/**
 * Loads the user badge for the current user and displays it in the specified container.
 *
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the user badge container using the ID "user_initials."
 * 2. Checks if the currentUser variable is a valid index.
 * 3. If the index is valid, retrieves the user's name.
 * 4. Generates the user badge using the generateUserBadge function.
 * 5. Updates the inner HTML of the user badge container with the generated user badge.
 */
function loadUserBadge() {
    let userBadgeContainer = document.getElementById("user_initials");
    i = currentUser;
    if (i >= 0) {
        let userName = users[i]["name"];
        let userInitials = generateUserBadge(userName);
        userBadgeContainer.innerHTML = userInitials;
    }
}

/**
 * Generates a user badge based on the provided full name.
 *
 * @param {string} fullName - The full name of the user.
 * @returns {string} - The generated user badge, which consists of the initials (first letter of first name and last name).
 *
 * @description
 * This function performs the following steps:
 * 1. Splits the full name into individual name parts using the space character.
 * 2. Retrieves the first name initial (first letter of the first name) and capitalizes it.
 * 3. Retrieves the last name initial (first letter of the last name) and capitalizes it.
 * 4. Concatenates the first name initial and last name initial to create the user badge.
 * 5. Returns the generated user badge.
 */
// function generateUserBadge(fullName) {
//     let nameParts = fullName.split(" ");
//     let firstNameInitial = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
//     let lastNameInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";
//     return firstNameInitial + lastNameInitial;
// }

function generateUserBadge(fullName) {
    let nameParts = fullName.split(" "); // Teile den Namen in Vor- und Nachname
    let firstNameInitial = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
    let lastNameInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstNameInitial + lastNameInitial; // Kombiniere die Initialen
}


let isSubMenu = false;

/**
 * Toggles the visibility of a submenu based on its element ID and a specified CSS class.
 *
 * @param {string} elementID - The ID of the submenu element.
 * @param {string} usedClass - The CSS class used to show/hide the submenu.
 * @returns {void} - No return value.
 *
 * @description
 * This function performs the following steps:
 * 1. Retrieves the submenu element using the provided element ID.
 * 2. Checks if the submenu is currently visible by checking the presence of the specified CSS class.
 * 3. If the submenu is visible, adds the specified CSS class to hide it and sets the flag isSubMenu to false.
 * 4. If the submenu is hidden, removes the specified CSS class to show it and sets the flag isSubMenu to true.
 */
function showSubmenu(elementID, usedClass) {
    let subMenu = document.getElementById(elementID);
    if (isSubMenu) {
        subMenu.classList.add(usedClass);
        isSubMenu = false;
    } else {
        subMenu.classList.remove(usedClass);
        isSubMenu = true;
    }
}
