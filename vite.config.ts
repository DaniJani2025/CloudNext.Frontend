import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync('path_to_your_local_certificates/<your-ip>.key'),
      cert: fs.readFileSync('path_to_your_local_certificates/<your-ip>.cert'),
    },
  },
})
