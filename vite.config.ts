import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'offline.html'],
      manifest: {
        name: '2gather',
        short_name: '2gather',
        description: 'Birlikte planlayın',
        theme_color: '#3D5A4C',
        background_color: '#F5F3EE',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // API calls and the SignalR hub must never be answered with the SPA shell
        navigateFallbackDenylist: [/^\/api\//, /^\/hubs\//],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: '2gather-api-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: '2gather-google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: '2gather-image-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@microsoft/signalr'],
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5289',
      '/hubs': {
        target: 'http://localhost:5289',
        ws: true,
      },
    },
  },
})
