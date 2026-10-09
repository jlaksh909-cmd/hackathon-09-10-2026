export type Branch = 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type ResourceStatus = 'approved' | 'pending' | 'rejected';

export interface Resource {
  id: string;
  title: string;
  subject: string;
  branch: Branch;
  year: Year;
  fileUrl: string;
  uploadedBy: string;
  status: ResourceStatus;
  upvotes: number;
  summary: string;
  // Optional metadata extensions
  format?: string;
  fileSize?: string;
  downloads?: number;
  approved?: boolean;
  tags?: string[];
  keyTakeaways?: string[];
  createdAt?: string;
}

export const BRANCHES: Branch[] = ['CSE', 'ECE', 'MECH', 'CIVIL'];
export const YEARS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const SUBJECTS: Record<Branch, string[]> = {
  CSE: ['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Machine Learning', 'Web Development', 'Discrete Mathematics'],
  ECE: ['Signal Processing', 'VLSI Design', 'Embedded Systems', 'Communication Theory', 'Analog Circuits', 'Digital Electronics'],
  MECH: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'Heat Transfer', 'Theory of Machines'],
  CIVIL: ['Structural Analysis', 'Geotechnical Engineering', 'Surveying', 'Concrete Technology', 'Environmental Engineering', 'Transportation'],
};

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Data Structures & Algorithms Complete Notes',
    subject: 'Data Structures',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Prof. Linda Wright',
    status: 'approved',
    upvotes: 89,
    summary: 'Comprehensive semester notes covering balanced BSTs, graph traversal algorithms (BFS/DFS), shortest paths, and dynamic programming.',
    format: 'PDF',
    fileSize: '4.2 MB',
    downloads: 320,
    approved: true,
    tags: ['Trees', 'Graphs', 'Big-O', 'Algorithms'],
    keyTakeaways: [
      'Master Theorem case 2 applies when f(n) = Theta(n^(log_b a))',
      'AVL Trees maintain balance factor in {-1, 0, +1}',
      'Dijkstra operates in O((V + E) log V) with min-heap priority queue'
    ]
  },
  {
    id: '2',
    title: 'Operating Systems Architecture & CPU Scheduling',
    subject: 'Operating Systems',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Dr. Marcus Vane',
    status: 'approved',
    upvotes: 64,
    summary: 'Detailed explanation of FCFS, SJF, Round Robin, Banker\'s algorithm, and semaphore sync mechanisms with step-by-step Gantt charts.',
    format: 'PDF',
    fileSize: '3.8 MB',
    downloads: 210,
    approved: true,
    tags: ['Processes', 'Scheduling', 'Deadlock', 'Memory'],
    keyTakeaways: [
      'Round-Robin time slice determines response vs context switch overhead',
      'Banker\'s Algorithm verifies safe sequence before allocation',
      'Page fault rate decreases with working set model caching'
    ]
  },
  {
    id: '3',
    title: 'Database Management Systems & SQL Normalization',
    subject: 'DBMS',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Prof. Rachel Evans',
    status: 'approved',
    upvotes: 78,
    summary: 'Step-by-step normalization (1NF–BCNF), relational algebra, transaction ACID properties, indexing, and SQL join queries.',
    format: 'PDF',
    fileSize: '5.1 MB',
    downloads: 280,
    approved: true,
    tags: ['SQL', 'BCNF', 'ACID', 'Transactions'],
    keyTakeaways: [
      '1NF requires atomic values; 2NF eliminates partial functional dependencies',
      '3NF eliminates transitive dependencies; BCNF requires superkeys on LHS',
      'Two-Phase Locking (2PL) guarantees conflict serializability'
    ]
  },
  {
    id: '4',
    title: 'Discrete Math & Logic Theory Handout',
    subject: 'Discrete Mathematics',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Dr. Kenneth Cho',
    status: 'approved',
    upvotes: 45,
    summary: 'Propositional calculus, predicate logic, recurrence relations, graph isomorphism, and combinatorics problem sets.',
    format: 'PDF',
    fileSize: '2.9 MB',
    downloads: 165,
    approved: true,
    tags: ['Logic', 'Graphs', 'Combinatorics'],
    keyTakeaways: [
      'Pigeonhole Principle applies to hash collision lower bounds',
      'Eulerian graph exists iff all vertices have even degree'
    ]
  },
  {
    id: '5',
    title: 'Web Development & Modern REST APIs',
    subject: 'Web Development',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Alex Morgan',
    status: 'approved',
    upvotes: 52,
    summary: 'Comprehensive handbook for React, Node.js backend architecture, authentication, and state management patterns.',
    format: 'PDF',
    fileSize: '6.4 MB',
    downloads: 290,
    approved: true,
    tags: ['React', 'Node.js', 'REST', 'TypeScript']
  },
  {
    id: '6',
    title: 'Computer Networks — TCP/IP & Protocol Stacks',
    subject: 'Computer Networks',
    branch: 'CSE',
    year: '3rd Year',
    fileUrl: '#',
    uploadedBy: 'Divya Nair',
    status: 'approved',
    upvotes: 91,
    summary: 'Layer-by-layer breakdown of TCP/IP vs OSI model, CIDR subnetting, BGP/OSPF routing, and TLS handshakes.',
    format: 'PDF',
    fileSize: '4.8 MB',
    downloads: 340,
    approved: true,
    tags: ['TCP/IP', 'Routing', 'Security']
  },
  {
    id: '7',
    title: 'Machine Learning — Regression, SVM & Neural Nets',
    subject: 'Machine Learning',
    branch: 'CSE',
    year: '4th Year',
    fileUrl: '#',
    uploadedBy: 'Sneha Patel',
    status: 'approved',
    upvotes: 114,
    summary: 'Supervised & unsupervised learning, gradient descent, loss landscapes, CNNs, and evaluation metrics with Python examples.',
    format: 'PDF',
    fileSize: '7.2 MB',
    downloads: 510,
    approved: true,
    tags: ['Neural Nets', 'SVM', 'Python']
  },
  {
    id: '8',
    title: 'Signal Processing — Fourier Transforms & Filtering',
    subject: 'Signal Processing',
    branch: 'ECE',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Rohit Kapoor',
    status: 'approved',
    upvotes: 58,
    summary: 'Continuous and discrete Fourier transforms, DFT, FFT, Z-transforms, and digital FIR/IIR filter design methodologies.',
    format: 'PDF',
    fileSize: '3.5 MB',
    downloads: 180,
    approved: true,
    tags: ['FFT', 'Filters', 'Signals']
  },
  {
    id: '9',
    title: 'VLSI Design — CMOS Logic Families & Layouts',
    subject: 'VLSI Design',
    branch: 'ECE',
    year: '3rd Year',
    fileUrl: '#',
    uploadedBy: 'Vikram Joshi',
    status: 'approved',
    upvotes: 49,
    summary: 'CMOS inverter DC characteristics, stick diagrams, Euler paths, RC delay modeling, and layout design rules.',
    format: 'PDF',
    fileSize: '4.1 MB',
    downloads: 140,
    approved: true,
    tags: ['CMOS', 'Layouts', 'VLSI']
  },
  {
    id: '10',
    title: 'Thermodynamics — Zeroth to Third Law Applications',
    subject: 'Thermodynamics',
    branch: 'MECH',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Neha Gupta',
    status: 'approved',
    upvotes: 62,
    summary: 'Carnot heat engines, entropy derivations, Rankine & Brayton power cycles, and steam tables numerical solutions.',
    format: 'PDF',
    fileSize: '3.9 MB',
    downloads: 195,
    approved: true,
    tags: ['Entropy', 'Carnot', 'Cycles']
  },
  {
    id: '11',
    title: 'Structural Analysis — Truss Analysis & Deflections',
    subject: 'Structural Analysis',
    branch: 'CIVIL',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Anita Deshmukh',
    status: 'approved',
    upvotes: 47,
    summary: 'Method of joints, method of sections, Castigliano\'s theorem, and influence line diagrams for determinate structures.',
    format: 'PDF',
    fileSize: '4.4 MB',
    downloads: 130,
    approved: true,
    tags: ['Trusses', 'Deflections', 'Structures']
  },
  {
    id: '12',
    title: 'Fluid Mechanics — Bernoulli & Navier-Stokes',
    subject: 'Fluid Mechanics',
    branch: 'MECH',
    year: '2nd Year',
    fileUrl: '#',
    uploadedBy: 'Amit Rao',
    status: 'approved',
    upvotes: 53,
    summary: 'Fluid statics, continuity equation, Bernoulli applications in venturimeters, and boundary layer theory.',
    format: 'PDF',
    fileSize: '3.7 MB',
    downloads: 170,
    approved: true,
    tags: ['Bernoulli', 'Navier-Stokes', 'Fluids']
  }
];

export const INITIAL_RESOURCES = mockResources;
