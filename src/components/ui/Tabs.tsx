import type { KeyboardEvent, ReactNode } from 'react'

export type TabItem<Id extends string> = {
  id: Id
  label: string
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
      {/* The padding leaves room for the shadows, which the scroll area would clip. */}
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex gap-3 overflow-x-auto p-2 pb-3"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId
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
              className={`shrink-0 border-2 border-ink px-4 py-2 font-condensed text-lg font-extrabold uppercase tracking-wide transition-[translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                isActive
                  ? 'bg-sun shadow-hard'
                  : 'bg-paper hover:-translate-y-0.5 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${activeId}`}
        aria-labelledby={`tab-${activeId}`}
        tabIndex={0}
        className="mt-4 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        {children}
      </div>
    </div>
  )
}

export default Tabs