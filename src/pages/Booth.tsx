import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Camera, CameraOff, Timer } from 'lucide-react'
import Countdown from '../components/camera/Countdown'
import Button from '../components/ui/Button'
import { useCamera } from '../hooks/useCamera'
import { useCountdown } from '../hooks/useCountdown'
import { capturePhoto } from '../utils/capturePhoto'

function Booth() {
  const { videoRef, status, error, start, stop } = useCamera()
  const [photo, setPhoto] = useState<string | null>(null)
  const [captureError, setCaptureError] = useState<string | null>(null)

  const handleSnap = useCallback(async () => {
    if (!videoRef.current) return

    try {
      const url = await capturePhoto(videoRef.current)
      setPhoto(url)
      setCaptureError(null)
    } catch {
      setCaptureError("We couldn't take that photo. Please try again.")
    }
  }, [videoRef])

  const { count, start: startCountdown, cancel } = useCountdown(3, handleSnap)
  const isCounting = count !== null

  // Free the memory of the previous photo when it is replaced or the page closes.
  useEffect(() => {
    if (!photo) return
    return () => URL.revokeObjectURL(photo)
  }, [photo])

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
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {isCounting ? (
            <Button variant="secondary" onClick={cancel}>
              Cancel
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={startCountdown}>
                <Timer size={20} aria-hidden="true" />
                {photo ? 'Take another' : 'Start countdown'}
              </Button>
              <Button variant="secondary" size="lg" onClick={stop}>
                <CameraOff size={18} aria-hidden="true" />
                Turn off camera
              </Button>
            </>
          )}
        </div>
      )}

      {captureError && (
        <p role="alert" className="mt-4 text-center text-red-600">
          {captureError}
        </p>
      )}

      {photo && (
        <section aria-labelledby="latest-shot" className="mt-10 text-center">
          <h2 id="latest-shot" className="text-2xl font-bold">
            Your shot
          </h2>
          <img
            src={photo}
            alt="The photo you just took"
            className="mx-auto mt-4 w-full max-w-md rounded-2xl shadow-xl ring-1 ring-black/5"
          />
        </section>
      )}
    </div>
  )
}

export default Booth