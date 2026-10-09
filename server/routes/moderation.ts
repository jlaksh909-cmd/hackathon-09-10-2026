import { Router } from 'express';
import { loadData, saveData } from '../db.js';

const router = Router();

// ── GET /api/moderation/pending (Senior Moderation Queue) ──
router.get('/pending', (_req, res) => {
  const data = loadData();
  const pending = data.resources.filter((r) => r.status === 'pending');
  res.json({ success: true, count: pending.length, data: pending });
});

// ── POST /api/moderation/:id/approve ──
router.post('/:id/approve', (req, res) => {
  const data = loadData();
  const resource = data.resources.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  resource.status = 'approved';
  saveData(data);

  res.json({
    success: true,
    message: 'Resource verified and approved to the live CampusHub library!',
    data: resource,
  });
});

// ── POST /api/moderation/:id/reject ──
router.post('/:id/reject', (req, res) => {
  const { reason } = req.body;
  const data = loadData();
  const resource = data.resources.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  resource.status = 'rejected';
  saveData(data);

  res.json({
    success: true,
    message: `Resource rejected: ${reason || 'Syllabus mismatch or duplicate'}`,
    data: resource,
  });
});

export default router;
