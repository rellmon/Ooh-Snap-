import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

type CountdownProps = {
  count: number | null
}

function Countdown({ count }: CountdownProps) {
  const isSnap = count === 0
  const isCounting = count !== null

  return (
    <MotionConfig reducedMotion="user">
      <div
        aria-live="assertive"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center ${
          isCounting ? 'bg-ink/40' : ''
        }`}
      >
        <AnimatePresence mode="wait">
          {isCounting && (
            <motion.span
              key={count}
              initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: -3 }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`border-4 border-ink px-8 py-2 font-heading uppercase leading-none shadow-hard-lg ${
                isSnap
                  ? 'bg-blaze text-5xl sm:text-7xl'
                  : 'bg-sun text-8xl sm:text-[9rem]'
              }`}
            >
              {isSnap ? 'Snap!' : count}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}

export default Countdown