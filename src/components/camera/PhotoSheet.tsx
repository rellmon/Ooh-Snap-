import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { getCaptionFont } from '../../data/caption'
import type { TextCaption } from '../../types/caption'
import type { PhotoFrame } from '../../types/frame'
import type { PhotoLayout } from '../../types/layout'
import type { PlacedSticker } from '../../types/sticker'
import {
  CORNER_RADIUS,
  EMOJI_FONT_FAMILY,
  FOOTER_FONT_SIZE,
  FOOTER_HEIGHT,
  getCellRect,
  getSheetMaxWidth,
  getSheetSize,
  PLACEHOLDER_COLOR,
} from '../../utils/sheetMetrics'

type PhotoSheetProps = {
  layout: PhotoLayout
  photos: string[]
  filterCss: string
  frame: PhotoFrame
  caption: TextCaption
  stickers: PlacedSticker[]
  // The editing props are optional: without them the sheet is view-only.
  onMoveCaption?: (x: number, y: number) => void
  selectedUid?: string | null
  onSelectSticker?: (uid: string) => void
  onMoveSticker?: (uid: string, x: number, y: number) => void
}

type DragState = {
  // Which thing is being dragged: a sticker's uid, or CAPTION_ID.
  id: string
  // Distance between the pointer and the item's center when the drag began.
  offsetX: number
  offsetY: number
}

type MoveHandler = (x: number, y: number) => void

const CAPTION_ID = 'caption'

const doNothing = () => {}

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
  caption,
  stickers,
  onMoveCaption = doNothing,
  selectedUid = null,
  onSelectSticker = doNothing,
  onMoveSticker = doNothing,
}: PhotoSheetProps) {
  const sheet = getSheetSize(layout)
  const sheetRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const captionFont = getCaptionFont(caption.fontId)

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

  // The drag helpers below work for any item, so stickers and the caption share them.
  function startDrag(
    event: PointerEvent<HTMLButtonElement>,
    id: string,
    x: number,
    y: number,
  ) {
    const pointer = getPointerFraction(event)
    if (!pointer) return

    // Keep receiving move events even if the pointer leaves the item.
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id,
      offsetX: x - pointer.x,
      offsetY: y - pointer.y,
    }
  }

  function continueDrag(
    event: PointerEvent<HTMLButtonElement>,
    id: string,
    onMove: MoveHandler,
  ) {
    const drag = dragRef.current
    const pointer = getPointerFraction(event)
    if (!drag || drag.id !== id || !pointer) return

    onMove(
      clamp01(pointer.x + drag.offsetX),
      clamp01(pointer.y + drag.offsetY),
    )
  }

  function endDrag() {
    dragRef.current = null
  }

  function nudge(
    event: KeyboardEvent<HTMLButtonElement>,
    x: number,
    y: number,
    onMove: MoveHandler,
  ) {
    const direction = ARROW_MOVES[event.key]
    if (!direction) return

    event.preventDefault()
    const step = event.shiftKey ? 0.05 : 0.01
    onMove(
      clamp01(x + direction[0] * step),
      clamp01(y + direction[1] * step),
    )
  }

  return (
    <div
      className="@container mx-auto w-full"
      style={{ maxWidth: getSheetMaxWidth(layout) }}
    >
      {/* An outline, not a border: a border would shrink the inside slightly
          and break the exact proportions the canvas copy relies on. */}
      <div
        ref={sheetRef}
        className="relative w-full overflow-hidden shadow-hard-lg outline-2 outline-ink"
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
              className="absolute overflow-hidden"
              style={{
                left: percentX(cell.x),
                top: percentY(cell.y),
                width: percentX(cell.width),
                height: percentY(cell.height),
                borderRadius: scaled(CORNER_RADIUS),
                backgroundColor: PLACEHOLDER_COLOR,
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
                  className="flex h-full items-center justify-center font-bold text-ink/30"
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

        {caption.content.trim() !== '' && (
          <button
            type="button"
            aria-label={`Caption: ${caption.content}. Drag it, or use the arrow keys, to move it.`}
            onPointerDown={(event) =>
              startDrag(event, CAPTION_ID, caption.x, caption.y)
            }
            onPointerMove={(event) =>
              continueDrag(event, CAPTION_ID, onMoveCaption)
            }
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={(event) =>
              nudge(event, caption.x, caption.y, onMoveCaption)
            }
            className="absolute cursor-grab select-none whitespace-nowrap px-[0.25em] leading-none hover:handle-ring focus-visible:handle-ring active:cursor-grabbing"
            style={{
              left: `${caption.x * 100}%`,
              top: `${caption.y * 100}%`,
              transform: `translate(-50%, -50%) rotate(${caption.rotation}deg)`,
              fontSize: `${caption.size * 100}cqw`,
              fontFamily: captionFont.family,
              fontWeight: captionFont.weight,
              color: caption.color,
              touchAction: 'none',
            }}
          >
            {caption.content}
          </button>
        )}

        {stickers.map((sticker, index) => {
          const isSelected = sticker.uid === selectedUid
          return (
            <button
              key={sticker.uid}
              type="button"
              aria-label={`Sticker ${index + 1}${isSelected ? ', selected' : ''}. Drag it, or use the arrow keys, to move it.`}
              onPointerDown={(event) => {
                onSelectSticker(sticker.uid)
                startDrag(event, sticker.uid, sticker.x, sticker.y)
              }}
              onPointerMove={(event) =>
                continueDrag(event, sticker.uid, (x, y) =>
                  onMoveSticker(sticker.uid, x, y),
                )
              }
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onFocus={() => onSelectSticker(sticker.uid)}
              onKeyDown={(event) =>
                nudge(event, sticker.x, sticker.y, (x, y) =>
                  onMoveSticker(sticker.uid, x, y),
                )
              }
              className={`absolute cursor-grab select-none leading-none hover:handle-ring focus-visible:handle-ring active:cursor-grabbing ${
                isSelected ? 'handle-ring' : ''
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