import { useCallback, useEffect, useRef, useState } from 'react'

type IdleTimeoutOptions = {
  active: boolean
  // How long without activity before the warning starts.
  idleMs: number
  // How long the warning lasts before the timeout fires.
  warningMs: number
  onTimeout: () => void
}

const ACTIVITY_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel'] as const

// `secondsLeft` is null normally, and counts down once the warning starts.
export function useIdleTimeout({
  active,
  idleMs,
  warningMs,
  onTimeout,
}: IdleTimeoutOptions) {
  const lastActivityRef = useRef(Date.now())
  const onTimeoutRef = useRef(onTimeout)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)

  // Keep the newest callback without restarting the timer when it changes.
  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  // The "I'm still here" button.
  const stayActive = useCallback(() => {
    lastActivityRef.current = Date.now()
    setSecondsLeft(null)
  }, [])

  useEffect(() => {
    if (!active) return

    lastActivityRef.current = Date.now()

    function markActivity() {
      // Once the warning has started, only the button counts as "still here".
      if (Date.now() - lastActivityRef.current < idleMs) {
        lastActivityRef.current = Date.now()
      }
    }

    function check() {
      const idleFor = Date.now() - lastActivityRef.current

      if (idleFor >= idleMs + warningMs) {
        lastActivityRef.current = Date.now()
        setSecondsLeft(null)
        onTimeoutRef.current()
      } else if (idleFor >= idleMs) {
        setSecondsLeft(Math.ceil((idleMs + warningMs - idleFor) / 1000))
      }
    }

    ACTIVITY_EVENTS.forEach((name) =>
      window.addEventListener(name, markActivity, { passive: true }),
    )
    const interval = setInterval(check, 500)

    return () => {
      ACTIVITY_EVENTS.forEach((name) =>
        window.removeEventListener(name, markActivity),
      )
      clearInterval(interval)
      setSecondsLeft(null)
    }
  }, [active, idleMs, warningMs])

  return { secondsLeft, stayActive }
}