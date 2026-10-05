import { Camera, RotateCcw } from 'lucide-react'
import Button from '../components/ui/Button'
import { useSession } from '../hooks/useSession'

function Review() {
  const { photos, clearPhotos } = useSession()

  if (photos.length === 0) {
    return (
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <Camera size={48} className="text-brand-300" aria-hidden="true" />
        <h1 className="mt-4 text-3xl font-bold">No photos yet</h1>
        <p className="mt-2 text-slate-600">
          Head to the booth and strike a pose first.
        </p>
        <Button to="/booth" className="mt-8">
          Go to the booth
        </Button>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <h1 className="pt-6 text-center text-4xl font-bold text-brand-600">
        How did we do?
      </h1>
      <p className="mt-2 text-center text-slate-600">
        Check your shots. Not happy with one? Go back and retake it.
      </p>

      <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {photos.map((photo, index) => (
          <li
            key={photo}
            className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="aspect-video w-full object-cover"
            />
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/booth" size="lg">
          <Camera size={20} aria-hidden="true" />
          Back to the booth
        </Button>
        <Button variant="secondary" size="lg" onClick={clearPhotos}>
          <RotateCcw size={18} aria-hidden="true" />
          Start over
        </Button>
      </div>
    </div>
  )
}

export default Review