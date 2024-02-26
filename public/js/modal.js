const templateModal = document.getElementById('template-modal')
const templateButton = document.getElementById('template-trigger')
const templateImg = document.getElementById('template-img')
const templatePostUpload = document.getElementById('template-post-upload')
const templateCheckbox = document.getElementById('template-checkbox')
const templateInput = document.getElementById('template-input')
const templateAddButton = document.getElementById('template-add')
const templatePublicCheckbox = document.getElementById(
  'template-public-checkbox'
)
const templatePublicDiv = document.getElementById('template-post-public')

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

function handlePublicChange(e) {
  if (e.target.checked) {
    templatePublicDiv.style.display = 'block'
  } else if (!e.target.checked) {
    templatePublicDiv.style.display = 'none'
  }
}

async function handleAdd(e) {
  const formData = new FormData()
  formData.append('image', templateInput.files[0])

  if (templatePublicCheckbox.checked) {
    const templateNameInput = document.getElementById('template-name')
    console.log(templateNameInput.value)
    formData.append('name', templateNameInput.value)
  }

  const res = await fetch('/add', { method: 'post', body: formData })
  const data = await res.json()

  closeModal()
  const templateAddedEvent = new CustomEvent('templateAdded', { detail: data })
  window.dispatchEvent(templateAddedEvent)
}

templateButton.addEventListener('click', openModal)
document.addEventListener('click', handleClose)
templateInput.addEventListener('change', handleImageUpload)
templateAddButton.addEventListener('click', handleAdd)
templatePublicCheckbox.addEventListener('change', handlePublicChange)
