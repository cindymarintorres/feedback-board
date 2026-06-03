import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      preserveSymlinks: true,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.WEB_PORT) || 3001,
      proxy: {
        '/api': {
          // Usamos la variable cargada o el fallback
          target: env.VITE_PROXY_TARGET || 'http://fb_api:3000',
          changeOrigin: true,
          // REVISA ESTO: NestJS suele tener el prefijo /api en sus rutas.
          // Si tu backend ya espera /api/tickets, NO uses el rewrite.
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
      watch: {
        usePolling: true,
      },
    },
  }
})
