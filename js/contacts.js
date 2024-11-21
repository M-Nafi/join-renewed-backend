let selectedContactIndex = null;
let colorIndex = 0;
let isEditing = false;

let contactsData = [
    // {
    //     name: "Anton Meyer",
    //     email: "antom@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#6E52FF",
    // },
    // {
    //     name: "Anja Schulz",
    //     email: "schulz@hotmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#FF7A00",
    // },
    // {
    //     name: "Benedikt Ziegler",
    //     email: "benedikt@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#9327FF",
    // },
    // {
    //     name: "David Eisenberg",
    //     email: "davidberg@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#FC71FF",
    // },
    // {
    //     name: "Eva Fischer",
    //     email: "eva@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#FFBB2B",
    // },
    // {
    //     name: "Emmanuel Mauer",
    //     email: "emmanuelma@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#1FD7C1",
    // },
    // {
    //     name: "Marcel Bauer",
    //     email: "bauer@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#462F8A",
    // },
    // {
    //     name: "Tatjana Wolf",
    //     email: "wolf@gmail.com",
    //     phone: "0123 45678910",
    //     bgcolor: "#FF5EB3",
    // },
];

let contactCircleColors = [
    "#FF7A00",
    "#9327FF",
    "#6E52FF",
    "#FC71FF",
    "#FFBB2B",
    "#1FD7C1",
    "#462F8A",
    "#FF4646",
    "#00BEE8",
    "#FF5EB3",
    "#FFA35E",
    "#FF745E",
    "#C3FF2B",
    "#0038FF",
    "#FFC701",
    "#FFE62B",
];


// ALTE funktion ohne Backend
// /**
//  * this function initailizes the contacts and loads user data
//  */
// async function initContacts() {
//     await loadUsers();
//     await loadAddedTasksFromStorage();
//     loadCurrentUser();
//     loadUserBadge();
//     sortContactsAlphabetically(users);
//     renderDifferentContacts();
// }


// NEUE funktion MIT backend

async function initContacts() {
    await loadUsers(); 
    await loadAddedTasksFromStorage();  
    await loadDatabaseContacts();  
    loadCurrentUser();  
    loadUserBadge();  
    sortContactsAlphabetically(contactsData);  
    renderDifferentContacts();  
}

/**
 * this function sorts the contact-array alphabetically by their name
 * @param {object} contacts - an array of objects, each representing contact with "name"
 */
function sortContactsAlphabetically(contacts) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * this fucntion renders the contact view and sets up edit functionality based on the users login status
 * if user is logged in, function renders contacts for the logged-in user, otherwise it renders all contacts
 */
function renderDifferentContacts() {
    let contactsContainer = document.getElementById("contact_container");
    let contactsHTML;
    if (currentUser >= 0) {
        contactsHTML = renderLoggedContactsHTML();
    } else {
        contactsHTML = generateContactsHTML(contactsData);
    }
    contactsContainer.innerHTML = contactsHTML;
    setupEditFunctionality();
}

/**
 * this function renders contacts for a logged-in user and set up edit functionality
 */
function renderLoggedContacts() {
    let contactsContainer = document.getElementById("contact_container");
    let contactsHTML = renderLoggedContactsHTML();
    contactsContainer.innerHTML = contactsHTML;
    setupEditFunctionality();
}

/**
 * this generates html for rendering contacts or logged-in contact/user
 * @returns {string} the string represents rendered contacts
 */
function renderLoggedContactsHTML() {
    return generateContactsHTML(users);
}

/**
 * this function generates html for rendering contacts
 * @param {object} contacts - array of contact objects
 * @returns {string} html string represents rendered contacts
 */
function generateContactsHTML(contacts) {
    let contactsHTML = "";
    let alphabetLetters = {};
    contacts.forEach((contact, index) => {
        let initials = getInitials(contact.name);
        let firstLetter = initials.charAt(0).toUpperCase();
        let circleColor = contact.bgcolor || contact.color || getRandomColor();
        if (!alphabetLetters[firstLetter]) {
            alphabetLetters[firstLetter] = true;
            contactsHTML += createAlphabetHTML(firstLetter);
        }
        contactsHTML += generateContactHTML(contact, initials, circleColor, index);
    });
    return contactsHTML;
}

/**
 * this function sets up edit functionality for contacts
 */
function setupEditFunctionality() {
    let editLinks = document.getElementsByClassName("edit-text");
    for (let i = 0; i < editLinks.length; i++) {
        editLinks[i].addEventListener("click", function () {
            editContacts(i);
        });
    }
}

/**
 * this function gets the contact for the current user based on given index
 * @param {number} index - index of the contact
 * @returns {Object} the contact object for the current user
 */
function getCurrentUserContact(index) {
    if (currentUser >= 0) {
        return users[index];
    } else {
        return contactsData[index];
    }
}

/**
 * this function removes active-style from contact and resetting background and color
 * @param {html element} contact - contact element
 */
