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

function setNavbarOffset() {
  document.documentElement.style.setProperty(
    "--navbar-height",
    navbar.offsetHeight + "px"
  );
}

setNavbarOffset();
window.addEventListener("resize", setNavbarOffset);
window.addEventListener("load", setNavbarOffset);

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector(".contact-submit-btn");
    const originalLabel = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent';
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerHTML = originalLabel;
      submitBtn.disabled = false;
    }, 2000);
  });
}
