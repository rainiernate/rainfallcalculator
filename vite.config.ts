import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rainfallcalculator/',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js',
      },
    },
  },
  envPrefix: 'VITE_',
  define: {
    'import.meta.env.VITE_NOAA_API_TOKEN': JSON.stringify(process.env.VITE_NOAA_API_TOKEN),
  }
})
