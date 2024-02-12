import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  if (command === 'serve') {
    return {
      base: '/search',
      server: {
        host: true,
        port: 5173,
      },
    }
  }
  return {
    plugins: [react()],
    base: '/',
    server: {
      host: true,
      port: 5173,
    },
  }
})
