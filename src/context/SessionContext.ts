import { createContext } from 'react'

export type SessionContextValue = {
  photos: string[]
  addPhoto: (url: string) => void
  replacePhoto: (index: number, url: string) => void
  clearPhotos: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)