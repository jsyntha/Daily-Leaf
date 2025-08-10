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

const debugDot = document.createElement("div");
debugDot.classList.add("debug-dot");
document.body.appendChild(debugDot);

document.addEventListener("mousemove", (e) => {
  debugDot.style.left = e.clientX + "px";
  debugDot.style.top = e.clientY + "px";
})