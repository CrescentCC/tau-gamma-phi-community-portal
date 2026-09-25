const steps = document.querySelectorAll(".signup-step");
const dots = document.querySelectorAll(".step-dot");
const signupForm = document.getElementById("signupForm");

function showStep(n) {
  steps.forEach((s) => s.classList.toggle("active", s.dataset.step === String(n)));
  dots.forEach((d) => d.classList.toggle("active", Number(d.dataset.dot) <= Number(n)));
}

function populateDateSelects() {
  const monthSelect = document.getElementById("birthMonth");
  const daySelect = document.getElementById("birthDay");
  const yearSelect = document.getElementById("birthYear");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  months.forEach((month, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = month;
    monthSelect.appendChild(opt);
  });

  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    daySelect.appendChild(opt);
  }

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 80; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
}

populateDateSelects();

function validateStep(stepEl) {
  const fields = stepEl.querySelectorAll("input[required], select[required]");
  for (const field of fields) {
    if (!field.value.trim()) {
      field.focus();
      return false;
    }
  }

  if (stepEl.dataset.step === "3") {
    const usernameInput = document.getElementById("signupUsername");
    const usernameError = document.getElementById("usernameError");

    if (usernameExists(usernameInput.value.trim())) {
      usernameError.textContent = "That username is already taken.";
      usernameError.hidden = false;
      return false;
    }
    usernameError.hidden = true;
  }

  return true;
}

document.querySelectorAll(".step-next-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentStep = btn.closest(".signup-step");
    if (!validateStep(currentStep)) return;
    showStep(btn.dataset.next);
  });
});

document.querySelectorAll(".step-back-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    showStep(link.dataset.back);
  });
});

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const step4 = document.querySelector('.signup-step[data-step="4"]');
  if (!validateStep(step4)) return;

  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const passwordError = document.getElementById("passwordError");

  if (password.length < 6) {
    passwordError.textContent = "Password must be at least 6 characters.";
    passwordError.hidden = false;
    return;
  }

  if (password !== confirmPassword) {
    passwordError.textContent = "Passwords do not match.";
    passwordError.hidden = false;
    return;
  }

  passwordError.hidden = true;

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const birthMonth = document.getElementById("birthMonth").value;
  const birthDay = document.getElementById("birthDay").value;
  const birthYear = document.getElementById("birthYear").value;
  const gender = document.getElementById("gender").value;
  const username = document.getElementById("signupUsername").value.trim();

  registerMember({
    username,
    password,
    firstName,
    lastName,
    birthDate: `${birthMonth}/${birthDay}/${birthYear}`,
    gender,
  });

  window.location.href = "index.html?registered=1";
});
