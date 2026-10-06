import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`border-2 border-ink bg-white p-6 shadow-hard ${className}`}>
      {children}
    </div>
  )
}

export default Card