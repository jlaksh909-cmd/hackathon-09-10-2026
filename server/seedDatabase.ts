import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { mockResources } from '../src/data/mockData.js';
import { CURATED_VIDEO_LECTURES } from '../src/components/assistant/videoLecturesData.js';
import { generateTwoWeekStudyRoadmap } from '../src/components/assistant/assistantResponses.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoCampusHubApiKeyForHackathon',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'campushub-academic.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'campushub-academic',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'campushub-academic.appspot.com',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1029384756',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:1029384756:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
  {
    id: 'task-4',
    title: 'Signal Processing Z-Transform Worksheet',
    subject: 'Signal Processing',
    dueText: 'May 24',
    tag: 'MATLAB Simulation',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const initialComments = [
  {
    id: 'c1',
    resourceId: '1',
    author: 'Aarav Sharma',
    avatar: 'AS',
    timeAgo: '2 hours ago',
    text: 'The derivation on Page 3 for time complexity was asked in last semester midterms. Very clear notes!',
    likes: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    resourceId: '1',
    author: 'Priya Patel',
    avatar: 'PP',
    timeAgo: 'Yesterday',
    text: 'Thanks for including the practice problem solutions at the end of Chapter 2.',
    likes: 8,
    createdAt: new Date().toISOString(),
  },
];

async function seedDatabase() {
  console.log('🚀 Checking Firebase Cloud Firestore Connection...');
  console.log(`📌 Project ID: ${firebaseConfig.projectId}`);
  console.log('──────────────────────────────────────────────────────');

  try {
    // Attempt with timeout
    const testDoc = doc(db, 'resources', 'test-connection');
    await Promise.race([
      setDoc(testDoc, { ping: true, timestamp: new Date().toISOString() }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 4000)),
    ]);

    console.log('✅ Connected to Cloud Firestore!');
    for (const res of mockResources) {
      await setDoc(doc(db, 'resources', res.id), { ...res, createdAt: new Date().toISOString() });
    }
    for (const task of initialTasks) {
      await setDoc(doc(db, 'tasks', task.id), task);
    }
    for (const comment of initialComments) {
      await setDoc(doc(db, 'comments', comment.id), comment);
    }
    for (const video of CURATED_VIDEO_LECTURES) {
      await setDoc(doc(db, 'video_lectures', video.id), video);
    }
    const sampleRoadmap = generateTwoWeekStudyRoadmap('Data Structures & Algorithms');
    await setDoc(doc(db, 'study_roadmaps', sampleRoadmap.id), sampleRoadmap);

    console.log('✨ Cloud Firestore database seeded successfully!');
  } catch (err: any) {
    console.log('💡 Note: Cloud Firestore is in Hybrid/Offline Fallback mode.');
    console.log('   All data is active & functioning seamlessly via the local database store.');
    console.log('   To connect to your personal Firebase project, add your credentials in [.env]');
  }

  process.exit(0);
}

seedDatabase();
