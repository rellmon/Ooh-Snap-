import { X } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import type { PlacedSticker, StickerOption } from '../../types/sticker'

type StickerPickerProps = {
  options: StickerOption[]
  placed: PlacedSticker[]
  onAdd: (emoji: string) => void
  onRemove: (uid: string) => void
  onClear: () => void
}

function StickerPicker({
  options,
  placed,
  onAdd,
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
            On your sheet (tap one to remove it)
          </p>
          <ul className="mt-2 flex flex-wrap justify-center gap-2">
            {placed.map((sticker, index) => (
              <li key={sticker.uid}>
                <button
                  type="button"
                  aria-label={`Remove sticker ${index + 1}`}
                  onClick={() => onRemove(sticker.uid)}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl ring-1 ring-brand-200 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                  <span aria-hidden="true">{sticker.emoji}</span>
                  <X
                    size={14}
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 rounded-full bg-brand-600 p-0.5 text-white"
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-center">
            <Button size="sm" variant="secondary" onClick={onClear}>
              Remove all
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default StickerPicker