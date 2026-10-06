import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CameraOff,
  RotateCcw,
  SwitchCamera,
  Timer,
} from 'lucide-react'
import Countdown from '../components/camera/Countdown'
import CountdownPicker from '../components/camera/CountdownPicker'
import Button from '../components/ui/Button'
import { useCamera } from '../hooks/useCamera'
import { useCountdown } from '../hooks/useCountdown'
import { usePersistentState } from '../hooks/usePersistentState'
import { useSession } from '../hooks/useSession'
import {
  COUNTDOWN_STORAGE_KEY,
  countdownOptions,
  DEFAULT_COUNTDOWN_SECONDS,
  isCountdownSeconds,
} from '../data/settings'
import { capturePhoto } from '../utils/capturePhoto'

const PAUSE_BETWEEN_PHOTOS_MS = 1000

function Booth() {
  const {
    videoRef,
    status,
    error,
    facingMode,
    canSwitch,
    start,
    stop,
    switchCamera,
  } = useCamera()
  const { layout, photos, addPhoto, replacePhoto, clearPhotos } = useSession()
  const totalPhotos = layout.photoCount
  const [countdownSeconds, setCountdownSeconds] = usePersistentState(
    COUNTDOWN_STORAGE_KEY,
    DEFAULT_COUNTDOWN_SECONDS,
    isCountdownSeconds,
  )
  const [isRunning, setIsRunning] = useState(false)
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null)
  const [captureError, setCaptureError] = useState<string | null>(null)

  const isComplete = photos.length >= totalPhotos
  const isSessionActive = isRunning && !isComplete
  const isRetaking = retakeIndex !== null
  const isBusy = isSessionActive || isRetaking

  const handleSnap = useCallback(async () => {
    if (!videoRef.current) return

    try {
      const url = await capturePhoto(videoRef.current, facingMode === 'user')

      if (retakeIndex !== null) {
        replacePhoto(retakeIndex, url)
        setRetakeIndex(null)
      } else {
        addPhoto(url)
      }
    } catch {
      setCaptureError("We couldn't take that photo. Please try again.")
      setIsRunning(false)
      setRetakeIndex(null)
    }
  }, [videoRef, facingMode, retakeIndex, addPhoto, replacePhoto])

  const {
    count,
    start: startCountdown,
    cancel,
  } = useCountdown(countdownSeconds, handleSnap)

  // While a session is running, wait a moment and start the next countdown.
  useEffect(() => {
    if (!isSessionActive || count !== null) return

    const timer = setTimeout(startCountdown, PAUSE_BETWEEN_PHOTOS_MS)
    return () => clearTimeout(timer)
  }, [isSessionActive, count, startCountdown])

  function handleStart() {
    setCaptureError(null)
    setIsRunning(true)
    startCountdown()
  }

  function handleRetake(index: number) {
    setCaptureError(null)
    setRetakeIndex(index)
    startCountdown()
  }

  function handleCancel() {
    cancel()
    setIsRunning(false)
    setRetakeIndex(null)
  }

  function handleStartOver() {
    cancel()
    clearPhotos()
    setCaptureError(null)
    setIsRunning(false)
    setRetakeIndex(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-16">
      <div className="py-4">
        <Button to="/templates" variant="secondary">
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Button>
      </div>

      <h1 className="text-center text-4xl font-bold text-brand-600">
        The Booth
      </h1>
      <p className="mt-1 text-center text-slate-600">Layout: {layout.name}</p>

      <section
        aria-label="Camera stage"
        className="relative mt-6 aspect-video overflow-hidden rounded-3xl bg-slate-900 shadow-xl"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
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
                <p>Starting the camera... Allow access if your browser asks.</p>
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
            {isRetaking
              ? `Retaking photo ${retakeIndex + 1}`
              : isComplete
                ? `All ${totalPhotos} photos taken!`
                : isSessionActive
                  ? `Photo ${photos.length + 1} of ${totalPhotos}`
                  : `${photos.length} of ${totalPhotos} photos taken`}
          </p>

          {!isBusy && (
            <CountdownPicker
              options={countdownOptions}
              selected={countdownSeconds}
              onSelect={setCountdownSeconds}
            />
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {isBusy ? (
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
                  <Button variant="secondary" size="lg" onClick={handleStartOver}>
                    <RotateCcw size={18} aria-hidden="true" />
                    Start over
                  </Button>
                )}
                {canSwitch && (
                  <Button variant="secondary" size="lg" onClick={switchCamera}>
                    <SwitchCamera size={18} aria-hidden="true" />
                    {facingMode === 'user' ? 'Use back camera' : 'Use front camera'}
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

      {isComplete && !isBusy && (
        <div className="mt-4 flex justify-center">
          <Button to="/review" size="lg">
            See your photos
            <ArrowRight size={20} aria-hidden="true" />
          </Button>
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
          {Array.from({ length: totalPhotos }, (_, index) => {
            const photo = photos[index]
            return (
              <li
                key={index}
                className="relative aspect-video overflow-hidden rounded-xl bg-white ring-1 ring-black/5"
              >
                {photo ? (
                  <>
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {status === 'active' && !isBusy && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-2 right-2"
                        aria-label={`Retake photo ${index + 1}`}
                        onClick={() => handleRetake(index)}
                      >
                        <RotateCcw size={14} aria-hidden="true" />
                        Retake
                      </Button>
                    )}
                  </>
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