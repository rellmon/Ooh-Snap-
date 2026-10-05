// Draws the current video frame onto a canvas and returns it as an image URL.
export function capturePhoto(video: HTMLVideoElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const width = video.videoWidth
    const height = video.videoHeight

    if (!width || !height) {
      reject(new Error('The camera is not ready yet.'))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      reject(new Error('Canvas is not supported.'))
      return
    }

    // Mirror the image so the saved photo matches the mirrored preview.
    context.translate(width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, width, height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Could not create the image.'))
          return
        }
        resolve(URL.createObjectURL(blob))
      },
      'image/jpeg',
      0.92,
    )
  })
}