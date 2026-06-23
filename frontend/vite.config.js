import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,   // required for HMR inside Docker on some systems
    },
    proxy: {
      "/api": {
        target: "http://backend:5001",  // use service name, not localhost, inside Docker
        changeOrigin:true,
      },
    },
  },
});