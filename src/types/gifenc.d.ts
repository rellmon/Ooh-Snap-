declare module 'gifenc' {
  export type GifPalette = number[][]
  type PixelFormat = 'rgb565' | 'rgb444' | 'rgba4444'

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    options?: { format?: PixelFormat },
  ): GifPalette

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: GifPalette,
    format?: PixelFormat,
  ): Uint8Array

  export function GIFEncoder(options?: {
    auto?: boolean
    initialCapacity?: number
  }): {
    writeFrame(
      index: Uint8Array,
      width: number,
      height: number,
      options?: { palette?: GifPalette; delay?: number; repeat?: number },
    ): void
    finish(): void
    bytes(): Uint8Array
  }
}