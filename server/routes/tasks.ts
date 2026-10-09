import { Router } from 'express';
import { loadData, saveData, Task } from '../db.js';

const router = Router();

// ── GET /api/tasks ──
router.get('/', (_req, res) => {
  const data = loadData();
  res.json({ success: true, count: data.tasks.length, data: data.tasks });
});

// ── POST /api/tasks (Create Custom Task) ──
router.post('/', (req, res) => {
  const { title, subject, dueText, tag } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Task title is required' });
  }

  const data = loadData();
  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    subject: subject || 'General Study',
    dueText: dueText || 'Tomorrow',
    tag: tag || 'Exam prep • Task',
    completed: false,
    createdAt: new Date().toISOString(),
  };

  data.tasks.push(newTask);
  saveData(data);

  res.status(201).json({ success: true, data: newTask });
});

// ── PATCH /api/tasks/:id/toggle ──
router.patch('/:id/toggle', (req, res) => {
  const data = loadData();
  const task = data.tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.completed = !task.completed;
  saveData(data);

  res.json({ success: true, data: task });
});

// ── DELETE /api/tasks/:id ──
router.delete('/:id', (req, res) => {
  const data = loadData();
  const index = data.tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const deleted = data.tasks.splice(index, 1);
  saveData(data);

  res.json({ success: true, message: 'Task deleted', data: deleted[0] });
});

export default router;
