(function () {
  "use strict";

  var cfg = window.AUTORA_OCULTA || {};
  var CHECKOUT_URL = cfg.CHECKOUT_URL || "CHECKOUT_URL";

  /* ---------- Tracking helpers ---------- */

  function getStoredUtm() {
    try {
      var raw = sessionStorage.getItem("ao_utm");
      return raw ? JSON.parse(raw) : window.__UTM__ || {};
    } catch (e) {
      return window.__UTM__ || {};
    }
  }

  function withUtm(url) {
    if (!url || url === "CHECKOUT_URL") return url;
    try {
      var u = new URL(url, window.location.href);
      var utm = getStoredUtm();
      Object.keys(utm).forEach(function (k) {
        if (!u.searchParams.get(k)) u.searchParams.set(k, utm[k]);
      });
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  function track(eventName, payload) {
    var data = Object.assign(
      {
        content_name: "Autora Oculta",
        content_category: "digital_product",
        value: 7.49,
        currency: "USD",
      },
      payload || {}
    );

    // Meta Pixel
    if (typeof window.fbq === "function") {
      try {
        window.fbq("track", eventName, data);
      } catch (e) {}
    }

    // Google Analytics 4
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", eventName, data);
      } catch (e) {}
    }

    // Debug hook
    if (window.AO_DEBUG) {
      console.log("[AO track]", eventName, data);
    }
  }

  function initPixel() {
    var id = cfg.META_PIXEL_ID;
    if (!id) return;
    if (window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", id);
    window.fbq("track", "PageView");
    track("ViewContent", { content_ids: ["autora-oculta"] });
  }

  function initGA() {
    var id = cfg.GA_MEASUREMENT_ID;
    if (!id) return;
    if (document.getElementById("ga4-script")) return;

    var s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });
  }

  /* ---------- Checkout links ---------- */

  function wireCheckoutLinks() {
    var links = document.querySelectorAll(".js-checkout");
    var href = withUtm(CHECKOUT_URL);

    links.forEach(function (el) {
      if (CHECKOUT_URL && CHECKOUT_URL !== "CHECKOUT_URL") {
        el.setAttribute("href", href);
      } else {
        el.setAttribute("href", "#oferta");
      }

      el.addEventListener("click", function (e) {
        var cta = el.getAttribute("data-cta") || "unknown";
        var eventName = el.getAttribute("data-event") || "InitiateCheckout";

        track(eventName, {
          cta_location: cta,
        });

        if (!CHECKOUT_URL || CHECKOUT_URL === "CHECKOUT_URL") {
          // Sin URL real: scroll suave al bloque de oferta
          var offer = document.getElementById("oferta");
          if (offer) {
            e.preventDefault();
            offer.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
  }

  /* ---------- Contact email ---------- */

  function wireContact() {
    var email = cfg.CONTACT_EMAIL || "hola@autoraoculta.com";
    document.querySelectorAll(".js-contact").forEach(function (el) {
      el.setAttribute("href", "mailto:" + email);
    });
  }

  /* ---------- Accordion ---------- */

  function initAccordion() {
    var root = document.querySelector("[data-accordion]");
    if (!root) return;

    root.querySelectorAll(".accordion__item").forEach(function (item) {
      var btn = item.querySelector(".accordion__trigger");
      var panel = item.querySelector(".accordion__panel");
      if (!btn || !panel) return;

      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";

        // Close others
        root.querySelectorAll(".accordion__trigger").forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          var p = other.parentElement.querySelector(".accordion__panel");
          if (p) p.hidden = true;
        });

        btn.setAttribute("aria-expanded", open ? "false" : "true");
        panel.hidden = open;
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    items.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- Floating CTA (mobile, after hero) ---------- */

  function initFloatCta() {
    var bar = document.getElementById("float-cta");
    var hero = document.getElementById("inicio");
    if (!bar || !hero) return;

    bar.hidden = false;

    if (!("IntersectionObserver" in window)) {
      bar.classList.add("is-visible");
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          // Visible while hero is out of view
          if (entry.isIntersecting) {
            bar.classList.remove("is-visible");
          } else {
            bar.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    io.observe(hero);

    // Hide when near footer / final CTA to avoid clutter
    var final = document.getElementById("final") || document.getElementById("pie");
    if (final) {
      var io2 = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              bar.classList.remove("is-visible");
            }
          });
        },
        { threshold: 0.15 }
      );
      io2.observe(final);
    }
  }

  /* ---------- Year ---------- */

  function setYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Boot ---------- */

  function boot() {
    initPixel();
    initGA();
    wireCheckoutLinks();
    wireContact();
    initAccordion();
    initReveal();
    initFloatCta();
    setYear();

    // ViewContent even without pixel (dataLayer ready for later)
    if (!cfg.META_PIXEL_ID) {
      track("ViewContent", { content_ids: ["autora-oculta"] });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
