let selectedContactIndex = null;
let colorIndex = 0;
let isEditing = false;

let contactsData = [];

async function initContacts() {
    await loadUsers(); 
    await loadAddedTasksFromStorage();  
    await loadDatabaseContacts();  
    loadCurrentUser();  
    loadUserBadge();  
    sortContactsAlphabetically(contactsData);  
    renderDifferentContacts();  
}

function sortContactsAlphabetically(contacts) {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

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

function renderLoggedContacts() {
    let contactsContainer = document.getElementById("contact_container");
    let contactsHTML = renderLoggedContactsHTML();
    contactsContainer.innerHTML = contactsHTML;
    setupEditFunctionality();
}

function renderLoggedContactsHTML() {
    return generateContactsHTML(users);
}

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

function setupEditFunctionality() {
    let editLinks = document.getElementsByClassName("edit-text");
    for (let i = 0; i < editLinks.length; i++) {
        editLinks[i].addEventListener("click", function () {
            editContacts(i);
        });
    }
}

function getCurrentUserContact(index) {
    if (currentUser >= 0) {
        return users[index];
    } else {
        return contactsData[index];
    }
}

function removeActiveContactStyles(contact) {
    contact.classList.remove("active-contact");
    contact.style.backgroundColor = "";
    let nameElement = contact.getElementsByClassName("contact-name")[0];
    nameElement.style.color = "";
}

function activateContactStyles(contact) {
    contact.style.backgroundColor = "#2a3647";
    contact.classList.add("active-contact");
    let nameElement = contact.getElementsByClassName("contact-name")[0];
    nameElement.style.color = "white";
}

function deactivateAllContacts() {
    let contacts = document.getElementsByClassName("contact-container");
    for (let i = 0; i < contacts.length; i++) {
        let currentContact = contacts[i];
        if (currentContact.classList.contains("active-contact")) {
            removeActiveContactStyles(currentContact);
        }
    }
}

function updateContactDetails(selectedContact, circleColor, contactInitials) {
    let contactDetails = document.getElementById("show_contact_details");
    contactDetails.innerHTML = createContactDetailsHTML(selectedContact, circleColor, contactInitials);
    contactDetails.classList.remove("d-none");
    contactDetails.classList.add("show");
}

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

function deactivateContactDetails(contact) {
    removeActiveContactStyles(contact);
    hideContactDetails();
}

function activateContactDetails(contact) {
    deactivateAllContacts();
    activateContactStyles(contact);
}

function hideContactDetails() {
    let contactDetails = document.getElementById("show_contact_details");
    contactDetails.classList.remove("show");
}

function getInitials(name) {
    let parts = name.split(" ");
    let initials = "";
    parts.forEach((part) => {
        initials += part.charAt(0).toUpperCase();
    });
    return initials;
}

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

function finalizeContactUpdate() {
    hideContactDetails();
    cancelOverlay();
    clearEntrys();
    renderDifferentContacts();
}

function findInsertIndex(newContactName, contactList) {
    let index = contactList.findIndex((contact) => newContactName.localeCompare(contact.name) <= 0);
    return index !== -1 ? index : contactList.length;
}

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

function nameOfCurrentUser() {
    let i = currentUser;
    let user = users[i].name;
    return user;
}

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

function deleteUserInAssignedTo(index) {
    let deletedUser = users[index].name;
    addedTasks.forEach(task => {
        let assignedIndex = task.assigned.indexOf(deletedUser);
        if (assignedIndex !== -1) {
            task.assigned.splice(assignedIndex, 1);
        }
    });
}

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