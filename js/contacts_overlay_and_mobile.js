// contacts - mobile

/**
 * this function displays contact details in a responsive view and responsive icons for contact handling updating accordingly
 */
function showResponsiveContactDetails() {
  document.getElementById("add_new_contact_main").classList.add("d-none");
  let contactsContainerRight = document.getElementById("contacts_container_right");
  if (contactsContainerRight) {
    contactsContainerRight.style.display = "flex";
  }
  document.getElementById("handle_resp_contact_icon").classList.add("d-none");
  document.getElementById("handle_resp_menu_icon").classList.remove("d-none");
}

/**
 * this function displays the back arrow for responsive navigation.
 */
function showResponsiveArrowBack() {
  document.getElementById("resp_arrow_back").classList.remove("d-none");
}

/**
 * this function closes contact details view and returns to main contact list
 */
function closeResponsiveDetails() { 
  let contactDetails = document.getElementById('show_contact_details'); 
  let contactsContainerRight = document.getElementById("contacts_container_right");
  if (contactsContainerRight) {
    contactsContainerRight.style.display = "none";
  }
  helpForClosingResponsiveDetails();
  deactivateAllContacts();  
  contactDetails.classList.remove('show'); 
}

/**
 * this help function provides assistance for closing the responsive details view
 */
function helpForClosingResponsiveDetails() {
  document.getElementById("resp_arrow_back").classList.add("d-none");
  document.getElementById("add_new_contact_main").classList.remove("d-none");
  document.getElementById("handle_resp_menu_icon").classList.add("d-none");
  document.getElementById("handle_resp_contact_icon").classList.remove("d-none");
  document.getElementById("resp_edit_container").classList.add("d-none");
}

/**
 * this function hides the responsive edit menu
 */
function hideResponsiveEditMenu() {
  let editOrDelete = document.getElementById("resp_edit_container");
  let responsiveContactsMenu = document.getElementById("handle_resp_menu_icon");
  editOrDelete.classList.add("d-none");
  responsiveContactsMenu.classList.remove("d-none");
}

/**
 * this function shows the responsive edit menu
 */
function showResponsiveEditMenu() {
  let responsiveContactsMenu = document.getElementById("handle_resp_menu_icon");
  let editOrDelete = document.getElementById("resp_edit_container");
  responsiveContactsMenu.classList.add("d-none");
  editOrDelete.classList.remove("d-none");
}

// contacts - overlay

/**
 * this function shows the overlay view for editing or adding a new contact
 * @param {boolean} isEdit - indicates whether the overlay is for editing an existing contact
 */
function showOverlay(isEdit) {    
  updateOverlayContent(isEdit);
  updateOverlayButtons(isEdit);  
  let addNewContact = document.getElementById("add_new_contact");
  addNewContact.classList.remove("d-none");
  setTimeout(() => {
    addNewContact.classList.add("show");    
  }, 10);
  cancelOverlay();
  document.getElementById('handle_resp_contact_container').classList.add('d-none');     
}

// ALTE funktion für das hinzufügen der kontakte OHNE backend
// /**
//  * this function is for adding a new contact
//  * @param {event} event - event object
//  */
// async function addNewContact(event) {
//   event.preventDefault();
//   let newContact = {
//     name: document.getElementById("contact_Name").value,
//     email: document.getElementById("contact_Email").value,
//     phone: document.getElementById("contact_Phone").value,
//     bgcolor: getRandomColor(),
//   };
//   let index;
//   if (currentUser >= 0) {
//     index = findInsertIndex(newContact.name, users);
//     users.splice(index, 0, newContact);
//     await setItem("users", JSON.stringify(users));
//   } else {
//     index = findInsertIndex(newContact.name, contactsData);
//     contactsData.splice(index, 0, newContact);
//   }
//   handleNewContact(index); 
// }

// NEUE funktion für das hinzufügen der kontakte ins backend

