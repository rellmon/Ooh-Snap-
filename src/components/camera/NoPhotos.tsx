import { Camera } from 'lucide-react'
import Button from '../ui/Button'

// Shown when someone opens a page that needs photos before taking any.
function NoPhotos() {
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

export default NoPhotos