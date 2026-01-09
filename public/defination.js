document.addEventListener('DOMContentLoaded', () => {

  let currentProductId = null

  // EDIT BOSILGANDA MODAL OCHILSIN
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentProductId = btn.dataset.id
      document.getElementById('commentInput').value = ''
      document.getElementById('editModal').style.display = 'flex'
    })
  })

  // MODAL YOPISH
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none'
  })

  // SAQLASH
  document.getElementById('saveComment').addEventListener('click', async () => {
    const comment = document.getElementById('commentInput').value.trim()
    if (!comment) return alert('Izoh yozing')

    await fetch(`/products/comment/${currentProductId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment })
    })

    location.reload()
  })

})