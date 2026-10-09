// `as const` makes this a fixed list, so TypeScript knows the exact values.
export const countdownOptions = [3, 5, 10] as const

// A union of those values: 3 | 5 | 10.
export type CountdownSeconds = (typeof countdownOptions)[number]

export const DEFAULT_COUNTDOWN_SECONDS: CountdownSeconds = 3

export const COUNTDOWN_STORAGE_KEY = 'ooh-snap:countdown-seconds'

// Anything read from storage is just text someone could have edited, so we check it.
export function isCountdownSeconds(value: unknown): value is CountdownSeconds {
  return countdownOptions.some((option) => option === value)
}

export const SOUND_STORAGE_KEY = 'ooh-snap:shutter-sound'

export const DEFAULT_SOUND_ENABLED: boolean = true

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

// In kiosk mode, a booth nobody touches resets itself.
export const IDLE_TIMEOUT_MS = 90_000
export const IDLE_WARNING_MS = 15_000

// How long each photo shows in the GIF.
export const gifSpeeds = [
  { id: 'fast', name: 'Fast', delayMs: 400 },
  { id: 'normal', name: 'Normal', delayMs: 900 },
  { id: 'slow', name: 'Slow', delayMs: 1500 },
] as const

export type GifSpeedId = (typeof gifSpeeds)[number]['id']

export const DEFAULT_GIF_SPEED: GifSpeedId = 'normal'

export const GIF_SPEED_STORAGE_KEY = 'ooh-snap:gif-speed'

export function isGifSpeedId(value: unknown): value is GifSpeedId {
  return gifSpeeds.some((speed) => speed.id === value)
}

export function getGifSpeed(id: GifSpeedId) {
  return gifSpeeds.find((speed) => speed.id === id) ?? gifSpeeds[1]
}