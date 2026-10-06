import type { AdjustmentControl, Adjustments } from '../types/adjustments'

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
}

export const adjustmentControls: AdjustmentControl[] = [
  { key: 'brightness', label: 'Brightness', min: 50, max: 150 },
  { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200 },
]