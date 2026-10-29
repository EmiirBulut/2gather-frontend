import { useUiStore, type ThemePreference } from '@/store/uiStore'

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

const resolveTheme = (preference: ThemePreference): 'light' | 'dark' =>
  preference === 'system' ? (darkQuery.matches ? 'dark' : 'light') : preference

const applyTheme = (): void => {
  document.documentElement.dataset.theme = resolveTheme(useUiStore.getState().themePreference)
}

/** Keeps <html data-theme> in sync with the stored preference and, for "system", the OS setting. */
export function initTheme(): void {
  applyTheme()
  useUiStore.subscribe(applyTheme)
  darkQuery.addEventListener('change', applyTheme)
}
