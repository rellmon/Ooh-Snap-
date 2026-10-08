import type { StickerOption } from '../types/sticker'

// Vite finds every PNG in the folder while the app is built. Each entry is
// the file's path and its final web address.
const stickerFiles = import.meta.glob<string>('../assets/stickers/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

// "../assets/stickers/speech-bubble.png" -> "speech-bubble"
function getBaseName(path: string): string {
  const fileName = path.split('/').pop() ?? path
  return fileName.replace(/\.png$/i, '')
}

// "speech-bubble" -> "Speech bubble"
function toLabel(baseName: string): string {
  const words = baseName.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export const stickerOptions: StickerOption[] = Object.entries(stickerFiles)
  .map(([path, src]) => {
    const baseName = getBaseName(path)
    return { id: baseName, name: toLabel(baseName), src }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

// Sizes are fractions of the sheet's width.
export const DEFAULT_STICKER_SIZE = 0.16
export const MIN_STICKER_SIZE = 0.06
export const MAX_STICKER_SIZE = 0.4