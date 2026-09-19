const tabButtons = document.querySelectorAll(".admin-tabs .filter-btn");
const tabPanels = document.querySelectorAll(".admin-tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    tabPanels.forEach((panel) => {
      panel.hidden = panel.dataset.tabPanel !== btn.dataset.tab;
    });
  });
});

function readPhotoAsDataUrl(input, callback) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

const programsGrid = document.getElementById("programsGrid");
const addProgramBtn = document.getElementById("addProgramBtn");
const programModal = document.getElementById("programModal");
const programModalTitle = document.getElementById("programModalTitle");
const programForm = document.getElementById("programForm");
const programPhotoInput = document.getElementById("programPhotoInput");
const programPhotoPreview = document.getElementById("programPhotoPreview");
const cancelProgramBtn = document.getElementById("cancelProgramBtn");

let editingProgramId = null;
let selectedProgramPhoto = null;

programPhotoInput.addEventListener("change", () => {
  readPhotoAsDataUrl(programPhotoInput, (dataUrl) => {
    selectedProgramPhoto = dataUrl;
    programPhotoPreview.innerHTML = `<img src="${dataUrl}">`;
  });
});

function openProgramModal(program) {
  editingProgramId = program ? program.id : null;
  selectedProgramPhoto = program ? program.image : null;
  programModalTitle.textContent = program ? "Edit Program" : "Add Program";
  programPhotoPreview.innerHTML = program
    ? `<img src="${program.image}">`
    : "<span>No image selected</span>";
  programModal.hidden = false;
}

function closeProgramModal() {
  programModal.hidden = true;
  programForm.reset();
  editingProgramId = null;
  selectedProgramPhoto = null;
}

function renderPrograms() {
  const programs = getPrograms();

  if (programs.length === 0) {
    programsGrid.innerHTML = '<p class="admin-panel-empty">No program posters yet.</p>';
    return;
  }

  programsGrid.innerHTML = programs
    .map(
      (p) => `
        <div class="admin-image-card">
          <img src="${p.image}" alt="Program poster">
          <div class="admin-image-card-actions">
            <button type="button" class="admin-icon-btn admin-image-btn edit-program-btn" data-id="${p.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="admin-icon-btn admin-image-btn delete-program-btn" data-id="${p.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `
    )
    .join("");

  programsGrid.querySelectorAll(".edit-program-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const program = getPrograms().find((p) => p.id === Number(btn.dataset.id));
      if (program) openProgramModal(program);
    });
  });

  programsGrid.querySelectorAll(".delete-program-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteProgram(Number(btn.dataset.id));
      renderPrograms();
    });
  });
}

addProgramBtn.addEventListener("click", () => openProgramModal(null));
cancelProgramBtn.addEventListener("click", closeProgramModal);

programForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedProgramPhoto) return;

  if (editingProgramId) {
    updateProgram(editingProgramId, { image: selectedProgramPhoto });
  } else {
    addProgram({ image: selectedProgramPhoto });
  }

  closeProgramModal();
  renderPrograms();
});

const galleryGrid = document.getElementById("galleryGrid");
const addGalleryBtn = document.getElementById("addGalleryBtn");
const galleryModal = document.getElementById("galleryModal");
const galleryModalTitle = document.getElementById("galleryModalTitle");
const galleryForm = document.getElementById("galleryForm");
const galleryPhotoInput = document.getElementById("galleryPhotoInput");
const galleryPhotoPreview = document.getElementById("galleryPhotoPreview");
const galleryCategoryInput = document.getElementById("galleryCategoryInput");
const cancelGalleryBtn = document.getElementById("cancelGalleryBtn");

let editingGalleryId = null;
let selectedGalleryPhoto = null;

galleryPhotoInput.addEventListener("change", () => {
  readPhotoAsDataUrl(galleryPhotoInput, (dataUrl) => {
    selectedGalleryPhoto = dataUrl;
    galleryPhotoPreview.innerHTML = `<img src="${dataUrl}">`;
  });
});

function openGalleryModal(item) {
  editingGalleryId = item ? item.id : null;
  selectedGalleryPhoto = item ? item.image : null;
  galleryModalTitle.textContent = item ? "Edit Photo" : "Add Photo";
  galleryPhotoPreview.innerHTML = item
    ? `<img src="${item.image}">`
    : "<span>No image selected</span>";
  galleryCategoryInput.value = item ? item.category : "events";
  galleryModal.hidden = false;
}

function closeGalleryModal() {
  galleryModal.hidden = true;
  galleryForm.reset();
  editingGalleryId = null;
  selectedGalleryPhoto = null;
}

function renderGallery() {
  const items = getGalleryItems();

  if (items.length === 0) {
    galleryGrid.innerHTML = '<p class="admin-panel-empty">No gallery photos yet.</p>';
    return;
  }

  galleryGrid.innerHTML = items
    .map(
      (g) => `
        <div class="admin-image-card">
          <img src="${g.image}" alt="Gallery photo">
          <span class="admin-image-category">${g.category}</span>
          <div class="admin-image-card-actions">
            <button type="button" class="admin-icon-btn admin-image-btn edit-gallery-btn" data-id="${g.id}">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="admin-icon-btn admin-image-btn delete-gallery-btn" data-id="${g.id}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `
    )
    .join("");

  galleryGrid.querySelectorAll(".edit-gallery-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = getGalleryItems().find((g) => g.id === Number(btn.dataset.id));
      if (item) openGalleryModal(item);
    });
  });

  galleryGrid.querySelectorAll(".delete-gallery-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteGalleryItem(Number(btn.dataset.id));
      renderGallery();
    });
  });
}

addGalleryBtn.addEventListener("click", () => openGalleryModal(null));
cancelGalleryBtn.addEventListener("click", closeGalleryModal);

galleryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!selectedGalleryPhoto) return;

  const category = galleryCategoryInput.value;

  if (editingGalleryId) {
    updateGalleryItem(editingGalleryId, { image: selectedGalleryPhoto, category });
  } else {
    addGalleryItem({ image: selectedGalleryPhoto, category });
  }

  closeGalleryModal();
  renderGallery();
});

renderPrograms();
renderGallery();
