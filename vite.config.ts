import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      proxy: {
        '/api': {
          target:
            'https://api-rest-ts-node-gateways-master-production.up.railway.app',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      cors: false,
    },
    plugins: [react()],
  });
};
