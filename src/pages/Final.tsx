import { ArrowLeft, Camera } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ComposedPreview from '../components/camera/ComposedPreview'
import NoPhotos from '../components/camera/NoPhotos'
import Button from '../components/ui/Button'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSession } from '../hooks/useSession'
import { buildFilterCss } from '../utils/filterCss'

function Final() {
  usePageTitle('Your photo is ready')
  const {
    layout,
    photos,
    filter,
    adjustments,
    frame,
    stickers,
    caption,
    resetSession,
  } = useSession()
  const navigate = useNavigate()

  if (photos.length === 0) {
    return <NoPhotos />
  }

  const filterCss = buildFilterCss(filter, adjustments)

  function handleNewSession() {
    resetSession()
    navigate('/templates')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <h1 className="pt-6 text-center text-6xl leading-none sm:text-7xl">
        Your photo is ready!
      </h1>
      <p className="mt-4 text-center text-lg">
        Download it and share it with everyone.
      </p>
      <div aria-hidden="true" className="checker mx-auto mb-10 mt-6 h-4 w-32" />

      <ComposedPreview
        layout={layout}
        photos={photos}
        filterCss={filterCss}
        frame={frame}
        stickers={stickers}
        caption={caption}
      />

      <div className="mt-12 flex flex-wrap justify-center gap-4">
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