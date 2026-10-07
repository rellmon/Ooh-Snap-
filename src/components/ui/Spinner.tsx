type SpinnerProps = {
  className?: string
}

// A square with one open side that ticks around. It takes the color of the text around it.
function Spinner({ className = '' }: SpinnerProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-5 w-5 shrink-0 border-[3px] border-current border-t-transparent motion-safe:animate-tick ${className}`}
    />
  )
}

export default Spinner