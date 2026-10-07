export type ToastTone = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  message: string
  tone: ToastTone
}