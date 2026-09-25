const lightboxOverlay = document.getElementById("lightboxOverlay");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightboxOverlay.hidden = false;

  requestAnimationFrame(() => {
    lightboxOverlay.classList.add("visible");
  });

  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightboxOverlay.classList.remove("visible");
  document.body.style.overflow = "";

  setTimeout(() => {
    lightboxOverlay.hidden = true;
    lightboxImg.src = "";
  }, 250);
}

document.addEventListener("click", (e) => {
  const target = e.target.closest(
    ".event-img, .program-card img, .gallery-item img"
  );
  if (target) {
    openLightbox(target.src, target.alt);
  }
});

lightboxClose.addEventListener("click", closeLightbox);

lightboxOverlay.addEventListener("click", (e) => {
  if (e.target === lightboxOverlay) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightboxOverlay.hidden) closeLightbox();
});
