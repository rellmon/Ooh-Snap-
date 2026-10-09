import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, Film, Share2 } from 'lucide-react'
import {
  DEFAULT_GIF_SPEED,
  getGifSpeed,
  GIF_SPEED_STORAGE_KEY,
  gifSpeeds,
  isGifSpeedId,
  type GifSpeedId,
} from '../../data/settings'
import { usePersistentState } from '../../hooks/usePersistentState'
import { useToast } from '../../hooks/useToast'
import type { TextCaption } from '../../types/caption'
import type { PhotoFrame } from '../../types/frame'
import type { PlacedSticker } from '../../types/sticker'
import { encodeGif, renderGifFrames, type GifFrame } from '../../utils/createGif'
import { createFilename, downloadUrl } from '../../utils/exportImage'
import { canShareImages, shareImage } from '../../utils/shareImage'
import Button from '../ui/Button'
import Spinner from '../ui/Spinner'

type GifMakerProps = {
  photos: string[]
  filterCss: string
  frame: PhotoFrame
  stickers: PlacedSticker[]
  caption: TextCaption
}

type GifStatus = 'idle' | 'working' | 'ready' | 'error'

type MadeGif = {
  url: string
  file: File
  filename: string
  size: string
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${Math.round(bytes / 1024)} KB`
}

function GifMaker({
  photos,
  filterCss,
  frame,
  stickers,
  caption,
}: GifMakerProps) {
  const [status, setStatus] = useState<GifStatus>('idle')
  // The slow part's result, kept so a speed change doesn't need to redo it.
  const [frames, setFrames] = useState<GifFrame[] | null>(null)
  const [gif, setGif] = useState<MadeGif | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [speedId, setSpeedId] = usePersistentState(
    GIF_SPEED_STORAGE_KEY,
    DEFAULT_GIF_SPEED,
    isGifSpeedId,
  )
  const [canShare] = useState(() => canShareImages('image/gif'))
  const { showToast } = useToast()
  const requestIdRef = useRef(0)

  // Makes a GIF that is still being built get thrown away when it finishes.
  const cancelPending = useCallback(() => {
    requestIdRef.current += 1
  }, [])

  useEffect(() => cancelPending, [cancelPending])

  // Free the GIF's memory when it is replaced or the page closes.
  useEffect(() => {
    if (!gif) return
    return () => URL.revokeObjectURL(gif.url)
  }, [gif])

  // The quick part: write the frames into a GIF at the given speed.
  function buildGif(frameList: GifFrame[], delayMs: number) {
    const blob = encodeGif(frameList, delayMs)
    const filename = createFilename('gif')

    setGif({
      url: URL.createObjectURL(blob),
      file: new File([blob], filename, { type: 'image/gif' }),
      filename,
      size: formatSize(blob.size),
    })
  }

  async function handleMake() {
    cancelPending()
    const requestId = requestIdRef.current
    setActionError(null)
    setStatus('working')

    try {
      const rendered = await renderGifFrames({
        photos,
        filterCss,
        frame,
        stickers,
        caption,
      })

      // The person left the page while we were working.
      if (requestId !== requestIdRef.current) return

      setFrames(rendered)
      buildGif(rendered, getGifSpeed(speedId).delayMs)
      setStatus('ready')
    } catch {
      if (requestId !== requestIdRef.current) return
      setStatus('error')
    }
  }

  function handleSpeedChange(id: GifSpeedId) {
    setSpeedId(id)
    if (frames) buildGif(frames, getGifSpeed(id).delayMs)
  }

  function handleDownload() {
    if (!gif) return
    downloadUrl(gif.url, gif.filename)
    showToast(`Download started: ${gif.filename}`, 'success')
  }

  async function handleShare() {
    if (!gif) return
    setActionError(null)

    try {
      const result = await shareImage(gif.file)
      if (result === 'shared') showToast('Shared!', 'success')
    } catch {
      setActionError(
        "We couldn't open the share menu. You can still download your GIF.",
      )
    }
  }

  return (
    <section aria-labelledby="gif-title" className="mt-16">
      <div className="flex items-center gap-4">
        <h2 id="gif-title" className="text-4xl">
          Make it move
        </h2>
        <div aria-hidden="true" className="checker h-4 flex-1" />
      </div>
      <p className="mt-4">Turn your photos into a looping GIF.</p>

      <div className="mt-6 flex flex-col items-center gap-5">
        {status === 'ready' && gif && (
          <img
            src={gif.url}
            alt="Your animated GIF, which cycles through your photos"
            className="w-full max-w-xs border-2 border-ink shadow-hard-lg"
          />
        )}

        <div
          aria-live="polite"
          className="flex flex-col items-center gap-3 empty:hidden"
        >
          {status === 'working' && (
            <p className="flex w-fit items-center gap-3 border-2 border-ink bg-sun px-4 py-2 font-condensed text-2xl font-extrabold uppercase tracking-wide shadow-hard">
              <Spinner />
              Making your GIF...
            </p>
          )}
          {status === 'ready' && gif && (
            <p className="font-condensed text-lg font-bold">
              Your GIF is ready ({gif.size})
            </p>
          )}
        </div>

        {status === 'error' && (
          <p
            role="alert"
            className="w-fit border-2 border-ink bg-blaze px-4 py-2 text-center font-condensed text-lg font-extrabold uppercase"
          >
            We couldn't make the GIF. Please try again.
          </p>
        )}

        {status !== 'working' && (
          <div
            role="group"
            aria-label="GIF speed"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span className="field-label mr-1">Speed</span>
            {gifSpeeds.map((speed) => {
              const isSelected = speed.id === speedId
              return (
                <Button
                  key={speed.id}
                  size="sm"
                  variant={isSelected ? 'primary' : 'secondary'}
                  aria-pressed={isSelected}
                  onClick={() => handleSpeedChange(speed.id)}
                >
                  {speed.name}
                </Button>
              )
            })}
          </div>
        )}

        {(status === 'idle' || status === 'error') && (
          <Button size="lg" onClick={handleMake}>
            <Film size={20} aria-hidden="true" />
            {status === 'error' ? 'Try again' : 'Make GIF'}
          </Button>
        )}

        {status === 'ready' && gif && (
          <div className="flex flex-wrap justify-center gap-4">
            {canShare && (
              <Button size="lg" onClick={handleShare}>
                <Share2 size={20} aria-hidden="true" />
                Share
              </Button>
            )}
            <Button
              variant={canShare ? 'secondary' : 'primary'}
              size="lg"
              onClick={handleDownload}
            >
              <Download size={20} aria-hidden="true" />
              Download GIF
            </Button>
          </div>
        )}

        {actionError && (
          <p
            role="alert"
            className="w-fit border-2 border-ink bg-blaze px-4 py-2 text-center font-condensed text-lg font-extrabold uppercase"
          >
            {actionError}
          </p>
        )}
      </div>
    </section>
  )
}

export default GifMaker