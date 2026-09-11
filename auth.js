const USERS_KEY = "tgp_users";
const SESSION_KEY = "tgp_session";

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedAdminAccount() {
  const users = getUsers();
  const hasAdmin = users.some((u) => u.role === "admin");

  if (!hasAdmin) {
    users.push({
      username: "admin",
      email: "admin@taugammaphi.org",
      password: "admin123",
      role: "admin",
    });
    saveUsers(users);
  }
}

seedAdminAccount();

function findUser(username) {
  return getUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

function usernameExists(username) {
  return !!findUser(username);
}

function findUserByIdentifier(identifier) {
  const value = identifier.toLowerCase();
  return getUsers().find(
    (u) =>
      u.username.toLowerCase() === value ||
      (u.email && u.email.toLowerCase() === value)
  );
}

function updatePassword(username, newPassword) {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return false;
  user.password = newPassword;
  saveUsers(users);
  return true;
}

function registerMember(memberData) {
  const users = getUsers();
  users.push({ ...memberData, role: "member" });
  saveUsers(users);
}

function attemptLogin(username, password) {
  const user = findUser(username);
  if (user && user.password === password) return user;
  return null;
}

function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username: user.username, role: user.role })
  );
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function redirectForRole(role) {
  window.location.href = role === "admin" ? "admin.html" : "index.html";
}
