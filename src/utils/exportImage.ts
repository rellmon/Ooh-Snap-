export type ExportFormat = 'png' | 'jpg'

const MIME_TYPES: Record<ExportFormat, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
}

const JPG_QUALITY = 0.92

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

// Example: ooh-snap-2026-10-06.png (uses the local date, not UTC).
export function createFilename(format: ExportFormat, date = new Date()): string {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return `ooh-snap-${year}-${month}-${day}.${format}`
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Could not create the image.'))
      },
      type,
      quality,
    )
  })
}

// Starts the download and returns the name of the file being saved.
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
): Promise<string> {
  const blob = await canvasToBlob(
    canvas,
    MIME_TYPES[format],
    format === 'jpg' ? JPG_QUALITY : undefined,
  )

  const filename = createFilename(format)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  link.remove()

  // Give the browser a moment to start the download before freeing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return filename
}

// Turns the canvas into a named image file, ready to hand to the share menu.
export async function canvasToFile(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
): Promise<File> {
  const blob = await canvasToBlob(
    canvas,
    MIME_TYPES[format],
    format === 'jpg' ? JPG_QUALITY : undefined,
  )

  return new File([blob], createFilename(format), { type: MIME_TYPES[format] })
}