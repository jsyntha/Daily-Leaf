console.log("Daily Leaf script loaded!");

const iconButtons = document.querySelectorAll(".icon");

iconButtons.forEach(button => {
  button.addEventListener("click", () => {
    const toolbarItem = button.closest(".toolbar-item");
    const dropdown = toolbarItem.querySelector(".dropdown");

    if (dropdown) {
      dropdown.classList.toggle("visible");
      button.classList.toggle("icon-active");
    }
  });
});

document.querySelectorAll(".toolbar-item").forEach(item => {
    const icon = item.querySelector(".icon");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    icon.addEventListener("mousedown", (e) => {
        const rect = item.getBoundingClientRect();
        const parentRect = item.parentElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        item.style.position = "absolute";
        item.style.left = rect.left - parentRect.left + "px";
        item.style.top = rect.top - parentRect.top + "px";
        item.style.zIndex = 1000;
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const toolbarRect = item.parentElement.getBoundingClientRect();
        item.style.left = (e.clientX - toolbarRect.left - offsetX) + "px";
        item.style.top = (e.clientY - toolbarRect.top - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});