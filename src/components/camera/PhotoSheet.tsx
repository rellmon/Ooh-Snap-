import type { PhotoLayout } from '../../types/layout'

type PhotoSheetProps = {
  layout: PhotoLayout
  photos: string[]
}

// Arranges photos the way the chosen layout describes.
function PhotoSheet({ layout, photos }: PhotoSheetProps) {
  return (
    <div
      className="mx-auto w-full rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5"
      style={{ maxWidth: `${layout.columns * 14}rem` }}
    >
      <ol
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${layout.columns}, 1fr)` }}
      >
        {Array.from({ length: layout.photoCount }, (_, index) => {
          const photo = photos[index]
          return (
            <li
              key={index}
              className="aspect-[4/3] overflow-hidden rounded-lg bg-brand-100"
            >
              {photo ? (
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xl font-bold text-brand-300">
                  {index + 1}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <p className="mt-3 text-center font-display text-sm font-bold tracking-widest text-brand-600">
        OOH SNAP!
      </p>
    </div>
  )
}

export default PhotoSheet