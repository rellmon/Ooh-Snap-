import type { CaptionFont, CaptionFontId, TextCaption } from '../types/caption'

// Keeps the text on one line and inside the sheet.
export const MAX_CAPTION_LENGTH = 20

// Font sizes are fractions of the sheet's width.
export const MIN_CAPTION_SIZE = 0.04
export const MAX_CAPTION_SIZE = 0.12

// Tilt is in degrees.
export const MIN_CAPTION_ROTATION = -45
export const MAX_CAPTION_ROTATION = 45

export const captionFonts: CaptionFont[] = [
  {
    id: 'bubbly',
    name: 'Bubbly',
    family: '"Fredoka", system-ui, sans-serif',
    weight: 700,
  },
  {
    id: 'script',
    name: 'Script',
    family: '"Pacifico", cursive',
    weight: 400,
  },
  {
    id: 'comic',
    name: 'Comic',
    family: '"Bangers", system-ui, sans-serif',
    weight: 400,
  },
  {
    id: 'clean',
    name: 'Clean',
    family: '"Nunito", system-ui, sans-serif',
    weight: 800,
  },
]

export const defaultCaptionFont: CaptionFont = captionFonts[0]

export function getCaptionFont(id: CaptionFontId): CaptionFont {
  return captionFonts.find((font) => font.id === id) ?? defaultCaptionFont
}

export const DEFAULT_CAPTION: TextCaption = {
  content: '',
  color: '#ffffff',
  fontId: defaultCaptionFont.id,
  x: 0.5,
  y: 0.5,
  size: 0.07,
  rotation: 0,
}

export const captionColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#111827' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Yellow', value: '#fde047' },
  { name: 'Sky blue', value: '#38bdf8' },
]