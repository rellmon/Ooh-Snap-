export type LayoutId = 'classic-strip' | 'grid-2x2'

export type PhotoLayout = {
  id: LayoutId
  name: string
  description: string
  // How many photos a session needs for this layout.
  photoCount: number
  // How the photos are arranged on the final image.
  columns: number
  rows: number
}