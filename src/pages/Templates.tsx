import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { layouts } from '../data/layouts'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSession } from '../hooks/useSession'
import type { PhotoLayout } from '../types/layout'

// A small drawing of the layout: one numbered box per photo.
function LayoutPreview({ layout }: { layout: PhotoLayout }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid gap-1.5 border-2 border-ink bg-paper p-2 shadow-hard-sm"
      style={{
        width: `${layout.columns * 5}rem`,
        gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
      }}
    >
      {Array.from({ length: layout.photoCount }, (_, index) => (
        <div
          key={index}
          className="flex aspect-[4/3] items-center justify-center border-2 border-ink bg-sun font-heading text-lg leading-none"
        >
          {index + 1}
        </div>
      ))}
    </div>
  )
}

function Templates() {
  usePageTitle('Pick your layout')
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

      <h1 className="text-center text-6xl leading-none sm:text-7xl">
        Pick your layout
      </h1>
      <p className="mt-4 text-center text-lg">
        How do you want your photos to look?
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {layouts.map((layout) => (
          <li key={layout.id}>
            <button
              type="button"
              onClick={() => handleChoose(layout)}
              className="flex h-full w-full flex-col items-center gap-4 border-2 border-ink bg-white p-6 text-center shadow-hard transition-[translate,box-shadow] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <LayoutPreview layout={layout} />
              <span className="font-heading text-3xl uppercase leading-none">
                {layout.name}
              </span>
              <span>{layout.description}</span>
              <span className="border-2 border-ink bg-sun px-2 font-condensed text-lg font-extrabold uppercase">
                {layout.photoCount} photos
              </span>
              <span className="mt-auto inline-flex items-center gap-2 font-condensed text-xl font-extrabold uppercase">
                Choose
                <ArrowRight size={20} strokeWidth={3} aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Templates