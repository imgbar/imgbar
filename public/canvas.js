'use strict'

import './libraries/canvas-txt.js'
import './libraries/htmx.js'
import { drawBackgroundImage, setImage } from './image.js'
import { setDownloadLink } from './controls.js'
const { drawText } = window.canvasTxt

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let image
let texts

function drawTexts() {
  texts.forEach((text) => {
    ctx.fillStyle = text.fill
    drawText(ctx, text.value, {
      x: text.dimensions.leftOffsetPercentFromCanvas * canvas.width,
      y: text.dimensions.topOffsetPercentFromCanvas * canvas.height,
      width: text.dimensions.widthPercentOfCanvas * canvas.width,
      height: text.dimensions.heightPercentOfCanvas * canvas.height,
      font: text.font,
      fontSize: text.size,
    })
  })
}

function updateTextBoxes() {
  texts.forEach((text, i) => {
    const div = document.getElementById(`text-box-${i + 1}`)
    const responsiveCanvas = canvas.getBoundingClientRect()

    div.style.left =
      text.dimensions.leftOffsetPercentFromCanvas * responsiveCanvas.width +
      'px'
    div.style.top =
      text.dimensions.topOffsetPercentFromCanvas * responsiveCanvas.height +
      'px'
    div.style.width =
      text.dimensions.widthPercentOfCanvas * responsiveCanvas.width + 'px'
    div.style.height =
      text.dimensions.heightPercentOfCanvas * responsiveCanvas.height + 'px'
  })
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBackgroundImage(image)
  drawTexts()
  updateTextBoxes()
}

function createTextBoxes() {
  const textBoxes = document.querySelectorAll('.text-box')
  textBoxes.forEach((box) => box.remove())

  texts.forEach((text, i) => {
    const div = document.createElement('div')
    div.classList.add('text-box')
    div.id = `text-box-${i + 1}`

    let isDragging = false
    let offsetX
    let offsetY

    div.addEventListener('mousedown', (e) => {
      isDragging = true

      offsetX = e.clientX - div.offsetLeft
      offsetY = e.clientY - div.offsetTop
    })

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        let x = e.clientX - offsetX
        let y = e.clientY - offsetY

        const responsiveCanvas = canvas.getBoundingClientRect()

        if (x < 0) x = 0
        if (x > responsiveCanvas.width - div.offsetWidth) {
          x = responsiveCanvas.width - div.offsetWidth
        }

        if (y < 0) y = 0
        if (y > responsiveCanvas.height - div.offsetHeight) {
          y = responsiveCanvas.height - div.offsetHeight
        }

        text.dimensions.leftOffsetPercentFromCanvas = x / responsiveCanvas.width
        text.dimensions.topOffsetPercentFromCanvas = y / responsiveCanvas.height
        draw()
      }
    })

    document.addEventListener('mouseup', () => {
      isDragging = false
    })

    document.getElementById('canvas-parent').append(div)
  })
}

function createWidthHandle() {
  texts.forEach((text, i) => {
    const div = document.getElementById(`text-box-${i + 1}`)
    const widthHandle = document.createElement('div')
    widthHandle.classList.add('text-box-width-handle')

    let isDragging = false
    let offsetX

    widthHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      isDragging = true
      offsetX = e.clientX
    })

    widthHandle.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const moveX = e.clientX - offsetX

        if (moveX > 0) {
          text.dimensions.widthPercentOfCanvas += 0.05
        } else if (moveX < 0) {
          text.dimensions.widthPercentOfCanvas -= 0.05
        }

        draw()
      }
    })

    document.addEventListener('mouseup', (e) => {
      isDragging = false
    })

    div.appendChild(widthHandle)
  })
}

function createHeightHandle() {
  texts.forEach((text, i) => {
    const div = document.getElementById(`text-box-${i + 1}`)
    const heightHandle = document.createElement('div')
    heightHandle.classList.add('text-box-height-handle')

    let isDragging = false
    let offsetY

    heightHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation()
      isDragging = true
      offsetY = e.clientY
    })

    heightHandle.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const moveY = e.clientY - offsetY

        if (moveY > 0) {
          text.dimensions.heightPercentOfCanvas += 0.05
        } else if (moveY < 0) {
          text.dimensions.heightPercentOfCanvas -= 0.05
        }

        draw()
      }
    })

    document.addEventListener('mouseup', (e) => {
      isDragging = false
    })

    div.appendChild(heightHandle)
  })
}

