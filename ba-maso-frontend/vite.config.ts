import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Increase (or remove) the "chunk > 500kB" warning threshold
    chunkSizeWarningLimit: 1200,

    rollupOptions: {
      onwarn(warning, warn) {
        // Keep your existing filter
        if (warning.code === 'TS_ERROR') return
        warn(warning)
      },
    },
  },
})