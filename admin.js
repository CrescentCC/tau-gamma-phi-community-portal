const session = getSession();
if (session) {
  document.getElementById("adminUsernameLabel").textContent = session.username;
}

const memberCountEl = document.getElementById("totalMembersStat");
if (memberCountEl) {
  const memberCount = getUsers().filter((u) => u.role === "member").length;
  memberCountEl.textContent = memberCount;
}

const totalEventsStat = document.getElementById("totalEventsStat");
if (totalEventsStat && typeof getEvents === "function") {
  const events = getEvents();
  const upcomingCount = events.filter((e) => e.status === "Upcoming").length;

  totalEventsStat.textContent = events.length;
  document.getElementById("upcomingEventsStat").textContent = upcomingCount;
  document.getElementById("newAnnouncementsStat").textContent = getAnnouncements().length;

  const dashboardEvents = document.getElementById("dashboardEvents");
  const upcoming = events.filter((e) => e.status === "Upcoming").slice(0, 3);
  if (upcoming.length > 0) {
    dashboardEvents.innerHTML = upcoming
      .map(
        (e) =>
          `<p class="admin-dashboard-list-item"><strong>${escapeHtml(e.title)}</strong> - ${formatDateDisplay(e.date)}</p>`
      )
      .join("");
  }

  const dashboardAnnouncements = document.getElementById("dashboardAnnouncements");
  const recent = getAnnouncements().slice(0, 3);
  if (recent.length > 0) {
    dashboardAnnouncements.innerHTML = recent
      .map(
        (a) =>
          `<p class="admin-dashboard-list-item"><strong>${escapeHtml(a.title)}</strong> - ${formatDateDisplay(a.date)}</p>`
      )
      .join("");
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
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
  window.location.href = "index.html";
});
