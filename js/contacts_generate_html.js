// contacts_create_html.js

/**
 * this function creates html for rendering the alphabet section in the contacts list
 * @param {string} firstLetter - first letter of the group
 * @returns {string} html string representing the alphabet section
 */
function createAlphabetHTML(firstLetter) {
  return `
        <div class="alphabet" id="alphabet-${firstLetter}">${firstLetter}</div>  
        <div class="alphabet-vector-line"></div>
      `;
}

/**
 * this function updates content of the overlay based on whether its for editing or adding a new contact
 * @param {boolean} isEdit - indicates whether the overlay is for editing
 */
function updateOverlayContent(isEdit) {
  let overlayContainerLeft = document.querySelector(".overlay-container-left");
  if (isEdit) {
    overlayContainerLeft.innerHTML = `
          <img class="add-contact-overlay-icon" src="./assets/img/join-overlay-icon-white.svg" />
          <div class="overlay-letter-add-contact">Edit contact</div>
          <div class="overlay-vectorline-horizontal"></div>
        `;
  } else {
    overlayContainerLeft.innerHTML = `
          <img class="add-contact-overlay-icon" src="./assets/img/join-overlay-icon-white.svg" />
          <div class="overlay-letter-add-contact">Add contact
            <div class="overlay-letters-better">Tasks are better with a team!</div>
            <div class="overlay-vectorline-horizontal"></div>
          </div>
        `;
  }
}

/**
 * this function gets the html for the overlay contact circle
 * @returns {string} html for the overlay contact circle
 */
function getOverlayContactCircleHTML() {
  return `<div id="overlay_contact_circle" class="overlay-contact-circle">
        <img id="contact_gray" class="contact-gray" src="./assets/img/contacts-circle-grey.svg" />
        <img id="contact_person_white" class="contact-person-white" src="./assets/img/person-white.svg"/>
      </div>`;
}

/**
 * this function generates overlay contact circle with specified color and initials
 * @param {string} color - color for contact circle
 * @param {string} initials - initials of the contact
 */
