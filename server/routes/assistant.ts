import { Router } from 'express';
import { loadData } from '../db.js';

const router = Router();

// ── POST /api/assistant/chat (AI Study Assistant Q&A) ──
router.post('/chat', (req, res) => {
  const { message, branch, subject, resourceId } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Query message is required' });
  }

  const data = loadData();
  const lowerQuery = message.toLowerCase();

  // Find relevant resource in database
  let matchedResource = null;
  if (resourceId) {
    matchedResource = data.resources.find((r) => r.id === resourceId);
  } else if (subject) {
    matchedResource = data.resources.find((r) => r.subject.toLowerCase() === subject.toLowerCase());
  } else {
    matchedResource = data.resources.find(
      (r) =>
        lowerQuery.includes(r.subject.toLowerCase()) ||
        lowerQuery.includes(r.title.toLowerCase())
    );
  }

  let answer = '';
  let citations: string[] = [];

  if (lowerQuery.includes('time complexity') || lowerQuery.includes('big o') || lowerQuery.includes('asymptotic')) {
    answer = `Based on the **${matchedResource ? matchedResource.title : 'Data Structures & Algorithms'}** lecture monograph:\n\n` +
      `• **Binary Search Tree Search/Insert:** Average O(log n), Worst-case O(n) when unbalanced.\n` +
      `• **Balanced AVL / Red-Black Tree:** Strictly bounded O(log n) for all operations via rotations.\n` +
      `• **QuickSort / MergeSort:** MergeSort is deterministic O(n log n) with O(n) auxiliary space; QuickSort is O(n log n) average, O(n²) worst-case.\n\n` +
      `*Formula Tip:* Master Theorem Case 2 applies when $T(n) = aT(n/b) + f(n)$ where $f(n) = \\Theta(n^{\\log_b a})$.`;
    citations = [matchedResource ? matchedResource.title : 'Data Structures Complete Revision Notes'];
  } else if (lowerQuery.includes('scheduling') || lowerQuery.includes('cpu') || lowerQuery.includes('os') || lowerQuery.includes('deadlock')) {
    answer = `From the **Operating Systems Architecture** curriculum materials:\n\n` +
      `1. **Round-Robin Scheduling:** Time slice (quantum) determines responsiveness. If quantum is too large, it degrades to FCFS; if too small, context-switch overhead dominates.\n` +
      `2. **Banker's Algorithm:** Used for Deadlock Avoidance by ensuring resource allocation keeps the system in a *Safe State* using allocation, max, and available matrices.\n` +
      `3. **Semaphores & Mutex:** Mutex is a locking mechanism (ownership required); Semaphore is a signaling mechanism (counting/binary).`;
    citations = ['Operating Systems Architecture & CPU Scheduling'];
  } else if (lowerQuery.includes('normalization') || lowerQuery.includes('bcnf') || lowerQuery.includes('sql') || lowerQuery.includes('database')) {
    answer = `From the **DBMS & SQL Normalization** study monograph:\n\n` +
      `• **1NF:** Atomic attribute values, no repeating groups.\n` +
      `• **2NF:** 1NF + No partial functional dependency on any candidate key.\n` +
      `• **3NF:** 2NF + No transitive functional dependency ($X \\rightarrow Y$, $Y \\rightarrow Z$).\n` +
      `• **BCNF (Boyce-Codd):** For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must strictly be a Super Key.`;
    citations = ['Database Management Systems & SQL Normalization'];
  } else {
    answer = `Here is the academic synthesis for your query on **${branch || 'Engineering'} (${subject || 'Core Curriculum'})**:\n\n` +
      `• The key concept revolves around verifying invariant properties and step-by-step mathematical proofs.\n` +
      `• Review the verified lecture monographs in the **CampusHub Resource Library** for worked previous-year midterm problems.\n` +
      `• Make sure to review definitions, asymptotic bounds, and boundary edge cases for upcoming semester exams.`;
    citations = matchedResource ? [matchedResource.title] : ['CampusHub Verified Academic Archive'];
  }

  res.json({
    success: true,
    reply: {
      id: `ai-${Date.now()}`,
      text: answer,
      citations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  });
});

export default router;
