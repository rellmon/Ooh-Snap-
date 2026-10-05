export type CameraErrorKind =
  | 'unsupported'
  | 'permission-denied'
  | 'not-found'
  | 'in-use'
  | 'unknown'

export type CameraError = {
  kind: CameraErrorKind
  message: string
}

const messages: Record<CameraErrorKind, string> = {
  unsupported:
    "This browser can't use the camera. Try a recent version of Chrome, Firefox, Safari, or Edge, and make sure the page is opened over https.",
  'permission-denied':
    'Camera access is blocked. Click the camera or lock icon in your address bar, allow the camera for this site, then try again.',
  'not-found':
    "We couldn't find a camera on this device. Plug one in and try again.",
  'in-use':
    'Your camera seems to be busy. Close any other apps or tabs that might be using it, then try again.',
  unknown:
    "We couldn't access your camera. Please check your browser permissions and try again.",
}

function getKind(error: unknown): CameraErrorKind {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'NotAllowedError':
      case 'SecurityError':
        return 'permission-denied'
      case 'NotFoundError':
        return 'not-found'
      case 'NotReadableError':
      case 'AbortError':
        return 'in-use'
    }
  }
  return 'unknown'
}

export function createCameraError(kind: CameraErrorKind): CameraError {
  return { kind, message: messages[kind] }
}

export function toCameraError(error: unknown): CameraError {
  return createCameraError(getKind(error))
}