async function addNewContact(event) {
  event.preventDefault();
  let newContact = {
    name: document.getElementById("contact_Name").value,
    email: document.getElementById("contact_Email").value,
    phone: document.getElementById("contact_Phone").value,
    bgcolor: getRandomColor(),
  };
  const response = await fetch("http://localhost:8000/api/add_contact/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newContact),
  });
  if (response.ok) {
    const result = await response.json();
    contactsData.push(result);
    const newContactIndex = contactsData.length - 1; 
    handleNewContact(newContactIndex);
  }
}

/**
 * this help function handles addition of new contact by performing various actions
 * @param {number} index - index of the newly added contact
 */
function handleNewContact(index) {
  clearEntrys();
  cancelOverlay();
  showSuccessMessage();
  renderDifferentContacts();
  showContactDetails(index); 
}

/**
 * this function edits selected contact in case of changing name nummer etc
 * @param {number} index - index of the selected contact
 */
function editContacts(index) {   
  let contact = currentUser >= 0 ? users[index] : contactsData[index];
  if (!contact) return;  
  selectedContactIndex = index;
  let originalCircleColor = contact.bgcolor || contact.color;
  let initials = getInitials(contact.name);
  showOverlay(true);
  updateContactDetails(index, originalCircleColor, initials);
  generateOverlayContactCircle(originalCircleColor, initials);
  updateContactInputs(contact);
  setSaveButtonFunction(index);
  hideResponsiveEditMenu();  
  document.getElementById('handle_resp_menu_container').classList.add('d-none');
}

/**
 * this function is for checking the overlays current state
 */
function cancelOverlay() {
  let overlay = document.getElementById("add_new_contact");
  if (overlay.classList.contains("show")) {
    closeOverlay();
  } else {
    handleOverlay();
  };    
}

/**
 * this function is for closing the overlay and show responsivemenu again
 */
function closeOverlay() {
  let overlay = document.getElementById("add_new_contact");
  overlay.classList.remove("show");
  overlay.classList.add("close");
  setTimeout(() => {    
    hideAddNewContact();
    resetOverlayContactCircle();
    setTimeout(() => {
      overlay.classList.remove("close");
      hideAddNewContact();
    }, 300);
    clearEntrys();
  }, 300); 
  document.getElementById('handle_resp_contact_container').classList.remove('d-none'); 
}

/**
 * this function is for handle the overlay.
 */
function handleOverlay() {
  let overlay = document.getElementById("add_new_contact");
  overlay.classList.remove("close");
  overlay.classList.add("show");
}

/**
 * this function updates the buttons in the overlay view based on whether its for editing or adding a new contact
 * @param {boolean} isEdit - indiactes whether the overlay is for editing
 */
function updateOverlayButtons(isEdit) {
  let overlayCancelButton = document.getElementById("overlay_cancel_button");
  let overlayCreateButton = document.getElementById("overlay_create_contact_button");
  if (isEdit) {
    setEditButtons(overlayCancelButton, overlayCreateButton);
  } else {
    setCreateButtons(overlayCancelButton, overlayCreateButton);
  }
}

/**
 * this function resets the overlay contact circle
 */
function resetOverlayContactCircle() {
  let overlayContactCircle = document.getElementById("overlay_contact_circle");
  overlayContactCircle.innerHTML = getOverlayContactCircleHTML();
}

/**
 * this function clears the input fields for contact details
 */
function clearEntrys() {
  document.getElementById("contact_Name").value = "";
  document.getElementById("contact_Email").value = "";
  document.getElementById("contact_Phone").value = "";
}

/**
 * this function updates the input fields for contact details with the provided contact data
 * @param {object} contact - contact containing name mail and phone
 */
function updateContactInputs(contact) {
  let contactNameInput = document.getElementById("contact_Name");
  let contactEmailInput = document.getElementById("contact_Email");
  let contactPhoneInput = document.getElementById("contact_Phone");
  contactNameInput.value = contact.name;
  contactEmailInput.value = contact.email;
  contactPhoneInput.value = contact.phone;
}

