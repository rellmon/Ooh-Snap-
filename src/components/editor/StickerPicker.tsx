import { Trash2 } from 'lucide-react'
import { MAX_STICKER_SIZE, MIN_STICKER_SIZE } from '../../data/stickers'
import Button from '../ui/Button'
import Card from '../ui/Card'
import type { PlacedSticker, StickerOption } from '../../types/sticker'

type StickerPickerProps = {
  options: StickerOption[]
  placed: PlacedSticker[]
  selected: PlacedSticker | null
  onAdd: (option: StickerOption) => void
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
    <Card className="mx-auto max-w-md space-y-5">
      <div>
        <h2 className="text-center text-2xl">Stickers</h2>
        <div
          role="group"
          aria-label="Add a sticker"
          className="mt-3 flex flex-wrap justify-center gap-3"
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={`Add ${option.name} sticker`}
              onClick={() => onAdd(option)}
              className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-white text-2xl shadow-hard-sm transition-[translate,box-shadow] duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-sun hover:shadow-hard active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <img
                src={option.src}
                alt=""
                draggable={false}
                className="h-8 w-8 object-contain"
              />
            </button>
          ))}
        </div>
      </div>

      {placed.length > 0 && (
        <div>
          <p className="text-center text-sm font-semibold text-ink/70">
            On your sheet (tap one to select it)
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-3">
            {placed.map((sticker, index) => {
              const isSelected = sticker.uid === selected?.uid
              return (
                <li key={sticker.uid}>
                  <button
                    type="button"
                    aria-label={`Select sticker ${index + 1}`}
                    aria-pressed={isSelected}
                    onClick={() => onSelect(sticker.uid)}
                    className={`flex h-12 w-12 items-center justify-center border-2 border-ink text-2xl transition-[translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      isSelected
                        ? 'bg-sun shadow-hard'
                        : 'bg-white hover:bg-paper'
                    }`}
                  >
                    <img
                      src={sticker.src}
                      alt=""
                      draggable={false}
                      className="h-8 w-8 object-contain"
                    />
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
            <label htmlFor="sticker-size" className="field-label">
              Size of selected sticker
            </label>
            <span className="field-value">
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
            className="mt-2 w-full"
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