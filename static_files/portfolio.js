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
})();
