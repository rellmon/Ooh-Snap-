import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Lightbulb,
  RotateCcw,
  SwitchCamera,
  Timer,
} from 'lucide-react'
import Countdown from '../components/camera/Countdown'
import CaptureFlash from '../components/camera/CaptureFlash'
import CountdownPicker from '../components/camera/CountdownPicker'
import SoundToggle from '../components/camera/SoundToggle'
import ArrowButton from '../components/ui/ArrowButton'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import {
  COUNTDOWN_STORAGE_KEY,
  countdownOptions,
  DEFAULT_COUNTDOWN_SECONDS,
  DEFAULT_SOUND_ENABLED,
  isBoolean,
  isCountdownSeconds,
  SOUND_STORAGE_KEY,
} from '../data/settings'
import { useCamera } from '../hooks/useCamera'
import { useCountdown } from '../hooks/useCountdown'
import { usePersistentState } from '../hooks/usePersistentState'
import { usePageTitle } from '../hooks/usePageTitle'
import { useSession } from '../hooks/useSession'
import { useShutterSound } from '../hooks/useShutterSound'
import { capturePhoto } from '../utils/capturePhoto'

const PAUSE_BETWEEN_PHOTOS_MS = 1000

function Booth() {
  usePageTitle('The booth')
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
  const [soundEnabled, setSoundEnabled] = usePersistentState(
    SOUND_STORAGE_KEY,
    DEFAULT_SOUND_ENABLED,
    isBoolean,
  )
  const { unlock, play: playShutter } = useShutterSound(soundEnabled)
  const [flashKey, setFlashKey] = useState(0)
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
      playShutter()
      setFlashKey((key) => key + 1)

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
  }, [videoRef, facingMode, retakeIndex, addPhoto, replacePhoto, playShutter])

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
    unlock()
    setCaptureError(null)
    setIsRunning(true)
    startCountdown()
  }

  function handleRetake(index: number) {
    unlock()
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

      <h1 className="text-center text-6xl leading-none sm:text-7xl">
        The Booth
      </h1>
      <p className="mt-4 text-center">
        <span className="inline-block border-2 border-ink bg-sun px-3 py-1 font-condensed text-lg font-extrabold uppercase tracking-wide">
          Layout: {layout.name}
        </span>
      </p>

      <section
        aria-label="Camera stage"
        className="relative mt-8 aspect-video overflow-hidden border-2 border-ink bg-ink shadow-hard-lg"
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

        {status === 'active' && (
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 border-2 border-ink bg-blaze px-2 font-condensed text-sm font-extrabold uppercase tracking-wide"
          >
            Live
          </span>
        )}

        {status !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-paper">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 items-center justify-center border-2 border-paper bg-sun text-ink"
            >
              <Camera size={32} />
            </span>

            {status === 'idle' && (
              <>
                <p className="text-lg">
                  Ready when you are. Let's turn on the camera.
                </p>
                <Button onClick={start}>Turn on camera</Button>
              </>
            )}

            {status === 'requesting' && (
              <>
                <p className="inline-flex items-center gap-3 text-lg">
                  <Spinner />
                  Starting the camera... Allow access if your browser asks.
                </p>
                <Button disabled>Turn on camera</Button>
              </>
            )}

            {status === 'error' && error && (
              <>
                <p role="alert" className="max-w-md text-lg">
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
        <CaptureFlash flashKey={flashKey} />
      </section>

      {status === 'idle' && photos.length > 0 && (
        <p className="mx-auto mt-6 flex max-w-xl items-start gap-3 border-2 border-dashed border-ink bg-white px-4 py-3">
          <Lightbulb
            size={22}
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          />
          <span>
            {isComplete
              ? 'Your photos are still here, but reloading the page erases them. Turn the camera back on to retake a shot, or go on to see them.'
              : 'Your photos so far are still here, but reloading the page erases them. Turn the camera back on to keep going.'}
          </span>
        </p>
      )}

      {status === 'active' && (
        <div className="mt-8 text-center">
          <p
            aria-live="polite"
            className="mb-5 font-condensed text-3xl font-extrabold uppercase tracking-wide"
          >
            {isRetaking
              ? `Retaking photo ${retakeIndex + 1}`
              : isComplete
                ? `All ${totalPhotos} photos taken!`
                : isSessionActive
                  ? `Photo ${photos.length + 1} of ${totalPhotos}`
                  : `${photos.length} of ${totalPhotos} photos taken`}
          </p>

          {!isBusy && (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <CountdownPicker
                options={countdownOptions}
                selected={countdownSeconds}
                onSelect={setCountdownSeconds}
              />
              <SoundToggle
                enabled={soundEnabled}
                onToggle={() => {
                  unlock()
                  setSoundEnabled(!soundEnabled)
                }}
              />
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
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
        <div className="mt-8 flex justify-center">
          <ArrowButton to="/review">See your photos</ArrowButton>
        </div>
      )}

      {captureError && (
        <p
          role="alert"
          className="mt-6 border-2 border-ink bg-blaze px-4 py-2 text-center font-condensed text-lg font-extrabold uppercase"
        >
          {captureError}
        </p>
      )}

      <section aria-labelledby="your-shots" className="mt-12">
        <div className="flex items-center gap-4">
          <h2 id="your-shots" className="text-4xl">
            Your shots
          </h2>
          <div aria-hidden="true" className="checker h-4 flex-1" />
        </div>

        <ol className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: totalPhotos }, (_, index) => {
            const photo = photos[index]
            return (
              <li
                key={index}
                className="relative aspect-video overflow-hidden border-2 border-ink bg-white shadow-hard-sm"
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
                  <div className="flex h-full items-center justify-center bg-paper font-heading text-4xl text-ink/30">
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