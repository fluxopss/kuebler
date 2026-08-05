/* Kuebler Mechanical — site chrome + conversion interactions */
(function () {
  "use strict";

  var PHONE_DISPLAY = "(772) 878-2281";
  var PHONE_TEL = "tel:+17728782281";
  var PHONE_SMS =
    "sms:+17728782281?&body=" +
    encodeURIComponent(
      "Hi Kuebler — I need HVAC help in Port St. Lucie. When can you get out?",
    );
  var PHONE_SMS_EMERGENCY =
    "sms:+17728782281?&body=" +
    encodeURIComponent(
      "EMERGENCY — HVAC down in Port St. Lucie. Need a tech ASAP.",
    );
  var CREED = "Do the job right the first time.";
  var LOGO = "assets/img/logo.svg";
  var KNIGHT = "assets/img/knight.svg";
  var OFFER_END = new Date("2026-09-30T23:59:59-04:00").getTime();
  var GOOGLE_REVIEW =
    "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeu2YgRq0yY5k2Y5k2"; // fallback; live buttons use search — use site review CTA
  // Prefer live-site contact review path if GBP place id unknown
  GOOGLE_REVIEW = "https://kueblermechanical.com/contact-us/";

  var FORM_SUCCESS_HTML =
    'Received. We&rsquo;ll call you back. Need us sooner? Call <a href="' +
    PHONE_TEL +
    '">' +
    PHONE_DISPLAY +
    "</a>.";

  var OFFERS = {
    tuneup: {
      price: "$129",
      title: "Tune-Up",
      bullets: [
        "Complete cooling check",
        "Complete heating check",
        "Condensate drain cleaning",
      ],
      note: "Call for details. Expires 09/30/2026.",
    },
    maintenance: {
      price: "$300",
      title: "Maintenance Agreement",
      bullets: [
        "Four tune-ups in one year",
        "Includes free filters",
        "10% off service calls",
      ],
      note: "Cannot be combined. Call for details. Expires 09/30/2026.",
    },
    thermostat: {
      price: "$200",
      title: "WiFi Thermostat",
      bullets: [
        "With purchase of a new system",
        "Limited time offer",
        "Cannot be combined",
      ],
      note: "New system only. Expires 09/30/2026.",
    },
    uv: {
      price: "FREE",
      title: "UV Light",
      bullets: [
        "With the purchase of a new system",
        "Limited time · cannot be combined",
      ],
      note: "Call for details. Expires 09/30/2026.",
    },
    veterans: {
      price: "10%",
      title: "Off for Veterans",
      bullets: [
        "Good on repairs",
        "Good on new equipment installations",
        "Cannot be used on tune-ups",
      ],
      note: "Call for details. Expires 09/30/2026.",
    },
    estimates: {
      price: "FREE",
      title: "Estimates on New Equipment",
      bullets: [
        "Goodman",
        "Ruud",
        "10 yr parts & 10 yr labor warranty (promo)",
      ],
      note: "Offer good only with purchase of a new system. Expires 09/30/2026.",
    },
  };

  var NAV_PRIMARY = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "emergency.html", label: "Emergency" },
    { href: "specials.html", label: "Specials" },
    { href: "gallery.html", label: "Gallery" },
    { href: "contact.html", label: "Contact" },
  ];

  var NAV_ALL = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About" },
    { href: "services.html", label: "Services" },
    { href: "emergency.html", label: "24/7 Emergency" },
    { href: "ac-repair.html", label: "AC Repair" },
    {
      href: "installation-replacement.html",
      label: "Installation & Replacement",
    },
    { href: "maintenance.html", label: "Maintenance Plans" },
    { href: "indoor-air-quality.html", label: "Indoor Air Quality" },
    { href: "commercial.html", label: "Commercial HVAC" },
    { href: "service-areas.html", label: "Service Areas" },
    { href: "gallery.html", label: "Gallery" },
    { href: "specials.html", label: "Specials" },
    { href: "financing.html", label: "Financing" },
    { href: "faq.html", label: "FAQ" },
    { href: "videos.html", label: "Videos" },
    { href: "blog.html", label: "Blog" },
    { href: "careers.html", label: "Careers" },
    { href: "contact.html", label: "Contact" },
  ];

  var WIZARD_STEP_FIELDS = ["city", "home", "age", "intent"];

  function qs(name) {
    try {
      return new URLSearchParams(window.location.search).get(name);
    } catch (e) {
      return null;
    }
  }

  function currentFile() {
    var path = window.location.pathname || "";
    var parts = path.split("/");
    var file = parts[parts.length - 1] || "index.html";
    if (!file || file.indexOf(".html") === -1) return "index.html";
    return file;
  }

  function isEmergencyPage() {
    return currentFile() === "emergency.html";
  }

  function track(eventName, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      var data = { event: eventName };
      if (payload) {
        Object.keys(payload).forEach(function (key) {
          data[key] = payload[key];
        });
      }
      window.dataLayer.push(data);
    } catch (e) {
      /* no-op when analytics unavailable */
    }
  }

  function linkList(items) {
    var file = currentFile();
    return items
      .map(function (p) {
        var cls = file === p.href ? ' class="is-active"' : "";
        return '<a href="' + p.href + '"' + cls + ">" + p.label + "</a>";
      })
      .join("");
  }

  function smsOffer(title, offerKey) {
    var body;
    if (offerKey === "veterans" || /veteran/i.test(title || "")) {
      body =
        "Hi Kuebler — fellow vet here. Want details on the " +
        title +
        " offer.";
    } else {
      body =
        "Hi Kuebler — interested in the " +
        title +
        " offer. Can you text details?";
    }
    return "sms:+17728782281?&body=" + encodeURIComponent(body);
  }

  function buildStickyCall() {
    var emergency = isEmergencyPage();
    var callBtn =
      '<a class="btn btn--primary" href="' +
      PHONE_TEL +
      '" data-cta="sticky-call" style="font-weight:800"' +
      (emergency ? ' aria-label="Call emergency dispatch now"' : "") +
      "><span>Call Now</span></a>";
    var textBtn =
      '<a class="btn btn--call" href="' +
      (emergency ? PHONE_SMS_EMERGENCY : PHONE_SMS) +
      '" data-cta="sticky-text"><span>' +
      (emergency ? "Text Emergency" : "Text") +
      "</span></a>";
    var bookBtn =
      '<a class="btn ' +
      (emergency ? "btn--outline" : "btn--call") +
      '" href="contact.html?need=Schedule%20Repair" data-cta="sticky-book"' +
      (emergency ? ' style="opacity:0.72"' : "") +
      "><span>" +
      (emergency ? "Book later" : "Book") +
      "</span></a>";
    return (
      '<div class="sticky-call' +
      (emergency ? " sticky-call--emergency" : "") +
      '" aria-label="Quick actions">' +
      callBtn +
      textBtn +
      bookBtn +
      "</div>"
    );
  }

  function buildHeader() {
    var links = linkList(NAV_PRIMARY);
    var mobileLinks = linkList(NAV_ALL);
    return (
      '<a class="skip-link" href="#main">Skip to main content</a>' +
      '<header class="site-header" id="siteHeader">' +
      '<div class="topbar"><div class="topbar__inner">' +
      '<div class="topbar__meta">' +
      "<span>Port St. Lucie &amp; The Treasure Coast</span>" +
      "<span>License #CAC1820289</span>" +
      '<span style="color:#f08c42;font-weight:700">★ Veteran-Owned</span>' +
      '<span title="Our creed">' +
      CREED +
      "</span>" +
      '<a href="emergency.html" style="color:#f08c42;font-weight:700">24/7 Emergency</a>' +
      "</div>" +
      '<a class="topbar__phone" href="' +
      PHONE_TEL +
      '" data-cta="topbar-phone">' +
      PHONE_DISPLAY +
      "</a>" +
      "</div></div>" +
      '<div class="nav">' +
      '<a class="brand" href="index.html" aria-label="Kuebler Mechanical home">' +
      '<img src="' +
      LOGO +
      '" alt="Kuebler Mechanical" width="190" height="48" />' +
      '<span class="brand__tag">Veteran-Owned HVAC</span>' +
      "</a>" +
      '<nav class="nav__links" aria-label="Primary">' +
      links +
      "</nav>" +
      '<div class="nav__cta">' +
      '<a class="btn btn--outline" href="specials.html#tuneup" data-cta="nav-tuneup">$129 Tune-Up</a>' +
      '<a class="btn btn--primary" href="' +
      PHONE_TEL +
      '" data-cta="nav-call">Call ' +
      PHONE_DISPLAY +
      "</a>" +
      "</div>" +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobileDrawer" aria-label="Open menu"><span></span></button>' +
      "</div>" +
      '<div class="mobile-drawer" id="mobileDrawer">' +
      mobileLinks +
      '<a class="btn btn--primary" href="' +
      PHONE_TEL +
      '" data-cta="drawer-call">Call ' +
      PHONE_DISPLAY +
      "</a>" +
      '<a class="btn btn--outline" href="' +
      PHONE_SMS +
      '" data-cta="drawer-text">Text Us</a>' +
      '<a class="btn btn--outline" href="contact.html" data-cta="drawer-contact">Request Service</a>' +
      "</div>" +
      "</header>"
    );
  }

  function buildFooter() {
    var pitchOn = qs("pitch") === "1";
    var footerBottom =
      "<span>&copy; " +
      new Date().getFullYear() +
      " Kuebler Mechanical LLC. All rights reserved.</span>" +
      "<span>" +
      CREED +
      "</span>" +
      "<span>Port St. Lucie &amp; the Treasure Coast</span>";

    if (pitchOn) {
      footerBottom =
        "<span>&copy; " +
        new Date().getFullYear() +
        " Kuebler Mechanical LLC. All rights reserved.</span>" +
        '<span class="demo-badge">Flux Labs Demo</span>' +
        "<span>Content sourced from kueblermechanical.com</span>";
    }

    return (
      '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<img src="' +
      LOGO +
      '" alt="Kuebler Mechanical" width="170" height="44" />' +
      "<p>Premium residential &amp; commercial HVAC for Port St. Lucie and the Treasure Coast. Licensed, bonded, veteran-owned—American craftsmanship you can call at 2AM.</p>" +
      '<p class="mt-4" style="color:#f08c42;font-weight:700;font-style:italic">' +
      CREED +
      "</p>" +
      '<p class="mt-4"><strong style="color:#fff">License #CAC1820289</strong></p>' +
      "</div>" +
      '<div><h4>Services</h4><div class="footer-links">' +
      '<a href="emergency.html">24/7 Emergency</a>' +
      '<a href="ac-repair.html">AC Repair</a>' +
      '<a href="installation-replacement.html">Installation &amp; Replacement</a>' +
      '<a href="maintenance.html">Maintenance Plans</a>' +
      '<a href="indoor-air-quality.html">Indoor Air Quality</a>' +
      '<a href="commercial.html">Commercial HVAC</a>' +
      '<a href="financing.html">Financing</a>' +
      "</div></div>" +
      '<div><h4>Company</h4><div class="footer-links">' +
      '<a href="about.html">About</a>' +
      '<a href="gallery.html">Gallery</a>' +
      '<a href="service-areas.html">Service Areas</a>' +
      '<a href="specials.html">Specials</a>' +
      '<a href="faq.html">FAQ</a>' +
      '<a href="videos.html">Videos</a>' +
      '<a href="blog.html">Blog</a>' +
      '<a href="careers.html">Careers</a>' +
      '<a href="contact.html">Contact</a>' +
      "</div></div>" +
      "<div><h4>Contact</h4>" +
      "<p>574 NW Mercantile Ave. Suite 107<br>Port St. Lucie, FL 34986</p>" +
      '<p class="mt-4"><a href="' +
      PHONE_TEL +
      '" style="color:#f08c42;font-weight:700;font-size:1.05rem" data-cta="footer-phone">' +
      PHONE_DISPLAY +
      "</a></p>" +
      '<p class="mt-2">Mon–Fri 7:30AM–4:00PM<br>24/7 Emergency Service</p>' +
      "</div>" +
      "</div>" +
      '<div class="container footer-bottom">' +
      footerBottom +
      "</div>" +
      (pitchOn
        ? '<div class="pitch-strip is-on" id="pitchStrip">' +
          "<strong>Pitch mode:</strong> Same coupons, reviews &amp; financing — without CAPTCHA friction, Salient template sameness, or “Powered by Optic.” Leads flow to <strong>your</strong> GHL." +
          "</div>"
        : "") +
      "</footer>" +
      '<a class="review-pill" href="' +
      GOOGLE_REVIEW +
      '" target="_blank" rel="noopener" data-cta="review-pill">★ Leave a Review</a>' +
      buildStickyCall() +
      '<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>' +
      '<div class="lightbox__inner">' +
      '<button type="button" class="lightbox__close" data-lightbox-close aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="Previous">‹</button>' +
      '<button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="Next">›</button>' +
      '<img src="" alt="" id="lightboxImg" />' +
      '<p class="lightbox__caption" id="lightboxCaption"></p>' +
      "</div></div>"
    );
  }

  function mountChrome() {
    var headerMount = document.getElementById("site-header");
    var footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.outerHTML = buildHeader();
    if (footerMount) footerMount.outerHTML = buildFooter();

    if (!sessionStorage.getItem("kueblerFlash")) {
      sessionStorage.setItem("kueblerFlash", "1");
      var flash = document.createElement("div");
      flash.className = "brand-flash";
      flash.innerHTML =
        '<img src="' + KNIGHT + '" alt="" width="120" height="120" />';
      document.body.appendChild(flash);
      setTimeout(function () {
        if (flash.parentNode) flash.parentNode.removeChild(flash);
      }, 1000);
    }
  }

  function bindHeader() {
    var header = document.getElementById("siteHeader");
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.getElementById("mobileDrawer");
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toggle && drawer) {
      toggle.addEventListener("click", function () {
        var open = drawer.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      drawer.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          drawer.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  function bindReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function bindMissionTimeline() {
    var timelines = document.querySelectorAll(".honor-timeline");
    if (!timelines.length) return;
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      timelines.forEach(function (tl) {
        tl.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" },
    );
    timelines.forEach(function (tl) {
      io.observe(tl);
    });
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function bindCinematicHero() {
    var hero = document.querySelector(".hero--cinematic");
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add("is-ready");
    });
    if (prefersReducedMotion()) return;

    var media = hero.querySelector(".hero__media img");
    var shade = hero.querySelector(".hero__shade");
    if (!media) return;

    /* Visual hook: is-parallax disables dual Ken Burns + scroll transform conflict */
    hero.classList.add("is-parallax");
    media.style.animation = "none";

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var h = hero.offsetHeight || 1;
        var progress = Math.min(1, Math.max(0, -rect.top / h));
        var y = progress * 48;
        var scale = 1.08 + progress * 0.06;
        media.style.transform =
          "translate3d(0," + y + "px,0) scale(" + scale + ")";
        if (shade) {
          shade.style.opacity = String(0.95 + progress * 0.05);
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function bindQuoteBeat() {
    var beat = document.querySelector("[data-quote-beat]");
    if (!beat) return;
    if (prefersReducedMotion()) {
      beat.classList.add("is-in");
      return;
    }
    if (!("IntersectionObserver" in window)) {
      beat.classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            beat.classList.add("is-in");
            io.unobserve(beat);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(beat);
  }

  function bindTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var tabs = root.querySelectorAll(".tab");
      var panels = root.querySelectorAll(".tab-panel");
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var id = tab.getAttribute("data-tab");
          tabs.forEach(function (t) {
            t.classList.toggle("is-active", t === tab);
            t.setAttribute("aria-selected", t === tab ? "true" : "false");
          });
          panels.forEach(function (p) {
            p.classList.toggle(
              "is-active",
              p.getAttribute("data-panel") === id,
            );
          });
        });
      });
    });
  }

  function bindForms() {
    document.querySelectorAll("[data-demo-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name="company_website"]');
        if (hp && hp.value) return;
        var success = form.querySelector(".form-success");
        if (success) {
          success.innerHTML = FORM_SUCCESS_HTML;
          success.classList.add("is-visible");
        }
        track("form_submit_success", {
          form: form.getAttribute("id") || form.getAttribute("name") || "lead",
          page: currentFile(),
        });
        form.reset();
      });
    });
  }

  function bindCountdowns() {
    var nodes = document.querySelectorAll("[data-countdown]");
    if (!nodes.length) return;
    function tick() {
      var now = Date.now();
      var diff = Math.max(0, OFFER_END - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      nodes.forEach(function (el) {
        el.innerHTML =
          '<span class="countdown__unit"><strong>' +
          d +
          "</strong><span>Days</span></span>" +
          '<span class="countdown__unit"><strong>' +
          String(h).padStart(2, "0") +
          "</strong><span>Hrs</span></span>" +
          '<span class="countdown__unit"><strong>' +
          String(m).padStart(2, "0") +
          "</strong><span>Min</span></span>" +
          '<span class="countdown__unit"><strong>' +
          String(s).padStart(2, "0") +
          "</strong><span>Sec</span></span>";
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  function bindLightbox() {
    var items = Array.prototype.slice.call(
      document.querySelectorAll("[data-lightbox]"),
    );
    var box = document.getElementById("lightbox");
    if (!box || !items.length) return;
    var img = document.getElementById("lightboxImg");
    var cap = document.getElementById("lightboxCaption");
    var idx = 0;

    function openAt(i) {
      idx = (i + items.length) % items.length;
      var el = items[idx];
      img.src = el.getAttribute("data-full") || el.getAttribute("src");
      img.alt = el.getAttribute("alt") || "";
      cap.textContent =
        el.getAttribute("data-caption") || el.getAttribute("alt") || "";
      box.hidden = false;
      box.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.classList.remove("is-open");
      box.hidden = true;
      document.body.style.overflow = "";
    }

    items.forEach(function (el, i) {
      el.addEventListener("click", function () {
        openAt(i);
      });
      el.style.cursor = "zoom-in";
    });
    box.querySelector("[data-lightbox-close]").addEventListener("click", close);
    box
      .querySelector("[data-lightbox-prev]")
      .addEventListener("click", function () {
        openAt(idx - 1);
      });
    box
      .querySelector("[data-lightbox-next]")
      .addEventListener("click", function () {
        openAt(idx + 1);
      });
    box.addEventListener("click", function (e) {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") openAt(idx - 1);
      if (e.key === "ArrowRight") openAt(idx + 1);
    });
  }

  function bindMapPins() {
    var pins = document.querySelectorAll("[data-city]");
    var out = document.getElementById("mapActiveCity");
    if (!pins.length || !out) return;
    pins.forEach(function (pin) {
      pin.addEventListener("click", function () {
        pins.forEach(function (p) {
          p.classList.remove("is-active");
        });
        pin.classList.add("is-active");
        var city = pin.getAttribute("data-city");
        out.innerHTML =
          "<div><strong>Serving " +
          city +
          '</strong><p class="text-muted" style="margin:0.25rem 0 0;font-size:0.9rem">Port St. Lucie &amp; Treasure Coast HVAC — same veteran-led standard.</p></div>' +
          '<a class="btn btn--primary" href="' +
          PHONE_TEL +
          '" data-cta="map-city">Call for ' +
          city +
          "</a>";
      });
    });
  }

  function bindWizard() {
    var root = document.querySelector("[data-wizard]");
    if (!root) return;
    var panels = root.querySelectorAll(".wizard__panel");
    var dots = root.querySelectorAll(".wizard__step-dot");
    var state = {
      city: "",
      home: "",
      age: "",
      intent: "",
      name: "",
      phone: "",
      email: "",
    };
    var step = 0;

    function show(i) {
      step = i;
      panels.forEach(function (p, idx) {
        p.classList.toggle("is-active", idx === step);
      });
      dots.forEach(function (d, idx) {
        d.classList.toggle("is-current", idx === step);
        d.classList.toggle("is-done", idx < step);
      });
      var summary = root.querySelector("[data-wizard-summary]");
      if (summary) {
        summary.innerHTML =
          "<ul class='wizard__summary'>" +
          "<li><strong>Area:</strong> " +
          (state.city || "—") +
          "</li>" +
          "<li><strong>Property:</strong> " +
          (state.home || "—") +
          "</li>" +
          "<li><strong>System age:</strong> " +
          (state.age || "—") +
          "</li>" +
          "<li><strong>Goal:</strong> " +
          (state.intent || "—") +
          "</li>" +
          "</ul>";
      }
      track("wizard_step", { step: step + 1, page: currentFile() });
    }

    root.querySelectorAll("[data-choice]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        var field = btn.getAttribute("data-field");
        var val = btn.getAttribute("data-choice");
        state[field] = val;
        var group = btn.parentElement;
        group.querySelectorAll("[data-choice]").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-selected", on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
      });
    });

    root.querySelectorAll("[data-wizard-next]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (step >= panels.length - 1) return;
        var field = WIZARD_STEP_FIELDS[step];
        if (field && !state[field]) {
          var choices = panels[step].querySelector(".wizard__choices");
          if (choices) {
            choices.style.outline = "2px solid #f08c42";
            choices.style.outlineOffset = "4px";
            setTimeout(function () {
              choices.style.outline = "";
              choices.style.outlineOffset = "";
            }, 1200);
          }
          btn.setAttribute("aria-invalid", "true");
          return;
        }
        btn.removeAttribute("aria-invalid");
        show(step + 1);
      });
    });
    root.querySelectorAll("[data-wizard-back]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (step > 0) show(step - 1);
      });
    });

    var form = root.querySelector("[data-wizard-form]");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name="company_website"]');
        if (hp && hp.value) return;
        state.name = form.name.value;
        state.phone = form.phone.value;
        state.email = form.email ? form.email.value : "";
        var success = root.querySelector(".form-success");
        if (success) {
          success.classList.add("is-visible");
          success.innerHTML =
            "Got it" +
            (state.name ? ", " + state.name : "") +
            ". We&rsquo;ll call you about your " +
            (state.intent || "estimate") +
            (state.city ? " in " + state.city : "") +
            '. Need us sooner? Call <a href="' +
            PHONE_TEL +
            '">' +
            PHONE_DISPLAY +
            "</a>.";
        }
        track("form_submit_success", {
          form: "wizard",
          intent: state.intent || "",
          city: state.city || "",
          page: currentFile(),
        });
        form.reset();
      });
    }
    show(0);
  }

  function bindContactPrefill() {
    var need = qs("need");
    var offer = qs("offer");
    var select = document.getElementById("need");
    if (select && need) {
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value === need || opt.text === need)
          select.value = opt.value || opt.text;
      });
    }
    var msg = document.getElementById("message");
    if (msg && offer && OFFERS[offer]) {
      msg.value =
        "I'm interested in the " +
        OFFERS[offer].title +
        " special (" +
        OFFERS[offer].price +
        ").";
    }
  }

  function bindFaqSearch() {
    var input = document.getElementById("faqSearch");
    if (!input) return;
    var items = document.querySelectorAll(".faq-item");
    input.addEventListener("input", function () {
      var q = input.value.toLowerCase().trim();
      items.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        item.hidden = q && text.indexOf(q) === -1;
      });
    });
  }

  function bindCountUp() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var start = 0;
      var dur = 900;
      var t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        var val = Math.round(start + (target - start) * p);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(animate);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function bindPrintCoupon() {
    var root = document.querySelector("[data-print-coupon]");
    if (!root) return;
    var key = qs("offer") || "tuneup";
    var offer = OFFERS[key] || OFFERS.tuneup;
    root.querySelector("[data-print-price]").textContent = offer.price;
    root.querySelector("[data-print-title]").textContent = offer.title;
    root.querySelector("[data-print-note]").textContent = offer.note;
    var ul = root.querySelector("[data-print-bullets]");
    ul.innerHTML = offer.bullets
      .map(function (b) {
        return "<li>" + b + "</li>";
      })
      .join("");
    var printBtn = document.querySelector("[data-do-print]");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        track("offer_claim", { offer: key, method: "print" });
        window.print();
      });
    }
  }

  function bindBlogFilters() {
    var root = document.querySelector("[data-blog-filters]");
    if (!root) return;
    var chips = root.querySelectorAll(".chip-filter");
    var cards = document.querySelectorAll("[data-category]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });
        cards.forEach(function (card) {
          var match =
            cat === "all" || card.getAttribute("data-category") === cat;
          card.style.display = match ? "" : "none";
        });
      });
    });
  }

  function bindAnalyticsClicks() {
    document.addEventListener("click", function (e) {
      var el = e.target.closest
        ? e.target.closest("a, button")
        : null;
      if (!el) return;

      var href = el.getAttribute("href") || "";
      var cta = el.getAttribute("data-cta");
      var isCta =
        cta ||
        el.classList.contains("btn") ||
        el.classList.contains("topbar__phone") ||
        el.classList.contains("review-pill") ||
        (el.closest && el.closest(".sticky-call"));

      if (isCta) {
        track("cta_click", {
          label: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          href: href,
          cta: cta || "",
          page: currentFile(),
        });
      }

      if (href.indexOf("sms:") === 0) {
        var offerCard = el.closest
          ? el.closest(".offer-card, [data-offer], [id]")
          : null;
        var offerId =
          (offerCard && offerCard.id) ||
          (el.getAttribute("data-offer") || "");
        if (
          offerId ||
          (offerCard && offerCard.classList.contains("offer-card"))
        ) {
          track("offer_claim", {
            offer: offerId || "special",
            method: "sms",
            page: currentFile(),
          });
        }
      }
    });
  }

  function exposeOfferSms() {
    window.kueblerSmsOffer = smsOffer;
  }

  function boot() {
    document.documentElement.classList.add("js");
    mountChrome();
    bindHeader();
    bindReveal();
    bindMissionTimeline();
    bindCinematicHero();
    bindQuoteBeat();
    bindTabs();
    bindForms();
    bindCountdowns();
    bindLightbox();
    bindMapPins();
    bindWizard();
    bindContactPrefill();
    bindFaqSearch();
    bindCountUp();
    bindPrintCoupon();
    bindBlogFilters();
    bindAnalyticsClicks();
    exposeOfferSms();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
