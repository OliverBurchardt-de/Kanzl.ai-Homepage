/* ==========================================================================
   Kanzl.ai — Interaktion
   Vanilla JS, keine Abhängigkeiten. Respektiert prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* -------------------- Theme toggle -------------------- */
  var themeToggle = document.getElementById("theme-toggle");

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function currentTheme() {
    return root.getAttribute("data-theme") || (systemPrefersDark() ? "dark" : "light");
  }
  function syncTogglePressed() {
    if (themeToggle) themeToggle.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  }
  syncTogglePressed();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("kanzl-theme", next); } catch (e) {}
      syncTogglePressed();
    });
  }

  /* -------------------- Mobile navigation -------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
  }
  function openNav() {
    navLinks.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Menü schließen");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      if (navLinks.classList.contains("is-open")) closeNav();
      else openNav();
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* -------------------- Header scrolled state -------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------- Footer year -------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------- Reveal on scroll -------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* -------------------- Prompt console (hero signature) -------------------- */
  var typed = document.getElementById("console-typed");
  var caret = document.getElementById("console-caret");
  var answer = document.getElementById("console-answer");
  var answerList = document.getElementById("console-answer-list");
  var answerFoot = answer ? answer.querySelector(".console-foot") : null;

  var scenes = [
    {
      prompt: "Fasse diese 40-seitige Klageschrift zusammen und liste alle Fristen auf.",
      items: [
        "Kernsachverhalt in 6 Sätzen zusammengefasst",
        "3 Fristen erkannt &amp; im Kalender vorgemerkt",
        "Beweisangebote strukturiert aufgelistet"
      ],
      foot: "24 Sekunden statt 45 Minuten — geprüft von der Fachkraft."
    },
    {
      prompt: "Entwirf ein Mandantenschreiben zur Fristverlängerung.",
      items: [
        "Höflicher Entwurf in Ihrem Kanzleistil",
        "Passende Höflichkeits- und Schlussformel",
        "Nur noch prüfen und freigeben"
      ],
      foot: "Vom leeren Blatt zum Entwurf in unter einer Minute."
    },
    {
      prompt: "Welche Unterlagen fehlen mir für diese Steuererklärung?",
      items: [
        "Checkliste aus den Mandantendaten erstellt",
        "4 fehlende Belege konkret benannt",
        "Vorformulierte Nachfrage an den Mandanten"
      ],
      foot: "Weniger Rückfragen, sauberere Akte."
    }
  ];

  function typeText(el, text, speed, done) {
    var i = 0;
    (function step() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        setTimeout(step, speed + Math.random() * 26);
      } else if (done) {
        setTimeout(done, 900);
      }
    })();
  }

  function renderAnswer(scene) {
    if (!answerList) return;
    var check =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> ';
    answerList.innerHTML = scene.items
      .map(function (t) { return "<li>" + check + t + "</li>"; })
      .join("");
    if (answerFoot) answerFoot.innerHTML = '<span aria-hidden="true">⏱</span> ' + scene.foot;
  }

  if (typed && answer && !prefersReduced) {
    var idx = 0;
    var run = function () {
      var scene = scenes[idx % scenes.length];
      answer.classList.remove("is-visible");
      if (caret) caret.style.display = "";
      typeText(typed, scene.prompt, 34, function () {
        renderAnswer(scene);
        answer.classList.add("is-visible");
        if (caret) caret.style.display = "none";
        setTimeout(function () {
          answer.classList.remove("is-visible");
          setTimeout(function () {
            typed.textContent = "";
            idx++;
            run();
          }, 450);
        }, 3600);
      });
    };
    // Start once the hero is on screen (or immediately as fallback)
    if ("IntersectionObserver" in window) {
      var hero = typed.closest(".console");
      var heroIo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { heroIo.disconnect(); run(); }
      }, { threshold: 0.25 });
      if (hero) heroIo.observe(hero); else run();
    } else {
      run();
    }
  } else if (typed) {
    // Reduced motion / no JS animation: show static example (already in markup)
    typed.textContent = typed.getAttribute("data-static") || scenes[0].prompt;
    if (caret) caret.style.display = "none";
    if (answer) answer.classList.add("is-visible");
  }
})();
