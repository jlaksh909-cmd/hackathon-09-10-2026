import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data_store.json');

export interface Resource {
  id: string;
  title: string;
  subject: string;
  branch: string;
  year: string;
  fileUrl: string;
  fileName?: string;
  uploadedBy: string;
  status: 'approved' | 'pending' | 'rejected';
  upvotes: number;
  summary: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueText: string;
  tag: string;
  completed: boolean;
  createdAt: string;
}

export interface DataStore {
  resources: Resource[];
  comments: Comment[];
  tasks: Task[];
}

const initialSeedData: DataStore = {
  resources: [
    {
      id: '1',
      title: 'Data Structures & Algorithms Complete Notes',
      subject: 'Data Structures',
      branch: 'CSE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'DSA_Complete_Notes.pdf',
      uploadedBy: 'Prof. Linda Wright',
      status: 'approved',
      upvotes: 89,
      summary: 'Comprehensive semester notes covering balanced BSTs, graph traversal algorithms (BFS/DFS), shortest paths, and dynamic programming.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Operating Systems Architecture & CPU Scheduling',
      subject: 'Operating Systems',
      branch: 'CSE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'OS_Architecture_Sched.pdf',
      uploadedBy: 'Dr. Marcus Vane',
      status: 'approved',
      upvotes: 64,
      summary: 'Detailed explanation of FCFS, SJF, Round Robin, Banker\'s algorithm, and semaphore sync mechanisms with step-by-step Gantt charts.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Database Management Systems & SQL Normalization',
      subject: 'DBMS',
      branch: 'CSE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'DBMS_Normalization_Guide.pdf',
      uploadedBy: 'Prof. Rachel Evans',
      status: 'approved',
      upvotes: 78,
      summary: 'Step-by-step normalization (1NF–BCNF), relational algebra, transaction ACID properties, indexing, and SQL join queries.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Discrete Math & Logic Theory Handout',
      subject: 'Discrete Mathematics',
      branch: 'CSE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'Discrete_Math_Logic.pdf',
      uploadedBy: 'Dr. Kenneth Cho',
      status: 'approved',
      upvotes: 45,
      summary: 'Propositional calculus, predicate logic, recurrence relations, graph isomorphism, and combinatorics problem sets.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Web Development & Modern REST APIs',
      subject: 'Web Development',
      branch: 'CSE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'Web_Dev_REST_APIs.pdf',
      uploadedBy: 'Alex Morgan',
      status: 'approved',
      upvotes: 52,
      summary: 'Comprehensive handbook for React, Node.js backend architecture, authentication, and state management patterns.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Computer Networks — TCP/IP & Protocol Stacks',
      subject: 'Computer Networks',
      branch: 'CSE',
      year: '3rd Year',
      fileUrl: '#',
      fileName: 'Computer_Networks_TCPIP.pdf',
      uploadedBy: 'Divya Nair',
      status: 'approved',
      upvotes: 91,
      summary: 'Layer-by-layer breakdown of TCP/IP vs OSI model, CIDR subnetting, BGP/OSPF routing, and TLS handshakes.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '7',
      title: 'Signal Processing — Fourier Transforms & Filtering',
      subject: 'Signal Processing',
      branch: 'ECE',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'Signal_Processing_Transforms.pdf',
      uploadedBy: 'Rohit Kapoor',
      status: 'approved',
      upvotes: 58,
      summary: 'Continuous and discrete Fourier transforms, DFT, FFT, Z-transforms, and digital FIR/IIR filter design methodologies.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '8',
      title: 'Thermodynamics — Zeroth to Third Law Applications',
      subject: 'Thermodynamics',
      branch: 'MECH',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'Thermodynamics_Laws.pdf',
      uploadedBy: 'Neha Gupta',
      status: 'approved',
      upvotes: 62,
      summary: 'Carnot heat engines, entropy derivations, Rankine & Brayton power cycles, and steam tables numerical solutions.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '9',
      title: 'Structural Analysis — Truss Analysis & Deflections',
      subject: 'Structural Analysis',
      branch: 'CIVIL',
      year: '2nd Year',
      fileUrl: '#',
      fileName: 'Structural_Analysis_Trusses.pdf',
      uploadedBy: 'Anita Deshmukh',
      status: 'approved',
      upvotes: 47,
      summary: 'Method of joints, method of sections, Castigliano\'s theorem, and influence line diagrams for determinate structures.',
      createdAt: new Date().toISOString(),
    }
  ],
  comments: [
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
    }
  ],
  tasks: [
    {
      id: 'task1',
      title: 'DSA Lab 4: AVL Trees Rebalance',
      subject: 'Data Structures',
      dueText: 'Today',
      tag: 'C++ • Test bench validation',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task2',
      title: 'OS Process Scheduling Sim',
      subject: 'Operating Systems',
      dueText: '2 days',
      tag: 'Round-Robin & Priority Queues',
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task3',
      title: 'SQL BCNF & 4NF Normalization',
      subject: 'DBMS',
      dueText: 'May 21',
      tag: 'Online Assessment • 20 mins',
      completed: false,
      createdAt: new Date().toISOString(),
    }
  ]
};

export function loadData(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading data file, resetting to seed data:', err);
  }
  saveData(initialSeedData);
  return initialSeedData;
}

export function saveData(data: DataStore): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data store:', err);
  }
}
