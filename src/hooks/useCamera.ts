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
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<CameraError | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const start = useCallback(async () => {
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

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStatus('active')
    } catch (err) {
      setError(toCameraError(err))
      setStatus('error')
    }
  }, [])

  // Runs when the page using this hook is closed: turn the camera off.
  useEffect(() => stop, [stop])

  return { videoRef, status, error, start, stop }
}