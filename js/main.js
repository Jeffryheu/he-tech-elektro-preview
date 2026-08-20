// He-Tech Elektro — site behaviour (mobile nav, scroll reveal, offerteformulier)

(function () {
  "use strict";

  // ---- Mobile navigation -------------------------------------------------
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");

  var toggleIcon = toggle ? toggle.querySelector("use") : null;

  function setMenu(isOpen) {
    menu.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (toggleIcon) {
      toggleIcon.setAttribute("href", isOpen ? "assets/icons.svg#icon-close" : "assets/icons.svg#icon-menu");
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  // ---- Scroll reveal -------------------------------------------------------
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---- Offerteformulier (Formspree) ----------------------------------------
  var form = document.querySelector("#offerte-form");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      // basic required-field check with inline error states
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        if (!field) return;
        var isFilled = input.type === "checkbox" ? input.checked : input.value.trim();
        if (!isFilled) {
          field.classList.add("has-error");
          valid = false;
        } else {
          field.classList.remove("has-error");
        }
      });

      if (!valid) {
        statusEl.textContent = "Vul de verplichte velden in.";
        statusEl.className = "form-status is-error";
        return;
      }

      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Bezig met versturen...";
      statusEl.className = "form-status";
      statusEl.textContent = "";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            statusEl.textContent = "Bedankt, uw aanvraag is verstuurd. We nemen binnen 1 werkdag contact op.";
            statusEl.className = "form-status is-success";
            form.reset();
          } else {
            statusEl.textContent = "Er ging iets mis bij het versturen. Probeer het opnieuw of bel 0617338523.";
            statusEl.className = "form-status is-error";
          }
        })
        .catch(function () {
          statusEl.textContent = "Er ging iets mis bij het versturen. Probeer het opnieuw of bel 0617338523.";
          statusEl.className = "form-status is-error";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }
})();
