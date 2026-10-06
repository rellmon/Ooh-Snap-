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
    let nextIndex = currentIndex

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
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="flex gap-2 overflow-x-auto pb-2"
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
              className={`shrink-0 rounded-full px-4 py-2 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                isActive
                  ? 'bg-brand-600 text-white shadow'
                  : 'bg-white text-brand-600 ring-1 ring-brand-200 hover:bg-brand-50'
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
        className="mt-4 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
      >
        {children}
      </div>
    </div>
  )
}

export default Tabs