import {
  captionColors,
  MAX_CAPTION_LENGTH,
  MAX_CAPTION_SIZE,
  MIN_CAPTION_SIZE,
} from '../../data/caption'
import type { TextCaption } from '../../types/caption'
import Button from '../ui/Button'
import Card from '../ui/Card'

type CaptionEditorProps = {
  caption: TextCaption
  onChange: (changes: Partial<TextCaption>) => void
}

function CaptionEditor({ caption, onChange }: CaptionEditorProps) {
  const hasText = caption.content.trim() !== ''

  return (
    <Card className="mx-auto max-w-md space-y-4">
      <h2 className="text-center text-lg font-bold">Text</h2>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="caption-text" className="font-semibold">
            Caption
          </label>
          <span className="text-sm text-slate-600">
            {caption.content.length}/{MAX_CAPTION_LENGTH}
          </span>
        </div>
        <input
          id="caption-text"
          type="text"
          value={caption.content}
          maxLength={MAX_CAPTION_LENGTH}
          placeholder="Say something fun..."
          onChange={(event) => onChange({ content: event.target.value })}
          className="mt-2 w-full rounded-full bg-white px-4 py-2 ring-1 ring-brand-200 focus-visible:outline-2 focus-visible:outline-brand-600"
        />
      </div>

      <div>
        <p className="font-semibold">Color</p>
        <div
          role="group"
          aria-label="Text color"
          className="mt-2 flex flex-wrap gap-3"
        >
          {captionColors.map((color) => {
            const isSelected = caption.color === color.value
            return (
              <button
                key={color.value}
                type="button"
                aria-label={color.name}
                aria-pressed={isSelected}
                onClick={() => onChange({ color: color.value })}
                className={`h-9 w-9 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                  isSelected
                    ? 'ring-2 ring-brand-600 ring-offset-2'
                    : 'ring-1 ring-black/20'
                }`}
                style={{ backgroundColor: color.value }}
              />
            )
          })}
        </div>
      </div>

      {hasText && (
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="caption-size" className="font-semibold">
              Size
            </label>
            <span className="text-sm text-slate-600">
              {Math.round(caption.size * 100)}%
            </span>
          </div>
          <input
            id="caption-size"
            type="range"
            min={Math.round(MIN_CAPTION_SIZE * 100)}
            max={Math.round(MAX_CAPTION_SIZE * 100)}
            step={1}
            value={Math.round(caption.size * 100)}
            onChange={(event) =>
              onChange({ size: Number(event.target.value) / 100 })
            }
            className="mt-2 w-full accent-brand-600"
          />
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onChange({ content: '' })}
          disabled={caption.content === ''}
        >
          Clear text
        </Button>
      </div>
    </Card>
  )
}

export default CaptionEditor