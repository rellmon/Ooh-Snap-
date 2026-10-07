import { useEffect } from 'react'

// Asks the browser to confirm before the page is reloaded or closed.
export function useUnsavedWarning(active: boolean) {
  useEffect(() => {
    if (!active) return

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      // Older browsers need this line to show the prompt.
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [active])
}