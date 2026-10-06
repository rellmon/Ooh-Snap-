export type AdjustmentKey = 'brightness' | 'contrast' | 'saturation'

// Percent values: 100 means "no change".
export type Adjustments = Record<AdjustmentKey, number>

export type AdjustmentControl = {
  key: AdjustmentKey
  label: string
  min: number
  max: number
}