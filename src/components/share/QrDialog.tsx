import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Button from '../ui/Button'

type QrDialogProps = {
  open: boolean
  onClose: () => void
}

function QrDialog({ open, onClose }: QrDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // The code points at this site's own address.
  const address = window.location.origin
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)

  // Open and close the native dialog to match the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="qr-title"
      // Fires for Esc, the Close button, and anything else that closes the box.
      onClose={onClose}
      // A click on the dimmed area outside the box lands on the dialog itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm border-2 border-ink bg-white p-0 text-ink shadow-hard-lg backdrop:bg-ink/60"
    >
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <h2 id="qr-title" className="text-4xl">
          Scan to open
        </h2>
        <p>Point your phone's camera at the code to open Ooh Snap! on your phone.</p>

        <div className="border-2 border-ink bg-white shadow-hard">
          <QRCodeSVG
            value={address}
            size={256}
            level="M"
            marginSize={4}
            bgColor="#ffffff"
            fgColor="#0b0b0b"
            title="QR code that opens Ooh Snap!"
            className="block h-auto w-full max-w-64"
          />
        </div>

        <p className="break-all font-condensed text-lg font-bold">{address}</p>

        {isLocal && (
          <p className="border-2 border-dashed border-ink px-3 py-2 text-sm">
            This is your computer's own address, so a phone can't open it. Try
            it from the deployed site.
          </p>
        )}

        <Button onClick={onClose}>Close</Button>
      </div>
    </dialog>
  )
}

export default QrDialog