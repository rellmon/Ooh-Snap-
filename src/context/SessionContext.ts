import { createContext } from 'react'
import type { LayoutId, PhotoLayout } from '../types/layout'

export type SessionContextValue = {
  layout: PhotoLayout
  selectLayout: (id: LayoutId) => void
  photos: string[]
  addPhoto: (url: string) => void
  replacePhoto: (index: number, url: string) => void
  clearPhotos: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)