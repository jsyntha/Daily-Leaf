console.log("Daily Leaf script loaded!");

const iconButtons = document.querySelectorAll(".icon");

function toggleDropdownFor(button) {
  const toolbarItem = button.closest(".toolbar-item");
  const dropdown = toolbarItem.querySelector(".dropdown");
  if (dropdown) {
    dropdown.classList.toggle("visible");
    button.classList.toggle("icon-active");
  }
}

const DRAG_THRESHOLD = 6;

iconButtons.forEach(button => {
  let startX = null, startY = null, dragged = false;

  button.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    dragged = false;
  });

  document.addEventListener("mousemove", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if ((dx * dx + dy * dy) > (DRAG_THRESHOLD * DRAG_THRESHOLD)) {
      dragged = true;
    }
  });

  document.addEventListener("mouseup", () => {
    startX = null;
    startY = null;
  });

  button.addEventListener("click", (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    toggleDropdownFor(button);
  });
});

document.querySelectorAll(".toolbar-item").forEach(item => {
  const icon = item.querySelector(".icon");

  let isDragging = false;
  let armed = false;
  let startX = 0, startY = 0;
  let offsetX = 0, offsetY = 0;

  icon.addEventListener("dragstart", e => e.preventDefault());

  icon.addEventListener("mousedown", e => {
    const rect = item.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    startX = e.clientX;
    startY = e.clientY;

    isDragging = true;
    armed = false;

    e.preventDefault();
  });

  document.addEventListener("mousemove", e => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const movedEnough = (dx * dx + dy * dy) > (DRAG_THRESHOLD * DRAG_THRESHOLD);

    if (!armed && movedEnough) {
      const rect = item.getBoundingClientRect();
      const parentRect = item.parentElement.getBoundingClientRect();
      item.style.position = "absolute";
      item.style.left = (rect.left - parentRect.left) + "px";
      item.style.top  = (rect.top - parentRect.top) + "px";
      item.style.zIndex = 1000;
      armed = true;
    }

    if (armed) {
      const parentRect = item.parentElement.getBoundingClientRect();
      item.style.left = (e.clientX - parentRect.left - offsetX) + "px";
      item.style.top  = (e.clientY - parentRect.top - offsetY) + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    armed = false;
    item.style.zIndex = "";
  });
});

(function initDateTime() {
  const el = document.getElementById("date-time");
  if (!el) return;

  const tz = "Europe/Dublin";
  const fmt = new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  });

  function tick() {
    const now = new Date();
    el.textContent = fmt.format(now);
    try {
      const iso = new Intl.DateTimeFormat("sv-SE", {
        timeZone: tz,
        hour12: false,
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      }).format(now).replace(" ", "T");
      el.setAttribute("datetime", iso);
    } catch (_) {}
  }

  tick();
  const align = 1000 - (Date.now() % 1000);
  setTimeout(function run() {
    tick();
    setTimeout(run, 1000);
  }, align);
})();

(function initTempUser() {
  const el = document.getElementById("user-name");
  if (!el) return;
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("dl_user_name") : null;
  const user = stored && stored.trim() ? stored.trim() : "Leafling";
  el.textContent = user;
})();

window.setDailyLeafUser = function(name) {
  try { localStorage.setItem("dl_user_name", String(name || "").trim()); } catch {}
  const el = document.getElementById("user-name");
  if (el) el.textContent = String(name || "").trim() || "Leafling";
};