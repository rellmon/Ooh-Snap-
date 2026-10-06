import type { PhotoFrame } from '../../types/frame'
import type { PhotoLayout } from '../../types/layout'
import type { PlacedSticker } from '../../types/sticker'
import {
  CORNER_RADIUS,
  EMOJI_FONT_FAMILY,
  FOOTER_FONT_SIZE,
  FOOTER_HEIGHT,
  getCellRect,
  getSheetSize,
} from '../../utils/sheetMetrics'

type PhotoSheetProps = {
  layout: PhotoLayout
  photos: string[]
  filterCss: string
  frame: PhotoFrame
  stickers: PlacedSticker[]
}

// A scaled-down replica of the canvas sheet, built from the same measurements.
function PhotoSheet({
  layout,
  photos,
  filterCss,
  frame,
  stickers,
}: PhotoSheetProps) {
  const sheet = getSheetSize(layout)

  // Canvas pixels -> percentages of the sheet (for positions and sizes).
  const percentX = (value: number) => `${(value / sheet.width) * 100}%`
  const percentY = (value: number) => `${(value / sheet.height) * 100}%`
  // Canvas pixels -> units of the sheet's width (for radius and text size).
  const scaled = (value: number) => `${(value / sheet.width) * 100}cqw`

  return (
    <div
      className="@container mx-auto w-full"
      style={{ maxWidth: `${layout.columns * 14}rem` }}
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5"
        style={{
          aspectRatio: `${sheet.width} / ${sheet.height}`,
          backgroundColor: frame.background,
        }}
      >
        {Array.from({ length: layout.photoCount }, (_, index) => {
          const cell = getCellRect(layout, index)
          const photo = photos[index]

          return (
            <div
              key={index}
              className="absolute overflow-hidden bg-brand-100"
              style={{
                left: percentX(cell.x),
                top: percentY(cell.y),
                width: percentX(cell.width),
                height: percentY(cell.height),
                borderRadius: scaled(CORNER_RADIUS),
              }}
            >
              {photo ? (
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="h-full w-full object-cover"
                  style={{ filter: filterCss }}
                />
              ) : (
                <div
                  className="flex h-full items-center justify-center font-bold text-brand-300"
                  style={{ fontSize: scaled(48) }}
                >
                  {index + 1}
                </div>
              )}
            </div>
          )
        })}

        <p
          className="absolute inset-x-0 bottom-0 flex items-center justify-center font-display font-bold"
          style={{
            height: percentY(FOOTER_HEIGHT),
            fontSize: scaled(FOOTER_FONT_SIZE),
            color: frame.textColor,
          }}
        >
          OOH SNAP!
        </p>

        {stickers.map((sticker) => (
          <span
            key={sticker.uid}
            aria-hidden="true"
            className="pointer-events-none absolute leading-none"
            style={{
              left: `${sticker.x * 100}%`,
              top: `${sticker.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              fontSize: `${sticker.size * 100}cqw`,
              fontFamily: EMOJI_FONT_FAMILY,
            }}
          >
            {sticker.emoji}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PhotoSheet