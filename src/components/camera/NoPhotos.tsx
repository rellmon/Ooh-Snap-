import { Camera } from 'lucide-react'
import Button from '../ui/Button'

// Shown when someone opens a page that needs photos before taking any.
function NoPhotos() {
  return (
    <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <span
        aria-hidden="true"
        className="flex h-20 w-20 items-center justify-center border-2 border-ink bg-sun shadow-hard"
      >
        <Camera size={40} />
      </span>
      <h1 className="mt-8 text-6xl leading-none">No photos yet</h1>
      <p className="mt-4 text-lg">Head to the booth and strike a pose first.</p>
      <Button to="/booth" size="lg" className="mt-8">
        Go to the booth
      </Button>
    </section>
  )
}

export default NoPhotos