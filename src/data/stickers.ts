import type { StickerOption } from '../types/sticker'

export const stickerOptions: StickerOption[] = [
  { id: 'heart', name: 'Heart', emoji: '❤️' },
  { id: 'star', name: 'Star', emoji: '⭐' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨' },
  { id: 'smiley', name: 'Smiley', emoji: '😄' },
  { id: 'sunglasses', name: 'Sunglasses', emoji: '😎' },
  { id: 'camera', name: 'Camera', emoji: '📸' },
  { id: 'speech-bubble', name: 'Speech bubble', emoji: '💬' },
]

// Sizes are fractions of the sheet's width.
export const DEFAULT_STICKER_SIZE = 0.16
export const MIN_STICKER_SIZE = 0.06
export const MAX_STICKER_SIZE = 0.4