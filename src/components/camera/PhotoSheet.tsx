import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
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
  selectedUid: string | null
  onSelectSticker: (uid: string) => void
  onMoveSticker: (uid: string, x: number, y: number) => void
}

type DragState = {
  uid: string
  // Distance between the pointer and the sticker's center when the drag began.
  offsetX: number
  offsetY: number
}

// Keeps a position inside the sheet (0 to 1).
function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

const ARROW_MOVES: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
}

// A scaled-down replica of the canvas sheet, built from the same measurements.
function PhotoSheet({
  layout,
  photos,
  filterCss,
  frame,
  stickers,
  selectedUid,
  onSelectSticker,
  onMoveSticker,
}: PhotoSheetProps) {
  const sheet = getSheetSize(layout)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)

  // Canvas pixels -> percentages of the sheet (for positions and sizes).
  const percentX = (value: number) => `${(value / sheet.width) * 100}%`
  const percentY = (value: number) => `${(value / sheet.height) * 100}%`
  // Canvas pixels -> units of the sheet's width (for radius and text size).
  const scaled = (value: number) => `${(value / sheet.width) * 100}cqw`

  // Where the pointer is on the sheet, as fractions from 0 to 1.
  function getPointerFraction(event: PointerEvent) {
    const rect = sheetRef.current?.getBoundingClientRect()
    if (!rect) return null

    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }
  }

  function handlePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    sticker: PlacedSticker,
  ) {
    onSelectSticker(sticker.uid)

    const pointer = getPointerFraction(event)
    if (!pointer) return

    // Keep receiving move events even if the pointer leaves the sticker.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      uid: sticker.uid,
      offsetX: sticker.x - pointer.x,
      offsetY: sticker.y - pointer.y,
    }
  }

  function handlePointerMove(
    event: PointerEvent<HTMLButtonElement>,
    sticker: PlacedSticker,
  ) {
    const drag = dragRef.current
    const pointer = getPointerFraction(event)
    if (!drag || drag.uid !== sticker.uid || !pointer) return

    onMoveSticker(
      sticker.uid,
      clamp01(pointer.x + drag.offsetX),
      clamp01(pointer.y + drag.offsetY),
    )
  }

  function handlePointerEnd() {
    dragRef.current = null
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    sticker: PlacedSticker,
  ) {
    const direction = ARROW_MOVES[event.key]
    if (!direction) return

    event.preventDefault()
    const step = event.shiftKey ? 0.05 : 0.01
    onMoveSticker(
      sticker.uid,
      clamp01(sticker.x + direction[0] * step),
      clamp01(sticker.y + direction[1] * step),
    )
  }

  return (
    <div
      className="@container mx-auto w-full"
      style={{ maxWidth: `${layout.columns * 14}rem` }}
    >
      <div
        ref={sheetRef}
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

        {stickers.map((sticker, index) => {
          const isSelected = sticker.uid === selectedUid
          return (
            <button
              key={sticker.uid}
              type="button"
              aria-label={`Sticker ${index + 1}${isSelected ? ', selected' : ''}. Drag it, or use the arrow keys, to move it.`}
              onPointerDown={(event) => handlePointerDown(event, sticker)}
              onPointerMove={(event) => handlePointerMove(event, sticker)}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onFocus={() => onSelectSticker(sticker.uid)}
              onKeyDown={(event) => handleKeyDown(event, sticker)}
              className={`absolute cursor-grab select-none rounded-lg leading-none focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-brand-600 active:cursor-grabbing ${
                isSelected ? 'ring-2 ring-brand-600' : ''
              }`}
              style={{
                left: `${sticker.x * 100}%`,
                top: `${sticker.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${sticker.size * 100}cqw`,
                fontFamily: EMOJI_FONT_FAMILY,
                touchAction: 'none',
              }}
            >
              <span aria-hidden="true">{sticker.emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PhotoSheet