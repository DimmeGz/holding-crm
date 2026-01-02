import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.REACT_APP_API_URL),
    },
  };
});
