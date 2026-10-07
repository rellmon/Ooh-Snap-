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
  'inline-flex items-center justify-center gap-2 border-2 border-ink font-condensed font-extrabold uppercase tracking-wide shadow-hard transition-[translate,box-shadow] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'

const variantStyles: Record<Variant, string> = {
  primary: 'bg-sun text-ink',
  secondary: 'bg-paper text-ink hover:bg-white',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1 text-base pointer-coarse:min-h-11',
  md: 'px-5 py-2.5 text-lg',
  lg: 'px-7 py-3.5 text-2xl',
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