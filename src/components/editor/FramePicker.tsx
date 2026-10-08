import type { FrameId, PhotoFrame } from '../../types/frame'
import TileButton from '../ui/TileButton'

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
      className="grid grid-cols-3 gap-3"
    >
      {frames.map((frame) => (
        <TileButton
          key={frame.id}
          label={frame.name}
          selected={frame.id === selectedId}
          onClick={() => onSelect(frame.id)}
        >
          <span
            className="flex h-full w-full items-center justify-center font-heading text-xl leading-none"
            style={{ backgroundColor: frame.background, color: frame.textColor }}
          >
            OOH SNAP!
          </span>
        </TileButton>
      ))}
    </div>
  )
}

export default FramePicker