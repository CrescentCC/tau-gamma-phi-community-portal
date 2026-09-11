const filterBtns = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    galleryItems.forEach((item) => {
      const matches = filter === "all" || item.dataset.category === filter;
      item.classList.toggle("hidden", !matches);
    });
  });
});
