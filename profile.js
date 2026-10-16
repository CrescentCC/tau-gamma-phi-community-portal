const profilePage = document.getElementById("profilePage");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");
const profileError = document.getElementById("profileError");

const session = typeof getSession === "function" ? getSession() : null;
if (!session) {
  window.location.replace("index.html");
}

const fields = document.querySelectorAll(".profile-field");
const NOT_SET = "Not set";

function fieldEl(name) {
  return document.querySelector(`.profile-field[data-field="${name}"]`);
}

function currentUser() {
  return getUsers().find((u) => u.username === session.username);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return /^\+?[\d\s()-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15;
}

function setFieldValue(name, text) {
  const el = fieldEl(name);
  if (!el) return;
  const value = el.querySelector(".field-value");
  value.textContent = text || NOT_SET;
  value.dataset.value = text || "";
}

function memberIdFor(user) {
  const index = getUsers().findIndex((u) => u.username === user.username);
  return "000-000-" + String(index + 1).padStart(3, "0");
}

function renderProfile() {
  const user = currentUser();
  if (!user) return;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  document.getElementById("profileName").textContent = fullName || user.username;

  const since = document.getElementById("profileSince");
  if (user.createdAt) {
    const d = new Date(user.createdAt);
    since.textContent =
      "Member since " + d.toLocaleString("en-US", { month: "long", year: "numeric" });
    since.hidden = false;
  } else {
    since.hidden = true;
  }

  setFieldValue("username", user.username);
  setFieldValue("email", user.email);
  setFieldValue("phone", user.phone);
  setFieldValue("memberId", memberIdFor(user));
  setFieldValue("birth", user.birthDate);
  setFieldValue("gender", user.gender);
}

function showError(message) {
  profileError.textContent = message;
  profileError.hidden = false;
}

function enterEditMode() {
  profilePage.classList.add("editing");
  editProfileBtn.hidden = true;
  logoutBtn.hidden = true;
  saveBtn.hidden = false;
  profileError.hidden = true;

  fields.forEach((field) => {
    const value = field.querySelector(".field-value");
    const input = field.querySelector(".field-input");
    if (!value || !input) return;

    if (input.type !== "password") {
      input.value = value.dataset.value || "";
    }

    value.hidden = true;
    input.hidden = false;
  });
}

function leaveEditMode() {
  profilePage.classList.remove("editing");
  editProfileBtn.hidden = false;
  logoutBtn.hidden = false;
  saveBtn.hidden = true;
  profileError.hidden = true;

  fields.forEach((field) => {
    const value = field.querySelector(".field-value");
    const input = field.querySelector(".field-input");
    if (!value || !input) return;
    input.hidden = true;
    value.hidden = false;
    input.value = "";
  });
}

function inputValue(name) {
  const input = fieldEl(name).querySelector(".field-input");
  return input ? input.value.trim() : "";
}

function saveProfile() {
  const users = getUsers();
  const user = users.find((u) => u.username === session.username);
  if (!user) return;

  const email = inputValue("email");
  const phone = inputValue("phone");
  const birth = inputValue("birth");
  const gender = inputValue("gender");
  const newPassword = fieldEl("password").querySelector(".field-input").value;

  if (email) {
    if (!isValidEmail(email)) return showError("Please enter a valid email address.");
    const taken = users.some(
      (u) => u !== user && u.email && u.email.toLowerCase() === email.toLowerCase()
    );
    if (taken) return showError("That email is already registered.");
  }

  if (phone && !isValidPhone(phone)) {
    return showError("Please enter a valid phone number.");
  }

  if (newPassword && newPassword.length < 6) {
    return showError("Password must be at least 6 characters.");
  }

  // A blank field keeps the existing value.
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (birth) user.birthDate = birth;
  if (gender) user.gender = gender;
  if (newPassword) user.password = newPassword;

  saveUsers(users);
  renderProfile();
  leaveEditMode();
}

if (session) {
  renderProfile();
}

editProfileBtn.addEventListener("click", enterEditMode);
saveBtn.addEventListener("click", saveProfile);

document.querySelectorAll(".field-edit-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.parentElement.querySelector(".field-input");
    if (input) input.focus();
  });
});

logoutBtn.addEventListener("click", () => {
  if (typeof clearSession === "function") clearSession();
  window.location.href = "index.html";
});
