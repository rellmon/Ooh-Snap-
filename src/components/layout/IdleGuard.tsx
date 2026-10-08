import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { IDLE_TIMEOUT_MS, IDLE_WARNING_MS } from '../../data/settings'
import { useIdleTimeout } from '../../hooks/useIdleTimeout'
import { useSession } from '../../hooks/useSession'
import { useToast } from '../../hooks/useToast'
import Button from '../ui/Button'

type IdleGuardProps = {
  active: boolean
}

function IdleGuard({ active }: IdleGuardProps) {
  const { resetSession } = useSession()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const { secondsLeft, stayActive } = useIdleTimeout({
    active,
    idleMs: IDLE_TIMEOUT_MS,
    warningMs: IDLE_WARNING_MS,
    onTimeout: () => {
      resetSession()
      navigate('/')
      showToast('Photos cleared. Ready for the next guest!', 'info')
    },
  })

  const isWarning = secondsLeft !== null

  // Open and close the native dialog to match the warning.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isWarning && !dialog.open) {
      dialog.showModal()
    } else if (!isWarning && dialog.open) {
      dialog.close()
    }
  }, [isWarning])

  return (
    <dialog
      ref={dialogRef}
      role="alertdialog"
      aria-labelledby="idle-title"
      aria-describedby="idle-description"
      // The Esc key counts as "I'm still here".
      onCancel={(event) => {
        event.preventDefault()
        stayActive()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md border-2 border-ink bg-white p-6 text-ink shadow-hard-lg backdrop:bg-ink/60"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 id="idle-title" className="text-4xl">
          Still there?
        </h2>
        <p id="idle-description">
          Your photos will be cleared and the booth will start over in about{' '}
          {Math.round(IDLE_WARNING_MS / 1000)} seconds, unless you tap the
          button.
        </p>
        <p
          aria-hidden="true"
          className="border-2 border-ink bg-sun px-6 py-1 font-heading text-6xl leading-none shadow-hard"
        >
          {secondsLeft}
        </p>
        <Button size="lg" onClick={stayActive}>
          I'm still here
        </Button>
      </div>
    </dialog>
  )
}

export default IdleGuard