async function setupCanvas() {
  document.getElementById('mg-title').innerHTML = selectedTemplate.title

  image = await setImage(selectedTemplate.imagePath)
  texts = selectedTemplate.texts

  createTextBoxes()
  createHeightHandle()
  createWidthHandle()

  createTextareas()

  draw()

  updateValue()
  updateFillColor()
}

await setupCanvas()

function updateValue() {
  const textareas = document.querySelectorAll('.mg-textarea')
  textareas.forEach((textarea, i) => {
    textarea.addEventListener('keyup', (e) => {
      const text = texts[i]
      text.value = e.target.value
      const textBoxHeight =
        text.dimensions.heightPercentOfCanvas * canvas.height

      function setTextSize(textSize) {
        const { height } = drawText(ctx, text.value, {
          x: 0,
          y: 0,
          width: text.dimensions.widthPercentOfCanvas * canvas.width,
          height: text.dimensions.heightPercentOfCanvas * canvas.height,
          font: text.font,
          fontSize: textSize,
        })

        if (height > textBoxHeight) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          setTextSize(textSize - 1)
        } else {
          text.size = textSize
        }
      }

      setTextSize(text.maxSize)
      draw()
    })
  })
}

function updateFillColor() {
  const fillInputs = document.querySelectorAll('#fill')
  fillInputs.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      texts[i].fill = e.target.value
      draw()
    })
  })
}

function resizeCanvas() {
  window.addEventListener('resize', () => {
    draw()
  })
}

resizeCanvas()
setDownloadLink()

const templateImages = document.querySelectorAll('#templates>img')
templateImages.forEach((img) => {
  img.addEventListener('click', async (e) => {
    const templateId = e.target.dataset.id
    selectedTemplate = await getTemplate(templateId)
    await setupCanvas()
  })
})

async function getTemplate(id) {
  const res = await fetch(`/template/${id}`)
  const data = await res.json()
  return data
}

function createTextareas() {
  const mgControls = document.getElementById('mg-controls')
  mgControls.innerHTML = ''

  texts.forEach((text, i) => {
    const mgControl = document.createElement('div')
    mgControl.classList.add('mg-control')

    const textarea = document.createElement('textarea')
    textarea.classList.add('mg-textarea')
    textarea.placeholder = `Text #${i + 1}`
    textarea.name = `Text #${i + 1}`
    textarea.value = text.value
    mgControl.appendChild(textarea)

    const div = document.createElement('div')
    const input = document.createElement('input')
    input.type = 'color'

    input.name = 'fill'
    input.id = 'fill'
    input.value = text.fill

    div.appendChild(input)

    mgControls.appendChild(mgControl)
    mgControl.appendChild(div)
  })
}

const addTextElement = document.getElementById('add-text')
addTextElement.addEventListener('click', (e) => {
  const newText = structuredClone(selectedTemplate.texts[0])
  selectedTemplate.texts.push(newText)
  setupCanvas()
})

const searchResultsElement = document.querySelector('.search-results')
searchResultsElement.addEventListener('click', async (e) => {
  const searchResultElement = e.target.closest('div')
  const templateId = searchResultElement.dataset.id
  selectedTemplate = await getTemplate(templateId)
  await setupCanvas()
})

const searchInputElement = document.getElementById('search')

document.addEventListener('htmx:afterRequest', (e) => {
  if (e.detail.target === searchResultsElement) {
    searchResultsElement.classList.add('search-results-open')
  }
})

document.addEventListener('click', (e) => {
  if (e.target !== searchResultsElement) {
    searchResultsElement.classList.remove('search-results-open')
  }
})

const templateModal = document.getElementById('template-modal')
const templateButton = document.getElementById('template-trigger')
const templateImg = document.getElementById('template-img')
const templatePostUpload = document.getElementById('template-post-upload')
const templateCheckbox = document.getElementById('template-checkbox')

templateButton.addEventListener('click', (e) => {
  templateModal.classList.add('modal-open')
})

const templateInput = document.getElementById('template-input')
templateInput.addEventListener('change', (e) => {
  const file = e.target.files[0]
  templateImg.src = URL.createObjectURL(file)
  templatePostUpload.style.display = 'flex'
})

document.addEventListener('click', (e) => {
  const clickedOnTrigger = e.target === templateButton
  const clickedOnModal = e.target.closest('.modal-open')
  if (!clickedOnTrigger && !clickedOnModal) {
    templateModal.classList.remove('modal-open')
    templatePostUpload.style.display = 'none'
    templateImg.src = ''
    templateCheckbox.checked = false
  }
})
