import { motion } from 'framer-motion'
import { ArrowRight, Camera, Download, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    icon: Camera,
    title: 'Strike a pose',
    text: 'Pick a layout, smile, and let the countdown do the rest.',
  },
  {
    icon: Sparkles,
    title: 'Make it yours',
    text: 'Add filters, frames, stickers, and text to your shots.',
  },
  {
    icon: Download,
    title: 'Keep the memories',
    text: 'Download your photo strip and share it with everyone.',
  },
]

const stripFrames = [
  'from-pink-300 to-rose-400',
  'from-amber-200 to-orange-300',
  'from-sky-200 to-indigo-300',
  'from-emerald-200 to-teal-300',
]

function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-20">
      <section className="grid items-center gap-12 py-12 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl font-extrabold tracking-tight text-pink-600 sm:text-7xl"
          >
            Ooh Snap!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-2xl font-semibold text-slate-800"
          >
            Capture the chaos. Keep the memories.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-slate-600"
          >
            A photobooth that runs right in your browser. Your photos stay on
            your device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 inline-block"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/booth"
                className="inline-flex items-center gap-2 rounded-full bg-pink-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-600/30 hover:bg-pink-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600"
              >
                Start the booth
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 40, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: 4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto w-44 rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5"
        >
          <div className="space-y-3">
            {stripFrames.map((gradient) => (
              <div
                key={gradient}
                className={`flex aspect-[4/3] items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}
              >
                <Camera className="text-white/80" size={28} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs font-extrabold tracking-widest text-pink-600">
            OOH SNAP!
          </p>
        </motion.div>
      </section>

      <section aria-labelledby="how-it-works">
        <h2
          id="how-it-works"
          className="text-center text-3xl font-extrabold text-slate-900"
        >
          How it works
        </h2>

        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li
              key={title}
              className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <Icon size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-bold">
                {index + 1}. {title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

export default Home