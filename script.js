const menuButton = document.querySelector("#menuButton");
const navLinks = document.querySelector("#navLinks");
const yearElement = document.querySelector("#year");
const navigationLinks = document.querySelectorAll(".nav-links a");

const main = document.querySelector("main");
const portfolioSectionOrder = [
  "home",
  "about",
  "experience",
  "skills",
  "achievements",
  "projects",
  "certifications",
  "contact",
];

portfolioSectionOrder.forEach((id) => {
  const section = document.getElementById(id);
  if (main && section) main.appendChild(section);
});

const sections = document.querySelectorAll("main section[id]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });
}

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (menuButton) menuButton.textContent = "☰";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));
