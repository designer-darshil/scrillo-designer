import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processContactSubmission } from './api/contact';

function contactApiDevPlugin(): Plugin {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url !== '/api/contact') {
          return next();
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const result = await processContactSubmission(payload);
            res.statusCode = result.success ? 200 : 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Internal server error' }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), contactApiDevPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
