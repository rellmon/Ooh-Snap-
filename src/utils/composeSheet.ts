import type { PhotoFilter } from '../types/filter'
import type { PhotoLayout } from '../types/layout'

// Sizes are in canvas pixels, not screen pixels.
const CELL_WIDTH = 800
const CELL_HEIGHT = 600
const PADDING = 40
const GAP = 24
const FOOTER_HEIGHT = 120
const CORNER_RADIUS = 20

const BACKGROUND_COLOR = '#ffffff'
const PLACEHOLDER_COLOR = '#fce7f3'
const BRAND_COLOR = '#db2777'
const FOOTER_FONT = '700 56px Fredoka, system-ui, sans-serif'

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not load a photo.'))
    image.src = url
  })
}

// Fills a box with the image, cropping the edges instead of stretching.
function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  )
  const sourceWidth = width / scale
  const sourceHeight = height / scale
  const sourceX = (image.naturalWidth - sourceWidth) / 2
  const sourceY = (image.naturalHeight - sourceHeight) / 2

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  )
}

export async function composeSheet(
  layout: PhotoLayout,
  photos: string[],
  filter: PhotoFilter,
): Promise<HTMLCanvasElement> {
  const images = await Promise.all(
    photos.slice(0, layout.photoCount).map(loadImage),
  )

  // Make sure the footer font is ready before we draw with it.
  await document.fonts.load(FOOTER_FONT)

  const gridWidth =
    layout.columns * CELL_WIDTH + (layout.columns - 1) * GAP
  const gridHeight = layout.rows * CELL_HEIGHT + (layout.rows - 1) * GAP

  const canvas = document.createElement('canvas')
  canvas.width = PADDING * 2 + gridWidth
  canvas.height = PADDING + gridHeight + FOOTER_HEIGHT

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas is not supported.')
  }

  context.fillStyle = BACKGROUND_COLOR
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < layout.photoCount; index++) {
    const column = index % layout.columns
    const row = Math.floor(index / layout.columns)
    const x = PADDING + column * (CELL_WIDTH + GAP)
    const y = PADDING + row * (CELL_HEIGHT + GAP)
    const image = images[index]

    context.save()
    context.beginPath()
    context.roundRect(x, y, CELL_WIDTH, CELL_HEIGHT, CORNER_RADIUS)
    context.clip()

    if (image) {
      context.filter = filter.css
      drawCover(context, image, x, y, CELL_WIDTH, CELL_HEIGHT)
    } else {
      context.fillStyle = PLACEHOLDER_COLOR
      context.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT)
    }

    context.restore()
  }

  context.fillStyle = BRAND_COLOR
  context.font = FOOTER_FONT
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(
    'OOH SNAP!',
    canvas.width / 2,
    PADDING + gridHeight + FOOTER_HEIGHT / 2,
  )

  return canvas
}