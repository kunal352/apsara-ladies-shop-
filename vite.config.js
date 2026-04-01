import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Apsara Ladies Shop',
        short_name: 'Apsara',
        description: 'Premium Inventory & Billing for Apsara Ladies Shop',
        theme_color: '#db2777',
        icons: [
          {
            src: 'https://raw.githubusercontent.com/kunal352/apsara-ladies-shop-/master/public/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://raw.githubusercontent.com/kunal352/apsara-ladies-shop-/master/public/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => true,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'apsara-offline-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
              },
            },
          },
        ],
      },
    })
  ],
})
