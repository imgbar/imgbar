const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function loadImage(imagePath) {
  const image = new Image()
  image.src = imagePath
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image)
    }
  })
}

async function calculateDimensions(image) {
  const isVertical = image.height > image.width
  const width = isVertical ? 450 : 450 * (image.width / image.height)
  const height = isVertical ? 450 * (image.height / image.width) : 450

  return { width, height }
}

async function setImage(imagePath) {
  const image = await loadImage(imagePath)
  const { width, height } = await calculateDimensions(image)

  canvas.height = height
  canvas.width = width
  return image
}

function drawBackgroundImage(image) {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

export { drawBackgroundImage, setImage }
