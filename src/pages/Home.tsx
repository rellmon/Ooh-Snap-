import { useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Camera, Download, QrCode, Sparkles } from 'lucide-react'
import PhotoStripArt from '../components/home/PhotoStripArt'
import QrDialog from '../components/share/QrDialog'
import ArrowButton from '../components/ui/ArrowButton'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { usePageTitle } from '../hooks/usePageTitle'

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

// The same fade-and-rise entrance, with a different delay for each piece.
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
})

function Home() {
  usePageTitle()
  const [isQrOpen, setIsQrOpen] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <div className="mx-auto max-w-5xl overflow-x-clip px-6 pb-20">
        <section className="grid grid-cols-1 items-center gap-12 py-10 md:grid-cols-2 md:py-16">
          <div className="min-w-0">
            <h1 className="text-[6.5rem] leading-[0.85] sm:text-[9rem]">
              <span className="block">Ooh</span>
              <span className="block">Snap!</span>
            </h1>

            <motion.p
              {...rise(0.1)}
              className="mt-6 font-condensed text-3xl font-extrabold uppercase leading-tight sm:text-4xl"
            >
              Capture the chaos.
              <br />
              <span className="mt-1 inline-block bg-sun px-2">
                Keep the memories.
              </span>
            </motion.p>

            <motion.p {...rise(0.2)} className="mt-5 max-w-md text-lg">
              A photobooth that runs right in your browser. Your photos stay on
              your device.
            </motion.p>

            <motion.div
              {...rise(0.3)}
              className="mt-6 flex items-center gap-3"
              aria-hidden="true"
            >
              <div className="checker h-4 w-14" />
              <span className="border-2 border-ink bg-white px-2 font-condensed font-extrabold uppercase tracking-wide">
                Pose. Snap. Repeat.
              </span>
            </motion.div>

            <motion.div
              {...rise(0.4)}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <ArrowButton to="/templates">Start the booth</ArrowButton>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsQrOpen(true)}
              >
                <QrCode size={20} aria-hidden="true" />
                Show QR code
              </Button>
            </motion.div>
          </div>

          <div className="min-w-0">
            <PhotoStripArt />
          </div>
        </section>

        <section aria-labelledby="how-it-works" className="mt-6">
          <div className="flex items-center gap-4">
            <h2 id="how-it-works" className="text-5xl">
              How it works
            </h2>
            <div aria-hidden="true" className="checker h-4 flex-1" />
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title}>
                <Card className="h-full">
                  <div className="flex items-start justify-between">
                    <span
                      aria-hidden="true"
                      className="font-heading text-6xl leading-none"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-sun"
                    >
                      <Icon size={24} />
                    </span>
                  </div>
                  <h3 className="mt-4 text-2xl">{title}</h3>
                  <p className="mt-2">{text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <QrDialog open={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </MotionConfig>
  )
}

export default Home