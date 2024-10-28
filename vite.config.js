import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'build', // Output directory for the build
    chunkSizeWarningLimit: 1000, // Chunk size limit for build warnings
  },
  server: {
    port: 8080, // Change this to match the port ngrok is forwarding to
    open: true, // Automatically open the app in the browser when the server starts
  },
});
