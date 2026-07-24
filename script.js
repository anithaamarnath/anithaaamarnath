const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

const setHeaderState = () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const countUp = (element) => {
  const target = Number(element.dataset.count);
  const duration = 1200;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.floor(target * eased);

    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
};

const stats = document.querySelector(".stats-grid");
let counted = false;

const statsObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll("[data-count]").forEach(countUp);
      statsObserver.disconnect();
    }
  },
  { threshold: 0.35 }
);

if (stats) statsObserver.observe(stats);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

document.getElementById("year").textContent = new Date().getFullYear();
