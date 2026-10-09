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
  }
];
