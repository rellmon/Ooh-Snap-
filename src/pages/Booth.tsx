import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera, CameraOff, RotateCcw, Timer } from 'lucide-react'
import Countdown from '../components/camera/Countdown'
import Button from '../components/ui/Button'
import { useCamera } from '../hooks/useCamera'
import { useCountdown } from '../hooks/useCountdown'
import { capturePhoto } from '../utils/capturePhoto'

// Later, the selected layout will decide this number.
const TOTAL_PHOTOS = 4
const PAUSE_BETWEEN_PHOTOS_MS = 1000

function Booth() {
  const { videoRef, status, error, start, stop } = useCamera()
  const [photos, setPhotos] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [captureError, setCaptureError] = useState<string | null>(null)

  const isComplete = photos.length >= TOTAL_PHOTOS
  const isSessionActive = isRunning && !isComplete

  const handleSnap = useCallback(async () => {
    if (!videoRef.current) return

    try {
      const url = await capturePhoto(videoRef.current)
      setPhotos((current) => [...current, url])
    } catch {
      setCaptureError("We couldn't take that photo. Please try again.")
      setIsRunning(false)
    }
  }, [videoRef])

  const { count, start: startCountdown, cancel } = useCountdown(3, handleSnap)

  // While a session is running, wait a moment and start the next countdown.
  useEffect(() => {
    if (!isSessionActive || count !== null) return

    const timer = setTimeout(startCountdown, PAUSE_BETWEEN_PHOTOS_MS)
    return () => clearTimeout(timer)
  }, [isSessionActive, count, startCountdown])

  // Keep a copy of the latest photos so we can free their memory on exit.
  const photosRef = useRef<string[]>([])
  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  useEffect(() => {
    return () => photosRef.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function handleStart() {
    setCaptureError(null)
    setIsRunning(true)
    startCountdown()
  }

  function handleCancel() {
    cancel()
    setIsRunning(false)
  }

  function handleStartOver() {
    cancel()
    photos.forEach((url) => URL.revokeObjectURL(url))
    setPhotos([])
    setCaptureError(null)
    setIsRunning(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <div className="py-4">
        <Button to="/" variant="secondary">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Button>
      </div>

      <h1 className="text-center text-4xl font-bold text-brand-600">
        The Booth
      </h1>

      <section
        aria-label="Camera stage"
        className="relative mt-6 aspect-video overflow-hidden rounded-3xl bg-slate-900 shadow-xl"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full -scale-x-100 object-cover"
        />

        {status !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-slate-200">
            <Camera size={48} aria-hidden="true" />

            {status === 'idle' && (
              <>
                <p>Ready when you are. Let's turn on the camera.</p>
                <Button onClick={start}>Turn on camera</Button>
              </>
            )}

            {status === 'requesting' && (
              <>
                <p>Waiting for your permission...</p>
                <Button disabled>Turn on camera</Button>
              </>
            )}

            {status === 'error' && error && (
              <>
                <p role="alert" className="max-w-md">
                  {error.message}
                </p>
                {error.kind !== 'unsupported' && (
                  <Button onClick={start}>Try again</Button>
                )}
              </>
            )}
          </div>
        )}

        <Countdown count={count} />
      </section>

      {status === 'active' && (
        <div className="mt-6 text-center">
          <p aria-live="polite" className="mb-4 text-lg font-semibold">
            {isComplete
              ? `All ${TOTAL_PHOTOS} photos taken!`
              : isSessionActive
                ? `Photo ${photos.length + 1} of ${TOTAL_PHOTOS}`
                : `${photos.length} of ${TOTAL_PHOTOS} photos taken`}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {isSessionActive ? (
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            ) : (
              <>
                {!isComplete && (
                  <Button size="lg" onClick={handleStart}>
                    <Timer size={20} aria-hidden="true" />
                    {photos.length === 0 ? 'Start session' : 'Continue'}
                  </Button>
                )}
                {photos.length > 0 && (
                  <Button
                    variant={isComplete ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={handleStartOver}
                  >
                    <RotateCcw size={18} aria-hidden="true" />
                    Start over
                  </Button>
                )}
                <Button variant="secondary" size="lg" onClick={stop}>
                  <CameraOff size={18} aria-hidden="true" />
                  Turn off camera
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {captureError && (
        <p role="alert" className="mt-4 text-center text-red-600">
          {captureError}
        </p>
      )}

      <section aria-labelledby="your-shots" className="mt-10">
        <h2 id="your-shots" className="text-center text-2xl font-bold">
          Your shots
        </h2>
        <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: TOTAL_PHOTOS }, (_, index) => {
            const photo = photos[index]
            return (
              <li
                key={index}
                className="aspect-video overflow-hidden rounded-xl bg-white ring-1 ring-black/5"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center border-2 border-dashed border-brand-200 text-xl font-bold text-brand-300">
                    {index + 1}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}

export default Booth