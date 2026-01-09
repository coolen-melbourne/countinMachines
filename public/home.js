const modal = document.getElementById("deleteModal");

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

function confirmDelete(btn) {
  btn.classList.add("loading");
  btn.disabled = true;

  setTimeout(() => {
    closeModal();
    alert("Deleted successfully ✅");
  }, 4000);
}
