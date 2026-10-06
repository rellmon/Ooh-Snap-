import { useEffect, useState } from 'react'

// Returns the value only after it has stopped changing for `delayMs`.
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    // Each new value cancels the previous timer.
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}