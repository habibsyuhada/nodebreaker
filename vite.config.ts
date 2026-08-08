import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serves project sites under /<repo>/, not /. The deploy workflow sets GH_PAGES=true
// so this base only applies to that build — local dev and any other deploy target stay at "/".
const base = process.env.GH_PAGES ? '/nodebreaker/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Explicit glob (not left to includeManifestIcons' auto-detection) because that feature
      // resolves manifest.icons[].src against publicDir after stripping only a leading "/" —
      // with a non-root `base` prefixed onto those paths (needed for GitHub Pages) the stripped
      // path no longer matches the real public/icons/ layout and silently precaches nothing.
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'NODEBREAKER',
        short_name: 'NODEBREAKER',
        description:
          'Pixel-art hacking puzzle game — explore fictional servers, piece together clues, break in.',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0a0c10',
        theme_color: '#0a0c10',
        icons: [
          { src: `${base}icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `${base}icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: `${base}icons/icon-maskable-192.png`,
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: `${base}icons/icon-maskable-512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell + built assets are precached automatically. Google Fonts are the one
        // external-origin request the game makes — cache them at runtime so a page that's
        // loaded once stays fully styled offline too, not just functional.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
})
