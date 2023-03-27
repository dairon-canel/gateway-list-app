import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      proxy: {
        port: process.env.VITE_VERCEL_PORT,
        '/api': process.env.VITE_VERCEL_DOMAIN,
      },
    },
    plugins: [react()],
  });
};
