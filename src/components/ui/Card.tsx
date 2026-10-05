import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>
      {children}
    </div>
  )
}

export default Card