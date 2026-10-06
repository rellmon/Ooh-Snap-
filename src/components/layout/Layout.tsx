import { useEffect, useRef } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { Camera } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  // When the page changes, start at the top and move focus to the new content.
  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b-2 border-ink">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-sun shadow-hard-sm">
              <Camera size={22} aria-hidden="true" />
            </span>
            <span className="font-heading text-3xl uppercase leading-none tracking-wide">
              Ooh Snap!
            </span>
          </Link>

          <div aria-hidden="true" className="hidden items-center gap-3 sm:flex">
            <div className="dots h-10 w-16" />
            <div className="h-8 w-8 border-2 border-ink bg-blaze" />
          </div>
        </div>
      </header>

      <main ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <MotionConfig reducedMotion="user">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </MotionConfig>
      </main>

      <footer className="border-t-2 border-ink">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 px-6 py-5">
          <div aria-hidden="true" className="checker h-4 w-16" />
          <p className="border-2 border-ink bg-sun px-3 py-1 font-condensed text-lg font-extrabold uppercase tracking-wide">
            Made for friends, parties, and good memories.
          </p>
        </div>
        <div
          aria-hidden="true"
          className="hazard-stripe h-4 w-full border-t-2 border-ink"
        />
      </footer>
    </div>
  )
}

export default Layout