function generateOverlayContactCircle(color, initials) {
  let overlayContactCircle = document.getElementById("overlay_contact_circle");
  overlayContactCircle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="126" height="126" viewBox="0 0 43 42" fill="none">
          <circle cx="21.5" cy="21" r="20" fill="${color}" stroke="white" stroke-width="2"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="18" fill="white">${initials}</text>
        </svg>
      `;
}

/**
 * this function generates html for an individual contact to be rendered in the contacts list
 * @param {object} contact - contact object containing name and email
 * @param {string} initials - initials of the contact
 * @param {string} circleColor - color for the contact circle
 * @param {number} index - index of the contact
 * @returns {string} html string representing the individual contact
 */
function generateContactHTML(contact, initials, circleColor, index) {
  return `
        <div class="contact-container" id="contact-${index}" onclick="showContactDetails(${index})">
          <div class="contact-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
              <circle cx="21.5" cy="21" r="20" fill="${circleColor}" stroke="white" stroke-width="2"/>
              <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif" font-size="18" fill="white">${initials}</text>
            </svg>
          </div>
          <div class="contact-data">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-mail">${contact.email}</div>
          </div>
        </div>
      `;
}

/**
 * this function generates html for displaying details of a clicked or selected contact
 * @param {number} index - index of the contact
 * @param {string} circleColor - color for the contact circle
 * @param {string} contactInitials - initials of the contact
 * @returns {string} html string representing the contact details view
 */
function createContactDetailsHTML(index, circleColor, contactInitials) {
  let selectedContact = getCurrentUserContact(index);
  return `
        <div id="contact_icon_and_name" class="contact-icon-and-name">
          <div id="contact_icon" class="contact-icon" style="background-color: ${circleColor}">
            <div id="contact_initials_container" class="contact-initials-container">
              <div id="contact_initials" class="contact-initials">${contactInitials}</div>
            </div>
          </div>
          <div id="contact_name_and_edit_container" class="contact-name-and-edit-container">
            <div id="details_contact_name" class="details-contact-name">${selectedContact.name}</div>               
            <div id="edit_container" class="edit-container">
              <div id="edit_contacts" class="edit-contacts">
                <div id="edit_icon" class="edit-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <mask id="mask0_69718_4858" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_69718_4858)">
                      <path d="M5.5 19H6.9L15.525 10.375L14.125 8.975L5.5 17.6V19ZM19.8 8.925L15.55 4.725L16.95 3.325C17.3333 2.94167 17.8042 2.75 18.3625 2.75C18.9208 2.75 19.3917 2.94167 19.775 3.325L21.175 4.725C21.5583 5.10833 21.7583 5.57083 21.775 6.1125C21.7917 6.65417 21.6083 7.11667 21.225 7.5L19.8 8.925ZM18.35 10.4L7.75 21H3.5V16.75L14.1 6.15L18.35 10.4Z" fill="#2A3647"/>
                    </g>
                  </svg>                        
                </div>
                <div id="edit_contact_detail" class="edit-text" onclick="editContacts(${index})">Edit</div>
              </div>
              <div id="delete_container" class="delete-container" onclick="deleteContact(${index})">
                <div id="delete_icon" class="delete-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                    <mask id="mask0_71348_10272" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_71348_10272)">
                      <path d="M7.5 21C6.95 21 6.47917 20.8042 6.0875 20.4125C5.69583 20.0208 5.5 19.55 5.5 19V6C5.21667 6 4.97917 5.90417 4.7875 5.7125C4.59583 5.52083 4.5 5.28333 4.5 5C4.5 4.71667 4.59583 4.47917 4.7875 4.2875C4.97917 4.09583 5.21667 4 5.5 4H9.5C9.5 3.71667 9.59583 3.47917 9.7875 3.2875C9.97917 3.09583 10.2167 3 10.5 3H14.5C14.7833 3 15.0208 3.09583 15.2125 3.2875C15.4042 3.47917 15.5 3.71667 15.5 4H19.5C19.7833 4 20.0208 4.09583 20.2125 4.2875C20.4042 4.47917 20.5 4.71667 20.5 5C20.5 5.28333 20.4042 5.52083 20.2125 5.7125C20.0208 5.90417 19.7833 6 19.5 6V19C19.5 19.55 19.3042 20.0208 18.9125 20.4125C18.5208 20.8042 18.05 21 17.5 21H7.5ZM7.5 6V19H17.5V6H7.5ZM9.5 16C9.5 16.2833 9.59583 16.5208 9.7875 16.7125C9.97917 16.9042 10.2167 17 10.5 17C10.7833 17 11.0208 16.9042 11.2125 16.7125C11.4042 16.5208 11.5 16.2833 11.5 16V9C11.5 8.71667 11.4042 8.47917 11.2125 8.2875C11.0208 8.09583 10.7833 8 10.5 8C10.2167 8 9.97917 8.09583 9.7875 8.2875C9.59583 8.47917 9.5 8.71667 9.5 9V16ZM13.5 16C13.5 16.2833 13.5958 16.5208 13.7875 16.7125C13.9792 16.9042 14.2167 17 14.5 17C14.7833 17 15.0208 16.9042 15.2125 16.7125C15.4042 16.5208 15.5 16.2833 15.5 16V9C15.5 8.71667 15.4042 8.47917 15.2125 8.2875C15.0208 8.09583 14.7833 8 14.5 8C14.2167 8 13.9792 8.09583 13.7875 8.2875C13.5958 8.47917 13.5 8.71667 13.5 9V16Z" fill="#2A3647"/>
                    </g>
                  </svg>                       
                </div>
                <div class="delete-text">Delete</div>
              </div>
            </div>                
          </div>
        </div>
        <div class="contact-information">Contact Information</div>
        <div class="mail-and-phone-container">
          <div class="mail-text">Email</div>
          <div id="mail_container" class="mail-container">${selectedContact.email}</div>
        </div>
        <div class="phone-container">
          <div class="phone-text">Phone</div>
          <div id="contact_phone_number" class="contact-phone-number">${selectedContact.phone}</div>
        </div>

        <div id="handle_resp_menu_container" class="handle-resp-menu-container"> 
        <img id="handle_resp_menu_icon" class="resp-menu-icon d-none" src="./assets/img/menu-contact-options.svg" onclick="showResponsiveEditMenu()">         
      </div>
      
      <div id="resp_edit_container" class="resp-edit-container d-none">
      <div id="edit_contacts" class="edit-contacts">
      <div id="edit_icon" class="edit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <mask id="mask0_69718_4858" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
            <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_69718_4858)">
            <path d="M5.5 19H6.9L15.525 10.375L14.125 8.975L5.5 17.6V19ZM19.8 8.925L15.55 4.725L16.95 3.325C17.3333 2.94167 17.8042 2.75 18.3625 2.75C18.9208 2.75 19.3917 2.94167 19.775 3.325L21.175 4.725C21.5583 5.10833 21.7583 5.57083 21.775 6.1125C21.7917 6.65417 21.6083 7.11667 21.225 7.5L19.8 8.925ZM18.35 10.4L7.75 21H3.5V16.75L14.1 6.15L18.35 10.4Z" fill="#2A3647"/>
          </g>
        </svg>                        
      </div>
      <div id="edit_contact_detail" class="edit-text" onclick="editContacts(${index})">Edit</div>
    </div>
    <div id="delete_container" class="delete-container" onclick="deleteContact(${index})">
      <div id="delete_icon" class="delete-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <mask id="mask0_71348_10272" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
            <rect x="0.5" width="24" height="24" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_71348_10272)">
            <path d="M7.5 21C6.95 21 6.47917 20.8042 6.0875 20.4125C5.69583 20.0208 5.5 19.55 5.5 19V6C5.21667 6 4.97917 5.90417 4.7875 5.7125C4.59583 5.52083 4.5 5.28333 4.5 5C4.5 4.71667 4.59583 4.47917 4.7875 4.2875C4.97917 4.09583 5.21667 4 5.5 4H9.5C9.5 3.71667 9.59583 3.47917 9.7875 3.2875C9.97917 3.09583 10.2167 3 10.5 3H14.5C14.7833 3 15.0208 3.09583 15.2125 3.2875C15.4042 3.47917 15.5 3.71667 15.5 4H19.5C19.7833 4 20.0208 4.09583 20.2125 4.2875C20.4042 4.47917 20.5 4.71667 20.5 5C20.5 5.28333 20.4042 5.52083 20.2125 5.7125C20.0208 5.90417 19.7833 6 19.5 6V19C19.5 19.55 19.3042 20.0208 18.9125 20.4125C18.5208 20.8042 18.05 21 17.5 21H7.5ZM7.5 6V19H17.5V6H7.5ZM9.5 16C9.5 16.2833 9.59583 16.5208 9.7875 16.7125C9.97917 16.9042 10.2167 17 10.5 17C10.7833 17 11.0208 16.9042 11.2125 16.7125C11.4042 16.5208 11.5 16.2833 11.5 16V9C11.5 8.71667 11.4042 8.47917 11.2125 8.2875C11.0208 8.09583 10.7833 8 10.5 8C10.2167 8 9.97917 8.09583 9.7875 8.2875C9.59583 8.47917 9.5 8.71667 9.5 9V16ZM13.5 16C13.5 16.2833 13.5958 16.5208 13.7875 16.7125C13.9792 16.9042 14.2167 17 14.5 17C14.7833 17 15.0208 16.9042 15.2125 16.7125C15.4042 16.5208 15.5 16.2833 15.5 16V9C15.5 8.71667 15.4042 8.47917 15.2125 8.2875C15.0208 8.09583 14.7833 8 14.5 8C14.2167 8 13.9792 8.09583 13.7875 8.2875C13.5958 8.47917 13.5 8.71667 13.5 9V16Z" fill="#2A3647"/>
          </g>
        </svg>                       
      </div>
      <div class="delete-text">Delete</div>
    </div>
      </div>
      `;
}


