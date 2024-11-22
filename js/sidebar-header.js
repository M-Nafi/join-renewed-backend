let isSubMenu = false;

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

function activeMenuLink() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link";
    document.getElementById(urlAsId).classList.add("sidebar-button-selected");
}

function activeMenuLinkMobile() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link_mobile";
    document.getElementById(urlAsId).classList.add("sidebar-button-selected");
}

function activeInfoLink() {
    let urlAsId = window.location.pathname.split("/").pop().split(".html")[0] + "_link";
    document.getElementById(urlAsId).classList.add("sidebar-privacy-button-selected");
}

function loadUserBadge() {
    let userBadgeContainer = document.getElementById("user_initials");
    i = currentUser;
    if (i >= 0) {
        let userName = users[i]["name"];
        let userInitials = generateUserBadge(userName);
        userBadgeContainer.innerHTML = userInitials;
    }
}

function generateUserBadge(input) {
    let fullName = "";
    if (typeof input === "object" && typeof input.name === "string") {
        fullName = input.name;
    } 
    else if (typeof input === "string") {
        fullName = input;
    } 
    else {
        console.error("Expected a string or an object with a 'name' property, but got:", input);
        return ""; 
    }
    let nameParts = fullName.split(" "); 
    let firstNameInitial = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : "";
    let lastNameInitial = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : "";
    return firstNameInitial + lastNameInitial; 
}

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
