const eventsTableBody = document.getElementById("eventsTableBody");
const addEventBtn = document.getElementById("addEventBtn");
const eventModal = document.getElementById("eventModal");
const eventModalTitle = document.getElementById("eventModalTitle");
const eventForm = document.getElementById("eventForm");
const cancelEventBtn = document.getElementById("cancelEventBtn");
const eventPhotoInput = document.getElementById("eventPhotoInput");
const eventPhotoPreview = document.getElementById("eventPhotoPreview");

let editingEventId = null;
let selectedEventPhoto = null;

eventPhotoInput.addEventListener("change", () => {
  const file = eventPhotoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedEventPhoto = reader.result;
    eventPhotoPreview.innerHTML = `<img src="${selectedEventPhoto}">`;
  };
  reader.readAsDataURL(file);
});

function openEventModal(event) {
  editingEventId = event ? event.id : null;
  selectedEventPhoto = event ? event.photo || null : null;

  eventModalTitle.textContent = event ? "Edit Event" : "Add Event";
  document.getElementById("eventTitleInput").value = event ? event.title : "";
  document.getElementById("eventDateInput").value = event ? event.date : "";
  document.getElementById("eventStatusInput").value = event ? event.status : "Upcoming";
  eventPhotoPreview.innerHTML = selectedEventPhoto
    ? `<img src="${selectedEventPhoto}">`
    : "<span>No image selected</span>";

  eventModal.hidden = false;
}

function closeEventModal() {
  eventModal.hidden = true;
  eventForm.reset();
  eventPhotoPreview.innerHTML = "<span>No image selected</span>";
  editingEventId = null;
  selectedEventPhoto = null;
}

function renderEvents() {
  const events = getEvents();

  if (events.length === 0) {
    eventsTableBody.innerHTML =
      '<tr><td colspan="4" class="admin-table-empty">No events yet.</td></tr>';
    return;
  }

  eventsTableBody.innerHTML = events
    .map(
      (e) => `
        <tr>
          <td>${escapeHtml(e.title)}</td>
          <td>${formatDateDisplay(e.date)}</td>
          <td><span class="status-pill status-${e.status.toLowerCase()}">${e.status}</span></td>
          <td class="admin-table-actions">
            <button type="button" class="admin-icon-btn edit-event-btn" data-id="${e.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="admin-icon-btn delete-event-btn" data-id="${e.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `
    )
    .join("");

  eventsTableBody.querySelectorAll(".edit-event-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const event = getEvents().find((e) => e.id === id);
      if (event) openEventModal(event);
    });
  });

  eventsTableBody.querySelectorAll(".delete-event-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteEvent(Number(btn.dataset.id));
      renderEvents();
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

addEventBtn.addEventListener("click", () => openEventModal(null));
cancelEventBtn.addEventListener("click", closeEventModal);

eventForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("eventTitleInput").value.trim();
  const date = document.getElementById("eventDateInput").value;
  const status = document.getElementById("eventStatusInput").value;

  if (!title || !date) return;

  if (editingEventId) {
    updateEvent(editingEventId, { title, date, status, photo: selectedEventPhoto });
  } else {
    addEvent({ title, date, status, photo: selectedEventPhoto });
  }

  closeEventModal();
  renderEvents();
});

renderEvents();
