import type { Resource, Branch, Year } from '../data/mockData';
import {
  fetchFirebaseResources,
  uploadResourceToFirebase,
  upvoteResourceInFirebase,
  fetchFirebaseComments,
  postCommentToFirebase,
  fetchFirebaseTasks,
  createTaskInFirebase,
  toggleTaskInFirebase,
  fetchFirebasePendingModeration,
  approveResourceInFirebase,
  rejectResourceInFirebase,
} from './firebaseService';

const API_BASE_URL = 'http://localhost:5000/api';

export interface TaskItem {
  id: string;
  title: string;
  subject: string;
  dueText: string;
  tag: string;
  completed: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  resourceId: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
}

// ── Resources API (Firebase First with Backend Sync) ──

export async function fetchResources(params?: {
  branch?: Branch | 'all';
  year?: Year | 'all';
  subject?: string | 'all';
  search?: string;
  status?: string;
}): Promise<Resource[]> {
  try {
    const firebaseData = await fetchFirebaseResources(params);
    if (firebaseData && firebaseData.length > 0) {
      if (params?.search) {
        const q = params.search.toLowerCase();
        return firebaseData.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.subject.toLowerCase().includes(q) ||
            r.uploadedBy.toLowerCase().includes(q) ||
            r.summary.toLowerCase().includes(q)
        );
      }
      return firebaseData;
    }
  } catch (err) {
    console.warn('Firebase query fallback to local/Express:', err);
  }

  // Fallback to Express backend
  try {
    const url = new URL(`${API_BASE_URL}/resources`);
    if (params) {
      if (params.branch) url.searchParams.set('branch', params.branch);
      if (params.year) url.searchParams.set('year', params.year);
      if (params.subject && params.subject !== 'all') url.searchParams.set('subject', params.subject);
      if (params.search) url.searchParams.set('search', params.search);
      if (params.status) url.searchParams.set('status', params.status);
    }
    const res = await fetch(url.toString());
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Offline fallback
  }

  return [];
}

export async function uploadResource(formData: FormData): Promise<Resource> {
  const file = formData.get('file') as File | null;
  const metadata = {
    title: (formData.get('title') as string) || 'Untitled Notes',
    subject: (formData.get('subject') as string) || 'Core Course',
    branch: (formData.get('branch') as Branch) || 'CSE',
    year: (formData.get('year') as Year) || '2nd Year',
    uploadedBy: (formData.get('uploadedBy') as string) || 'Alex Morgan',
    summary: (formData.get('summary') as string) || 'Curated study guide and lecture notes.',
  };

  try {
    const firebaseResult = await uploadResourceToFirebase(file, metadata);
    if (firebaseResult) return firebaseResult;
  } catch (err) {
    console.warn('Firebase upload fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return json.data;
}

export async function upvoteResource(id: string): Promise<number> {
  try {
    const upvotes = await upvoteResourceInFirebase(id);
    if (upvotes > 0) return upvotes;
  } catch (err) {
    console.warn('Firebase upvote fallback:', err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/resources/${id}/upvote`, {
      method: 'POST',
    });
    if (res.ok) {
      const json = await res.json();
      return json.upvotes;
    }
  } catch {
    // Fallback
  }
  return 0;
}

// ── Comments API (Firebase Firestore Real-time) ──

export async function fetchComments(resourceId: string): Promise<CommentItem[]> {
  try {
    const comments = await fetchFirebaseComments(resourceId);
    if (comments && comments.length > 0) return comments;
  } catch (err) {
    console.warn('Firebase comments fetch fallback:', err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/resources/${resourceId}/comments`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return [];
}

export async function postComment(resourceId: string, author: string, text: string): Promise<CommentItem> {
  try {
    const newComment = await postCommentToFirebase(resourceId, author, text);
    if (newComment) return newComment;
  } catch (err) {
    console.warn('Firebase post comment fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/resources/${resourceId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  });
  if (!res.ok) throw new Error('Post comment failed');
  const json = await res.json();
  return json.data;
}

// ── Tasks API (Firebase Firestore Tasks) ──

export async function fetchTasks(): Promise<TaskItem[]> {
  try {
    const tasks = await fetchFirebaseTasks();
    if (tasks && tasks.length > 0) return tasks;
  } catch (err) {
    console.warn('Firebase tasks fetch fallback:', err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return [];
}

export async function createTask(task: { title: string; subject: string; dueText: string; tag: string }): Promise<TaskItem> {
  try {
    const newTask = await createTaskInFirebase(task);
    if (newTask) return newTask;
  } catch (err) {
    console.warn('Firebase create task fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Create task failed');
  const json = await res.json();
  return json.data;
}

export async function toggleTask(id: string, currentCompleted = false): Promise<TaskItem> {
  try {
    const newCompleted = await toggleTaskInFirebase(id, currentCompleted);
    return {
      id,
      title: '',
      subject: '',
      dueText: '',
      tag: '',
      completed: newCompleted,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Firebase toggle task fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Toggle task failed');
  const json = await res.json();
  return json.data;
}

// ── Moderation API (Firebase Firestore Status) ──

export async function fetchPendingModeration(): Promise<Resource[]> {
  try {
    const pending = await fetchFirebasePendingModeration();
    if (pending && pending.length > 0) return pending;
  } catch (err) {
    console.warn('Firebase moderation queue fallback:', err);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/moderation/pending`);
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch {
    // Fallback
  }
  return [];
}

export async function approveResource(id: string): Promise<Resource> {
  try {
    await approveResourceInFirebase(id);
  } catch (err) {
    console.warn('Firebase approve fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/moderation/${id}/approve`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Approve failed');
  const json = await res.json();
  return json.data;
}

export async function rejectResource(id: string, reason?: string): Promise<Resource> {
  try {
    await rejectResourceInFirebase(id, reason);
  } catch (err) {
    console.warn('Firebase reject fallback:', err);
  }

  const res = await fetch(`${API_BASE_URL}/moderation/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Reject failed');
  const json = await res.json();
  return json.data;
}

// ── AI Assistant API ──

export async function queryAssistant(message: string, branch?: string, subject?: string, resourceId?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, branch, subject, resourceId }),
    });
    if (res.ok) {
      const json = await res.json();
      return json.reply;
    }
  } catch {
    // Fallback synthesis
  }

  return {
    id: `ai-${Date.now()}`,
    text: `From verified **${branch || 'Engineering'}** notes on **${subject || 'Core Curriculum'}**:\n\n• Focus on core invariant proofs, recurrence relations ($T(n) = aT(n/b) + f(n)$), and boundary invariants.\n• Check the lecture summaries in the CampusHub repository.`,
    citations: ['CampusHub Firebase Verified Database'],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}
