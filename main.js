const navbar = document.getElementById("navbar");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const chevronBtn = document.getElementById("chevronBtn");
const navLinks = document.getElementById("navLinks");

hamburgerBtn.addEventListener("click", () => {
  navbar.classList.add("nav-open");
});

chevronBtn.addEventListener("click", () => {
  navbar.classList.remove("nav-open");
});

const links = navLinks.querySelectorAll("a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("nav-open");
  });
});
