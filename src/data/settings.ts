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