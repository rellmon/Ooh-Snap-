import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { DEFAULT_ADJUSTMENTS } from '../data/adjustments'
import { defaultFilter, getFilterById } from '../data/filters'
import { defaultFrame, getFrameById } from '../data/frames'
import { defaultLayout, getLayoutById } from '../data/layouts'
import { DEFAULT_STICKER_SIZE } from '../data/stickers'
import type { AdjustmentKey, Adjustments } from '../types/adjustments'
import type { FilterId } from '../types/filter'
import type { FrameId } from '../types/frame'
import type { LayoutId } from '../types/layout'
import type { PlacedSticker } from '../types/sticker'
import { SessionContext } from './SessionContext'

type SessionProviderProps = {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [layoutId, setLayoutId] = useState<LayoutId>(defaultLayout.id)
  const [filterId, setFilterId] = useState<FilterId>(defaultFilter.id)
  const [frameId, setFrameId] = useState<FrameId>(defaultFrame.id)
  const [adjustments, setAdjustments] =
    useState<Adjustments>(DEFAULT_ADJUSTMENTS)
  const [stickers, setStickers] = useState<PlacedSticker[]>([])
  const [photos, setPhotos] = useState<string[]>([])

  const layout = getLayoutById(layoutId)
  const filter = getFilterById(filterId)
  const frame = getFrameById(frameId)

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
    setFrameId(defaultFrame.id)
    setAdjustments(DEFAULT_ADJUSTMENTS)
    setStickers([])
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

  const selectFrame = useCallback((id: FrameId) => setFrameId(id), [])

  const setAdjustment = useCallback((key: AdjustmentKey, value: number) => {
    setAdjustments((current) => ({ ...current, [key]: value }))
  }, [])

  const resetAdjustments = useCallback(
    () => setAdjustments(DEFAULT_ADJUSTMENTS),
    [],
  )

  // New stickers land somewhere near the middle, so they don't stack exactly.
  const addSticker = useCallback((emoji: string): string => {
    const sticker: PlacedSticker = {
      uid: crypto.randomUUID(),
      emoji,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      size: DEFAULT_STICKER_SIZE,
    }
    setStickers((current) => [...current, sticker])
    return sticker.uid
  }, [])

  const removeSticker = useCallback((uid: string) => {
    setStickers((current) => current.filter((sticker) => sticker.uid !== uid))
  }, [])

  const clearStickers = useCallback(() => setStickers([]), [])

  const moveSticker = useCallback((uid: string, x: number, y: number) => {
    setStickers((current) =>
      current.map((sticker) =>
        sticker.uid === uid ? { ...sticker, x, y } : sticker,
      ),
    )
  }, [])

  const resizeSticker = useCallback((uid: string, size: number) => {
    setStickers((current) =>
      current.map((sticker) =>
        sticker.uid === uid ? { ...sticker, size } : sticker,
      ),
    )
  }, [])

  const value = useMemo(
    () => ({
      layout,
      selectLayout,
      filter,
      selectFilter,
      adjustments,
      setAdjustment,
      resetAdjustments,
      frame,
      selectFrame,
      stickers,
      addSticker,
      removeSticker,
      clearStickers,
      moveSticker,
      resizeSticker,
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
      frame,
      selectFrame,
      stickers,
      addSticker,
      removeSticker,
      clearStickers,
      moveSticker,
      resizeSticker,
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