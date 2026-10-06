import { ArrowLeft, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ComposedPreview from '../components/camera/ComposedPreview'
import NoPhotos from '../components/camera/NoPhotos'
import Button from '../components/ui/Button'
import { useSession } from '../hooks/useSession'
import { buildFilterCss } from '../utils/filterCss'

function Final() {
  const {
    layout,
    photos,
    filter,
    adjustments,
    frame,
    stickers,
    caption,
    clearPhotos,
  } = useSession()
  const navigate = useNavigate()

  if (photos.length === 0) {
    return <NoPhotos />
  }

  const filterCss = buildFilterCss(filter, adjustments)

  function handleNewSession() {
    clearPhotos()
    navigate('/templates')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <h1 className="pt-6 text-center text-4xl font-bold text-brand-600">
        Your photo is ready!
      </h1>
      <p className="mb-8 mt-2 text-center text-slate-600">
        Download it and share it with everyone.
      </p>

      <ComposedPreview
        layout={layout}
        photos={photos}
        filterCss={filterCss}
        frame={frame}
        stickers={stickers}
        caption={caption}
      />

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button to="/editor" variant="secondary" size="lg">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to editing
        </Button>
        <Button variant="secondary" size="lg" onClick={handleNewSession}>
          <Camera size={20} aria-hidden="true" />
          Take new photos
        </Button>
      </div>
    </div>
  )
}

export default Final