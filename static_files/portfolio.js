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

  var initial = "dark";
  try { initial = localStorage.getItem("theme") || "dark"; } catch (e) {}
  apply(initial);

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

  // ponytail: clipboard → execCommand → mailto. Ceiling: no analytics on copy-fail.
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");
    ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }

  function showCopied(btn) {
    if (btn._copyTimer) clearTimeout(btn._copyTimer);
    if (!btn._copyOriginal) btn._copyOriginal = btn.innerHTML;
    btn.innerHTML = '<span aria-hidden="true">✓</span> Copied to clipboard!';
    btn.setAttribute("aria-live", "polite");
    btn._copyTimer = setTimeout(function () {
      btn.innerHTML = btn._copyOriginal;
      btn._copyTimer = null;
    }, 2400);
  }

  function copyEmail(email, btn) {
    function succeed() { showCopied(btn); }
    function fail() { location.href = "mailto:" + email; }

    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(succeed).catch(function () {
        if (fallbackCopy(email)) succeed();
        else fail();
      });
      return;
    }
    if (fallbackCopy(email)) succeed();
    else fail();
  }

  document.querySelectorAll(".copy-email-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyEmail(btn.getAttribute("data-email") || "keshavbathla2017@gmail.com", btn);
    });
  });
})();
