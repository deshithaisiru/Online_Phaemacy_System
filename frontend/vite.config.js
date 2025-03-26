import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/medicart': {
        target: 'http://localhost:5001', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
