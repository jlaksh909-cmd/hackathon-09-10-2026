import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resourcesRouter from './routes/resources.js';
import tasksRouter from './routes/tasks.js';
import moderationRouter from './routes/moderation.js';
import assistantRouter from './routes/assistant.js';
import { loadData } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ── API Routes ──
app.use('/api/resources', resourcesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/moderation', moderationRouter);
app.use('/api/assistant', assistantRouter);

// ── Root Health Check ──
app.get('/api/health', (_req, res) => {
  const data = loadData();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    totalResources: data.resources.length,
    pendingModeration: data.resources.filter((r) => r.status === 'pending').length,
    tasksCount: data.tasks.length,
  });
});

// ── Global Error & Bad JSON Handler ──
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload received' });
  }
  console.error('Unhandled server error:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 CampusHub Backend Server running on http://localhost:${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api/resources`);
});
