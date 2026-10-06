import { useEffect, useState } from 'react'
import { composeSheet } from '../../utils/composeSheet'
import type { PhotoLayout } from '../../types/layout'

type ComposedPreviewProps = {
  layout: PhotoLayout
  photos: string[]
}

function ComposedPreview({ layout, photos }: ComposedPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    let isCancelled = false
    let createdUrl: string | null = null

    composeSheet(layout, photos)
      .then(
        (canvas) =>
          new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob)
              else reject(new Error('Could not create the image.'))
            }, 'image/png')
          }),
      )
      .then((blob) => {
        if (isCancelled) return
        createdUrl = URL.createObjectURL(blob)
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
    <img
      src={imageUrl}
      alt="Your finished photo sheet"
      className="mx-auto w-full rounded-2xl shadow-xl ring-1 ring-black/5"
      style={{ maxWidth: `${layout.columns * 14}rem` }}
    />
  )
}

export default ComposedPreview