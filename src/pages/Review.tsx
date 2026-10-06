import { Camera, RotateCcw } from 'lucide-react'
import NoPhotos from '../components/camera/NoPhotos'
import PhotoSheet from '../components/camera/PhotoSheet'
import ArrowButton from '../components/ui/ArrowButton'
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
      <h1 className="pt-6 text-center text-6xl leading-none sm:text-7xl">
        How did we do?
      </h1>
      <p className="mt-4 text-center text-lg">
        Your {layout.name}. Not happy with a shot? Go back to the booth and
        retake it.
      </p>

      <div className="mt-10">
        <PhotoSheet
          layout={layout}
          photos={photos}
          filterCss="none"
          frame={defaultFrame}
          caption={DEFAULT_CAPTION}
          stickers={[]}
        />
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Button to="/booth" variant="secondary" size="lg">
          <Camera size={20} aria-hidden="true" />
          Back to the booth
        </Button>
        <Button variant="secondary" size="lg" onClick={clearPhotos}>
          <RotateCcw size={18} aria-hidden="true" />
          Start over
        </Button>
        <ArrowButton to="/editor">Edit your photo</ArrowButton>
      </div>
    </div>
  )
}

export default Review