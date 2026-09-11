const profilePage = document.getElementById("profilePage");
const editProfileBtn = document.getElementById("editProfileBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

const fields = document.querySelectorAll(".profile-field");

function enterEditMode() {
  profilePage.classList.add("editing");
  editProfileBtn.hidden = true;
  logoutBtn.hidden = true;
  saveBtn.hidden = false;

  fields.forEach((field) => {
    const value = field.querySelector(".field-value");
    const input = field.querySelector(".field-input");
    if (!value || !input) return;

    if (input.type !== "password") {
      input.value = value.dataset.value || value.textContent;
    }

    value.hidden = true;
    input.hidden = false;
  });
}

function exitEditMode() {
  profilePage.classList.remove("editing");
  editProfileBtn.hidden = false;
  logoutBtn.hidden = false;
  saveBtn.hidden = true;

  fields.forEach((field) => {
    const value = field.querySelector(".field-value");
    const input = field.querySelector(".field-input");
    if (!value || !input) return;

    if (input.type === "password") {
      if (input.value.trim()) {
        value.textContent = "•".repeat(Math.min(input.value.length, 16));
      }
    } else if (input.value.trim()) {
      value.dataset.value = input.value.trim();
      value.textContent = input.value.trim();
    }

    input.hidden = true;
    value.hidden = false;
    input.value = "";
  });
}

editProfileBtn.addEventListener("click", enterEditMode);
saveBtn.addEventListener("click", exitEditMode);

document.querySelectorAll(".field-edit-icon").forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.parentElement.querySelector(".field-input");
    if (input) input.focus();
  });
});

logoutBtn.addEventListener("click", () => {
  if (typeof clearSession === "function") clearSession();
  window.location.href = "login.html";
});
