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
