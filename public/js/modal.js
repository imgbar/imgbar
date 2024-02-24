const templateModal = document.getElementById('template-modal')
const templateButton = document.getElementById('template-trigger')
const templateImg = document.getElementById('template-img')
const templatePostUpload = document.getElementById('template-post-upload')
const templateCheckbox = document.getElementById('template-checkbox')
const templateInput = document.getElementById('template-input')
const templatePostPublicDiv = document.getElementById('template-post-public')

function openModal() {
  templateModal.classList.add('modal-open')
}

function closeModal(e) {
  const clickedOnTrigger = e.target === templateButton
  const clickedOnModal = e.target.closest('.modal-open')
  if (!clickedOnTrigger && !clickedOnModal) {
    templateModal.classList.remove('modal-open')
    templatePostUpload.style.display = 'none'
    templateImg.src = ''
    templateCheckbox.checked = false
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0]
  templateImg.src = URL.createObjectURL(file)
  templatePostUpload.style.display = 'flex'
}

function handleTemplateSharing(e) {}

templateButton.addEventListener('click', openModal)
document.addEventListener('click', closeModal)
templateInput.addEventListener('change', handleImageUpload)
templateCheckbox.addEventListener('change', (e) => {
  if (e.currentTarget.checked) {
    templatePostPublicDiv.style.display = 'block'
  } else if (!e.currentTarget.checked) {
    templatePostPublicDiv.style.display = 'none'
  }
})
