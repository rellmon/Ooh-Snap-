import { useEffect } from 'react'

const APP_NAME = 'Ooh Snap!'

// Sets the browser tab title. With no title, it is just the app name.
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME
  }, [title])
}