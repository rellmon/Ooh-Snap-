import { useCallback, useState } from 'react'

// Like useState, but the value is also saved in localStorage.
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  isValid: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === null) return defaultValue

      const parsed: unknown = JSON.parse(stored)
      return isValid(parsed) ? parsed : defaultValue
    } catch {
      // Storage is blocked, or the saved text isn't valid. Use the default.
      return defaultValue
    }
  })

  const update = useCallback(
    (next: T) => {
      setValue(next)
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        // Storage may be full or blocked. The setting still works this visit.
      }
    },
    [key],
  )

  return [value, update] as const
}