import { useCallback, useEffect, useState } from 'react'

export function useFullscreen() {
  // False on iPhones, which don't offer fullscreen for web pages.
  const isSupported = document.fullscreenEnabled
  const [isFullscreen, setIsFullscreen] = useState(
    () => document.fullscreenElement !== null,
  )

  // Keeps the button in sync when someone leaves with the Esc key.
  useEffect(() => {
    function handleChange() {
      setIsFullscreen(document.fullscreenElement !== null)
    }

    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  // Must be called from a click or tap. Returns whether the browser said yes.
  const enter = useCallback(async (): Promise<boolean> => {
    try {
      await document.documentElement.requestFullscreen()
      return true
    } catch {
      return false
    }
  }, [])

  const exit = useCallback(async () => {
    try {
      await document.exitFullscreen()
    } catch {
      // Already out of fullscreen. Nothing to do.
    }
  }, [])

  return { isSupported, isFullscreen, enter, exit }
}