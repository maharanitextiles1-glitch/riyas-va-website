const header = document.querySelector(".site-header");
const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});

document.getElementById("year").textContent = new Date().getFullYear();


/* Awards carousel — 3 desktop / 2 tablet / 1 mobile */
document.querySelectorAll("[data-awards-carousel]").forEach(carousel => {
  const viewport = carousel.querySelector(".awards-viewport");
  const track = carousel.querySelector(".awards-track");
  const slides = Array.from(carousel.querySelectorAll(".award-slide"));
  const prev = carousel.querySelector(".award-nav-prev");
  const next = carousel.querySelector(".award-nav-next");
  const dotsWrap = carousel.querySelector(".award-dots");
  const counter = carousel.querySelector(".award-counter b");

  let current = 0;
  let timer = null;
  let perView = getPerView();

  function getPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, slides.length - perView);
  }

  function rebuildDots() {
    dotsWrap.innerHTML = "";
    const totalPositions = maxIndex() + 1;

    for (let i = 0; i < totalPositions; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "award-dot" + (i === current ? " active" : "");
      dot.setAttribute("aria-label", `Go to award group ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
  }

  function getStep() {
    if (!slides.length) return 0;
    const first = slides[0];
    const slideWidth = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return slideWidth + gap;
  }

  function goTo(index, resetAuto = false) {
    const max = maxIndex();

    if (index > max) index = 0;
    if (index < 0) index = max;

    current = index;

    const offset = getStep() * current;
    track.style.transform = `translateX(-${offset}px)`;

    const dots = Array.from(dotsWrap.querySelectorAll(".award-dot"));
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });

    if (counter) {
      counter.textContent = String(current + 1).padStart(2, "0");
    }

    if (resetAuto) restartAuto();
  }

  function restartAuto() {
    clearInterval(timer);
    timer = setInterval(() => {
      goTo(current + 1);
    }, 4200);
  }

  function refreshLayout() {
    const newPerView = getPerView();

    if (newPerView !== perView) {
      perView = newPerView;
      current = Math.min(current, maxIndex());
      rebuildDots();
    }

    goTo(current);
  }

  prev.addEventListener("click", () => goTo(current - 1, true));
  next.addEventListener("click", () => goTo(current + 1, true));

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restartAuto);

  let touchStartX = 0;

  carousel.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", event => {
    const diff = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) > 45) {
      goTo(current + (diff < 0 ? 1 : -1), true);
    }
  }, { passive: true });

  window.addEventListener("resize", refreshLayout);

  rebuildDots();
  goTo(0);
  restartAuto();
});


/* Media carousel — 3 desktop / 2 tablet / 1 mobile */
document.querySelectorAll("[data-media-carousel]").forEach(carousel => {
  const track = carousel.querySelector(".media-track");
  const slides = Array.from(carousel.querySelectorAll(".media-slide"));
  const prev = carousel.querySelector(".media-nav-prev");
  const next = carousel.querySelector(".media-nav-next");
  const dotsWrap = carousel.querySelector(".media-dots");

  let current = 0;
  let perView = getPerView();
  let timer = null;

  function getPerView() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function maxIndex() {
    return Math.max(0, slides.length - perView);
  }

  function getStep() {
    if (!slides.length) return 0;
    const width = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return width + gap;
  }

  function rebuildDots() {
    dotsWrap.innerHTML = "";

    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "media-dot" + (i === current ? " active" : "");
      dot.setAttribute("aria-label", `Go to media group ${i + 1}`);
      dot.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(index, resetAuto = false) {
    const max = maxIndex();

    if (index > max) index = 0;
    if (index < 0) index = max;

    current = index;

    track.style.transform = `translateX(-${getStep() * current}px)`;

    Array.from(dotsWrap.querySelectorAll(".media-dot")).forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });

    if (resetAuto) restartAuto();
  }

  function restartAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function refresh() {
    const newPerView = getPerView();

    if (newPerView !== perView) {
      perView = newPerView;
      current = Math.min(current, maxIndex());
      rebuildDots();
    }

    goTo(current);
  }

  prev.addEventListener("click", () => goTo(current - 1, true));
  next.addEventListener("click", () => goTo(current + 1, true));

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restartAuto);

  let touchStartX = 0;

  carousel.addEventListener("touchstart", event => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", event => {
    const diff = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(diff) > 45) {
      goTo(current + (diff < 0 ? 1 : -1), true);
    }
  }, { passive: true });

  window.addEventListener("resize", refresh);

  rebuildDots();
  goTo(0);
  restartAuto();
});
