import { AnimatePresence, motion } from 'framer-motion'

type CountdownProps = {
  count: number | null
}

function Countdown({ count }: CountdownProps) {
  const isSnap = count === 0

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20"
    >
      <AnimatePresence mode="wait">
        {count !== null && (
          <motion.span
            key={count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`font-display font-bold leading-none text-white drop-shadow-lg ${
              isSnap ? 'text-6xl sm:text-8xl' : 'text-9xl sm:text-[12rem]'
            }`}
          >
            {isSnap ? 'SNAP!' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Countdown