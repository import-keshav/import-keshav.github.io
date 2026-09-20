(function () {
  var root = document.documentElement;
  var toggles = document.querySelectorAll(".theme-toggle");
  var menu = document.getElementById("navMenu");

  function current() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    var pressed = theme === "light";
    var label = pressed ? "Switch to dark theme" : "Switch to light theme";
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
      btn.setAttribute("aria-label", label);
    });
  }

  apply(localStorage.getItem("theme") || "dark");

  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  });

  if (menu) {
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.removeAttribute("open");
      });
    });
  }

  // Frictionless copy email handler
  document.querySelectorAll(".copy-email-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = btn.getAttribute("data-email") || "keshavbathla2017@gmail.com";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          var original = btn.innerHTML;
          btn.innerHTML = '<span aria-hidden="true">✓</span> Copied to clipboard!';
          setTimeout(function () {
            btn.innerHTML = original;
          }, 2400);
        }).catch(function () {
          location.href = "mailto:" + email;
        });
      } else {
        location.href = "mailto:" + email;
      }
    });
  });
})();
