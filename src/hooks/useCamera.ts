import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createCameraError,
  toCameraError,
  type CameraError,
} from '../utils/cameraErrors'

export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestIdRef = useRef(0)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<CameraError | null>(null)

  // Shuts the camera down. Changes no React state, so it is safe in cleanup.
  const release = useCallback(() => {
    requestIdRef.current += 1
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Turns the camera off on purpose and resets the UI.
  const stop = useCallback(() => {
    release()
    setError(null)
    setStatus('idle')
  }, [release])

  const start = useCallback(async () => {
    release()
    const requestId = requestIdRef.current
    setError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(createCameraError('unsupported'))
      setStatus('error')
      return
    }

    setStatus('requesting')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      // The page was closed, or the camera was stopped, while we waited.
      if (requestId !== requestIdRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStatus('active')
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setError(toCameraError(err))
      setStatus('error')
    }
  }, [release])

  // Runs when the page using this hook is closed: turn the camera off.
  useEffect(() => release, [release])

  return { videoRef, status, error, start, stop }
}