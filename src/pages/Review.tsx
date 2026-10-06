import { ArrowRight, Camera, RotateCcw } from 'lucide-react'
import NoPhotos from '../components/camera/NoPhotos'
import PhotoSheet from '../components/camera/PhotoSheet'
import Button from '../components/ui/Button'
import { DEFAULT_CAPTION } from '../data/caption'
import { defaultFrame } from '../data/frames'
import { useSession } from '../hooks/useSession'

function Review() {
  const { layout, photos, clearPhotos } = useSession()

  if (photos.length === 0) {
    return <NoPhotos />
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <h1 className="pt-6 text-center text-4xl font-bold text-brand-600">
        How did we do?
      </h1>
      <p className="mt-2 text-center text-slate-600">
        Your {layout.name}. Not happy with a shot? Go back to the booth and
        retake it.
      </p>

      <div className="mt-8">
        <PhotoSheet
          layout={layout}
          photos={photos}
          filterCss="none"
          frame={defaultFrame}
          caption={DEFAULT_CAPTION}
          stickers={[]}
        />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/booth" variant="secondary" size="lg">
          <Camera size={20} aria-hidden="true" />
          Back to the booth
        </Button>
        <Button variant="secondary" size="lg" onClick={clearPhotos}>
          <RotateCcw size={18} aria-hidden="true" />
          Start over
        </Button>
        <Button to="/editor" size="lg">
          Edit your photo
          <ArrowRight size={20} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export default Review