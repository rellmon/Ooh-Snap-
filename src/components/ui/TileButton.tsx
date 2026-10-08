import type { ReactNode } from 'react'

type TileButtonProps = {
  label: string
  selected: boolean
  onClick: () => void
  // The picture at the top of the tile.
  children: ReactNode
}

// A choice tile: a small preview above a label. The selected tile is yellow and raised.
function TileButton({ label, selected, onClick, children }: TileButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-w-0 flex-col border-2 border-ink text-center transition-[translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
        selected
          ? '-translate-x-0.5 -translate-y-0.5 bg-sun shadow-hard'
          : 'bg-white shadow-hard-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard'
      }`}
    >
      <span
        aria-hidden="true"
        className="block aspect-[4/3] w-full overflow-hidden border-b-2 border-ink bg-paper"
      >
        {children}
      </span>
      <span className="flex flex-1 items-center justify-center px-1 py-1.5 font-condensed text-xs font-extrabold uppercase leading-tight sm:text-sm">
        {label}
      </span>
    </button>
  )
}

export default TileButton