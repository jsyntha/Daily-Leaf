console.log("Daily Leaf script loaded!");

function closeAllDropdowns() {
    document.querySelectorAll(".dropdown.visible").forEach(d => d.classList.remove("visible"));
    document.querySelectorAll(".icon-active").forEach(b => b.classList.remove("icon-active"));
}

function toggleDropdownFor(button) {
    const toolbarItem = button.closest(".toolbar-item");
    const dropdown = toolbarItem.querySelector(".dropdown");
    if (dropdown) {
        dropdown.classList.toggle("visible");
        button.classList.toggle("icon-active");
    }
}

const DRAG_THRESHOLD = 6;

document.addEventListener("DOMContentLoaded", function() {
    const iconButtons = document.querySelectorAll(".icon");
    
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
            if (button.id === "accessibility") return;
            toggleDropdownFor(button);
            e.stopPropagation();
        });
    });

    document.querySelectorAll(".toolbar-item").forEach(item => {
        const icon = item.querySelector(".icon");
        if (!icon) return;

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
                item.style.top = (rect.top - parentRect.top) + "px";
                item.style.zIndex = 1000;
                armed = true;
            }

            if (armed) {
                const parentRect = item.parentElement.getBoundingClientRect();
                item.style.left = (e.clientX - parentRect.left - offsetX) + "px";
                item.style.top = (e.clientY - parentRect.top - offsetY) + "px";
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            armed = false;
            item.style.zIndex = "";
        });
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeAllDropdowns();
    });

    hookImportExportMenu();
    loadSavedFontColor && loadSavedFontColor();
});

(function() {
    const mainBtn = document.getElementById("accessibility");
    const mainDropdown = document.getElementById("accessibility-dropdown");
    const subDropdowns = {
        "font-colour": document.getElementById("font-colour-dropdown"),
        "font-style": document.getElementById("font-style-dropdown"),
        "text-size": document.getElementById("text-size-dropdown"),
    };

    mainBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (mainDropdown.classList.contains("visible")) {
            mainDropdown.classList.remove("visible");
            mainBtn.classList.remove("icon-active");
            Object.values(subDropdowns).forEach(d => d.classList.remove("visible"));
        } else {
            mainDropdown.classList.add("visible");
            mainBtn.classList.add("icon-active");
            Object.values(subDropdowns).forEach(d => d.classList.remove("visible"));
        }
    });

    mainDropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", function(e) {
            e.stopPropagation();
            const key = this.getAttribute("data-option");
            Object.entries(subDropdowns).forEach(([k, d]) => {
                if (k === key) d.classList.toggle("visible");
                else d.classList.remove("visible");
            });
        });
    });

    Object.values(subDropdowns).forEach(dd => {
        dd.addEventListener("click", function(e) { e.stopPropagation(); });
    });

    document.querySelectorAll(".color-option").forEach(option => {
        option.addEventListener("click", function(e) {
            const color = this.getAttribute("data-color");
            changeFontColor(color);
        });
    });

    document.querySelectorAll(".font-style-option").forEach(option => {
        option.addEventListener("click", function(e) {
            const style = this.getAttribute("data-style");
            if (style) {
                document.body.style.setProperty("font-family", style, "important");
                Array.from(document.querySelectorAll("*")).forEach(el => {
                    el.style.setProperty("font-family", style, "important");
                });
                try { localStorage.setItem("dl_font_family", style); } catch {}
            } else {
                document.body.style.removeProperty("font-family");
                Array.from(document.querySelectorAll("*")).forEach(el => {
                    el.style.removeProperty("font-family");
                });
                try { localStorage.removeItem("dl_font_family"); } catch {}
            }
        });
    });

    document.querySelectorAll(".size-option").forEach(option => {
        option.addEventListener("click", function(e) {
            const size = this.getAttribute("data-size");
            document.body.style.fontSize = size;
            try { localStorage.setItem("dl_font_size", size); } catch {}
        });
    });

    window.addEventListener("DOMContentLoaded", function() {
        const style = localStorage.getItem("dl_font_family");
        if (style) {
            document.body.style.setProperty("font-family", style, "important");
            Array.from(document.querySelectorAll("*")).forEach(el => {
                el.style.setProperty("font-family", style, "important");
            });
        }
        const size = localStorage.getItem("dl_font_size");
        if (size) document.body.style.fontSize = size;
    });

    document.querySelectorAll(".previous-option").forEach(option => {
        option.addEventListener("click", function(e) {
            e.stopPropagation();
            const dropdown = this.closest(".sub-dropdown");
            if (dropdown) dropdown.classList.remove("visible");
            const mainDropdown = document.getElementById("accessibility-dropdown");
            if (mainDropdown) mainDropdown.classList.add("visible");
        });
    });
})();


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

