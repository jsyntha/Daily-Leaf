console.log("Daily Leaf script loaded!");

const notesButton = document.getElementById('notes-journal-icon');
const dropdown = notesButton.nextElementSibling;

notesButton.addEventListener("click", () => {
    dropdown.classList.toggle("visible");
})