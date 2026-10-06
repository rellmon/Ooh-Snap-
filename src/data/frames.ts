import type { FrameId, PhotoFrame } from '../types/frame'

export const frames: PhotoFrame[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    background: '#ffffff',
    textColor: '#db2777',
  },
  {
    id: 'noir',
    name: 'Noir',
    background: '#111827',
    textColor: '#f9a8d4',
  },
  {
    id: 'party',
    name: 'Party',
    background: '#fde047',
    textColor: '#be185d',
  },
]

export const defaultFrame: PhotoFrame = frames[0]

export function getFrameById(id: FrameId): PhotoFrame {
  return frames.find((frame) => frame.id === id) ?? defaultFrame
}