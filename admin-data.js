const ANNOUNCEMENTS_KEY = "tgp_announcements";
const EVENTS_KEY = "tgp_events";

function getAnnouncements() {
  const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAnnouncements(list) {
  localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(list));
}

function addAnnouncement(announcement) {
  const list = getAnnouncements();
  list.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    ...announcement,
  });
  saveAnnouncements(list);
}

function deleteAnnouncement(id) {
  saveAnnouncements(getAnnouncements().filter((a) => a.id !== id));
}

function updateAnnouncement(id, updates) {
  const list = getAnnouncements();
  const target = list.find((a) => a.id === id);
  if (!target) return;
  Object.assign(target, updates);
  saveAnnouncements(list);
}

function getEvents() {
  const raw = localStorage.getItem(EVENTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveEvents(list) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(list));
}

function addEvent(event) {
  const list = getEvents();
  list.push({ id: Date.now(), ...event });
  saveEvents(list);
}

function updateEvent(id, updates) {
  const list = getEvents();
  const target = list.find((e) => e.id === id);
  if (!target) return;
  Object.assign(target, updates);
  saveEvents(list);
}

function deleteEvent(id) {
  saveEvents(getEvents().filter((e) => e.id !== id));
}

function formatDateDisplay(isoOrDateString) {
  const d = new Date(isoOrDateString);
  if (isNaN(d)) return isoOrDateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ATTENDANCE_KEY = "tgp_attendance";

function getAttendanceStore() {
  const raw = localStorage.getItem(ATTENDANCE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveAttendanceStore(store) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(store));
}

function getAttendanceForEvent(eventId) {
  const store = getAttendanceStore();
  return store[eventId] || {};
}

function setAttendanceStatus(eventId, username, status) {
  const store = getAttendanceStore();
  if (!store[eventId]) store[eventId] = {};
  store[eventId][username] = {
    status,
    time: status === "Present" ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
  };
  saveAttendanceStore(store);
}

const PROGRAMS_KEY = "tgp_programs";
const GALLERY_KEY = "tgp_gallery";

function getPrograms() {
  const raw = localStorage.getItem(PROGRAMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePrograms(list) {
  localStorage.setItem(PROGRAMS_KEY, JSON.stringify(list));
}

function addProgram(program) {
  const list = getPrograms();
  list.push({ id: Date.now(), ...program });
  savePrograms(list);
}

function updateProgram(id, updates) {
  const list = getPrograms();
  const target = list.find((p) => p.id === id);
  if (!target) return;
  Object.assign(target, updates);
  savePrograms(list);
}

function deleteProgram(id) {
  savePrograms(getPrograms().filter((p) => p.id !== id));
}

function getGalleryItems() {
  const raw = localStorage.getItem(GALLERY_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveGalleryItems(list) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(list));
}

function addGalleryItem(item) {
  const list = getGalleryItems();
  list.push({ id: Date.now(), ...item });
  saveGalleryItems(list);
}

function updateGalleryItem(id, updates) {
  const list = getGalleryItems();
  const target = list.find((g) => g.id === id);
  if (!target) return;
  Object.assign(target, updates);
  saveGalleryItems(list);
}

function deleteGalleryItem(id) {
  saveGalleryItems(getGalleryItems().filter((g) => g.id !== id));
}

function seedDefaultContent() {
  if (getEvents().length === 0) {
    saveEvents([
      {
        id: Date.now(),
        title: "Community Outreach Program",
        date: "2026-09-26",
        status: "Upcoming",
      },
    ]);
  }

  if (getAnnouncements().length === 0) {
    saveAnnouncements([
      {
        id: Date.now() + 1,
        title: "General Membership Meeting",
        contents:
          "All members of Tau Gamma Phi – Conception Chapter are encouraged to attend our upcoming general membership meeting. Important updates, chapter activities, and upcoming community programs will be discussed.",
        date: "2026-08-27",
        photo: null,
      },
      {
        id: Date.now() + 2,
        title: "Community Donation Drive",
        contents:
          "Our chapter is accepting donations of school supplies, clothing, food, and other essential items for our upcoming community outreach program. Every contribution, big or small, can help make a difference.",
        date: "2026-09-08",
        photo: null,
      },
    ]);
  }

  if (getPrograms().length === 0) {
    savePrograms([
      { id: Date.now() + 3, image: "assets/Program-1.jpg" },
      { id: Date.now() + 4, image: "assets/Program-2.jpg" },
      { id: Date.now() + 5, image: "assets/Program-3.jpg" },
      { id: Date.now() + 6, image: "assets/Program-4.jpg" },
      { id: Date.now() + 7, image: "assets/Program-5.jpg" },
    ]);
  }

  if (getGalleryItems().length === 0) {
    saveGalleryItems([
      { id: Date.now() + 8, image: "assets/landing-page.jpg", category: "activities" },
      { id: Date.now() + 9, image: "assets/event-photo.jpg", category: "events" },
      { id: Date.now() + 10, image: "assets/Program-1.jpg", category: "programs" },
      { id: Date.now() + 11, image: "assets/Program-2.jpg", category: "programs" },
      { id: Date.now() + 12, image: "assets/Program-3.jpg", category: "events" },
      { id: Date.now() + 13, image: "assets/Program-4.jpg", category: "activities" },
    ]);
  }
}

seedDefaultContent();
