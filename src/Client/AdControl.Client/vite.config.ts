/// <reference types="node" />
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { env } from 'process';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
//import.meta.env.VITE_GEMINI_API_KEY

  const API = process.env.SERVER_API_URL ?
      `${process.env.SERVER_API_URL}` : 'http://localhost:5000/api';

  return {
    plugins: [react(),
      VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'favicon.ico',
        'robots.txt',
        'apple-touch-icon.png'
      ],

      manifest: {
        name: 'AdvertControl',
        short_name: 'AdControl',
        description: 'Современная платформа для удаленного управления цифровыми экранами.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })],

    server: {
      proxy: {
        "/api": {
          target: API,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ""),
        },
      },
      host: "0.0.0.0",
      port: 5173,
      protocol: 'wss',
      allowedHosts: [
        "ad-control.ru",
        "localhost",
      ],
      hmr: true,
    },
  };
});
