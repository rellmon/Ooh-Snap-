import type { PhotoLayout } from '../types/layout'

// All sizes are in canvas pixels. The on-screen preview scales them down.
export const CELL_WIDTH = 800
export const CELL_HEIGHT = 600
export const PADDING = 40
export const GAP = 24
export const FOOTER_HEIGHT = 120
export const CORNER_RADIUS = 20
export const FOOTER_FONT_SIZE = 56

// Used for stickers in both the preview and the canvas, so they match.
export const EMOJI_FONT_FAMILY =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif'

type SheetSize = {
  width: number
  height: number
}

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

// The full size of the finished sheet for a layout.
export function getSheetSize(layout: PhotoLayout): SheetSize {
  const gridWidth = layout.columns * CELL_WIDTH + (layout.columns - 1) * GAP
  const gridHeight = layout.rows * CELL_HEIGHT + (layout.rows - 1) * GAP

  return {
    width: PADDING * 2 + gridWidth,
    height: PADDING + gridHeight + FOOTER_HEIGHT,
  }
}

// Where photo number `index` goes on the sheet.
export function getCellRect(layout: PhotoLayout, index: number): Rect {
  const column = index % layout.columns
  const row = Math.floor(index / layout.columns)

  return {
    x: PADDING + column * (CELL_WIDTH + GAP),
    y: PADDING + row * (CELL_HEIGHT + GAP),
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
  }
}