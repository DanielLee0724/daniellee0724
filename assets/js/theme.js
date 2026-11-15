(function () {
  "use strict";

  var themeKey = "daniellee-color-scheme";
  var themeChannel = "daniellee-color-scheme";
  var toggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    if (theme !== "light" && theme !== "dark") {
      return;
    }

    document.body.dataset.theme = theme;

    if (toggle) {
      var lightMode = theme === "light";
      var label = lightMode ? "Switch to dark mode" : "Switch to light mode";
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("aria-pressed", String(lightMode));
      toggle.setAttribute("title", label);
      toggle.innerHTML = '<i class="fa ' + (lightMode ? "fa-moon-o" : "fa-sun-o") + '" aria-hidden="true"></i>';
    }
  }

  var channel = typeof BroadcastChannel === "function" ? new BroadcastChannel(themeChannel) : null;
  var savedTheme = localStorage.getItem(themeKey);
  applyTheme(savedTheme === "light" ? "light" : "dark");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var theme = document.body.dataset.theme === "light" ? "dark" : "light";
      applyTheme(theme);
      localStorage.setItem(themeKey, theme);

      if (channel) {
        channel.postMessage(theme);
      }
    });
  }

  window.addEventListener("storage", function (event) {
    if (event.key === themeKey) {
      applyTheme(event.newValue === "light" ? "light" : "dark");
    }
  });

  if (channel) {
    channel.addEventListener("message", function (event) {
      applyTheme(event.data);
    });
  }
}());
