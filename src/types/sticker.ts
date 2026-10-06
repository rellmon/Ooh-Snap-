export type StickerOption = {
  id: string
  name: string
  emoji: string
}

// Positions and sizes are fractions of the sheet (0 to 1), so they work at any scale.
export type PlacedSticker = {
  uid: string
  emoji: string
  // The sticker's center: 0 is the left/top edge, 1 is the right/bottom edge.
  x: number
  y: number
  // The sticker's width as a fraction of the sheet's width.
  size: number
}