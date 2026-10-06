import type { LayoutId, PhotoLayout } from '../types/layout'

export const layouts: PhotoLayout[] = [
  {
    id: 'classic-strip',
    name: 'Classic Strip',
    description: 'Four photos stacked in a tall, old-school strip.',
    photoCount: 4,
    columns: 1,
    rows: 4,
  },
  {
    id: 'grid-2x2',
    name: '2x2 Grid',
    description: 'Four photos in a square, like a mini collage.',
    photoCount: 4,
    columns: 2,
    rows: 2,
  },
]

export const defaultLayout: PhotoLayout = layouts[0]

export function getLayoutById(id: LayoutId): PhotoLayout {
  return layouts.find((layout) => layout.id === id) ?? defaultLayout
}