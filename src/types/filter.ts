export type FilterId = 'original' | 'grayscale'

export type PhotoFilter = {
  id: FilterId
  name: string
  // A CSS filter string. It works in CSS and on a canvas.
  css: string
}