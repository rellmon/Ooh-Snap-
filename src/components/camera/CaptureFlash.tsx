import { motion, useReducedMotion } from 'framer-motion'

type CaptureFlashProps = {
  // Goes up by one every time a photo is taken. 0 means no photo yet.
  flashKey: number
}

function CaptureFlash({ flashKey }: CaptureFlashProps) {
  const prefersReducedMotion = useReducedMotion()

  // A bright flash is skipped for people who asked their device to reduce motion.
  if (flashKey === 0 || prefersReducedMotion) return null

  return (
    <motion.div
      key={flashKey}
      aria-hidden="true"
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 bg-white"
    />
  )
}

export default CaptureFlash