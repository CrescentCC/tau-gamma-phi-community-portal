const steps = document.querySelectorAll(".signup-step");
const retrieveForm = document.getElementById("retrieveForm");
const identifierInput = document.getElementById("identifierInput");
const identifierError = document.getElementById("identifierError");
const sendVerificationBtn = document.querySelector(".step-next-btn");

let matchedUsername = null;

function showStep(n) {
  steps.forEach((s) => s.classList.toggle("active", s.dataset.step === String(n)));
}

sendVerificationBtn.addEventListener("click", () => {
  const identifier = identifierInput.value.trim();

  if (!identifier) {
    identifierInput.focus();
    return;
  }

  const user = findUserByIdentifier(identifier);

  if (!user) {
    identifierError.textContent =
      "No account found with that phone number or email. Try your username instead.";
    identifierError.hidden = false;
    return;
  }

  identifierError.hidden = true;
  matchedUsername = user.username;

  const originalLabel = sendVerificationBtn.textContent;
  sendVerificationBtn.textContent = "Sending...";
  sendVerificationBtn.disabled = true;

  setTimeout(() => {
    sendVerificationBtn.textContent = originalLabel;
    sendVerificationBtn.disabled = false;
    showStep(2);
  }, 1200);
});

retrieveForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmNewPassword = document.getElementById("confirmNewPassword").value;
  const newPasswordError = document.getElementById("newPasswordError");

  if (newPassword.length < 6) {
    newPasswordError.textContent = "Password must be at least 6 characters.";
    newPasswordError.hidden = false;
    return;
  }

  if (newPassword !== confirmNewPassword) {
    newPasswordError.textContent = "Passwords do not match.";
    newPasswordError.hidden = false;
    return;
  }

  newPasswordError.hidden = true;
  updatePassword(matchedUsername, newPassword);
  window.location.href = "index.html?reset=1";
});