function getAppState() {
    const user = (typeof localStorage !== "undefined" && localStorage.getItem("dl_user_name")) || "Leafling";
    const fontColor = localStorage.getItem("dl_font_color") || null;
    const toolbar = Array.from(document.querySelectorAll("#toolbar .toolbar-item")).map(item => {
        const icon = item.querySelector(".icon");
        const id = icon ? icon.id : null;
        const position = item.style.position || null;
        const left = item.style.left || null;
        const top = item.style.top || null;
        return { iconId: id, position, left, top };
    });
    return {
        app: "DailyLeaf",
        version: 1,
        exportedAt: new Date().toISOString(),
        user: { name: String(user || "") },
        preferences: { fontColor },
        toolbar
    };
}

function applyAppState(state) {
    if (!state || state.app !== "DailyLeaf") return;
    if (state.user && typeof state.user.name === "string") {
        window.setDailyLeafUser(state.user.name);
    }
    if (state.preferences && typeof state.preferences.fontColor === "string") {
        changeFontColor(state.preferences.fontColor);
    }
    if (Array.isArray(state.toolbar)) {
        state.toolbar.forEach(entry => {
            if (!entry || !entry.iconId) return;
            const icon = document.getElementById(entry.iconId);
            if (!icon) return;
            const item = icon.closest(".toolbar-item");
            if (!item) return;
            if (entry.left != null && entry.top != null) {
                item.style.position = "absolute";
                item.style.left = typeof entry.left === "number" ? (entry.left + "px") : String(entry.left);
                item.style.top = typeof entry.top === "number" ? (entry.top + "px")  : String(entry.top);
            }
        });
    }
}

function handleExportClick() {
    const state = getAppState();
    const text = JSON.stringify(state, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    const fname = "daily-leaf-export-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) + ".json";
    const a = document.createElement("a");
    a.href = url;
    a.download = fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function handleImportClick() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = function() {
        const file = input.files && input.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function() {
            try {
                const data = JSON.parse(String(reader.result || "{}"));
                applyAppState(data);
                const el = document.getElementById("importexport-module");
                if (el) el.textContent = "Imported settings applied";
            } catch (e) {
                alert("Import failed: invalid JSON");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function hookImportExportMenu() {
    const icon = document.getElementById("import-export-icon");
    if (!icon) return;
    const item = icon.closest(".toolbar-item");
    if (!item) return;
    const entries = item.querySelectorAll(".dropdown .dropdown-item");
    entries.forEach(entry => {
        const label = (entry.textContent || "").trim().toLowerCase();
        if (label === "export") {
            entry.addEventListener("click", () => { 
                handleExportClick(); 
                toggleDropdownFor(icon); 
            });
        } else if (label === "import") {
            entry.addEventListener("click", () => { 
                handleImportClick(); 
                toggleDropdownFor(icon); 
            });
        }
    });
}

function changeFontColor(color) {
    document.body.style.color = color;
    try { localStorage.setItem("dl_font_color", color); } catch {}
}
function loadSavedFontColor() {
    const color = localStorage.getItem("dl_font_color");
    if (color) changeFontColor(color);
}
