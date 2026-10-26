import dotenv from 'dotenv';
dotenv.config({ override: true });
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './server/routes/taskRoutes.ts';
import { connectToMongo } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Body parser
  app.use(express.json());

  // Attempt initial MongoDB Atlas connection if MONGODB_URI is provided
  if (process.env.MONGODB_URI) {
    console.log('[Server] Connecting to configured MongoDB Atlas...');
    await connectToMongo(process.env.MONGODB_URI).catch((err) => {
      console.warn('[Server] Initial MongoDB connection notice:', err.message);
    });
  } else {
    console.log('[Server] MONGODB_URI not detected in environment. Initializing with active Express REST API.');
  }

  // Mount API routes
  app.use('/api', taskRoutes);

  // Vite integration
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '127.0.0.1', () => {
    console.log(`[Server] MERN Task Manager server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
