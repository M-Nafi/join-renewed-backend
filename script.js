let users = [];
let currentUser;

let today = new Date();
let hour = today.getHours();

/**
 * Includes HTML Templates (header/footer) asynchronously.
 * Fetches HTML files specified in elements with attribute 'w3-include-html' and inserts them into those elements.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
  checkPath();
}

/**
 * Initializes summary page by loading users, setting current user, greeting user, loading added tasks, loading user badge, and rendering summary data.
 */
async function summaryInit() {
  await loadUsers();
  loadCurrentUser();
  greetUser();
  await loadAddedTasksFromStorage();
  loadUserBadge();
  renderSummaryData();
}

/**
 * Initializes the page by loading users and rendering the login window.
 */
async function init() {
  loadUsers();
  renderLogIn();
}

async function initSidePages() {
  await loadUsers();
  loadCurrentUser();
  loadUserBadge();
}

/**
 * Renders the login window.
 */
function renderLogIn() {
  let log_container = document.getElementById("log_container");
  log_container.innerHTML = "";
  log_container.classList.remove("height-sing-up");
  log_container.innerHTML += renderHtmlLogIn();
  showSignUpBtn();
}

/**
 * Renders the Sign Up window.
 */
function renderSignUp() {
  let log_container = document.getElementById("log_container");
  log_container.innerHTML = "";
  log_container.classList.add("height-sing-up");
  log_container.innerHTML += renderSignUpHTML();
  ifChecked();
  hideSignUpBtn();
}

// Sign up //

/**
 * Registers a user if email doesn't exist in the users array.
 */
async function registerUser() {
  let email = document.getElementById("sign_email").value;
  ifChecked();
  if (isEmailExists(email)) {
    emailExist();
  } else {
    userToRemoteStorage();
    successfulRegistration();
  }
}

/**
 * Checks if the terms and conditions checkbox is checked to enable the register button.
 */
function ifChecked() {
  let checkedTrue = document.getElementById('sing-up-check');
  let registerBtn = document.getElementById('register_btn');

  if (checkedTrue.checked) {
    registerBtn.disabled = false;
    registerBtn.classList.remove('reg-btn'); // Reset background color
  } else {
    registerBtn.disabled = true;
    registerBtn.classList.add('reg-btn'); // Set background color to gray
  }
}

/**
 * Clears remote storage by resetting the users array.
 */
async function clearRemoteSTRG() {
  users = [];
  await setItem("users", JSON.stringify(users));
}

/**
 * Adds a user to the users array and stores it in remote storage.
 */
async function userToRemoteStorage() {
  users.push({
    name: sign_name.value,
    email: sign_email.value,
    password: sign_password.value,
    bgcolor: getRandomColor(),
    Number: '',
  });
  await setItem("users", JSON.stringify(users));
}

/**
 * Generates a random color code.
 * @returns {string} The generated color code.
 */
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * Displays a message indicating successful registration and redirects to login after a short delay.
 */
function successfulRegistration() {
  const sing_up_container = document.getElementById('sing_up_container');
  sing_up_container.innerHTML = '<span class="register-succesful">Registration successful</span>';

  setTimeout(() => {
    renderLogIn();
  }, 1000);
}

/**
 * Checks if an email already exists in the users array.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the email exists, false otherwise.
 */
function isEmailExists(email) {
  return users.some((user) => user.email === email);
}

/**
 * Displays a message indicating that the email already exists.
 */
function emailExist() {
  let messageElement = document.getElementById("message");
  messageElement.innerText = "Die E-Mail ist bereits vorhanden.";
  messageElement.style.color = "red";
}

/**
 * Loads users from remote storage to the local array.
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * Checks if the password and confirm password fields match to enable the register button.
 */
function checkPass() {
  if (
    document.getElementById("sign_password").value ==
    document.getElementById("sign_password_confirm").value
  ) {
    document.getElementById("register_btn").disabled = false;
    document.getElementById("message").style.color = "green";
    document.getElementById("message").innerHTML = "matching";
  } else {
    document.getElementById("register_btn").disabled = true;
    document.getElementById("message").style.color = "red";
    document.getElementById("message").innerHTML = "not matching";
  }
}

/**
 * Resets input fields in the registration form.
 */
function resetForm() {
  document.getElementById("sign_name").value = "";
  document.getElementById("sign_email").value = "";
  document.getElementById("sign_password").value = "";
  document.getElementById("sign_password_confirm").value = "";
}

// Log in //

/**
 * Logs in the user if email and password match.
 */
function logIn() {
  let email = document.getElementById('log_in_email').value;
  let password = document.getElementById('log_in_password').value;
  let user = logInValidation(email, password);
  if (user) {
    indexOfUser(email);
    logInSuccedMsg();
  }
  else {
    document.getElementById('log_message').innerText = 'Email or password not found';
    document.getElementById('log_message').style = 'color: red';
  }
}

/**
 * Finds the index of a user by email and stores it in local storage.
 */
function indexOfUser(email) {
  let userIndex = users.findIndex(user => user.email === email);
  localStorage.setItem('currentUserIndex', userIndex);
}

/**
 * Validates user login by checking email and password.
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 * @returns {object|null} The user object if found, null otherwise.
 */
function logInValidation(email, password) {
  let user = users.find(u => u.email == email);
  if (user && user.password == password) {
    return user;
  } else {
    return null;
  }
}

/**
 * redirects to the summary page after a short delay.
 */
function logInSuccedMsg() {
  setTimeout(() => {
    window.location.href = 'summary.html';
  }, 1000);
}

/**
 * Loads the current user index from local storage.
 */
function loadCurrentUser() {
  currentUser = localStorage.getItem('currentUserIndex');
}

/**
 * Greets the user based on the current time and the current user.
 */
function greetUser() {
  let greet = document.getElementById('user_name');
  i = currentUser;
  if (i >= 0) {
    greet.innerHTML = `${users[i]['name']}`;
  } else {
    greet.innerHTML = `Guest`;
  }
  displayGreeting();
}

/**
 * Registers a guest user and redirects to the summary page.
 */
function logInGuest() {
  window.location.href = 'summary.html';
  userIndex = -1;
  localStorage.setItem('currentUserIndex', userIndex);
  document.getElementById('user_name') = 'Guest User';
}

/**
 * Displays a greeting based on the current time.
 */
function displayGreeting() {
  let greeting;
  if (hour >= 4 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  let greetBox = document.getElementById('greet_box');
  greetBox.textContent = greeting;
}

/**
 * Hides the sign-up button on mobile devices.
 */
function hideSignUpBtn() {
  let width = document.documentElement.clientWidth;
  if (width < 500) {
    document.getElementById('sing_up_mobile').classList.add('d-none');
  }
}

/**
 * Shows the sign-up button on mobile devices.
 */
function showSignUpBtn() {
  let width = document.documentElement.clientWidth;
  if (width < 500) {
    document.getElementById('sing_up_mobile').classList.remove('d-none');
  }
}
