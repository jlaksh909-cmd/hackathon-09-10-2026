import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  increment,
  type Unsubscribe,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Resource, Branch, Year } from '../data/mockData';
import { mockResources } from '../data/mockData';
import type { TaskItem, CommentItem } from './api';

// Collection references
const RESOURCES_COLLECTION = 'resources';
const TASKS_COLLECTION = 'tasks';
const COMMENTS_COLLECTION = 'comments';

// ── In-Memory Cache & Seed Initializer ──
let hasInitializedFirestore = false;

export async function initializeFirebaseSeed() {
  if (hasInitializedFirestore) return;
  try {
    const snap = await getDocs(collection(db, RESOURCES_COLLECTION));
    if (snap.empty) {
      console.log('🔥 Initializing Firebase Firestore with seed resources...');
      for (const res of mockResources) {
        await setDoc(doc(db, RESOURCES_COLLECTION, res.id), {
          ...res,
          createdAt: new Date().toISOString(),
        });
      }
      // Seed initial tasks
      const initialTasks = [
        {
          id: 'task-1',
          title: 'DSA Lab 4: AVL Trees Rebalance',
          subject: 'Data Structures',
          dueText: 'Today',
          tag: 'C++ • Test bench validation',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'task-2',
          title: 'OS Process Scheduling Sim',
          subject: 'Operating Systems',
          dueText: '2 days',
          tag: 'Round-Robin & Priority Queues',
          completed: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'task-3',
          title: 'SQL BCNF & 4NF Normalization',
          subject: 'DBMS',
          dueText: 'May 21',
          tag: 'Online Assessment • 20 mins',
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
      for (const t of initialTasks) {
        await setDoc(doc(db, TASKS_COLLECTION, t.id), t);
      }
    }
    hasInitializedFirestore = true;
  } catch (err) {
    console.warn('Firebase Firestore seed check fallback (local mode active):', err);
  }
}

// ── Resources Firestore API ──

export async function fetchFirebaseResources(filter?: {
  branch?: Branch | 'all';
  year?: Year | 'all';
  subject?: string | 'all';
  status?: string;
}): Promise<Resource[]> {
  try {
    const colRef = collection(db, RESOURCES_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Resource));
      if (filter) {
        if (filter.branch && filter.branch !== 'all') {
          list = list.filter((r) => r.branch === filter.branch);
        }
        if (filter.year && filter.year !== 'all') {
          list = list.filter((r) => r.year === filter.year);
        }
        if (filter.subject && filter.subject !== 'all') {
          list = list.filter((r) => r.subject === filter.subject);
        }
        if (filter.status) {
          list = list.filter((r) => r.status === filter.status);
        }
      }
      return list;
    }
  } catch (err) {
    console.warn('Firestore fetch fallback:', err);
  }
  return mockResources;
}

export function subscribeFirebaseResources(
  callback: (resources: Resource[]) => void,
  filter?: { branch?: Branch; year?: Year }
): Unsubscribe {
  try {
    const colRef = collection(db, RESOURCES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          let items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Resource));
          if (filter?.branch) items = items.filter((r) => r.branch === filter.branch);
          if (filter?.year) items = items.filter((r) => r.year === filter.year);
          callback(items);
        } else {
          callback(mockResources);
        }
      },
      (error) => {
        console.warn('Firestore realtime listener fallback:', error);
        callback(mockResources);
      }
    );
  } catch {
    callback(mockResources);
    return () => {};
  }
}

