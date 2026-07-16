import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-image.webp', 'hero-autora-oculta.webp'],
      manifest: {
        name: 'Autora Oculta — Método',
        short_name: 'Autora Oculta',
        description:
          'Área del método Autora Oculta: proyecto, estructura, prompts y plan de 7 días.',
        theme_color: '#0a0608',
        background_color: '#0a0608',
        display: 'standalone',
        orientation: 'any',
        start_url: '/entregavel/',
        scope: '/',
        lang: 'es',
        id: '/entregavel/',
        categories: ['education', 'productivity', 'books'],
        shortcuts: [
          {
            name: 'Plan 7 días',
            short_name: 'Plan 7',
            url: '/entregavel/plan7',
          },
          {
            name: 'Prompts',
            short_name: 'Prompts',
            url: '/entregavel/prompts',
          },
          {
            name: 'Tu proyecto',
            short_name: 'Proyecto',
            url: '/entregavel/proyecto',
          },
        ],
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
