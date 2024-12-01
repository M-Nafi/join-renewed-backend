let addedSubtasks = [];
let newAssigned = [];

async function initAddTask() {
  await loadUsers();
  // await loadAddedTasks();
  loadCurrentUser();
  loadUserBadge();
  getDateToday();
  changePrioColor("Medium");
  initUserSelectField("et_contact_overlay");
  checkIfSendingIsPossible();
}

// async function loadAddedTasks() {
//   try {
//     addedTasks = JSON.parse(await getItem("addedTasks"));
//   } catch (e) {
//     console.error("Loading Added Tasks error:", e);
//   }
// }

function changePrioColor(prio) {
  resetContainers();
  let container = document.getElementById(`${prio}_container`);
  let img = document.getElementById(`${prio}_img`);
  container.classList.add("selected");
  let color = determinePrioBackgroundColor(prio);
  container.style.backgroundColor = color;
  container.style.color = "white";
  img.src = `./assets/img/${prio}-white.svg`;
}

function settingPrioBackground(container, img, prio) {
  container.style.backgroundColor = "white";
  container.style.color = "#2a3647";
  img.src = "./assets/img/" + prio + ".svg";
}

function determinePrioBackgroundColor(prio) {
  let color;
  if (prio === "Urgent") {
    color = "#ff3d00";
  } else if (prio === "Medium") {
    color = "#ffa800";
  } else if (prio === "Low") {
    color = "#7ae229";
  }
  return color;
}

function resetContainers() {
  let containers = document.getElementsByClassName("status-definition-container");
  for (let i = 0; i < containers.length; i++) {
    let container = containers[i];
    container.style.backgroundColor = "white";
    container.style.color = "#2a3647";
    let img = container.getElementsByClassName("prio-images")[0];
    img.src = "./assets/img/" + container.id.replace("_container", "") + ".svg";
    container.classList.remove("selected");
  }
}

function initUserSelectField(containerID) {
  let contactsContainer = document.getElementById(containerID);
  for (let i = 0; i < users.length; i++) {
    let userName = users[i]["name"];
    let userBadge = generateUserBadge(userName);
    let badgeColor = users[i]["bgcolor"];
    if (newAssigned.includes(userName)) {
      contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
    } else {
      contactsContainer.innerHTML += generateTaskAssigmentContactsHTML(userName, badgeColor, userBadge, i);
    }
  }
}

function addElectedContact(id, i, newAssigned) {
  let checkAssigned = document.getElementById(id);
  let userName = users[i]["name"];
  let deleteName = newAssigned.indexOf(userName);
  if (checkAssigned.checked) {
    newAssigned.push(userName);
  } else if (!checkAssigned.checked) {
    newAssigned.splice(deleteName, 1);
  }
  showSelectedContacts(newAssigned, "et_selected_contacts");
}

function showSelectedContacts(newAssigned) {
  let selectedContacts = document.getElementById("et_selected_contacts");
  selectedContacts.innerHTML = "";
  for (let i = 0; i < newAssigned.length; i++) {
    let userName = newAssigned[i];
    let userIndex = users.findIndex((user) => user.name === userName);
    if (userIndex !== -1) {
      let badgeColor = users[userIndex]["bgcolor"];
      let userBadge = generateUserBadge(userName);
      let selectedContactHTML = generateSelectedContactHTML(userName, badgeColor, userBadge, i);
      selectedContacts.innerHTML += selectedContactHTML;
    }
  }
}

function getDateToday() {
  let today = new Date().toISOString().split("T")[0];
  let dateField = document.getElementById("date_field");
  dateField.setAttribute("min", today);
  dateField.addEventListener("input", function () {
    if (dateField.value) {
      dateField.style.color = "black";
    } else {
      dateField.style.color = "lightgrey";
    }
  });
}

function changingSubtaskIcons() {
  let inputField = document.getElementById("add_new_subtask_field");
  document.getElementById("normal_subtask_icon").classList.add("d-none");
  document.getElementById("three_subtask_icons").classList.remove("d-none");
  inputField.focus();
  inputField.select();
}

function closeSubtaskIcons() {
  document.getElementById("normal_subtask_icon").classList.remove("d-none");
  document.getElementById("three_subtask_icons").classList.add("d-none");
  let input = document.getElementById("add_new_subtask_field");
  input.value = "";
}

function handleSubtaskActions() {
  let subtaskInput = document.getElementById("add_new_subtask_field");
  let input = document.getElementById("add_new_subtask_field");
  let subtask = subtaskInput.value.trim();
  changingSubtaskIcons();
  displaySubtasks();
  input.value = "";
}

function displaySubtasks() {
  let subtask = document.getElementById("add_new_subtask_field").value.trim();
  if (subtask !== "") {
    addedSubtasks.push({ subdone: false, subtitle: subtask });
    renderAddedSubtasks();
    subtask.value = "";
  }
}

