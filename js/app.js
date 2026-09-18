(function () {
  var project = window.DEMO_DATA || { project: "Demo Website", slug: document.body.dataset.demoProject || "demo", user: { name: "Demo User" } };
  var storageKey = project.slug + ":demo-state";
  var defaults = {
    user: project.user || { name: "Demo User", plan: "Demo" },
    cart: [],
    wishlist: [],
    settings: { notifications: true },
    actions: [],
    updatedAt: new Date().toISOString()
  };

  function clone(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || clone(defaults);
    } catch (error) {
      return clone(defaults);
    }
  }

  function saveState(next) {
    next.updatedAt = new Date().toISOString();
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  var state = loadState();
  saveState(state);

  var style = document.createElement("style");
  style.textContent = [
    ".demo-toast-wrap{position:fixed;right:18px;bottom:18px;display:grid;gap:10px;z-index:99999;pointer-events:none}",
    ".demo-toast{pointer-events:auto;background:var(--demo-surface,#0f172a);color:#fff;border:1px solid var(--demo-border,rgba(255,255,255,.14));box-shadow:var(--demo-shadow,0 18px 50px rgba(2,6,23,.24));border-radius:14px;padding:12px 14px;max-width:360px;font:600 14px/1.35 Inter,system-ui,sans-serif;animation:demoToastIn .18s ease-out}",
    ".demo-toast small{display:block;color:rgba(255,255,255,.68);font-weight:500;margin-top:3px}",
    ".demo-reset{position:fixed;left:18px;bottom:18px;z-index:99990;border:1px solid var(--demo-border,rgba(127,127,127,.22));background:rgba(255,255,255,.92);color:var(--demo-accent,#2563eb);border-radius:999px;padding:10px 13px;font:800 12px Inter,system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.12);cursor:pointer;backdrop-filter:blur(14px)}",
    ".demo-modal-backdrop{position:fixed;inset:0;background:rgba(2,6,23,.5);display:none;align-items:center;justify-content:center;padding:20px;z-index:99998}",
    ".demo-modal-backdrop.open{display:flex}",
    ".demo-modal{width:min(540px,100%);background:var(--demo-surface,#fff);color:var(--demo-text,#111827);border:1px solid var(--demo-border,rgba(127,127,127,.22));border-radius:18px;box-shadow:var(--demo-shadow,0 30px 90px rgba(2,6,23,.34));overflow:hidden;font-family:Inter,system-ui,sans-serif}",
    ".demo-modal header{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--demo-border,rgba(127,127,127,.22))}",
    ".demo-modal h2{margin:0;font-size:18px;letter-spacing:-.02em}",
    ".demo-modal .body{padding:20px;color:var(--demo-muted,#4b5563);line-height:1.55}",
    ".demo-modal footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;background:rgba(127,127,127,.08);border-top:1px solid var(--demo-border,rgba(127,127,127,.22))}",
    ".demo-modal .close{border:0;background:transparent;font-size:24px;line-height:1;cursor:pointer;color:var(--demo-muted,#6b7280)}",
    ".demo-modal .primary{border:0;border-radius:10px;background:var(--demo-accent,#2563eb);color:white;padding:10px 14px;font-weight:800;cursor:pointer}",
    ".demo-invalid{outline:2px solid #ef4444!important;outline-offset:2px}",
    ".demo-field-error{color:#dc2626;font:700 12px/1.3 Inter,system-ui,sans-serif;margin-top:5px}",
    ".demo-empty{padding:18px;border:1px dashed var(--demo-border,rgba(127,127,127,.35));border-radius:14px;text-align:center;color:var(--demo-muted,#6b7280);background:rgba(127,127,127,.08)}",
    ".demo-busy{opacity:.78;cursor:progress!important}",
    "@keyframes demoToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    "@media(max-width:520px){.demo-reset{left:12px;bottom:12px}.demo-toast-wrap{right:12px;left:12px;bottom:64px}}"
  ].join("");
  document.head.appendChild(style);

  var toastWrap = document.createElement("div");
  toastWrap.className = "demo-toast-wrap";
  document.body.appendChild(toastWrap);

  var reset = document.createElement("button");
  reset.className = "demo-reset";
  reset.type = "button";
  reset.textContent = "Reset Demo";
  reset.setAttribute("aria-label", "Reset demo data");
  document.body.appendChild(reset);

  var modal = document.createElement("div");
  modal.className = "demo-modal-backdrop";
  modal.innerHTML = '<div class="demo-modal" role="dialog" aria-modal="true"><header><h2>Demo Action</h2><button class="close" type="button" aria-label="Close">×</button></header><div class="body"></div><footer><button class="primary" type="button">Done</button></footer></div>';
  document.body.appendChild(modal);

  function toast(message, detail) {
    var item = document.createElement("div");
    item.className = "demo-toast";
    item.innerHTML = detail ? message + "<small>" + detail + "</small>" : message;
    toastWrap.appendChild(item);
    setTimeout(function () { item.remove(); }, 3000);
  }

  function openModal(title, text) {
    modal.querySelector("h2").textContent = title;
    modal.querySelector(".body").textContent = text;
    modal.classList.add("open");
    modal.querySelector(".primary").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
  }

  modal.addEventListener("click", function (event) {
    if (event.target === modal || event.target.closest(".close") || event.target.closest(".primary")) closeModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  reset.addEventListener("click", function () {
    state = clone(defaults);
    saveState(state);
    toast("Demo data reset", "Local demo state was restored.");
  });

  function cleanErrors(form) {
    form.querySelectorAll(".demo-field-error").forEach(function (error) { error.remove(); });
    form.querySelectorAll(".demo-invalid").forEach(function (field) { field.classList.remove("demo-invalid"); });
  }

  document.querySelectorAll("form").forEach(function (form) {
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      cleanErrors(form);
      var fields = Array.prototype.slice.call(form.querySelectorAll("input, textarea, select"));
      var valid = true;
      fields.forEach(function (field) {
        var value = (field.value || "").trim();
        var required = field.hasAttribute("required") || ["email", "password", "url"].indexOf(field.type) !== -1;
        var message = "";
        if (required && !value) message = "This field is required.";
        if (!message && field.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) message = "Enter a valid email.";
        if (!message && field.type === "password" && value && value.length < 6) message = "Use at least 6 characters.";
        if (!message && field.type === "url" && value) {
          try { new URL(value); } catch (error) { message = "Enter a valid URL."; }
        }
        if (message) {
          valid = false;
          field.classList.add("demo-invalid");
          var errorNode = document.createElement("div");
          errorNode.className = "demo-field-error";
          errorNode.textContent = message;
          field.insertAdjacentElement("afterend", errorNode);
        }
      });
      if (!valid) return toast("Please check the form", "Highlighted fields need valid demo values.");
      state.actions.push({ type: "form", label: form.getAttribute("aria-label") || "Form submitted", at: new Date().toISOString() });
      saveState(state);
      toast("Form submitted", "Demo Mode — no real message, payment, or account change was sent.");
      form.reset();
    });
  });

  function searchableCards(scope, input) {
    var selectors = "tbody tr, article, .card, .server-card, .product-card, .project-card, .pricing-card, .feature-card, li";
    return Array.prototype.slice.call(scope.querySelectorAll(selectors)).filter(function (el) {
      return !el.contains(input) && !el.closest(".demo-modal") && !el.classList.contains("demo-toast");
    });
  }

  document.querySelectorAll('input[type="search"], input[placeholder*="Search" i], input[placeholder*="search" i]').forEach(function (input) {
    input.addEventListener("input", function () {
      var term = input.value.trim().toLowerCase();
      var scope = input.closest("main, section, .dashboard, .content") || document.body;
      var candidates = searchableCards(scope, input);
      if (candidates.length < 2 && scope !== document.body) {
        scope = document.body;
        candidates = searchableCards(scope, input);
      }
      var visible = 0;
      candidates.forEach(function (el) {
        var match = !term || el.textContent.toLowerCase().indexOf(term) !== -1;
        el.hidden = !match;
        if (match) visible += 1;
      });
      var empty = scope.querySelector(".demo-empty");
      if (term && candidates.length && !visible) {
        if (!empty) {
          empty = document.createElement("div");
          empty.className = "demo-empty";
          empty.textContent = "No demo results match your search.";
          input.closest("form, header, .toolbar, .topbar")?.insertAdjacentElement("afterend", empty) || scope.appendChild(empty);
        }
      } else if (empty) empty.remove();
    });
  });

  document.querySelectorAll("select").forEach(function (select) {
    select.addEventListener("change", function () {
      toast("Filter updated", "Demo results are using: " + (select.value || "All"));
    });
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (link) {
      var href = link.getAttribute("href");
      if (href === "#") {
        event.preventDefault();
        var label = link.textContent.trim() || "Demo page";
        var id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        var target = document.getElementById(id) || Array.prototype.slice.call(document.querySelectorAll("section")).find(function (section) {
          return section.textContent.toLowerCase().indexOf(label.toLowerCase()) !== -1;
        });
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          toast(label, "Navigated within the demo page.");
        }
      }
    }

    var button = event.target.closest("button, [role='button']");
    if (!button || button.closest(".demo-modal") || button.classList.contains("demo-reset")) return;
    if (button.type === "submit" || button.dataset.demoHandled === "true") return;
    var text = (button.textContent || button.getAttribute("aria-label") || "").trim();
    if (!text) return;
    var lower = text.toLowerCase();
    if (lower.indexOf("delete") !== -1 || lower.indexOf("remove") !== -1 || lower.indexOf("cancel") !== -1) {
      openModal(text, "Demo Mode — this simulated destructive action did not change any real system.");
      return;
    }
    if (/restart|deploy|checkout|order|create|save|add|submit|apply|download|upload|contact|start|view|open|learn|get|book|schedule|buy|cart|wishlist|subscribe|sign|login/.test(lower)) {
      var original = button.textContent;
      var width = button.getBoundingClientRect().width;
      button.style.minWidth = Math.ceil(width) + "px";
      button.disabled = true;
      button.classList.add("demo-busy");
      button.textContent = "Working...";
      setTimeout(function () {
        button.disabled = false;
        button.classList.remove("demo-busy");
        button.textContent = original;
        state.actions.push({ type: "button", label: text, at: new Date().toISOString() });
        saveState(state);
        toast(text + " completed", "Demo Mode — no real external action was performed.");
      }, 520);
    }
  });

  toast(project.project + " ready", "Demo Mode is active.");
})();
