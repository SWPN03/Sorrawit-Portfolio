const menuButton = document.querySelector("#menuButton");
const navLinks = document.querySelector("#navLinks");
const yearElement = document.querySelector("#year");
const navigationLinks = document.querySelectorAll(".nav-links a");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Mobile navigation
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

// Active navigation link
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
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

  sections.forEach((section) => navObserver.observe(section));
}

// ==========================================================
// Certificate popup
// ==========================================================
const certificateLinks = document.querySelectorAll(".certificate-card .text-link");

const certModal = document.createElement("div");
certModal.className = "cert-modal";
certModal.setAttribute("aria-hidden", "true");
certModal.innerHTML = `
  <div class="cert-modal-overlay" data-cert-close></div>
  <div class="cert-modal-content" role="dialog" aria-modal="true" aria-label="Certificate preview">
    <button class="cert-modal-close" type="button" data-cert-close aria-label="Close certificate">&times;</button>
    <div class="cert-modal-viewer"></div>
  </div>
`;
document.body.appendChild(certModal);

const certModalViewer = certModal.querySelector(".cert-modal-viewer");

function isPdf(url) {
  return url.split("?")[0].split("#")[0].toLowerCase().endsWith(".pdf");
}

function openCertificateModal(link) {
  const url = link.getAttribute("href");
  if (!url) return;

  certModalViewer.innerHTML = "";

  if (isPdf(url)) {
    const frame = document.createElement("iframe");
    frame.src = url;
    frame.className = "cert-modal-pdf";
    frame.title = "Certificate PDF";
    certModalViewer.appendChild(frame);
  } else {
    const image = document.createElement("img");
    image.src = url;
    image.alt = link.closest(".certificate-card")?.querySelector("h3")?.textContent?.trim() || "Certificate";
    image.className = "cert-modal-image";
    certModalViewer.appendChild(image);
  }

  certModal.classList.add("active");
  certModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCertificateModal() {
  certModal.classList.remove("active");
  certModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => {
    if (!certModal.classList.contains("active")) certModalViewer.innerHTML = "";
  }, 200);
}

certificateLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openCertificateModal(link);
  });
});

certModal.querySelectorAll("[data-cert-close]").forEach((button) => {
  button.addEventListener("click", closeCertificateModal);
});

// ==========================================================
// Achievement showcase popup + gallery
// ==========================================================
const achievementLinks = document.querySelectorAll(".timeline-card .achievement-view");

const achievementModal = document.createElement("div");
achievementModal.className = "achievement-modal";
achievementModal.setAttribute("aria-hidden", "true");
achievementModal.innerHTML = `
  <div class="achievement-modal-overlay" data-achievement-close></div>
  <div class="achievement-modal-dialog" role="dialog" aria-modal="true" aria-label="Achievement details">
    <button class="achievement-modal-close" type="button" data-achievement-close aria-label="Close achievement">&times;</button>
    <div class="achievement-modal-grid">
      <div class="achievement-gallery">
        <div class="achievement-gallery-stage">
          <div class="achievement-gallery-media"></div>
          <button class="achievement-gallery-arrow achievement-gallery-prev" type="button" aria-label="Previous image">&#8249;</button>
          <button class="achievement-gallery-arrow achievement-gallery-next" type="button" aria-label="Next image">&#8250;</button>
        </div>
        <div class="achievement-gallery-dots" aria-label="Gallery navigation"></div>
        <p class="achievement-gallery-counter"></p>
      </div>
      <div class="achievement-modal-info">
        <span class="achievement-modal-type"></span>
        <h2 class="achievement-modal-title"></h2>
        <p class="achievement-modal-rank"></p>
        <p class="achievement-modal-date"></p>
        <p class="achievement-modal-description"></p>
        <div class="achievement-modal-meta"></div>
        <a class="text-link achievement-modal-open" href="#" target="_blank" rel="noopener noreferrer">Open original ↗</a>
      </div>
    </div>
  </div>
`;
document.body.appendChild(achievementModal);

const galleryMedia = achievementModal.querySelector(".achievement-gallery-media");
const galleryDots = achievementModal.querySelector(".achievement-gallery-dots");
const galleryCounter = achievementModal.querySelector(".achievement-gallery-counter");
const galleryPrev = achievementModal.querySelector(".achievement-gallery-prev");
const galleryNext = achievementModal.querySelector(".achievement-gallery-next");
const modalType = achievementModal.querySelector(".achievement-modal-type");
const modalTitle = achievementModal.querySelector(".achievement-modal-title");
const modalRank = achievementModal.querySelector(".achievement-modal-rank");
const modalDate = achievementModal.querySelector(".achievement-modal-date");
const modalDescription = achievementModal.querySelector(".achievement-modal-description");
const modalMeta = achievementModal.querySelector(".achievement-modal-meta");
const modalOpen = achievementModal.querySelector(".achievement-modal-open");

