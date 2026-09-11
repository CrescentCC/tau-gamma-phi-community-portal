const session = getSession();
if (session) {
  document.getElementById("adminUsernameLabel").textContent = session.username;
}

const memberCountEl = document.getElementById("totalMembersStat");
if (memberCountEl) {
  const memberCount = getUsers().filter((u) => u.role === "member").length;
  memberCountEl.textContent = memberCount;
}

const adminSidebar = document.getElementById("adminSidebar");
const adminHamburgerBtn = document.getElementById("adminHamburgerBtn");
const adminOverlay = document.getElementById("adminOverlay");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");

function openSidebar() {
  adminSidebar.classList.add("open");
  adminOverlay.hidden = false;
}

function closeSidebar() {
  adminSidebar.classList.remove("open");
  adminOverlay.hidden = true;
}

adminHamburgerBtn.addEventListener("click", openSidebar);
adminOverlay.addEventListener("click", closeSidebar);

adminLogoutBtn.addEventListener("click", () => {
  clearSession();
  window.location.href = "login.html";
});
