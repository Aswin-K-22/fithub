import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000', // Fallback for safety
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
            });
            proxy.on('proxyRes', (proxyRes) => {
              console.log(`Received response with status: ${proxyRes.statusCode}`);
            });
          },
        },
      },
    },
  });
};