import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/styles/globals.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <div>2Gather — scaffold ok</div>
  </StrictMode>
)
