import type { Adjustments } from '../types/adjustments'
import type { PhotoFilter } from '../types/filter'

// Combines the chosen filter and the sliders into one CSS filter string.
// The filter comes first, then the adjustments are applied on top.
export function buildFilterCss(
  filter: PhotoFilter,
  adjustments: Adjustments,
): string {
  const parts: string[] = []

  if (filter.css !== 'none') parts.push(filter.css)
  if (adjustments.brightness !== 100) {
    parts.push(`brightness(${adjustments.brightness}%)`)
  }
  if (adjustments.contrast !== 100) {
    parts.push(`contrast(${adjustments.contrast}%)`)
  }
  if (adjustments.saturation !== 100) {
    parts.push(`saturate(${adjustments.saturation}%)`)
  }

  return parts.length > 0 ? parts.join(' ') : 'none'
}