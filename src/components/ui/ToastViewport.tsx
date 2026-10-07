import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Check, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react'
import type { Toast, ToastTone } from '../../types/toast'

const toneStyles: Record<ToastTone, { box: string; icon: LucideIcon }> = {
  success: { box: 'bg-sun', icon: Check },
  error: { box: 'bg-blaze', icon: TriangleAlert },
  info: { box: 'bg-white', icon: Info },
}

type ToastViewportProps = {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <MotionConfig reducedMotion="user">
      {/* This region is always on the page, so screen readers announce what is added to it. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map(({ id, message, tone }) => {
            const { box, icon: Icon } = toneStyles[tone]
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 border-2 border-ink px-4 py-3 shadow-hard ${box}`}
              >
                <Icon
                  size={20}
                  strokeWidth={3}
                  aria-hidden="true"
                  className="shrink-0"
                />
                <p className="min-w-0 flex-1 break-words font-condensed text-lg font-bold leading-tight">
                  {message}
                </p>
                <button
                  type="button"
                  aria-label="Dismiss notification"
                  onClick={() => onDismiss(id)}
                  className="shrink-0 border-2 border-ink bg-paper p-1 hover:bg-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <X size={16} strokeWidth={3} aria-hidden="true" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default ToastViewport