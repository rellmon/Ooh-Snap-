import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { layouts } from '../data/layouts'
import { useSession } from '../hooks/useSession'
import type { PhotoLayout } from '../types/layout'

// A small drawing of the layout: one empty box per photo.
function LayoutPreview({ layout }: { layout: PhotoLayout }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid gap-1.5 rounded-lg bg-white p-2 shadow ring-1 ring-black/10"
      style={{
        width: `${layout.columns * 4.5}rem`,
        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
      }}
    >
      {Array.from({ length: layout.photoCount }, (_, index) => (
        <div key={index} className="aspect-[4/3] rounded bg-brand-200" />
      ))}
    </div>
  )
}

function Templates() {
  const { selectLayout } = useSession()
  const navigate = useNavigate()

  function handleChoose(layout: PhotoLayout) {
    selectLayout(layout.id)
    navigate('/booth')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <div className="py-4">
        <Button to="/" variant="secondary">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Button>
      </div>

      <h1 className="text-center text-4xl font-bold text-brand-600">
        Pick your layout
      </h1>
      <p className="mt-2 text-center text-slate-600">
        How do you want your photos to look?
      </p>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {layouts.map((layout) => (
          <li key={layout.id}>
            <button
              type="button"
              onClick={() => handleChoose(layout)}
              className="flex h-full w-full flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
            >
              <LayoutPreview layout={layout} />
              <span className="font-display text-2xl font-bold">
                {layout.name}
              </span>
              <span className="text-sm text-slate-600">
                {layout.description}
              </span>
              <span className="text-sm font-bold text-brand-600">
                {layout.photoCount} photos
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Templates