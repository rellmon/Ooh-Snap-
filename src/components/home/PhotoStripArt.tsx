import { motion } from 'framer-motion'
import { Camera, Heart, Smile, Star, type LucideIcon } from 'lucide-react'

type StripFrame = {
  icon: LucideIcon
  background: string
  color: string
}

const stripFrames: StripFrame[] = [
  { icon: Smile, background: 'bg-sun', color: 'text-ink' },
  { icon: Heart, background: 'bg-blaze', color: 'text-ink' },
  { icon: Star, background: 'bg-white', color: 'text-ink' },
  { icon: Camera, background: 'bg-ink', color: 'text-sun' },
]

// A decorative photo strip. Purely visual, so screen readers skip it.
function PhotoStripArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-56 py-8 sm:w-64">
      <div
        className="absolute inset-x-[-1.5rem] bottom-2 top-1/3 bg-sun"
        style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
      />
      <div className="dots absolute -left-8 top-2 h-24 w-24" />
      <div className="absolute -right-3 top-0 h-10 w-10 border-2 border-ink bg-blaze" />

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative border-2 border-ink bg-white p-3 shadow-hard-lg"
      >
        <div className="space-y-3">
          {stripFrames.map(({ icon: Icon, background, color }, index) => (
            <div
              key={index}
              className={`flex aspect-[4/3] items-center justify-center border-2 border-ink ${background} ${color}`}
            >
              <Icon size={44} strokeWidth={2.5} />
            </div>
          ))}
        </div>
        <p className="mt-3 text-center font-heading text-xl uppercase tracking-wider">
          Ooh Snap!
        </p>
      </motion.div>
    </div>
  )
}

export default PhotoStripArt