import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { loadData, saveData, Resource, Comment } from '../db.js';

const router = Router();

// Setup multer storage for uploaded files
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ── GET /api/resources ──
router.get('/', (req, res) => {
  const { branch, year, subject, search, status } = req.query;
  const data = loadData();

  let filtered = data.resources;

  if (status) {
    filtered = filtered.filter((r) => r.status === status);
  } else {
    filtered = filtered.filter((r) => r.status === 'approved');
  }

  if (branch && branch !== 'all') {
    filtered = filtered.filter((r) => r.branch === branch);
  }

  if (year && year !== 'all') {
    filtered = filtered.filter((r) => r.year === year);
  }

  if (subject && subject !== 'all') {
    filtered = filtered.filter((r) => r.subject === subject);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.uploadedBy.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// ── GET /api/resources/:id ──
router.get('/:id', (req, res) => {
  const data = loadData();
  const resource = data.resources.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.json({ success: true, data: resource });
});

// ── POST /api/resources (Upload Resource) ──
router.post('/', upload.single('file'), (req, res) => {
  const { title, subject, branch, year, uploadedBy } = req.body;
  const file = req.file;

  if (!title || !subject || !branch || !year) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const data = loadData();
  const newResource: Resource = {
    id: `res-${Date.now()}`,
    title: title.trim(),
    subject,
    branch,
    year,
    fileUrl: file ? `/uploads/${file.filename}` : '#',
    fileName: file ? file.originalname : 'Document.pdf',
    uploadedBy: uploadedBy || 'Alex Morgan',
    status: 'pending', // Requires senior review
    upvotes: 0,
    summary: `Curated notes for ${subject} (${branch}, ${year}) — pending senior moderation verification.`,
    createdAt: new Date().toISOString(),
  };

  data.resources.unshift(newResource);
  saveData(data);

  res.status(201).json({
    success: true,
    message: 'Resource uploaded and submitted for senior review!',
    data: newResource,
  });
});

// ── POST /api/resources/:id/upvote ──
router.post('/:id/upvote', (req, res) => {
  const data = loadData();
  const resource = data.resources.find((r) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  resource.upvotes += 1;
  saveData(data);

  res.json({ success: true, upvotes: resource.upvotes, data: resource });
});

// ── GET /api/resources/:id/comments ──
router.get('/:id/comments', (req, res) => {
  const data = loadData();
  const comments = data.comments.filter((c) => c.resourceId === req.params.id);
  res.json({ success: true, data: comments });
});

// ── POST /api/resources/:id/comments ──
router.post('/:id/comments', (req, res) => {
  const { author, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Comment text is required' });
  }

  const data = loadData();
  const newComment: Comment = {
    id: `c-${Date.now()}`,
    resourceId: req.params.id,
    author: author || 'Alex Morgan',
    avatar: (author || 'Alex Morgan').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
    timeAgo: 'Just now',
    text: text.trim(),
    likes: 0,
    createdAt: new Date().toISOString(),
  };

  data.comments.unshift(newComment);
  saveData(data);

  res.status(201).json({ success: true, data: newComment });
});

export default router;
