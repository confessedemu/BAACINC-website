/* BAACINC site behaviour. No libraries and no network calls.
   The project brief never leaves this browser until the visitor sends it
   from their own email app. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var DRAFT_KEY = "baacinc.projectBrief.v1";
  var FIELD_IDS = [
    "brief-name",
    "brief-organization",
    "brief-email",
    "brief-phone",
    "brief-service",
    "brief-city",
    "brief-timing",
    "brief-message"
  ];

  function init() {
    initYear();
    var closeNav = initNav();
    var openBrief = initForm();
    initServices(openBrief, closeNav);
    initNotes(closeNav);
  }

  function initYear() {
    var el = document.getElementById("copyright-year");
    if (!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  function initNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return function () {};

    function closeNav() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      nav.classList.add("is-open");
      document.body.classList.add("nav-open");
    }

    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeNav();
      else openNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      closeNav();
      toggle.focus();
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (toggle.contains(event.target) || nav.contains(event.target)) return;
      closeNav();
    });

    return closeNav;
  }

  function initNotes(closeNav) {
    var links = document.querySelectorAll(".js-note");
    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener("click", function () {
        if (closeNav) closeNav();
        var name = document.getElementById("brief-name");
        if (!name) return;
        window.setTimeout(function () {
          name.focus();
        }, 0);
      });
    });
  }

  function initServices(openBrief, closeNav) {
    var root = document.querySelector("[data-services]");
    if (!root) return;
    var list = root.querySelector("[data-tablist]");
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
    if (!list || !tabs.length) return;

    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Service areas");
    list.setAttribute("aria-orientation", "vertical");

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        panels[i].classList.toggle("is-active", on);
      });
      if (moveFocus) tabs[index].focus();
      if (window.matchMedia("(max-width: 799px)").matches && panels[index].scrollIntoView) {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        panels[index].scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "nearest"
        });
      }
    }

    tabs.forEach(function (tab, index) {
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panels[index].id);
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tab.tabIndex = index === 0 ? 0 : -1;
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tab.id);
      tab.addEventListener("click", function () {
        select(index, false);
      });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          next = (index + 1) % tabs.length;
        } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          next = (index - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          next = 0;
        } else if (event.key === "End") {
          next = tabs.length - 1;
        }
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });

    root.addEventListener("click", function (event) {
      var ask = event.target.closest("[data-ask]");
      if (!ask || !openBrief) return;
      event.preventDefault();
      if (closeNav) closeNav();
      openBrief(ask.getAttribute("data-ask"));
    });
  }

  function initForm() {
    var form = document.getElementById("brief");
    if (!form) return function () {};

    var attempted = false;
    var status = document.getElementById("form-status");
    var errorBox = document.getElementById("form-errors");
    var fallback = document.getElementById("brief-fallback");
    var briefText = document.getElementById("brief-text");
    var mailtoLink = document.getElementById("mailto-fallback");

    function field(id) {
      return document.getElementById(id);
    }

    function readForm() {
      var data = {};
      FIELD_IDS.forEach(function (id) {
        var el = field(id);
        data[id] = el ? el.value : "";
      });
      return data;
    }

    function saveDraft() {
      try {
        var data = readForm();
        var empty = FIELD_IDS.every(function (id) {
          return !String(data[id] || "").trim();
        });
        if (empty) localStorage.removeItem(DRAFT_KEY);
        else localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch (err) {
        /* Private browsing can block storage. The form still works. */
      }
    }

    function restoreDraft() {
      try {
        var raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return false;
        var data = JSON.parse(raw);
        if (!data || typeof data !== "object") return false;
        FIELD_IDS.forEach(function (id) {
          if (typeof data[id] !== "string") return;
          var el = field(id);
          if (el) el.value = data[id];
        });
        return true;
      } catch (err) {
        return false;
      }
    }

    function oneLine(value) {
      return String(value || "").replace(/[\r\n\t]+/g, " ").trim();
    }

    function serviceLabel() {
      var select = field("brief-service");
      if (!select || select.selectedIndex < 0) return "";
      return select.options[select.selectedIndex].text.replace(/\s+/g, " ").trim();
    }

    function setFieldError(id, message) {
      var el = field(id);
      var err = field(id + "-error");
      var hint = field(id + "-hint");
      if (!el || !err) return;
      var described = [];
      if (hint) described.push(hint.id);
      if (message) {
        el.setAttribute("aria-invalid", "true");
        err.textContent = message;
        described.push(err.id);
      } else {
        el.removeAttribute("aria-invalid");
        err.textContent = "";
      }
      if (described.length) el.setAttribute("aria-describedby", described.join(" "));
      else el.removeAttribute("aria-describedby");
    }

    function validate() {
      var errors = [];
      function add(id, message) {
        setFieldError(id, message);
        if (message) errors.push({ id: id, message: message });
      }

      var name = oneLine(field("brief-name").value);
      add("brief-name", name ? "" : "Enter your name.");

      var email = oneLine(field("brief-email").value);
      if (!email) add("brief-email", "Enter your email address.");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        add("brief-email", "Enter an email address like name@example.com.");
      } else add("brief-email", "");

      var phone = oneLine(field("brief-phone").value);
      var digits = phone.replace(/\D/g, "");
      add(
        "brief-phone",
        phone && digits.length < 7
          ? "Enter a phone number with at least 7 digits, or leave it blank."
          : ""
      );

      add("brief-service", field("brief-service").value ? "" : "Choose the service this note is about.");

      var message = field("brief-message").value.trim();
      add(
        "brief-message",
        message.length >= 20 ? "" : "Add a short brief, at least a sentence or two."
      );

      return errors;
    }

    function showErrors(errors) {
      errorBox.hidden = false;
      errorBox.replaceChildren();
      var lead = document.createElement("p");
      lead.textContent = "The brief still needs a few details:";
      var list = document.createElement("ul");
      errors.forEach(function (item) {
        var li = document.createElement("li");
        var link = document.createElement("a");
        link.href = "#" + item.id;
        link.textContent = item.message;
        li.appendChild(link);
        list.appendChild(li);
      });
      errorBox.append(lead, list);
      errorBox.focus();
    }

    function compose() {
      var data = readForm();
      var label = serviceLabel();
      var lines = [
        "Project brief for BAACINC",
        "",
        "Name: " + oneLine(data["brief-name"]),
        "Organization: " + (oneLine(data["brief-organization"]) || "Not given"),
        "Email: " + oneLine(data["brief-email"]),
        "Phone: " + (oneLine(data["brief-phone"]) || "Not given"),
        "Service: " + label,
        "City: " + (oneLine(data["brief-city"]) || "Not given"),
        "Timing: " + (oneLine(data["brief-timing"]) || "Not given"),
        "",
        "Brief:",
        data["brief-message"].trim()
      ];
      var text = lines.join("\r\n");
      var subject = oneLine("BAACINC project brief: " + label);
      var url =
        "mailto:michael.brown@baacinc.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(text);
      return { text: text, url: url };
    }

    function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function (resolve, reject) {
        briefText.value = text;
        briefText.focus();
        briefText.select();
        var ok = false;
        try {
          ok = document.execCommand("copy");
        } catch (err) {
          ok = false;
        }
        if (ok) resolve();
        else reject(new Error("copy failed"));
      });
    }

    function openBrief(value) {
      var select = field("brief-service");
      if (select && value) {
        select.value = value;
        saveDraft();
      }
      var contact = document.getElementById("contact");
      if (contact && contact.scrollIntoView) {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        contact.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
      if (window.history && history.replaceState) {
        history.replaceState(null, "", "#contact");
      }
      window.setTimeout(function () {
        if (select) select.focus();
        if (status && select && select.value) {
          status.textContent = serviceLabel() + " is selected in the project brief.";
        }
      }, 0);
    }

    if (restoreDraft() && status) {
      status.textContent = "A draft saved in this browser was restored. BAACINC cannot see it.";
    }

    form.addEventListener("input", function () {
      saveDraft();
      if (!attempted) return;
      var errors = validate();
      if (!errors.length) {
        errorBox.hidden = true;
        errorBox.replaceChildren();
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      attempted = true;
      var errors = validate();
      if (errors.length) {
        fallback.hidden = true;
        showErrors(errors);
        return;
      }
      errorBox.hidden = true;
      errorBox.replaceChildren();
      var packed = compose();
      briefText.value = packed.text;
      mailtoLink.href = packed.url;
      fallback.hidden = false;
      var note =
        "Your email app should open with this brief addressed to michael.brown@baacinc.com. Nothing was sent to BAACINC. If the app did not open, copy the brief below and send it yourself.";
      if (packed.url.length > 1800) {
        note +=
          " This note is long, and some email apps cut off a long link, so copying is the safer path.";
      }
      status.textContent = note;
      try {
        window.location.href = packed.url;
      } catch (err) {
        /* No email app answered. The copy box below is the way out. */
      }
    });

    document.getElementById("copy-brief").addEventListener("click", function () {
      var text = briefText.value;
      copyText(text).then(
        function () {
          status.textContent =
            "The brief is on the clipboard. Paste it into an email to michael.brown@baacinc.com. Nothing was sent to BAACINC.";
        },
        function () {
          status.textContent =
            "The clipboard was blocked. Select the brief in the box and copy it, then email it to michael.brown@baacinc.com.";
          briefText.focus();
          briefText.select();
        }
      );
    });

    document.getElementById("clear-draft").addEventListener("click", function () {
      var hasText = FIELD_IDS.some(function (id) {
        return String(field(id).value || "").trim();
      });
      if (hasText && !window.confirm("Clear the saved draft and empty this form?")) return;
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (err) {
        /* Ignore storage failures. */
      }
      form.reset();
      attempted = false;
      FIELD_IDS.forEach(function (id) {
        setFieldError(id, "");
      });
      errorBox.hidden = true;
      errorBox.replaceChildren();
      fallback.hidden = true;
      briefText.value = "";
      status.textContent = "The draft in this browser was cleared.";
      field("brief-name").focus();
    });

    return openBrief;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