let galleryItems = [];
let galleryIndex = 0;

function getGalleryItems(link) {
  const customGallery = link.dataset.gallery;
  if (customGallery) {
    return customGallery.split("|").map((item) => item.trim()).filter(Boolean);
  }
  const href = link.getAttribute("href");
  return href ? [href] : [];
}

function renderGallery() {
  const current = galleryItems[galleryIndex];
  galleryMedia.innerHTML = "";

  if (current) {
    if (isPdf(current)) {
      const frame = document.createElement("iframe");
      frame.src = current;
      frame.title = `Achievement document ${galleryIndex + 1}`;
      galleryMedia.appendChild(frame);
    } else {
      const image = document.createElement("img");
      image.src = current;
      image.alt = `Achievement image ${galleryIndex + 1}`;
      galleryMedia.appendChild(image);
    }
  }

  galleryDots.innerHTML = "";
  galleryItems.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `achievement-gallery-dot${index === galleryIndex ? " active" : ""}`;
    dot.setAttribute("aria-label", `Show image ${index + 1}`);
    dot.addEventListener("click", () => {
      galleryIndex = index;
      renderGallery();
    });
    galleryDots.appendChild(dot);
  });

  const multiple = galleryItems.length > 1;
  galleryPrev.hidden = !multiple;
  galleryNext.hidden = !multiple;
  galleryDots.hidden = !multiple;
  galleryCounter.textContent = galleryItems.length ? `${galleryIndex + 1} / ${galleryItems.length}` : "";
}

function openAchievementModal(link) {
  const card = link.closest(".timeline-card");
  if (!card) return;

  const badge = card.querySelector(".certificate-badge")?.textContent?.trim() || "ACHIEVEMENT";
  const title = card.querySelector(".timeline-header h3")?.textContent?.replace(/\s+/g, " ").trim() || "Achievement";
  const date = card.querySelector(".timeline-header > span")?.textContent?.trim() || "";
  const rank = card.querySelector(".achievement-title")?.textContent?.trim() || "";
  const description = [...card.querySelectorAll(":scope > p:not(.achievement-title)")]
    .map((p) => p.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");

  galleryItems = getGalleryItems(link);
  galleryIndex = 0;

  modalType.textContent = badge;
  modalTitle.textContent = title;
  modalRank.textContent = rank;
  modalRank.hidden = !rank;
  modalDate.textContent = date;
  modalDate.hidden = !date;
  modalDescription.textContent = description || "Achievement details and supporting media.";

  modalMeta.innerHTML = "";
  [badge, "Cybersecurity", rank ? "Competition" : "Participation"].forEach((label) => {
    if (!label) return;
    const tag = document.createElement("span");
    tag.textContent = label;
    modalMeta.appendChild(tag);
  });

  modalOpen.href = link.getAttribute("href") || "#";
  renderGallery();

  achievementModal.classList.add("active");
  achievementModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeAchievementModal() {
  achievementModal.classList.remove("active");
  achievementModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  window.setTimeout(() => {
    if (!achievementModal.classList.contains("active")) galleryMedia.innerHTML = "";
  }, 200);
}

achievementLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openAchievementModal(link);
  });
});

galleryPrev.addEventListener("click", () => {
  galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
  renderGallery();
});

galleryNext.addEventListener("click", () => {
  galleryIndex = (galleryIndex + 1) % galleryItems.length;
  renderGallery();
});

achievementModal.querySelectorAll("[data-achievement-close]").forEach((button) => {
  button.addEventListener("click", closeAchievementModal);
});

// Keyboard controls for both popups
document.addEventListener("keydown", (event) => {
  if (achievementModal.classList.contains("active")) {
    if (event.key === "Escape") closeAchievementModal();
    if (event.key === "ArrowLeft" && galleryItems.length > 1) {
      galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
      renderGallery();
    }
    if (event.key === "ArrowRight" && galleryItems.length > 1) {
      galleryIndex = (galleryIndex + 1) % galleryItems.length;
      renderGallery();
    }
    return;
  }

  if (event.key === "Escape" && certModal.classList.contains("active")) {
    closeCertificateModal();
  }
});
