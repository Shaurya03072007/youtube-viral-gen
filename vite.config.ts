import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Fix for "This host is not allowed" error on Render
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  }
});