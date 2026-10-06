import Button from '../ui/Button'
import type { FrameId, PhotoFrame } from '../../types/frame'

type FramePickerProps = {
  frames: PhotoFrame[]
  selectedId: FrameId
  onSelect: (id: FrameId) => void
}

function FramePicker({ frames, selectedId, onSelect }: FramePickerProps) {
  return (
    <div
      role="group"
      aria-label="Photo frames"
      className="flex flex-wrap justify-center gap-3"
    >
      {frames.map((frame) => (
        <Button
          key={frame.id}
          variant={frame.id === selectedId ? 'primary' : 'secondary'}
          aria-pressed={frame.id === selectedId}
          onClick={() => onSelect(frame.id)}
        >
          <span
            aria-hidden="true"
            className="h-4 w-4 border-2 border-ink"
            style={{ backgroundColor: frame.background }}
          />
          {frame.name}
        </Button>
      ))}
    </div>
  )
}

export default FramePicker