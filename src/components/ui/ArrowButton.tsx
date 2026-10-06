import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ArrowButtonProps = {
  to: string
  children: ReactNode
  className?: string
}

// The big call-to-action: a yellow block with a black arrow square on the right.
function ArrowButton({ to, children, className = '' }: ArrowButtonProps) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-stretch border-2 border-ink bg-sun shadow-hard transition-[translate,box-shadow] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink ${className}`}
    >
      <span className="flex items-center px-6 py-3 font-condensed text-3xl font-extrabold uppercase tracking-wide sm:px-8">
        {children}
      </span>
      <span className="flex items-center border-l-2 border-ink bg-ink px-4 text-white transition-colors group-hover:text-sun">
        <ArrowRight size={28} strokeWidth={3} aria-hidden="true" />
      </span>
    </Link>
  )
}

export default ArrowButton