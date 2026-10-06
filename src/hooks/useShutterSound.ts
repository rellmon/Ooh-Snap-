import { useCallback, useEffect, useRef } from 'react'

// One short, decaying burst of noise, filtered to sound like a mechanical click.
function playClick(context: AudioContext, startAt: number, pitch: number) {
  const length = Math.ceil(context.sampleRate * 0.05)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const samples = buffer.getChannelData(0)

  for (let i = 0; i < length; i++) {
    samples[i] = (Math.random() * 2 - 1) * (1 - i / length)
  }

  const source = context.createBufferSource()
  source.buffer = buffer

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = pitch
  filter.Q.value = 0.8

  const gain = context.createGain()
  gain.gain.value = 0.7

  source.connect(filter).connect(gain).connect(context.destination)
  source.start(startAt)
}

export function useShutterSound(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null)

  // Browsers only allow sound after a tap or click, so call this from a click handler.
  const unlock = useCallback(() => {
    if (typeof AudioContext === 'undefined') return

    try {
      contextRef.current ??= new AudioContext()
      if (contextRef.current.state === 'suspended') {
        contextRef.current.resume().catch(() => {})
      }
    } catch {
      // No sound is better than a broken booth.
    }
  }, [])

  const play = useCallback(() => {
    const context = contextRef.current
    if (!enabled || !context || context.state !== 'running') return

    const now = context.currentTime
    playClick(context, now, 2600)
    playClick(context, now + 0.07, 1500)
  }, [enabled])

  // Release the audio hardware when the page closes.
  useEffect(() => {
    return () => {
      contextRef.current?.close().catch(() => {})
      contextRef.current = null
    }
  }, [])

  return { unlock, play }
}