import { Trash2 } from 'lucide-react'
import { MAX_STICKER_SIZE, MIN_STICKER_SIZE } from '../../data/stickers'
import Button from '../ui/Button'
import Card from '../ui/Card'
import type { PlacedSticker, StickerOption } from '../../types/sticker'

type StickerPickerProps = {
  options: StickerOption[]
  placed: PlacedSticker[]
  selected: PlacedSticker | null
  onAdd: (emoji: string) => void
  onSelect: (uid: string) => void
  onResize: (uid: string, size: number) => void
  onRemove: (uid: string) => void
  onClear: () => void
}

function StickerPicker({
  options,
  placed,
  selected,
  onAdd,
  onSelect,
  onResize,
  onRemove,
  onClear,
}: StickerPickerProps) {
  return (
    <Card className="mx-auto max-w-md space-y-4">
      <div>
        <h2 className="text-center text-lg font-bold">Stickers</h2>
        <div
          role="group"
          aria-label="Add a sticker"
          className="mt-3 flex flex-wrap justify-center gap-2"
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={`Add ${option.name} sticker`}
              onClick={() => onAdd(option.emoji)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl ring-1 ring-brand-200 transition hover:-translate-y-0.5 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            >
              <span aria-hidden="true">{option.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {placed.length > 0 && (
        <div>
          <p className="text-center text-sm font-semibold text-slate-600">
            On your sheet (tap one to select it)
          </p>
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {placed.map((sticker, index) => {
              const isSelected = sticker.uid === selected?.uid
              return (
                <li key={sticker.uid}>
                  <button
                    type="button"
                    aria-label={`Select sticker ${index + 1}`}
                    aria-pressed={isSelected}
                    onClick={() => onSelect(sticker.uid)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      isSelected
                        ? 'bg-brand-100 ring-2 ring-brand-600'
                        : 'bg-white ring-1 ring-brand-200 hover:bg-brand-50'
                    }`}
                  >
                    <span aria-hidden="true">{sticker.emoji}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {selected && (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="sticker-size" className="font-semibold">
              Size of selected sticker
            </label>
            <span className="text-sm text-slate-600">
              {Math.round(selected.size * 100)}%
            </span>
          </div>
          <input
            id="sticker-size"
            type="range"
            min={Math.round(MIN_STICKER_SIZE * 100)}
            max={Math.round(MAX_STICKER_SIZE * 100)}
            step={1}
            value={Math.round(selected.size * 100)}
            onChange={(event) =>
              onResize(selected.uid, Number(event.target.value) / 100)
            }
            className="mt-2 w-full accent-brand-600"
          />
          <div className="mt-3 flex justify-center">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onRemove(selected.uid)}
            >
              <Trash2 size={14} aria-hidden="true" />
              Remove this sticker
            </Button>
          </div>
        </div>
      )}

      {placed.length > 0 && (
        <div className="flex justify-center">
          <Button size="sm" variant="secondary" onClick={onClear}>
            Remove all
          </Button>
        </div>
      )}
    </Card>
  )
}

export default StickerPicker