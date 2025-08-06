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

// icon dragging 
document.querySelectorAll(".toolbar-item").forEach(item => {
    const icon = item.querySelector(".icon");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    icon.addEventListener("mousedown", (e) => {
        isDragging = true;

        const rect = item.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        item.style.zIndex = 1000;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        item.style.left = (e.clientX - offsetX) + "px";
        item.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});
