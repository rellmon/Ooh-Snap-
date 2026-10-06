import type { FilterId, PhotoFilter } from '../types/filter'

export const filters: PhotoFilter[] = [
  { id: 'original', name: 'Original', css: 'none' },
  { id: 'grayscale', name: 'Grayscale', css: 'grayscale(100%)' },
  {
    id: 'vintage',
    name: 'Vintage',
    css: 'sepia(45%) contrast(110%) saturate(85%) brightness(98%)',
  },
  {
    id: 'warm',
    name: 'Warm',
    css: 'sepia(30%) saturate(125%) brightness(105%)',
  },
  {
    id: 'cool',
    name: 'Cool',
    css: 'hue-rotate(12deg) saturate(95%) brightness(104%)',
  },
  {
    id: 'bright',
    name: 'Bright',
    css: 'brightness(120%) saturate(110%)',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    css: 'contrast(135%) saturate(110%)',
  },
]

export const defaultFilter: PhotoFilter = filters[0]

export function getFilterById(id: FilterId): PhotoFilter {
  return filters.find((filter) => filter.id === id) ?? defaultFilter
}