function renderAddedSubtasks() {
  let subtaskContainer = document.getElementById("subtask_display_container");
  subtaskContainer.innerHTML = "";
  for (let i = 0; i < addedSubtasks.length; i++) {
    let subtask = addedSubtasks[i].subtitle;
    subtaskContainer.innerHTML += createSubtaskHTML(subtask, i);
  }
  subtaskContainer.classList.remove("d-none");
  closeSubtaskIcons();
}

function saveEditedSubtask(index) {
  let inputField = document.getElementById(`input_${index}`);
  let subtask = inputField.value.trim();
  if (subtask !== "") {
    addedSubtasks[index].subtitle = subtask;
    renderAddedSubtasks();
  }
}

function editAddedSubtask(index) {
  moveIconsForEditing(index);
  document.getElementById(`subtask_icons_1_${index}`).classList.add("d-none");
  document.getElementById(`check_dark_save_${index}`).classList.remove("d-none");
  let inputField = document.getElementById(`input_${index}`);
  inputField.focus();
}

function moveIconsForEditing(index) {
  let editIcon = document.getElementById(`subtask_icons_1_${index}`);
  let deleteIcon = document.getElementById(`subtask_icons_3_${index}`);
  let saveIcon = document.getElementById(`check_dark_save_${index}`);
  let vectorLine = document.getElementById(`subtask_icons_2_${index}`);
  let container = editIcon.parentElement;
  container.insertBefore(saveIcon, editIcon);
  container.insertBefore(vectorLine, editIcon);
  container.insertBefore(deleteIcon, editIcon);
}

function deleteAddedSubtask(subtask) {
  let index = addedSubtasks.indexOf(subtask);
  if (index == -1 || index !== -1) {
    addedSubtasks.splice(index, 1);
    renderAddedSubtasks();
  }
}

function clearAllFields() {
  clearContainerLeft();
  resetContainers();
  clearContainerRight();
  closeSubtaskIcons();
  document.getElementById("subtask_display_container").innerHTML = "";
  addedSubtasks = [];
  changePrioColor("Medium");
}

function clearContainerLeft() {
  document.getElementById("enter_title_field").value = "";
  document.getElementById("enter_description_field").value = "";
  document.getElementById("et_select_contacts_search").value = "";
  clearSelectedContacts();
}

function clearSelectedContacts() {
  newAssigned = [];
  showSelectedContacts(newAssigned);
}

function clearContainerRight() {
  let dateField = document.getElementById("date_field");
  document.getElementById("date_field").value = "";
  dateField.style.color = "lightgrey";
  document.getElementById("select_category_field").selectedIndex = 0;
  document.getElementById("add_new_subtask_field").value = "";
}

function checkIfSendingIsPossible() {
  let createTaskButton = document.getElementById("create_task_button");
  let titleField = document.getElementById("enter_title_field");
  let dateField = document.getElementById("date_field");
  let categoryField = document.getElementById("select_category_field");
  function checkInputs() {
    if (
      titleField.value.trim().length > 0 && dateField.value.trim().length > 0 && categoryField.value.trim().length > 0
    ) {
      createTaskButton.disabled = false;
    } else {
      createTaskButton.disabled = true;
    }
  }
  titleField.addEventListener("input", checkInputs);
  dateField.addEventListener("input", checkInputs);
  categoryField.addEventListener("input", checkInputs);
}

function getSelectedPriority() {
  let priorityContainers = document.getElementsByClassName("status-definition-container");
  for (let i = 0; i < priorityContainers.length; i++) {
    if (priorityContainers[i].classList.contains("selected")) {
      return priorityContainers[i].id.replace("_container", "");
    }
  }
}

async function createTask() {
  const setNewTask = createNewTaskID();
  const selectedPriority = getSelectedPriority();
  const selectedContacts = window.assigned;  

  assigneds = selectedContacts.map((contact) => ({
    name: contact.name,
    id: contact.id,
    bgcolor: contact.bgcolor
  }));

  const newTaskData = {
    id: setNewTask,
    title: document.getElementById("enter_title_field").value,
    description: document.getElementById("enter_description_field").value,
    assigned: assigneds,  
    dueDate: document.getElementById("date_field").value,
    priority: selectedPriority,
    category: document.getElementById("select_category_field").value,
    subtask: addedSubtasks.map((sub) => sub.subtitle), 
  };

  try {
    const response = await fetch('http://localhost:8000/api/add_task/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTaskData),
    });

    if (response.ok) {
      createTaskMessage();  
      setTimeout(() => {
        window.location.href = "board.html";
      }, 1000);
    }
  } catch (error) {
    console.error('Netzwerkfehler:', error);
  }
}

function createNewTaskID() {
  let newTaskID;
  if (addedTasks.length !== 0) {
    newTaskID = addedTasks.length;
  } else {
    newTaskID = 0;
  }
  return newTaskID;
}