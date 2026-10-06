import type { FilterId, PhotoFilter } from '../types/filter'

export const filters: PhotoFilter[] = [
  { id: 'original', name: 'Original', css: 'none' },
  { id: 'grayscale', name: 'Grayscale', css: 'grayscale(100%)' },
]

export const defaultFilter: PhotoFilter = filters[0]

export function getFilterById(id: FilterId): PhotoFilter {
  return filters.find((filter) => filter.id === id) ?? defaultFilter
}