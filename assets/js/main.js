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
      prompt: "Prüfe diesen Steuerbescheid auf Abweichungen zu unserer Erklärung.",
      items: [
        "3 Abweichungen zur Erklärung erkannt",
        "Einspruchsfrist erkannt &amp; vorgemerkt",
        "Begründungsentwurf für den Einspruch erstellt"
      ],
      foot: "Aus Stunden werden Minuten — geprüft von der Fachkraft."
    },
    {
      prompt: "Fasse diesen Betriebsprüfungsbericht auf die strittigen Punkte zusammen.",
      items: [
        "Kernaussagen in 6 Sätzen zusammengefasst",
        "4 strittige Feststellungen markiert",
        "Argumente je Position vorsortiert"
      ],
      foot: "Vom 60-Seiten-PDF zur Entscheidungsvorlage in Minuten."
    },
    {
      prompt: "Prüfe diesen Vertrag auf kritische Klauseln.",
      items: [
        "Kritische Klauseln hervorgehoben",
        "Fehlende Standardklauseln benannt",
        "Formulierungsvorschläge ergänzt"
      ],
      foot: "Ein Prüf-Durchgang, den Sie nur noch fachlich abnehmen."
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

/* ==========================================================================
   Datenvisualisierungen (Canvas) — "Warum jetzt"
   Theme-aware, respektiert prefers-reduced-motion, responsiv.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function fmt(n) { return Math.round(n).toLocaleString("de-DE"); }

  function hexA(col, a) {
    col = (col || "").trim();
    if (col.charAt(0) === "#") {
      var h = col.slice(1);
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      var n = parseInt(h, 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }
    if (col.indexOf("rgb") === 0) {
      return col.replace(/^rgba?\(/, "rgba(").replace(/\)\s*$/, "," + a + ")");
    }
    return col;
  }

  function colors() {
    // Charts render on a fixed dark (Anthrazit) panel in both themes,
    // so gold data has strong contrast and the look matches the hero console.
    return {
      ink: "#f5f4f0",
      soft: "#aeb1b6",
      mute: "#8b8e94",
      line: "rgba(255,255,255,0.12)",
      signal: "#F7B234"
    };
  }

  function fit(canvas) {
    var wrap = canvas.parentElement;
    var w = wrap.clientWidth, h = wrap.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); }
    if (canvas.height !== Math.round(h * dpr)) { canvas.height = Math.round(h * dpr); }
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function mount(canvas, draw) {
    var last = reduce ? 1 : 0, started = false;
    function render(p) { last = p; var s = fit(canvas); draw(s.ctx, s.w, s.h, p, colors()); }
    function animate() {
      var start = null, dur = draw.duration || 2400;
      (function step(ts) {
        if (start === null) start = ts;
        var p = clamp((ts - start) / dur, 0, 1);
        render(p);
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true; io.unobserve(canvas);
            if (reduce) render(1); else requestAnimationFrame(function () { animate(); });
          }
        });
      }, { threshold: 0.3 });
      io.observe(canvas);
    } else { render(1); }

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { render(last); }).observe(canvas.parentElement);
    } else {
      window.addEventListener("resize", function () { render(last); });
    }
    if ("MutationObserver" in window) {
      new MutationObserver(function () { render(last); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      if (mq.addEventListener) mq.addEventListener("change", function () { render(last); });
    }
  }

  /* --- Grafik A: exponentielles Wachstum (AlphaFold) --- */
  function drawExp(ctx, w, h, p, c) {
    ctx.clearRect(0, 0, w, h);
    var padL = 64, padR = 18, padT = 48, padB = 28;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var x0 = padL, yBottom = padT + plotH, yTop = padT;
    var axisMax = 210e6;
    var yearMin = 1971, yearMax = 2023;
    var pts = [
      [1971, 800], [1990, 9000], [2000, 22000], [2010, 68000],
      [2016, 120000], [2020, 190000], [2021, 1000000], [2022, 200000000], [2023, 200000000]
    ];
    function xAt(y) { return x0 + (y - yearMin) / (yearMax - yearMin) * plotW; }
    function yAt(v) { return yBottom - (v / axisMax) * plotH; }
    function valAt(y) {
      if (y <= pts[0][0]) return pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        if (y <= pts[i][0]) {
          var a = pts[i - 1], b = pts[i], f = (y - a[0]) / (b[0] - a[0]);
          return a[1] + (b[1] - a[1]) * f;
        }
      }
      return pts[pts.length - 1][1];
    }
    var y2020 = (2020 - yearMin) / (yearMax - yearMin);
    var xf = p < 0.5 ? (p / 0.5) * y2020 : y2020 + ((p - 0.5) / 0.5) * (1 - y2020);
    var revYear = yearMin + xf * (yearMax - yearMin);

    // grid + y labels
    ctx.lineWidth = 1;
    ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    [[0, "0"], [100e6, "100 Mio."], [200e6, "200 Mio."]].forEach(function (t) {
      var yy = yAt(t[0]);
      ctx.strokeStyle = c.line; ctx.globalAlpha = 0.8;
      ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + plotW, yy); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = c.mute; ctx.fillText(t[1], x0 - 8, yy);
    });
    // x labels (2020 & 2022 sit too close at this zoom — label only the peak year)
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.fillStyle = c.mute;
    [[1971, "1971"], [2000, "2000"], [2022, "2022"]].forEach(function (t) {
      ctx.fillText(t[1], xAt(t[0]), yBottom + 8);
    });

    // curve path
    var steps = 140, i, yr, px, py;
    function trace() {
      ctx.beginPath();
      for (i = 0; i <= steps; i++) {
        yr = yearMin + (revYear - yearMin) * (i / steps);
        px = xAt(yr); py = yAt(valAt(yr));
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
    }
    var tipX = xAt(revYear), tipY = yAt(valAt(revYear));
    // area
    trace();
    ctx.lineTo(tipX, yBottom); ctx.lineTo(x0, yBottom); ctx.closePath();
    var grad = ctx.createLinearGradient(0, yTop, 0, yBottom);
    grad.addColorStop(0, hexA(c.signal, 0.30));
    grad.addColorStop(1, hexA(c.signal, 0.02));
    ctx.fillStyle = grad; ctx.fill();
    // stroke
    trace();
    ctx.strokeStyle = c.signal; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.stroke();
    // tip
    ctx.fillStyle = hexA(c.signal, 0.22); ctx.beginPath(); ctx.arc(tipX, tipY, 8, 0, 6.29); ctx.fill();
    ctx.fillStyle = c.signal; ctx.beginPath(); ctx.arc(tipX, tipY, 4, 0, 6.29); ctx.fill();

    // counter readout
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = c.ink; ctx.font = "600 26px 'JetBrains Mono', monospace";
    ctx.fillText(fmt(valAt(revYear)), x0 + 2, yTop + 20);
    ctx.fillStyle = c.soft; ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.fillText(revYear <= 2020.4 ? "Strukturen · von Menschen bestimmt"
      : "Strukturen · von KI vorhergesagt", x0 + 2, yTop + 36);

    // human marker
    var aH = clamp((revYear - 2016) / 4, 0, 1);
    if (aH > 0) {
      ctx.globalAlpha = aH;
      var hx = xAt(2020), hy = yAt(190000);
      ctx.strokeStyle = c.mute; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, hy - 30); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.soft; ctx.font = "500 11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right"; ctx.textBaseline = "bottom";
      ctx.fillText("~200.000 · 50+ Jahre", hx - 3, hy - 32);
      ctx.globalAlpha = 1;
    }
    // ×1.000 badge — placed left of the cliff so it never clips the right edge
    var aE = clamp((p - 0.86) / 0.14, 0, 1);
    if (aE > 0) {
      ctx.globalAlpha = aE;
      ctx.fillStyle = c.signal; ctx.font = "700 17px 'Fraunces', Georgia, serif";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText("× 1.000", xAt(2022) - 12, yAt(120e6));
      ctx.globalAlpha = 1;
    }
  }
  drawExp.duration = 2900;

  /* --- Grafik B: die aufgehende Schere --- */
  function drawGap(ctx, w, h, p, c) {
    ctx.clearRect(0, 0, w, h);
    var padL = 46, padR = 92, padT = 30, padB = 34;
    var plotW = w - padL - padR, plotH = h - padT - padB;
    var x0 = padL, yB = padT + plotH, yT = padT;
    function xAt(t) { return x0 + t * plotW; }
    function yAt(v) { return yB - v * plotH; }
    function ai(t) { return 0.5 + 0.44 * Math.pow(t, 1.8); }
    function no(t) { return 0.5 - 0.05 * t; } /* nahezu flach: Vorsprung wächst durch Steigen, nicht Fallen */
    var tMax = easeOutCubic(p), steps = 110, i, t;

    // baseline + "heute" axis
    ctx.strokeStyle = c.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, yB); ctx.lineTo(x0 + plotW, yB); ctx.stroke();
    ctx.setLineDash([3, 4]);
    ctx.beginPath(); ctx.moveTo(x0, yT); ctx.lineTo(x0, yB); ctx.stroke();
    ctx.setLineDash([]);

    // gap fill
    ctx.beginPath();
    for (i = 0; i <= steps; i++) { t = tMax * i / steps; if (i === 0) ctx.moveTo(xAt(t), yAt(ai(t))); else ctx.lineTo(xAt(t), yAt(ai(t))); }
    for (i = steps; i >= 0; i--) { t = tMax * i / steps; ctx.lineTo(xAt(t), yAt(no(t))); }
    ctx.closePath(); ctx.fillStyle = hexA(c.signal, 0.14); ctx.fill();

    // curves
    function curve(fn, col, wd) {
      ctx.beginPath();
      for (i = 0; i <= steps; i++) { t = tMax * i / steps; if (i === 0) ctx.moveTo(xAt(t), yAt(fn(t))); else ctx.lineTo(xAt(t), yAt(fn(t))); }
      ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.lineJoin = "round"; ctx.stroke();
    }
    curve(no, c.mute, 2);
    curve(ai, c.signal, 2.75);

    // origin + tip dots
    ctx.fillStyle = c.signal; ctx.beginPath(); ctx.arc(xAt(0), yAt(0.5), 3.5, 0, 6.29); ctx.fill();
    ctx.beginPath(); ctx.arc(xAt(tMax), yAt(ai(tMax)), 3.5, 0, 6.29); ctx.fill();

    // legend
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.font = "600 12px 'Instrument Sans', system-ui, sans-serif";
    var lx = x0 + 8, ly = yT + 10;
    ctx.fillStyle = c.signal; ctx.fillRect(lx, ly - 2, 16, 3);
    ctx.fillStyle = c.soft; ctx.fillText("Kanzleien mit KI", lx + 22, ly);
    ly += 19;
    ctx.fillStyle = c.mute; ctx.fillRect(lx, ly - 2, 16, 3);
    ctx.fillStyle = c.soft; ctx.fillText("Kanzleien ohne KI", lx + 22, ly);

    // axis labels
    ctx.fillStyle = c.mute; ctx.font = "500 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("heute", x0, yB + 8);
    ctx.textAlign = "right"; ctx.fillText("Zukunft", x0 + plotW, yB + 8);
    ctx.save(); ctx.translate(14, (yT + yB) / 2); ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = c.mute;
    ctx.font = "500 11px 'JetBrains Mono', monospace"; ctx.fillText("Wettbewerbsfähigkeit", 0, 0);
    ctx.restore();
  }
  drawGap.duration = 2200;

  var expEl = document.getElementById("viz-exp");
  var gapEl = document.getElementById("viz-gap");
  if (expEl && expEl.getContext) mount(expEl, drawExp);
  if (gapEl && gapEl.getContext) mount(gapEl, drawGap);
})();
