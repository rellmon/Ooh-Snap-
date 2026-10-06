import type { CountdownSeconds } from '../../data/settings'
import Button from '../ui/Button'

type CountdownPickerProps = {
  options: readonly CountdownSeconds[]
  selected: CountdownSeconds
  onSelect: (seconds: CountdownSeconds) => void
}

function CountdownPicker({ options, selected, onSelect }: CountdownPickerProps) {
  return (
    <div
      role="group"
      aria-label="Countdown length"
      className="mb-6 flex flex-wrap items-center justify-center gap-3"
    >
      <span className="field-label mr-1">Countdown</span>
      {options.map((seconds) => {
        const isSelected = seconds === selected
        return (
          <Button
            key={seconds}
            size="sm"
            variant={isSelected ? 'primary' : 'secondary'}
            aria-pressed={isSelected}
            aria-label={`${seconds} seconds`}
            onClick={() => onSelect(seconds)}
          >
            {seconds}s
          </Button>
        )
      })}
    </div>
  )
}

export default CountdownPicker