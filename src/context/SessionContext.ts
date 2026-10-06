import { createContext } from 'react'
import type { FilterId, PhotoFilter } from '../types/filter'
import type { LayoutId, PhotoLayout } from '../types/layout'

export type SessionContextValue = {
  layout: PhotoLayout
  selectLayout: (id: LayoutId) => void
  filter: PhotoFilter
  selectFilter: (id: FilterId) => void
  photos: string[]
  addPhoto: (url: string) => void
  replacePhoto: (index: number, url: string) => void
  clearPhotos: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)