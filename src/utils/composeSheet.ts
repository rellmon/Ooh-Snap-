import { getCaptionFont } from '../data/caption'
import type { TextCaption } from '../types/caption'
import type { PhotoFrame } from '../types/frame'
import type { PhotoLayout } from '../types/layout'
import type { PlacedSticker } from '../types/sticker'
import {
  CORNER_RADIUS,
  FOOTER_FONT_SIZE,
  FOOTER_HEIGHT,
  getCellRect,
  getSheetSize,
  PLACEHOLDER_COLOR,
} from './sheetMetrics'

const FOOTER_FONT = `700 ${FOOTER_FONT_SIZE}px Fredoka, system-ui, sans-serif`

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
  filterCss: string,
  frame: PhotoFrame,
  stickers: PlacedSticker[],
  caption: TextCaption,
): Promise<HTMLCanvasElement> {
  const images = await Promise.all(
    photos.slice(0, layout.photoCount).map(loadImage),
  )

  // A sticker that fails to load is skipped, so one bad file can't ruin the export.
  const stickerImages = await Promise.all(
    stickers.map((sticker) => loadImage(sticker.src).catch(() => null)),
  )

  // Make sure the footer font is ready before we draw with it.
  await document.fonts.load(FOOTER_FONT)

  const sheet = getSheetSize(layout)

  // The caption's font is only needed if there is a caption to draw.
  const hasCaption = caption.content.trim() !== ''
  const captionFont = getCaptionFont(caption.fontId)
  const captionFontCss = `${captionFont.weight} ${caption.size * sheet.width}px ${captionFont.family}`
  if (hasCaption) {
    await document.fonts.load(captionFontCss, caption.content)
  }

  const canvas = document.createElement('canvas')
  canvas.width = sheet.width
  canvas.height = sheet.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas is not supported.')
  }

  context.fillStyle = frame.background
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let index = 0; index < layout.photoCount; index++) {
    const { x, y, width, height } = getCellRect(layout, index)
    const image = images[index]

    context.save()
    context.beginPath()
    context.roundRect(x, y, width, height, CORNER_RADIUS)
    context.clip()

    if (image) {
      context.filter = filterCss
      drawCover(context, image, x, y, width, height)
    } else {
      context.fillStyle = PLACEHOLDER_COLOR
      context.fillRect(x, y, width, height)
    }

    context.restore()
  }

  context.fillStyle = frame.textColor
  context.font = FOOTER_FONT
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(
    'OOH SNAP!',
    canvas.width / 2,
    sheet.height - FOOTER_HEIGHT / 2,
  )

  // The caption goes above the photos and footer, but below the stickers.
  if (hasCaption) {
    context.save()
    // Move the origin to the caption's center, then turn the canvas around it.
    context.translate(caption.x * sheet.width, caption.y * sheet.height)
    context.rotate((caption.rotation * Math.PI) / 180)
    context.fillStyle = caption.color
    context.font = captionFontCss
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(caption.content, 0, 0)
    context.restore()
  }

  // Stickers go last, so they sit on top of everything else.
  context.imageSmoothingQuality = 'high'
  stickers.forEach((sticker, index) => {
    const image = stickerImages[index]
    if (!image) return

    const width = sticker.size * sheet.width
    const height = width * (image.naturalHeight / image.naturalWidth)

    context.drawImage(
      image,
      sticker.x * sheet.width - width / 2,
      sticker.y * sheet.height - height / 2,
      width,
      height,
    )
  })

  return canvas
}