function removeActiveContactStyles(contact) {
    contact.classList.remove("active-contact");
    contact.style.backgroundColor = "";
    let nameElement = contact.getElementsByClassName("contact-name")[0];
    nameElement.style.color = "";
}

/**
 * this fucntion activates styles for a contact. setting background color, adding active-contact class, and updating text color
 * @param {html element} contact - contact element
 */
function activateContactStyles(contact) {
    contact.style.backgroundColor = "#2a3647";
    contact.classList.add("active-contact");
    let nameElement = contact.getElementsByClassName("contact-name")[0];
    nameElement.style.color = "white";
}

/**
 * this function deactivates styles for all contacts by removing active-contact class and resetting background and text colors
 */
function deactivateAllContacts() {
    let contacts = document.getElementsByClassName("contact-container");
    for (let i = 0; i < contacts.length; i++) {
        let currentContact = contacts[i];
        if (currentContact.classList.contains("active-contact")) {
            removeActiveContactStyles(currentContact);
        }
    }
}

/**
 * this function updates contact details with specified contact info
 * @param {object} selectedContact - selected contact as object
 * @param {string} circleColor - color for the contact circle
 * @param {string} contactInitials - initials of the contact
 */
function updateContactDetails(selectedContact, circleColor, contactInitials) {
    let contactDetails = document.getElementById("show_contact_details");
    contactDetails.innerHTML = createContactDetailsHTML(selectedContact, circleColor, contactInitials);
    contactDetails.classList.remove("d-none");
    contactDetails.classList.add("show");
}



/**
 * this function shows or hides contact details based on selected/choosed index/contact
 * activates or deactivates the contact details and adjusts the responsive layout accordingly
 * @param {number} selectedIndex - index of the selected contact
 */
function showContactDetails(selectedIndex) {         
    let contact = document.getElementById(`contact-${selectedIndex}`);
    let isActive = contact ? contact.classList.contains("active-contact") : false;
    let contactDetails = document.getElementById("show_contact_details");

    if (isActive) {
        deactivateContactDetails(contact);
    } else if (contact) {
        activateDetailAndDisplay(selectedIndex, contact);        
        if (window.innerWidth < 850) {
            showResponsiveContactDetails();
            showResponsiveArrowBack();
            hideResponsiveEditMenu();                         
            }
    }
}

/**
 * this function activates contact details and display them for the selected contact index
 * @param {number} selectedIndex - index of selected contact
 * @param {html element} contact - contact element
 */
function activateDetailAndDisplay(selectedIndex, contact) {
    activateContactDetails(contact);
    let circleColor = contact.querySelector(".contact-circle > svg > circle").getAttribute("fill");
    let selectedContact = getCurrentUserContact(selectedIndex);
    let contactInitials = getInitials(selectedContact.name);
    let contactDetails = document.getElementById("show_contact_details");
    if (contactDetails) {
        updateContactDetails(selectedIndex, circleColor, contactInitials);
        contactDetails.classList.remove("d-none");
        contactDetails.classList.add("show");
    }
}

/**
 * this help function for deactivating contact details for the specified contact by removing active styles and hiding the details
 * @param {html element} contact - the contact element
 */
function deactivateContactDetails(contact) {
    removeActiveContactStyles(contact);
    hideContactDetails();
}

/**
 * this help function activates contact details and deactivating other contacts
 * @param {html element} contact - contact element
 */
function activateContactDetails(contact) {
    deactivateAllContacts();
    activateContactStyles(contact);
}

/**
 * this function hides the contact details
 */
function hideContactDetails() {
    let contactDetails = document.getElementById("show_contact_details");
    contactDetails.classList.remove("show");
}

/**
 * this function gets the initials from a given name
 * @param {string} name - shows full name
 * @returns {string} The initials extracted from the name.
 */
function getInitials(name) {
    let parts = name.split(" ");
    let initials = "";
    parts.forEach((part) => {
        initials += part.charAt(0).toUpperCase();
    });
    return initials;
}

// /**
//  * this function updates contact details after editing
//  * @param {number} index - index of the contact being edited
//  */
// function updateContact(index) {
//     if (currentUser >= 0) {
//         contact = users[index];
//     } else {
//         contact = contactsData[index];
//     }
//     //let contact = currentUser >= 0 ? users[index] : contactsData[index];
//     if (!contact) return;
//     contact.name = document.getElementById("contact_Name").value;
//     contact.email = document.getElementById("contact_Email").value;
//     contact.phone = document.getElementById("contact_Phone").value;

//     if (currentUser >= 0) {
//         sortContactsAlphabetically(users);
//         setItem("users", JSON.stringify(users));
//     } else {
//         sortContactsAlphabetically(contactsData);
//     }
//     finalizeContactUpdate();
// }

