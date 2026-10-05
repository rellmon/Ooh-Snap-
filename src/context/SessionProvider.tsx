import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { SessionContext } from './SessionContext'

type SessionProviderProps = {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [photos, setPhotos] = useState<string[]>([])

  // The ref always holds the newest list, so we can safely read it
  // when freeing memory. State is what makes the screen update.
  const photosRef = useRef<string[]>([])

  const updatePhotos = useCallback((next: string[]) => {
    photosRef.current = next
    setPhotos(next)
  }, [])

  const addPhoto = useCallback(
    (url: string) => updatePhotos([...photosRef.current, url]),
    [updatePhotos],
  )

  const replacePhoto = useCallback(
    (index: number, url: string) => {
      const oldUrl = photosRef.current[index]
      updatePhotos(
        photosRef.current.map((photo, i) => (i === index ? url : photo)),
      )
      if (oldUrl) URL.revokeObjectURL(oldUrl)
    },
    [updatePhotos],
  )

  const clearPhotos = useCallback(() => {
    if (photosRef.current.length === 0) return
    photosRef.current.forEach((url) => URL.revokeObjectURL(url))
    updatePhotos([])
  }, [updatePhotos])

  const value = useMemo(
    () => ({ photos, addPhoto, replacePhoto, clearPhotos }),
    [photos, addPhoto, replacePhoto, clearPhotos],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}