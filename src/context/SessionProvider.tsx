import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEFAULT_ADJUSTMENTS } from '../data/adjustments'
import { defaultFilter, getFilterById } from '../data/filters'
import { defaultLayout, getLayoutById } from '../data/layouts'
import type { AdjustmentKey, Adjustments } from '../types/adjustments'
import type { FilterId } from '../types/filter'
import type { LayoutId } from '../types/layout'
import { SessionContext } from './SessionContext'

type SessionProviderProps = {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [layoutId, setLayoutId] = useState<LayoutId>(defaultLayout.id)
  const [filterId, setFilterId] = useState<FilterId>(defaultFilter.id)
  const [adjustments, setAdjustments] =
    useState<Adjustments>(DEFAULT_ADJUSTMENTS)
  const [photos, setPhotos] = useState<string[]>([])

  const layout = getLayoutById(layoutId)
  const filter = getFilterById(filterId)

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

  // Ends the current shoot: the photos go, and so do the edits made to them.
  const clearPhotos = useCallback(() => {
    setFilterId(defaultFilter.id)
    setAdjustments(DEFAULT_ADJUSTMENTS)
    if (photosRef.current.length === 0) return
    photosRef.current.forEach((url) => URL.revokeObjectURL(url))
    updatePhotos([])
  }, [updatePhotos])

  // Photos taken for one layout don't belong to another, so switching clears them.
  const selectLayout = useCallback(
    (id: LayoutId) => {
      clearPhotos()
      setLayoutId(id)
    },
    [clearPhotos],
  )

  const selectFilter = useCallback((id: FilterId) => setFilterId(id), [])

  const setAdjustment = useCallback((key: AdjustmentKey, value: number) => {
    setAdjustments((current) => ({ ...current, [key]: value }))
  }, [])

  const resetAdjustments = useCallback(
    () => setAdjustments(DEFAULT_ADJUSTMENTS),
    [],
  )

  const value = useMemo(
    () => ({
      layout,
      selectLayout,
      filter,
      selectFilter,
      adjustments,
      setAdjustment,
      resetAdjustments,
      photos,
      addPhoto,
      replacePhoto,
      clearPhotos,
    }),
    [
      layout,
      selectLayout,
      filter,
      selectFilter,
      adjustments,
      setAdjustment,
      resetAdjustments,
      photos,
      addPhoto,
      replacePhoto,
      clearPhotos,
    ],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}