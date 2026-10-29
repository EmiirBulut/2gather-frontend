import { useSyncExternalStore } from 'react'
import { getInstallPrompt, showInstallPrompt, subscribeInstallPrompt } from '@/lib/pwaInstall'

interface PWAInstall {
  isInstallable: boolean
  promptInstall: () => Promise<void>
}

export function usePWAInstall(): PWAInstall {
  const prompt = useSyncExternalStore(subscribeInstallPrompt, getInstallPrompt)
  return { isInstallable: prompt !== null, promptInstall: showInstallPrompt }
}