export async function uploadResourceToFirebase(
  file: File | null,
  metadata: {
    title: string;
    subject: string;
    branch: Branch;
    year: Year;
    uploadedBy: string;
    summary: string;
  }
): Promise<Resource> {
  let fileUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf';

  if (file) {
    try {
      const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(uploadResult.ref);
    } catch (storageErr) {
      console.warn('Firebase Storage offline fallback, creating local blob URL:', storageErr);
      fileUrl = URL.createObjectURL(file);
    }
  }

  const newResource: Resource = {
    id: `res-${Date.now()}`,
    title: metadata.title,
    subject: metadata.subject,
    branch: metadata.branch,
    year: metadata.year,
    fileUrl,
    uploadedBy: metadata.uploadedBy || 'Anonymous Student',
    status: 'approved',
    upvotes: 1,
    summary: metadata.summary || 'Uploaded study guide and lecture revision notes.',
  };

  try {
    await setDoc(doc(db, RESOURCES_COLLECTION, newResource.id), {
      ...newResource,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore save fallback:', err);
  }

  return newResource;
}

export async function upvoteResourceInFirebase(id: string): Promise<number> {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await updateDoc(docRef, {
      upvotes: increment(1),
    });
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().upvotes as number;
    }
  } catch (err) {
    console.warn('Firestore upvote fallback:', err);
  }
  return 0;
}

// ── Comments Firestore API ──

export async function fetchFirebaseComments(resourceId: string): Promise<CommentItem[]> {
  try {
    const colRef = collection(db, COMMENTS_COLLECTION);
    const q = query(colRef, where('resourceId', '==', resourceId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommentItem));
    }
  } catch (err) {
    console.warn('Firestore comments fetch fallback:', err);
  }
  return [];
}

export async function postCommentToFirebase(
  resourceId: string,
  author: string,
  text: string
): Promise<CommentItem> {
  const newComment: CommentItem = {
    id: `c-${Date.now()}`,
    resourceId,
    author: author || 'Alex Morgan',
    avatar: (author || 'AM').slice(0, 2).toUpperCase(),
    timeAgo: 'Just now',
    text,
    likes: 0,
  };

  try {
    await setDoc(doc(db, COMMENTS_COLLECTION, newComment.id), {
      ...newComment,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore comment add fallback:', err);
  }

  return newComment;
}

// ── Tasks Firestore API ──

export async function fetchFirebaseTasks(): Promise<TaskItem[]> {
  try {
    const snap = await getDocs(collection(db, TASKS_COLLECTION));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TaskItem));
    }
  } catch (err) {
    console.warn('Firestore tasks fetch fallback:', err);
  }
  return [];
}

export async function createTaskInFirebase(task: {
  title: string;
  subject: string;
  dueText: string;
  tag: string;
}): Promise<TaskItem> {
  const newTaskItem: TaskItem = {
    id: `task-${Date.now()}`,
    title: task.title,
    subject: task.subject,
    dueText: task.dueText,
    tag: task.tag,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, TASKS_COLLECTION, newTaskItem.id), newTaskItem);
  } catch (err) {
    console.warn('Firestore task create fallback:', err);
  }

  return newTaskItem;
}

export async function toggleTaskInFirebase(id: string, currentCompleted: boolean): Promise<boolean> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(docRef, {
      completed: !currentCompleted,
    });
    return !currentCompleted;
  } catch (err) {
    console.warn('Firestore task toggle fallback:', err);
    return !currentCompleted;
  }
}

// ── Moderation Firestore API ──

export async function fetchFirebasePendingModeration(): Promise<Resource[]> {
  try {
    const colRef = collection(db, RESOURCES_COLLECTION);
    const q = query(colRef, where('status', '==', 'pending'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Resource));
    }
  } catch (err) {
    console.warn('Firestore moderation fetch fallback:', err);
  }
  return [];
}

export async function approveResourceInFirebase(id: string): Promise<void> {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await updateDoc(docRef, { status: 'approved' });
  } catch (err) {
    console.warn('Firestore approve fallback:', err);
  }
}

export async function rejectResourceInFirebase(id: string, reason?: string): Promise<void> {
  try {
    const docRef = doc(db, RESOURCES_COLLECTION, id);
    await updateDoc(docRef, { status: 'rejected', rejectReason: reason || 'Syllabus mismatch' });
  } catch (err) {
    console.warn('Firestore reject fallback:', err);
  }
}
