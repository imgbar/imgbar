const templateModal = document.getElementById('template-modal')
const templateButton = document.getElementById('template-trigger')
const templateImg = document.getElementById('template-img')
const templatePostUpload = document.getElementById('template-post-upload')
const templateCheckbox = document.getElementById('template-checkbox')
const templateInput = document.getElementById('template-input')
const templateAddButton = document.getElementById('template-add')

function openModal() {
  templateModal.classList.add('modal-open')
}

function closeModal() {
  templateModal.classList.remove('modal-open')
  templatePostUpload.style.display = 'none'
  templateImg.src = ''
}

function handleClose(e) {
  const clickedOnTrigger = e.target === templateButton
  const clickedOnModal = e.target.closest('.modal-open')
  if (!clickedOnTrigger && !clickedOnModal) {
    closeModal()
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  templateImg.src = URL.createObjectURL(file)
  templatePostUpload.style.display = 'flex'
}

function handleAdd(e) {}

templateButton.addEventListener('click', openModal)
document.addEventListener('click', handleClose)
templateInput.addEventListener('change', handleImageUpload)
templateAddButton.addEventListener('click', handleAdd)
