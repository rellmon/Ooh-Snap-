import type { LucideIcon } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'

export type TabItem<Id extends string> = {
  id: Id
  label: string
  icon?: LucideIcon
}

type TabsProps<Id extends string> = {
  tabs: TabItem<Id>[]
  activeId: Id
  onChange: (id: Id) => void
  label: string
  children: ReactNode
}

function Tabs<Id extends string>({
  tabs,
  activeId,
  onChange,
  label,
  children,
}: TabsProps<Id>) {
  // Arrow keys, Home and End move between tabs, as people expect from tabs.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeId)
    let nextIndex: number

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    } else {
      return
    }

    event.preventDefault()
    const next = tabs[nextIndex]
    onChange(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <div>
      {/* One toolbar: every tab gets an equal share of the width, so nothing scrolls or clips. */}
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="grid border-2 border-ink bg-white shadow-hard"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={`flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 font-condensed text-xs font-extrabold uppercase transition-colors focus-visible:outline-3 focus-visible:-outline-offset-4 focus-visible:outline-ink sm:text-sm md:text-base md:tracking-wide ${
                index > 0 ? 'border-l-2 border-ink' : ''
              } ${isActive ? 'bg-sun' : 'bg-white hover:bg-paper'}`}
            >
              {Icon && <Icon size={20} aria-hidden="true" />}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
        className="mt-5 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {children}
      </div>
    </div>
  )
}

export default Tabs