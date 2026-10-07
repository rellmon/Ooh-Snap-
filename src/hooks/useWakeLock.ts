import { useEffect, useState } from 'react'

export function isWakeLockSupported(): boolean {
  return typeof navigator !== 'undefined' && 'wakeLock' in navigator
}

// Keeps the screen on while `active` is true. `isHeld` says whether the lock is really on.
export function useWakeLock(active: boolean) {
  const [isHeld, setIsHeld] = useState(false)

  useEffect(() => {
    if (!active || !isWakeLockSupported()) return

    let sentinel: WakeLockSentinel | null = null
    let isCancelled = false

    async function acquire() {
      try {
        const lock = await navigator.wakeLock.request('screen')

        // We were switched off while waiting for the browser to answer.
        if (isCancelled) {
          lock.release().catch(() => {})
          return
        }

        sentinel = lock
        lock.addEventListener('release', () => {
          if (!isCancelled) setIsHeld(false)
        })
        setIsHeld(true)
      } catch {
        // The device can refuse, for example in battery saver mode.
        if (!isCancelled) setIsHeld(false)
      }
    }

    // The browser drops the lock whenever the tab is hidden. Ask again on return.
    function handleVisibilityChange() {
      if (
        document.visibilityState === 'visible' &&
        (!sentinel || sentinel.released)
      ) {
        acquire()
      }
    }

    acquire()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      isCancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      sentinel?.release().catch(() => {})
      sentinel = null
      setIsHeld(false)
    }
  }, [active])

  return { isHeld }
}