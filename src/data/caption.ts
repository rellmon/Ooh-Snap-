import type { TextCaption } from '../types/caption'

// Keeps the text on one line and inside the sheet.
export const MAX_CAPTION_LENGTH = 20

// Font sizes are fractions of the sheet's width.
export const MIN_CAPTION_SIZE = 0.04
export const MAX_CAPTION_SIZE = 0.12

export const DEFAULT_CAPTION: TextCaption = {
  content: '',
  color: '#ffffff',
  x: 0.5,
  y: 0.5,
  size: 0.07,
}

export const captionColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#111827' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Yellow', value: '#fde047' },
  { name: 'Sky blue', value: '#38bdf8' },
]