/**
 * this function sets the save button function for editing
 * @param {number} index - index of choosen contact being edited
 */
function setSaveButtonFunction(index) {
  let overlayCreateButton = document.getElementById("overlay_create_contact_button");
  overlayCreateButton.innerHTML = "Save <img src='./assets/img/overlay-ok.svg'/>";
  overlayCreateButton.onclick = function () {
    updateContact(index);
    showSuccessMessage();
    closeOverlay(); 
    showContactDetails(index);    
  }; 
}

/**
 * this function sets the functionality for edit buttons in the overlay
 * @param {html element} overlayCancelButton - overlay cancel button
 * @param {html element} overlayCreateButton - overlay create/save button
 */
function setEditButtons(overlayCancelButton, overlayCreateButton) {
  overlayCancelButton.textContent = "Delete";
  overlayCancelButton.onclick = function () {
    deleteContact(selectedContactIndex);
    cancelOverlay();
  };
  overlayCreateButton.innerHTML = "Save <img src='./assets/img/overlay-ok.svg'/>";
  overlayCreateButton.onclick = function () {
    showSuccessMessage();  
    closeResponsiveDetails();  
  };
}

/**
 * this function sets the functionality for create buttons in the overlay
 * @param {html element} overlayCancelButton - overlay cancel button
 * @param {html element} overlayCreateButton - overlay create button
 */
function setCreateButtons(overlayCancelButton, overlayCreateButton) {
  overlayCancelButton.innerHTML = "Cancel <svg xmlns='http://www.w3.org/2000/svg' width='24' height='25' viewBox='0 0 24 25' fill='none'><mask id='mask0_71720_5473' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='24' height='25'><rect y='0.96582' width='24' height='24' fill='#D9D9D9'/></mask><g mask='url(#mask0_71720_5473)'><path d='M11.9998 14.3659L7.0998 19.2659C6.91647 19.4492 6.68314 19.5409 6.3998 19.5409C6.11647 19.5409 5.88314 19.4492 5.6998 19.2659C5.51647 19.0825 5.4248 18.8492 5.4248 18.5659C5.4248 18.2825 5.51647 18.0492 5.6998 17.8659L10.5998 12.9659L5.6998 8.06587C5.51647 7.88254 5.4248 7.6492 5.4248 7.36587C5.4248 7.08254 5.51647 6.8492 5.6998 6.66587C5.88314 6.48254 6.11647 6.39087 6.3998 6.39087C6.68314 6.39087 6.91647 6.48254 7.0998 6.66587L11.9998 11.5659L16.8998 6.66587C17.0831 6.48254 17.3165 6.39087 17.5998 6.39087C17.8831 6.39087 18.1165 6.48254 18.2998 6.66587C18.4831 6.8492 18.5748 7.08254 18.5748 7.36587C18.5748 7.6492 18.4831 7.88254 18.2998 8.06587L13.3998 12.9659L18.2998 17.8659C18.4831 18.0492 18.5748 18.2825 18.5748 18.5659C18.5748 18.8492 18.4831 19.0825 18.2998 19.2659C18.1165 19.4492 17.8831 19.5409 17.5998 19.5409C17.3165 19.5409 17.0831 19.4492 16.8998 19.2659L11.9998 14.3659Z' fill='#2A3647'/></g></svg>";
  overlayCreateButton.innerHTML = "Create contact <img src='./assets/img/overlay-ok.svg'/>";
  overlayCancelButton.onclick = function () {
    cancelOverlay();
  };
}

/**
 * this function hides the add new contact container
 */
function hideAddNewContact() {
  let addNewContact = document.getElementById("add_new_contact");
  addNewContact.classList.remove("show");
  addNewContact.classList.add("d-none");
}
