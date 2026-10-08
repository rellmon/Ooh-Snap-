import { useEffect, useState } from 'react'
import { Download, Share2 } from 'lucide-react'
import { useToast } from '../../hooks/useToast'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'
import { composeSheet } from '../../utils/composeSheet'
import {
  canvasToBlob,
  canvasToFile,
  downloadCanvas,
  type ExportFormat,
} from '../../utils/exportImage'
import { canShareImages, shareImage } from '../../utils/shareImage'
import { getSheetMaxWidth } from '../../utils/sheetMetrics'
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
  const [shareFile, setShareFile] = useState<File | null>(null)
  const [hasFailed, setHasFailed] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const { showToast } = useToast()
  // Asked once. Passing the function (not calling it) lets React run it only on the first render.
  const [canShare] = useState(canShareImages)

  useEffect(() => {
    let isCancelled = false
    let createdUrl: string | null = null

    composeSheet(layout, photos, filterCss, frame, stickers, caption)
      .then(async (composed) => {
        // The share file is made now, so tapping Share can call the share menu right away.
        const [blob, file] = await Promise.all([
          canvasToBlob(composed, 'image/png'),
          canShare ? canvasToFile(composed, 'jpg') : Promise.resolve(null),
        ])
        if (isCancelled) return
        createdUrl = URL.createObjectURL(blob)
        setCanvas(composed)
        setShareFile(file)
        setImageUrl(createdUrl)
      })
      .catch(() => {
        if (!isCancelled) setHasFailed(true)
      })

    return () => {
      isCancelled = true
      if (createdUrl) URL.revokeObjectURL(createdUrl)
    }
  }, [layout, photos, filterCss, frame, stickers, caption, canShare])

  async function handleDownload(format: ExportFormat) {
    if (!canvas) return
    setActionError(null)

    try {
      const filename = await downloadCanvas(canvas, format)
      showToast(`Download started: ${filename}`, 'success')
    } catch {
      setActionError("We couldn't create the download. Please try again.")
    }
  }

  async function handleShare() {
    if (!shareFile) return
    setActionError(null)

    try {
      const result = await shareImage(shareFile)
      if (result === 'shared') showToast('Shared!', 'success')
    } catch {
      setActionError(
        "We couldn't open the share menu. You can still download your photo.",
      )
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
        style={{ maxWidth: getSheetMaxWidth(layout) }}
      />

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {canShare && shareFile && (
          <Button size="lg" onClick={handleShare}>
            <Share2 size={20} aria-hidden="true" />
            Share
          </Button>
        )}
        <Button
          variant={canShare ? 'secondary' : 'primary'}
          size="lg"
          onClick={() => handleDownload('png')}
        >
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

      {actionError && (
        <p
          role="alert"
          className="mx-auto mt-6 w-fit border-2 border-ink bg-blaze px-4 py-2 text-center font-condensed text-lg font-extrabold uppercase"
        >
          {actionError}
        </p>
      )}
    </>
  )
}

export default ComposedPreview