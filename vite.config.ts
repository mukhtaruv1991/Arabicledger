import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa'; // <-- استيراد الأداة الجديدة

export default defineConfig({
  plugins: [
    react(),
    // --- هذا هو الجزء الجديد والمهم ---
    VitePWA({
      registerType: 'autoUpdate', // يقوم بتحديث التطبيق تلقائيًا عند وجود نسخة جديدة
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'] // الملفات التي سيتم تخزينها مؤقتًا
      },
      manifest: {
        name: 'نظام المحاسبة الذكي',
        short_name: 'المحاسبة',
        description: 'نظام محاسبة شامل لإدارة الشؤون المالية',
        theme_color: '#1e40af', // اللون الرئيسي للتطبيق
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png', // سنحتاج لإنشاء هذه الأيقونة
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // وهذه أيضًا
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // مهم جدًا للأيقونات التكيفية في أندرويد
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
