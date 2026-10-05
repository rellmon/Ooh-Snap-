import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: Variant
  size?: Size
  to?: string
  children: ReactNode
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink-600 disabled:cursor-not-allowed disabled:opacity-50'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 hover:bg-pink-700',
  secondary: 'bg-white text-pink-600 ring-1 ring-pink-200 hover:bg-pink-50',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
}

function Button({
  variant = 'primary',
  size = 'md',
  to,
  children,
  className = '',
  ...buttonProps
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}

export default Button