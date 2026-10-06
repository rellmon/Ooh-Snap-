import { DEFAULT_ADJUSTMENTS } from '../../data/adjustments'
import type {
  AdjustmentControl,
  AdjustmentKey,
  Adjustments,
} from '../../types/adjustments'
import Button from '../ui/Button'
import Card from '../ui/Card'

type AdjustmentSlidersProps = {
  controls: AdjustmentControl[]
  values: Adjustments
  onChange: (key: AdjustmentKey, value: number) => void
  onReset: () => void
}

function AdjustmentSliders({
  controls,
  values,
  onChange,
  onReset,
}: AdjustmentSlidersProps) {
  const isDefault = controls.every(
    ({ key }) => values[key] === DEFAULT_ADJUSTMENTS[key],
  )

  return (
    <Card className="mx-auto max-w-md space-y-4">
      {controls.map(({ key, label, min, max }) => (
        <div key={key}>
          <div className="flex items-center justify-between">
            <label htmlFor={`adjust-${key}`} className="font-semibold">
              {label}
            </label>
            <span className="text-sm text-slate-600">{values[key]}%</span>
          </div>
          <input
            id={`adjust-${key}`}
            type="range"
            min={min}
            max={max}
            step={1}
            value={values[key]}
            onChange={(event) => onChange(key, Number(event.target.value))}
            className="mt-2 w-full accent-brand-600"
          />
        </div>
      ))}

      <div className="flex justify-center">
        <Button
          size="sm"
          variant="secondary"
          onClick={onReset}
          disabled={isDefault}
        >
          Reset adjustments
        </Button>
      </div>
    </Card>
  )
}

export default AdjustmentSliders