import type { FrameId, PhotoFrame } from '../types/frame'

export const frames: PhotoFrame[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    background: '#ffffff',
    textColor: '#0b0b0b',
  },
  {
    id: 'noir',
    name: 'Noir',
    background: '#0b0b0b',
    textColor: '#ffc20e',
  },
  {
    id: 'party',
    name: 'Party',
    background: '#ffc20e',
    textColor: '#0b0b0b',
  },
]

export const defaultFrame: PhotoFrame = frames[0]

export function getFrameById(id: FrameId): PhotoFrame {
  return frames.find((frame) => frame.id === id) ?? defaultFrame
}