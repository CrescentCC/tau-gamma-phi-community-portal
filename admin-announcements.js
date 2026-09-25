const announcementForm = document.getElementById("announcementForm");
const announcementSuccess = document.getElementById("announcementSuccess");
const announcementList = document.getElementById("announcementList");
const announcementSubmitBtn = document.getElementById("announcementSubmitBtn");
const cancelEditAnnouncementBtn = document.getElementById("cancelEditAnnouncementBtn");

let editingAnnouncementId = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function resetForm() {
  announcementForm.reset();
  editingAnnouncementId = null;
  announcementSubmitBtn.textContent = "Publish";
  cancelEditAnnouncementBtn.hidden = true;
}

function startEdit(announcement) {
  editingAnnouncementId = announcement.id;
  document.getElementById("announcementTitle").value = announcement.title;
  document.getElementById("announcementContents").value = announcement.contents;

  announcementSubmitBtn.textContent = "Update";
  cancelEditAnnouncementBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAnnouncements() {
  const list = getAnnouncements();

  if (list.length === 0) {
    announcementList.innerHTML = '<p class="admin-panel-empty">No announcements yet.</p>';
    return;
  }

  announcementList.innerHTML = list
    .map(
      (a) => `
        <div class="admin-list-row">
          <div class="admin-list-row-main">
            <p class="admin-list-row-title">${escapeHtml(a.title)}</p>
            <p class="admin-list-row-date">${formatDateDisplay(a.date)}</p>
            <p class="admin-list-row-body">${escapeHtml(a.contents)}</p>
          </div>
          <div class="admin-table-actions">
            <button type="button" class="admin-icon-btn edit-announcement-btn" data-id="${a.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="admin-icon-btn delete-announcement-btn" data-id="${a.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `
    )
    .join("");

  announcementList.querySelectorAll(".edit-announcement-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const announcement = getAnnouncements().find((a) => a.id === id);
      if (announcement) startEdit(announcement);
    });
  });

  announcementList.querySelectorAll(".delete-announcement-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      deleteAnnouncement(id);
      if (editingAnnouncementId === id) resetForm();
      renderAnnouncements();
    });
  });
}

cancelEditAnnouncementBtn.addEventListener("click", resetForm);

announcementForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("announcementTitle").value.trim();
  const contents = document.getElementById("announcementContents").value.trim();

  if (!title || !contents) return;

  if (editingAnnouncementId) {
    updateAnnouncement(editingAnnouncementId, { title, contents });
  } else {
    addAnnouncement({ title, contents });
  }

  const wasEditing = !!editingAnnouncementId;
  resetForm();

  announcementSuccess.textContent = wasEditing ? "Announcement updated." : "Announcement published.";
  announcementSuccess.hidden = false;
  setTimeout(() => {
    announcementSuccess.hidden = true;
  }, 2000);

  renderAnnouncements();
});

renderAnnouncements();
  renderAnnouncements();
});

renderAnnouncements();
