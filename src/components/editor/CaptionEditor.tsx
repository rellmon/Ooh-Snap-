import {
  captionColors,
  captionFonts,
  MAX_CAPTION_LENGTH,
  MAX_CAPTION_ROTATION,
  MAX_CAPTION_SIZE,
  MIN_CAPTION_ROTATION,
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
    <Card className="mx-auto max-w-md space-y-5">
      <h2 className="text-center text-2xl">Text</h2>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="caption-text" className="field-label">
            Caption
          </label>
          <span className="field-value">
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
          className="mt-2 w-full border-2 border-ink bg-white px-4 py-2.5 text-lg shadow-hard-sm placeholder:text-ink/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
        />
      </div>

      <div>
        <p className="field-label">Font</p>
        <div
          role="group"
          aria-label="Text font"
          className="mt-2 flex flex-wrap gap-3"
        >
          {captionFonts.map((font) => {
            const isSelected = caption.fontId === font.id
            return (
              <Button
                key={font.id}
                size="sm"
                variant={isSelected ? 'primary' : 'secondary'}
                aria-pressed={isSelected}
                onClick={() => onChange({ fontId: font.id })}
                style={{
                  fontFamily: font.family,
                  fontWeight: font.weight,
                  textTransform: 'none',
                }}
              >
                {font.name}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="field-label">Color</p>
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
                className={`h-10 w-10 border-2 border-ink transition-[translate,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                  isSelected ? '-translate-x-0.5 -translate-y-0.5 shadow-hard' : ''
                }`}
                style={{ backgroundColor: color.value }}
              />
            )
          })}
        </div>
      </div>

      {hasText && (
        <>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="caption-size" className="field-label">
                Size
              </label>
              <span className="field-value">
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
              className="mt-2 w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="caption-tilt" className="field-label">
                Tilt
              </label>
              <span className="field-value">{caption.rotation}°</span>
            </div>
            <input
              id="caption-tilt"
              type="range"
              min={MIN_CAPTION_ROTATION}
              max={MAX_CAPTION_ROTATION}
              step={1}
              value={caption.rotation}
              onChange={(event) =>
                onChange({ rotation: Number(event.target.value) })
              }
              className="mt-2 w-full"
            />
          </div>
        </>
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