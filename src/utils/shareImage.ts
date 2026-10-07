// Asks the browser whether it can share image files, using a tiny test file.
export function canShareImages(): boolean {
  if (
    typeof navigator === 'undefined' ||
    typeof navigator.share !== 'function' ||
    typeof navigator.canShare !== 'function'
  ) {
    return false
  }

  try {
    const probe = new File([''], 'probe.jpg', { type: 'image/jpeg' })
    return navigator.canShare({ files: [probe] })
  } catch {
    return false
  }
}

export type ShareResult = 'shared' | 'cancelled'

// Opens the device's share menu with the image attached.
export async function shareImage(file: File): Promise<ShareResult> {
  try {
    await navigator.share({
      files: [file],
      title: 'Ooh Snap!',
      text: 'Made at the Ooh Snap! booth',
    })
    return 'shared'
  } catch (error) {
    // Closing the share menu without choosing anything is not a failure.
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'cancelled'
    }
    throw error
  }
}