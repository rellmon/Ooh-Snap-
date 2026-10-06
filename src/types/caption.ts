export type CaptionFontId = 'bubbly' | 'script' | 'comic' | 'clean'

export type CaptionFont = {
  id: CaptionFontId
  name: string
  // A CSS font-family list. It works in CSS and on a canvas.
  family: string
  weight: number
}

export type TextCaption = {
  content: string
  color: string
  fontId: CaptionFontId
  // The text's center, as fractions of the sheet (0 to 1).
  x: number
  y: number
  // Font size as a fraction of the sheet's width.
  size: number
  // Tilt in degrees. Positive turns clockwise.
  rotation: number
}