export type FrameId = 'minimal' | 'noir' | 'party'

export type PhotoFrame = {
  id: FrameId
  name: string
  // Colors work the same in CSS and on a canvas, so both previews match.
  background: string
  textColor: string
}