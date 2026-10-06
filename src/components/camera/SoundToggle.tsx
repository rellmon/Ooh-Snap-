import { Volume2, VolumeX } from 'lucide-react'
import Button from '../ui/Button'

type SoundToggleProps = {
  enabled: boolean
  onToggle: () => void
}

function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <Button
      size="sm"
      variant={enabled ? 'primary' : 'secondary'}
      aria-pressed={enabled}
      onClick={onToggle}
    >
      {enabled ? (
        <Volume2 size={16} aria-hidden="true" />
      ) : (
        <VolumeX size={16} aria-hidden="true" />
      )}
      Shutter sound
    </Button>
  )
}

export default SoundToggle