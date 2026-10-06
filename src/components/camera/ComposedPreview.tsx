import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import Button from '../ui/Button'
import { composeSheet } from '../../utils/composeSheet'
import {
  canvasToBlob,
  downloadCanvas,
  type ExportFormat,
} from '../../utils/exportImage'
import type { PhotoLayout } from '../../types/layout'

type ComposedPreviewProps = {
  layout: PhotoLayout
  photos: string[]
}

function ComposedPreview({ layout, photos }: ComposedPreviewProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    let createdUrl: string | null = null

    composeSheet(layout, photos)
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
  }, [layout, photos])

  async function handleDownload(format: ExportFormat) {
    if (!canvas) return
    setDownloadError(null)

    try {
      await downloadCanvas(canvas, format)
    } catch {
      setDownloadError("We couldn't create the download. Please try again.")
    }
  }

  if (hasFailed) {
    return (
      <p role="alert" className="text-center text-red-600">
        We couldn't put your photo sheet together. Please go back and try again.
      </p>
    )
  }

  if (!imageUrl) {
    return (
      <p aria-live="polite" className="text-center text-slate-600">
        Developing your photo...
      </p>
    )
  }

  return (
    <>
      <img
        src={imageUrl}
        alt="Your finished photo sheet"
        className="mx-auto w-full rounded-2xl shadow-xl ring-1 ring-black/5"
        style={{ maxWidth: `${layout.columns * 14}rem` }}
      />

      <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        <p role="alert" className="mt-4 text-center text-red-600">
          {downloadError}
        </p>
      )}
    </>
  )
}

export default ComposedPreview