import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { composeSheet } from '../../utils/composeSheet'
import {
  canvasToBlob,
  downloadCanvas,
  type ExportFormat,
} from '../../utils/exportImage'
import type { TextCaption } from '../../types/caption'
import type { PhotoFrame } from '../../types/frame'
import type { PhotoLayout } from '../../types/layout'
import type { PlacedSticker } from '../../types/sticker'

type ComposedPreviewProps = {
  layout: PhotoLayout
  photos: string[]
  filterCss: string
  frame: PhotoFrame
  stickers: PlacedSticker[]
  caption: TextCaption
}

function ComposedPreview({
  layout,
  photos,
  filterCss,
  frame,
  stickers,
  caption,
}: ComposedPreviewProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    let isCancelled = false
    let createdUrl: string | null = null

    composeSheet(layout, photos, filterCss, frame, stickers, caption)
      .then(async (composed) => {
        const blob = await canvasToBlob(composed, 'image/png')
        if (isCancelled) return
        createdUrl = URL.createObjectURL(blob)
        setCanvas(composed)
        setImageUrl(createdUrl)
      })
      .catch(() => {
        if (!isCancelled) setHasFailed(true)
      })

    return () => {
      isCancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
    }
  }, [layout, photos, filterCss, frame, stickers, caption])

  async function handleDownload(format: ExportFormat) {
    if (!canvas) return
    setDownloadError(null)

    try {
      const filename = await downloadCanvas(canvas, format)
      showToast(`Download started: ${filename}`, 'success')
    } catch {
      setDownloadError("We couldn't create the download. Please try again.")
    }
  }

  if (hasFailed) {
    return (
      <p
        role="alert"
        className="mx-auto max-w-md border-2 border-ink bg-blaze px-4 py-3 text-center font-condensed text-xl font-extrabold uppercase"
      >
        We couldn't put your photo sheet together. Please go back and try again.
      </p>
    )
  }

  if (!imageUrl) {
    return (
      <p
        aria-live="polite"
        className="mx-auto flex w-fit items-center gap-3 border-2 border-ink bg-sun px-4 py-2 font-condensed text-2xl font-extrabold uppercase tracking-wide shadow-hard"
      >
        <Spinner />
        Developing your photo...
      </p>
    )
  }

  return (
    <>
      <img
        src={imageUrl}
        alt="Your finished photo sheet"
        className="mx-auto w-full border-2 border-ink shadow-hard-lg"
        style={{ maxWidth: `${layout.columns * 14}rem` }}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button size="lg" onClick={() => handleDownload('png')}>
          <Download size={20} aria-hidden="true" />
          Download PNG
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => handleDownload('jpg')}
        >
          <Download size={20} aria-hidden="true" />
          Download JPG
        </Button>
      </div>

      {downloadError && (
        <p
          role="alert"
          className="mx-auto mt-6 w-fit border-2 border-ink bg-blaze px-4 py-2 text-center font-condensed text-lg font-extrabold uppercase"
        >
          {downloadError}
        </p>
      )}
    </>
  )
}

export default ComposedPreview