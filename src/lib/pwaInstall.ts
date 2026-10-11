import type { BeforeInstallPromptEvent } from '@/types/pwa'

// The browser fires beforeinstallprompt once, often before React mounts,
// so the event is captured at module load and exposed as a small store.
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()

const notify = (): void => listeners.forEach((listener) => listener())

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  notify()
})

export const subscribeInstallPrompt = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getInstallPrompt = (): BeforeInstallPromptEvent | null => deferredPrompt

export async function showInstallPrompt(): Promise<void> {
  const prompt = deferredPrompt
  if (!prompt) return
  // A prompt can only be used once, whatever the user chooses
  deferredPrompt = null
  notify()
  await prompt.prompt()
  await prompt.userChoice
}