async function updateContact(index) {
    let contact = currentUser >= 0 ? users[index] : contactsData[index];
    if (!contact) {
        return;
    }
    contact.name = document.getElementById("contact_Name").value;
    contact.email = document.getElementById("contact_Email").value;
    contact.phone = document.getElementById("contact_Phone").value;
    if (!contact.id) {
        return;
    }
    const response = await fetch(`http://localhost:8000/api/contacts/${contact.id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
    });
    if (response.ok) {
        if (currentUser >= 0) {
            sortContactsAlphabetically(users);
            setItem("users", JSON.stringify(users));
        } else {
            sortContactsAlphabetically(contactsData);
        }
        finalizeContactUpdate();
    }
}



/**
 * this function performs additional actions to finalize the contact update
 */
function finalizeContactUpdate() {
    hideContactDetails();
    cancelOverlay();
    clearEntrys();
    renderDifferentContacts();
}


/**
 * this function finds insert index for new contact in a sorted contact list
 * @param {string} newContactName - name of the new contact
 * @param {object[]} contactList - list of contacts
 * @returns {number} - insert index for the new contact
 */
function findInsertIndex(newContactName, contactList) {
    let index = contactList.findIndex((contact) => newContactName.localeCompare(contact.name) <= 0);
    return index !== -1 ? index : contactList.length;
}

/**
 * this functoin adds new user to the list of users
 */
function addUser() {
    users.push({
        name: contact_Name.value,
        email: contact_Email.value,
        phone: contact_Phone.value,
        bgcolor: getRandomColor(),
    });
    setItem("users", JSON.stringify(users));
    renderDifferentContacts();
}

// /**
//  * this function adds new contact data to the list of contactsData
//  */
// function addContactsData() {
//     contactsData.push({
//         name: contact_Name.value,
//         email: contact_Email.value,
//         phone: contact_Phone.value,
//         bgcolor: getRandomColor(),
//     });
//     renderDifferentContacts();
// }

function addContactsData() {
    contactsData.push({
        id: contactsData.length + 1,
        name: contact_Name.value,
        email: contact_Email.value,
        phone: contact_Phone.value,
        bgcolor: getRandomColor(),
    });
    renderDifferentContacts();
}

/**
 * Deletes a contact based on the provided index.
 * @param {number} index - The index of the contact to be deleted.
 * @returns {Promise<void>} A Promise that resolves after the contact is deleted.
 */
// async function deleteContact(index) {
//     if (currentUser >= 0) {
//         let currentLoggedUser = nameOfCurrentUser();
//         deleteUserInAssignedTo(index);
//         await setItem("addedTasks", JSON.stringify(addedTasks));
//         users.splice(index, 1);
//         await setItem("users", JSON.stringify(users));
//         updateCurrentUser(currentLoggedUser);
//     }
//     let contactDetails = document.getElementById("show_contact_details");
//     if (contactDetails.classList.contains("show")) {
//         hideContactDetails();
//     }
//     renderDifferentContacts();
//     hideResponsiveEditMenu();
//     loadAddedTasksFromStorage();
// }


async function deleteContact(index) {
    let contact = currentUser >= 0 ? users[index] : contactsData[index];
    if (!contact || !contact.id) {
        return;
    }
    const response = await fetch(`http://localhost:8000/api/contacts/${contact.id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.ok) {
        if (currentUser >= 0) {
            users.splice(index, 1);
            setItem("users", JSON.stringify(users));
        } else {
            contactsData.splice(index, 1);
        }
        finalizeContactUpdate();
    }
}

/**
 * Retrieves the name of the current user.
 * @returns {string} The name of the current user.
 */
function nameOfCurrentUser() {
    let i = currentUser;
    let user = users[i].name;
    return user;
}

/**
 * Updates the current user based on the provided user name.
 * @param {string} user - The name of the user to set as the current user.
 */
function updateCurrentUser(user) {
    let found = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === user) {
            userIndex = i;
            localStorage.setItem("currentUserIndex", userIndex);
            loadCurrentUser();
            found = true;
            break;
        }
    }
    if (!found) {
        console.error("User not found");
    }
}

/**
 * Deletes a user from the "assigned" array in all tasks
 * @param {number} index - The index of the user in the users array to be deleted
 * @description
 * This function removes a user from the "assigned" array in all tasks. It takes the index of the user in the users array and filters out the user's name from the "assigned" array of each task.
 */
function deleteUserInAssignedTo(index) {
    let deletedUser = users[index].name;
    addedTasks.forEach(task => {
        let assignedIndex = task.assigned.indexOf(deletedUser);
        if (assignedIndex !== -1) {
            task.assigned.splice(assignedIndex, 1);
        }
    });
}

/**
 * this function displays success message for contact creation
 */
function showSuccessMessage() {
    let successMessage = document.getElementById("contact_succesfully_created");
    successMessage.classList.remove("d-none");
    successMessage.style.opacity = 1;
    successMessage.style.transform = "translateX(0)";
    setTimeout(() => {
        successMessage.style.opacity = 0;
        successMessage.style.transform = "translateX(100%)";
    }, 2000);
    setTimeout(() => {
        successMessage.classList.add("d-none");
    }, 3500);
}