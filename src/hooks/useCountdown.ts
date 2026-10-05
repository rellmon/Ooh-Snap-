import { useCallback, useEffect, useRef, useState } from 'react'

const TICK_MS = 1000
const SNAP_MS = 800

// count: 3, 2, 1, then 0 (shown as "SNAP!"), then null (not counting).
export function useCountdown(seconds: number, onComplete?: () => void) {
  const [count, setCount] = useState<number | null>(null)

  // Keep the latest callback without restarting the timer when it changes.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (count === null) return

    const timer = setTimeout(
      () => {
        if (count > 0) {
          setCount(count - 1)
        } else {
          setCount(null)
          onCompleteRef.current?.()
        }
      },
      count === 0 ? SNAP_MS : TICK_MS,
    )

    // Runs before the next tick, or when the page closes.
    return () => clearTimeout(timer)
  }, [count])

  const start = useCallback(() => setCount(seconds), [seconds])
  const cancel = useCallback(() => setCount(null), [])

  return { count, start, cancel }
}