/* =====================================================
   main.js  –  Varshini Uppada Portfolio
   Covers: Custom cursor, Particles, Typewriter,
           Scroll Reveal, Counter animation, Skill bars,
           Nav highlight, Hamburger, Form submit
   ===================================================== */

"use strict";

/* ── 1. CUSTOM CURSOR ─────────────────────────────── */
(function () {
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  if (!cursor || !cursorTrail) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener("mousemove", e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + "px";
    cursor.style.top = ty + "px";
  });

  function animateTrail() {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    cursorTrail.style.left = cx + "px";
    cursorTrail.style.top = cy + "px";
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover effect on interactive elements
  const interactables = document.querySelectorAll("a, button, input, textarea, .project-card, .info-card, .timeline-card, .cert-coming-card");
  interactables.forEach(el => {
    el.addEventListener("mouseenter", () => { cursor.classList.add("hovering"); cursorTrail.classList.add("hovering"); });
    el.addEventListener("mouseleave", () => { cursor.classList.remove("hovering"); cursorTrail.classList.remove("hovering"); });
  });
})();




/* ── 3. TYPEWRITER ────────────────────────────────── */
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const words = [
    "LLM pipelines",
    "Computer Vision",
    "NLP systems",
    "scalable APIs",
    "Neural Networks",
    "things that scale",
  ];
  let wi = 0, ci = 0, deleting = false;
  const TYPING_SPEED = 80, DELETING_SPEED = 40, PAUSE = 1800;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? DELETING_SPEED : TYPING_SPEED);
  }
  type();
})();


/* ── 4. COUNTER ANIMATION ─────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  let current = 0;
  const step = Math.ceil(target / 55);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(interval);
  }, 25);
}


/* ── 5. SKILL BAR ANIMATION ───────────────────────── */
function animateBar(el) {
  const w = el.dataset.width;
  el.style.width = w + "%";
}


/* ── 6. SCROLL REVEAL + INTERSECTION OBSERVER ─────── */
(function () {
  const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
  const counters = document.querySelectorAll(".stat-number");
  const barFills = document.querySelectorAll(".bar-fill, .edu-progress-fill");
  let countersAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  // Counter & Bar observers
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        counters.forEach(c => animateCounter(c));
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) statObserver.observe(heroStats);

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBar(entry.target);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  barFills.forEach(b => barObserver.observe(b));
})();


/* ── 7. NAVBAR SCROLL & ACTIVE LINK ──────────────── */
(function () {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    const scrollY = window.scrollY;

    // scrolled class
    if (scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    // active link
    let current = "";
    sections.forEach(s => {
      if (scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle("active", l.dataset.target === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();


/* ── 8. HAMBURGER MENU ────────────────────────────── */
(function () {
  const btn = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    links.classList.toggle("open");
  });

  // Close on link click (mobile)
  links.querySelectorAll(".nav-link").forEach(l => {
    l.addEventListener("click", () => {
      btn.classList.remove("open");
      links.classList.remove("open");
    });
  });
})();


/* ── 9. CONTACT FORM ──────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById("submitBtn");
  const text = document.getElementById("submitText");
  const icon = document.getElementById("submitIcon");
  const success = document.getElementById("formSuccess");

  btn.disabled = true;
  text.textContent = "Sending…";
  icon.textContent = "⏳";

  // Simulate send (replace with real endpoint when needed)
  setTimeout(() => {
    text.textContent = "Sent!";
    icon.textContent = "✅";
    success.style.display = "block";
    e.target.reset();
    setTimeout(() => {
      btn.disabled = false;
      text.textContent = "Send Message";
      icon.textContent = "🚀";
      success.style.display = "none";
    }, 4000);
  }, 1500);
}


/* ── 10. SMOOTH SCROLL for CTA buttons ───────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


/* ── 11. TILT EFFECT on project cards ─────────────── */
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


/* ── 12. GLOWING CURSOR TRAIL on hero ─────────────── */
(function () {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  hero.addEventListener("mousemove", e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    hero.style.setProperty("--mx", x + "px");
    hero.style.setProperty("--my", y + "px");
  });
})();


/* ── 13. STAGGERED REVEAL for timeline items ─────── */
(function () {
  const items = document.querySelectorAll(".timeline-item");
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("revealed"), i * 120);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  items.forEach(item => obs.observe(item));
})();


/* ── 14. LOADER ────────────────────────────────────── */
(function () {
  const loader = document.getElementById("loader");
  if (!loader) return;
  // Hide after CSS animation completes (1.6s) + a little buffer
  setTimeout(() => loader.classList.add("hidden"), 1900);
})();


/* ── 15. SKILL ICON CARDS – STAGGERED ENTRY ─────────── */
(function () {
  const cards = document.querySelectorAll(".skill-icon-card");
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reveal with the CSS-custom-property delay
        entry.target.classList.add("sic-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  cards.forEach(c => obs.observe(c));

  // Cursor hover effect
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  cards.forEach(c => {
    c.addEventListener("mouseenter", () => {
      cursor && cursor.classList.add("hovering");
      cursorTrail && cursorTrail.classList.add("hovering");
    });
    c.addEventListener("mouseleave", () => {
      cursor && cursor.classList.remove("hovering");
      cursorTrail && cursorTrail.classList.remove("hovering");
    });
  });
})();


/* ── 16. SKILL CATEGORY TABS ──────────────────────── */
(function () {
  const tabs = document.querySelectorAll(".skill-tab");
  const cards = document.querySelectorAll(".skill-icon-card");
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const cat = tab.dataset.cat;
      cards.forEach(card => {
        const matches = cat === "all" || card.dataset.cat === cat;
        if (matches) {
          card.classList.remove("filtered-out");
        } else {
          card.classList.add("filtered-out");
        }
      });
    });
  });
})();




/* ── 17. 3-D CARD TILT ───────────────────────────── */
(function () {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const maxTilt = 10;
      const rx = (-y / (r.height / 2)) * maxTilt;
      const ry = (x / (r.width / 2)) * maxTilt;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();


/* ── 18. MAGNETIC BUTTON SPOTLIGHT ──────────────── */
(function () {
  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      btn.style.setProperty("--mx", x + "%");
      btn.style.setProperty("--my", y + "%");
    });
  });
})();


/* ── 19. AMBIENT BLOB INJECTION ─────────────────── */
(function () {
  ["blob-1", "blob-2", "blob-3"].forEach(cls => {
    const el = document.createElement("div");
    el.className = "ambient-blob " + cls;
    document.body.appendChild(el);
  });
})();


/* ── 20. STAGGER-WRAP OBSERVER ───────────────────── */
(function () {
  // Mark cert-grid and projects-grid as stagger-wraps
  document.querySelectorAll(".cert-grid, .hero-stats").forEach(el => {
    el.classList.add("stagger-wrap");
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".stagger-wrap").forEach(el => obs.observe(el));
})();


/* ── 21. REVEAL-LEFT / REVEAL-RIGHT OBSERVER ─────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll(".reveal-left, .reveal-right").forEach(el => obs.observe(el));
})();


/* ── 22. COUNT-UP POP TRIGGER ────────────────────── */
(function () {
  const nums = document.querySelectorAll(".stat-number");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("popped");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.8 });
  nums.forEach(n => obs.observe(n));
})();


/* ── 23. CURSOR MAGNETIC PULL on buttons ────────── */
(function () {
  document.querySelectorAll(".btn-primary, .btn-secondary, .project-link-btn").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
})();

