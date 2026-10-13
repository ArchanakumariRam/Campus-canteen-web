import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

function adminRewritePlugin() {
  return {
    name: 'admin-rewrite-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin.html';
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), adminRewritePlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
