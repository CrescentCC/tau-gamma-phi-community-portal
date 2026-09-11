const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginSuccess = document.getElementById("loginSuccess");

const params = new URLSearchParams(window.location.search);

if (params.get("registered") === "1") {
  loginSuccess.textContent = "Account created! Please log in.";
  loginSuccess.hidden = false;
} else if (params.get("reset") === "1") {
  loginSuccess.textContent = "Password updated! Please log in with your new password.";
  loginSuccess.hidden = false;
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = attemptLogin(username, password);

  if (!user) {
    loginError.textContent = "Incorrect username or password.";
    loginError.hidden = false;
    return;
  }

  loginError.hidden = true;
  setSession(user);
  redirectForRole(user.role);
});
