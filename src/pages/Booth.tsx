import { ArrowLeft, Camera } from 'lucide-react'
import Button from '../components/ui/Button'
import { useCamera } from '../hooks/useCamera'

function Booth() {
  const { videoRef, status, error, start } = useCamera()

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
      </section>
    </div>
  )
}

export default Booth