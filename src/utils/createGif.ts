import { applyPalette, GIFEncoder, quantize } from 'gifenc'
import type { TextCaption } from '../types/caption'
import type { PhotoFrame } from '../types/frame'
import type { PlacedSticker } from '../types/sticker'
import { composeSheet } from './composeSheet'
import type { LayoutGrid } from './sheetMetrics'

// Every GIF frame is the sheet with one photo on it.
const SINGLE_PHOTO: LayoutGrid = { columns: 1, rows: 1, photoCount: 1 }

// GIFs get big quickly, so frames are much smaller than the downloadable sheet.
const GIF_WIDTH = 480

// These borrow the library's own types, so they always match what it expects.
type GifPalette = ReturnType<typeof quantize>
type GifIndex = ReturnType<typeof applyPalette>

// One frame, ready to be written into a GIF at any speed.
export type GifFrame = {
  index: GifIndex
  palette: GifPalette
  width: number
  height: number
}

type RenderGifFramesOptions = {
  photos: string[]
  filterCss: string
  frame: PhotoFrame
  stickers: PlacedSticker[]
  caption: TextCaption
}

// Lets the browser repaint (and the spinner turn) between the slow parts.
function pause(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

// The slow part: draws every photo and reduces it to a 256-color frame.
export async function renderGifFrames({
  photos,
  filterCss,
  frame,
  stickers,
  caption,
}: RenderGifFramesOptions): Promise<GifFrame[]> {
  const frames: GifFrame[] = []

  for (const photo of photos) {
    const full = await composeSheet(
      SINGLE_PHOTO,
      [photo],
      filterCss,
      frame,
      stickers,
      caption,
    )

    // Shrink the frame to GIF size.
    const small = document.createElement('canvas')
    small.width = GIF_WIDTH
    small.height = Math.round((full.height * GIF_WIDTH) / full.width)

    const context = small.getContext('2d', { willReadFrequently: true })
    if (!context) {
      throw new Error('Canvas is not supported.')
    }
    context.imageSmoothingQuality = 'high'
    context.drawImage(full, 0, 0, small.width, small.height)

    // A GIF frame is a list of palette positions plus a palette of at most 256 colors.
    const { data } = context.getImageData(0, 0, small.width, small.height)
    const palette = quantize(data, 256)
    const index = applyPalette(data, palette)

    frames.push({ index, palette, width: small.width, height: small.height })

    await pause()
  }

  return frames
}

// The quick part: writes the frames into a GIF with the chosen delay between them.
export function encodeGif(frames: GifFrame[], frameDelayMs: number): Blob {
  const encoder = GIFEncoder()

  for (const frame of frames) {
    encoder.writeFrame(frame.index, frame.width, frame.height, {
      palette: frame.palette,
      delay: frameDelayMs,
      repeat: 0,
    })
  }

  encoder.finish()

  // Copying into a fresh array keeps TypeScript's Blob typing happy.
  return new Blob([new Uint8Array(encoder.bytes())], { type: 'image/gif' })
}