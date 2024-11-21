
function generateSelectedContactHTML(userName, badgeColor, userBadge, i) {
  return `
      <label class="selected-contact-label">      
          <div class="contact-badge" style="background-color: ${badgeColor};">
            <span>${userBadge}</span>
          </div>      
      </label>
    `;
}


function generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i) {
  return `
      <label class="slider-contact-label">
        <div class="current-contact-slider">
          <div id="_contect_badge${i}" class="contact-badge" style="background-color: ${badgeColor};">
            <span>${userBadge}</span>
          </div>
          <span>${userName}</span>
          <div class="checkbox">
            <input onclick="addElectedContact('_confirm_contact${i}', ${i}, newAssigned)" id="_confirm_contact${i}" type="checkbox" />
            <label class="checkbox-edit-task" for="_confirm_contact${i}"></label>
          </div>
        </div>
      </label>
    `;
}


function generateTaskAssigmentContactsCheckedHTML(userName, badgeColor, userBadge, i) {
  return `
      <label class="slider-contact-label">
        <div class="current-contact-slider">
          <div id="_contect_badge${i}" class="contact-badge" style="background-color: ${badgeColor};">
            <span>${userBadge}</span>
          </div>
          <span>${userName}</span>
          <div class="checkbox">
            <input onclick="addElectedContact('_confirm_contact${i}', ${i}, newAssigned)" id="_confirm_contact${i}" type="checkbox" checked/>
            <label class="checkbox-edit-task" for="_confirm_contact${i}"></label>
          </div>
        </div>
      </label>
    `;
}


function createSubtaskHTML(subtask, index) {
  return `
    <div class="added-subtask">• <input id="input_${index}" class="subtask-input" type="text" value="${subtask}" contenteditable="true">
       <div class="added-subtask-icons">
        <img id="subtask_icons_3_${index}" onclick="deleteAddedSubtask('${subtask}')" class="invisible subtask-icon" src="./assets/img/delete-icon.svg">
        <img id="subtask_icons_2_${index}" class="invisible vector-line" src="./assets/img/vector-line.svg">
        <img id="subtask_icons_1_${index}" onclick="editAddedSubtask(${index})" class="invisible subtask-icon" src="./assets/img/pencil-icon.svg">
        <img id="check_dark_save_${index}" onclick="saveEditedSubtask(${index})" class="invisible subtask-icon d-none" src="./assets/img/check-dark.svg">  
       </div>
      </div>
    `;
}


function createSubtaskHTML(subtask, index) {
  return `
  <div class="added-subtask">• <input id="input_${index}" class="subtask-input" type="text" value="${subtask}" contenteditable="true">
     <div class="added-subtask-icons">
      <img id="subtask_icons_3_${index}" onclick="deleteAddedSubtask('${subtask}')" class="invisible subtask-icon" src="./assets/img/delete-icon.svg">
      <img id="subtask_icons_2_${index}" class="invisible vector-line" src="./assets/img/vector-line.svg">
      <img id="subtask_icons_1_${index}" onclick="editAddedSubtask(${index})" class="invisible subtask-icon" src="./assets/img/pencil-icon.svg">
      <img id="check_dark_save_${index}" onclick="saveEditedSubtask(${index})" class="invisible subtask-icon d-none" src="./assets/img/check-dark.svg">  
     </div>
    </div>
  `;
}


function createTaskMessage() {
  let taskMessage = document.getElementById("sending_confirmation");
  taskMessage.classList.add("animate-message");
}


function initializeSlider() {
  let contactOverlay = document.getElementById('et_contact_overlay');
  let isSliderOpen = false;

  function toggleSlider(e) {
    e.stopPropagation();
    isSliderOpen = !isSliderOpen;
    contactOverlay.classList.toggle("hide", !isSliderOpen);
  }

  function closeSlider() {
    if (isSliderOpen) {
      contactOverlay.classList.add("d-none");
      isSliderOpen = false;
      document.getElementById('et_selected_contacts').classList.remove('d-none');
    }
  }  
  document.getElementById('select-contacts_down').addEventListener("click", toggleSlider);  
  document.addEventListener("click", function(e) {
    if (isSliderOpen && !contactOverlay.contains(e.target)) {
      closeSlider();
    }
  });
  document.getElementById('et_selected_contacts').classList.remove('d-none');
}


document.addEventListener("DOMContentLoaded", initializeSlider);



