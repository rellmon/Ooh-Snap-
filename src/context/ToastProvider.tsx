import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import ToastViewport from '../components/ui/ToastViewport'
import type { Toast, ToastTone } from '../types/toast'
import { ToastContext } from './ToastContext'

const TOAST_DURATION_MS = 5000
const MAX_TOASTS = 3

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  // One timer per toast, so each one can be cancelled if it is closed early.
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = crypto.randomUUID()
      // Keep only the newest few, so toasts can never pile up the screen.
      setToasts((current) => [...current, { id, message, tone }].slice(-MAX_TOASTS))
      timersRef.current.set(
        id,
        setTimeout(() => dismissToast(id), TOAST_DURATION_MS),
      )
    },
    [dismissToast],
  )

  // Cancel any waiting timers when the app closes.
  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}