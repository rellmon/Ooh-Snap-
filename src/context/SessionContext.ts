import { createContext } from 'react'
import type { AdjustmentKey, Adjustments } from '../types/adjustments'
import type { FilterId, PhotoFilter } from '../types/filter'
import type { FrameId, PhotoFrame } from '../types/frame'
import type { LayoutId, PhotoLayout } from '../types/layout'
import type { PlacedSticker } from '../types/sticker'

export type SessionContextValue = {
  layout: PhotoLayout
  selectLayout: (id: LayoutId) => void
  filter: PhotoFilter
  selectFilter: (id: FilterId) => void
  adjustments: Adjustments
  setAdjustment: (key: AdjustmentKey, value: number) => void
  resetAdjustments: () => void
  frame: PhotoFrame
  selectFrame: (id: FrameId) => void
  stickers: PlacedSticker[]
  // Returns the new sticker's id, so the page can select it right away.
  addSticker: (emoji: string) => string
  removeSticker: (uid: string) => void
  clearStickers: () => void
  moveSticker: (uid: string, x: number, y: number) => void
  resizeSticker: (uid: string, size: number) => void
  photos: string[]
  addPhoto: (url: string) => void
  replacePhoto: (index: number, url: string) => void
  clearPhotos: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)