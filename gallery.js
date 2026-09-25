const galleryContainer = document.getElementById("galleryContainer");
const filterBtns = document.querySelectorAll(".filter-btn");

function renderGalleryPage() {
  const items = getGalleryItems();

  if (items.length === 0) {
    galleryContainer.innerHTML = '<p class="admin-panel-empty">No photos yet. Check back soon!</p>';
    return;
  }

  galleryContainer.innerHTML = items
    .map(
      (item) => `
        <div class="gallery-item" data-category="${item.category}">
          <img src="${item.image}" alt="Gallery photo">
        </div>
      `
    )
    .join("");
}

function applyFilter(filter) {
  document.querySelectorAll(".gallery-item").forEach((item) => {
    const matches = filter === "all" || item.dataset.category === filter;
    item.classList.toggle("hidden", !matches);
  });
}

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter(btn.dataset.filter);
  });
});

renderGalleryPage();
