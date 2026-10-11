// younesmourri.com — progressive enhancement: nav, reveal-on-scroll, footer year.
(function () {
  "use strict";

  // Flag JS so CSS reveal animations only hide content when JS can reveal it.
  document.documentElement.classList.add("js");

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Refined sticky nav: subtle shadow once scrolled
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Scroll-reveal animations (subtle, performant)
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window) || revealEls.length === 0) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
})();

  // Contact form: opens the visitor's email app with the message pre-addressed.
  // The address is assembled at runtime so scrapers don't harvest it from the HTML.
  var cform = document.getElementById("contact-form");
  if (cform) {
    var cerr = cform.querySelector(".form-error");
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = cform.elements["sender-name"].value.trim();
      var email = cform.elements["sender-email"].value.trim();
      var topic = cform.elements["topic"].value;
      var msg = cform.elements["message"].value.trim();
      var ok = name.length > 1 && /.+@.+\..+/.test(email) && msg.length > 1;
      if (cerr) cerr.hidden = ok;
      if (!ok) return;
      var to = ["admin", "livetech.ai"].join("@");
      var subject = encodeURIComponent("[" + topic + "] Message from " + name);
      var body = encodeURIComponent(msg + "\n\n-- " + name + " (" + email + ")");
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });

    // "Invite me to speak" scrolls to the form with the topic preselected.
    document.querySelectorAll("[data-topic]").forEach(function (el) {
      el.addEventListener("click", function () {
        var sel = cform.elements["topic"];
        var want = el.getAttribute("data-topic");
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text === want) { sel.selectedIndex = i; break; }
        }
      });
    });
  }
