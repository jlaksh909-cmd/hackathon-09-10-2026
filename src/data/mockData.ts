export type Branch = 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type ResourceStatus = 'pending' | 'approved' | 'rejected';
export type ResourceCategory = 'Notes' | 'PYQ' | 'Syllabus' | 'Reference' | 'CheatSheet';

export interface Resource {
  id: string;
  title: string;
  subject: string;
  category: ResourceCategory;
  branch: Branch;
  year: Year;
  semester: number;
  format: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  fileUrl: string;
  downloadUrl: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  status: ResourceStatus;
  upvotes: number;
  approved: boolean;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
}

export const BRANCH_OPTIONS: Branch[] = ['CSE', 'ECE', 'MECH', 'CIVIL'];
export const YEAR_OPTIONS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-dsa-01',
    title: 'Data Structures & Algorithms - Complete Visual Notes & LeetCode Patterns',
    subject: 'Data Structures & Algorithms',
    category: 'Notes',
    branch: 'CSE',
    year: '2nd Year',
    semester: 3,
    format: 'PDF',
    fileSize: '4.8 MB',
    fileUrl: 'https://example.com/resources/cse-dsa-visual-guide.pdf',
    downloadUrl: 'https://example.com/resources/cse-dsa-visual-guide.pdf',
    uploadedBy: 'Aarav Sharma (Senior, 4th Year)',
    uploadDate: '2026-08-15',
    downloads: 1420,
    status: 'approved',
    upvotes: 388,
    approved: true,
    summary: 'Comprehensive classroom and revision notes covering Arrays, Linked Lists, Stacks, Queues, Binary Trees, BSTs, Graphs (BFS/DFS, Dijkstra), and Dynamic Programming with time & space complexity analysis.',
    keyTakeaways: [
      'Master Big-O asymptotic analysis and space complexity tradeoffs.',
      'Understand recurring tree traversals (Inorder, Preorder, Postorder) and AVL rotations.',
      'Core graph algorithms: Dijkstra, Prim\'s, and Kruskal\'s are guaranteed 15-mark semester exam questions.',
      'Includes 50+ solved LeetCode patterns frequently asked in campus placements.'
    ],
    tags: ['dsa', 'trees', 'graphs', 'algorithms', 'cse', 'placement']
  },
  {
    id: 'res-m1-02',
    title: 'Engineering Mathematics - I (M1) Handwritten Complete Notes & Formulas',
    subject: 'Engineering Mathematics - I',
    category: 'Notes',
    branch: 'CSE',
    year: '1st Year',
    semester: 1,
    format: 'PDF',
    fileSize: '6.2 MB',
    fileUrl: 'https://example.com/resources/m1-handwritten-notes.pdf',
    downloadUrl: 'https://example.com/resources/m1-handwritten-notes.pdf',
    uploadedBy: 'Prof. K. Venkat (Senior Faculty)',
    uploadDate: '2026-09-01',
    downloads: 2150,
    status: 'approved',
    upvotes: 512,
    approved: true,
    summary: 'Curated student handwritten notes with step-by-step solved problems on Matrices (Rank, Eigenvalues, Cayley-Hamilton theorem), Differential Calculus, Taylor Series, and Multiple Integrals with exam tips.',
    keyTakeaways: [
      'Eigenvalues & Eigenvectors and Cayley-Hamilton theorem consistently cover 20+ marks.',
      'Formula cheat sheet for Jacobians, Maxima & Minima of two variables.',
      'Step-by-step shortcuts to evaluate double and triple integrals without calculation errors.',
      'Annotated with high-frequency previous 5-year exam question patterns.'
    ],
    tags: ['m1', 'math', 'matrices', 'calculus', 'first-year', 'eigenvalues']
  },
  {
    id: 'res-os-03',
    title: 'Operating Systems - Concurrency, Scheduling & Memory Paging Manual',
    subject: 'Operating Systems',
    category: 'Notes',
    branch: 'CSE',
    year: '3rd Year',
    semester: 5,
    format: 'PDF',
    fileSize: '3.9 MB',
    fileUrl: 'https://example.com/resources/os-concurrency-cheatsheet.pdf',
    downloadUrl: 'https://example.com/resources/os-concurrency-cheatsheet.pdf',
    uploadedBy: 'Prof. S. Ranganathan',
    uploadDate: '2026-08-25',
    downloads: 1290,
    status: 'approved',
    upvotes: 98,
    approved: true,
    summary: 'Detailed explanation of Peterson algorithm, semaphores, deadlock detection algorithms, and virtual memory page replacement policies with previous year university questions.',
    keyTakeaways: [
      'Deadlock prevention vs avoidance (Banker\'s algorithm) step-by-step.',
      'CPU Scheduling gantt charts for Round Robin and Multi-level feedback queues.',
      'Page fault rate calculation and LRU/FIFO comparative proofs.'
    ],
    tags: ['os', 'operating systems', 'concurrency', 'paging', 'cse']
  },
  {
    id: 'res-dsp-04',
    title: 'Digital Signal Processing - FFT & IIR/FIR Filter Design Question Bank',
    subject: 'Digital Signal Processing',
    category: 'Reference',
    branch: 'ECE',
    year: '3rd Year',
    semester: 5,
    format: 'PDF',
    fileSize: '4.5 MB',
    fileUrl: 'https://example.com/resources/ece-dsp-filter-design.pdf',
    downloadUrl: 'https://example.com/resources/ece-dsp-filter-design.pdf',
    uploadedBy: 'Neha Verma (TA, ECE)',
    uploadDate: '2026-08-18',
    downloads: 780,
    status: 'approved',
    upvotes: 76,
    approved: true,
    summary: 'Step-by-step derivations of Radix-2 DIT/DIF FFT algorithms, Butterworth filter design formulas, bilinear transformation methods, and MATLAB code samples.',
    keyTakeaways: [
      'Radix-2 butterfly signal flow graphs for 8-point sequences.',
      'Bilinear transformation bilinear mapping distortion and pre-warping.',
      'Chebyshev Type I and II filter frequency response characteristics.'
    ],
    tags: ['dsp', 'signals', 'fft', 'filters', 'ece']
  },
  {
    id: 'res-bee-05',
    title: 'Basic Electrical Engineering (BEE) Solved Question Bank',
    subject: 'Basic Electrical Engineering',
    category: 'PYQ',
    branch: 'ECE',
    year: '1st Year',
    semester: 1,
    format: 'PDF',
    fileSize: '3.4 MB',
    fileUrl: 'https://example.com/resources/bee-question-bank.pdf',
    downloadUrl: 'https://example.com/resources/bee-question-bank.pdf',
    uploadedBy: 'Academic Cell',
    uploadDate: '2026-08-20',
    downloads: 1180,
    status: 'approved',
    upvotes: 245,
    approved: true,
    summary: 'Topic-wise solved question bank containing KCL/KVL mesh analysis, AC fundamentals (phasors, power factor), DC Machines, Transformers, and Three-Phase circuits with labeled circuit diagrams.',
    keyTakeaways: [
      'Node & Mesh analysis are foundational—master sign conventions first.',
      'Transformer equivalent circuits and efficiency equations are top exam favorites.',
      '3-Phase star and delta relationship derivations yield guaranteed full scores.'
    ],
    tags: ['bee', 'electrical', 'kcl', 'kvl', 'transformers', 'first-year']
  },
  {
    id: 'res-thermo-06',
    title: 'Thermodynamics & Heat Transfer - Formula Pocketbook & Solved Numericals',
    subject: 'Thermodynamics',
    category: 'CheatSheet',
    branch: 'MECH',
    year: '2nd Year',
    semester: 3,
    format: 'PDF',
    fileSize: '3.7 MB',
    fileUrl: 'https://example.com/resources/mech-thermo-handbook.pdf',
    downloadUrl: 'https://example.com/resources/mech-thermo-handbook.pdf',
    uploadedBy: 'Vikram Joshi (Senior, MECH)',
    uploadDate: '2026-09-02',
    downloads: 910,
    status: 'approved',
    upvotes: 115,
    approved: true,
    summary: 'All first and second law derivations, Carnot cycle analysis, steam table usage guidelines, and transient heat conduction numerical problems with detailed solutions.',
    keyTakeaways: [
      'First and second laws of thermodynamics closed vs open system equations.',
      'Mollier diagram enthalpy-entropy state determinations.',
      'One-dimensional Fourier conduction with convective boundary conditions.'
    ],
    tags: ['thermodynamics', 'heat transfer', 'carnot', 'mech']
  },
  {
    id: 'res-struct-07',
    title: 'Structural Analysis II - Moment Distribution & Slope Deflection Solved Examples',
    subject: 'Structural Engineering',
    category: 'PYQ',
    branch: 'CIVIL',
    year: '3rd Year',
    semester: 5,
    format: 'PDF',
    fileSize: '5.2 MB',
    fileUrl: 'https://example.com/resources/civil-structural-analysis-2.pdf',
    downloadUrl: 'https://example.com/resources/civil-structural-analysis-2.pdf',
    uploadedBy: 'Pooja Kulkarni (3rd Year, CIVIL)',
    uploadDate: '2026-09-12',
    downloads: 320,
    status: 'pending',
    upvotes: 12,
    approved: false,
    summary: 'Collection of 20+ past semester solved questions on continuous beams, non-sway portal frames using Hardy Cross moment distribution method with step-by-step free body diagrams.',
    keyTakeaways: [
      'Continuous beam carryover factor and distribution factor rules.',
      'Sway analysis equations for asymmetric portal frames.',
      'Matrix stiffness approach formulation for plane trusses.'
    ],
    tags: ['structures', 'civil', 'beams', 'frames', 'hardy-cross']
  },
  {
    id: 'res-micro-08',
    title: 'Microprocessors & Microcontrollers (8086/8051) Lab Manual with Assembly Code',
    subject: 'Microprocessors',
    category: 'Notes',
    branch: 'ECE',
    year: '2nd Year',
    semester: 4,
    format: 'PDF',
    fileSize: '2.8 MB',
    fileUrl: 'https://example.com/resources/ece-8086-lab-manual.pdf',
    downloadUrl: 'https://example.com/resources/ece-8086-lab-manual.pdf',
    uploadedBy: 'Devendra Patel (2nd Year, ECE)',
    uploadDate: '2026-09-15',
    downloads: 145,
    status: 'pending',
    upvotes: 8,
    approved: false,
    summary: 'Verified MASM code listings for string manipulation, sorting, 8255 PPI interfacing, and 8051 timer configuration experiments with wiring diagrams and register maps.',
    keyTakeaways: [
      '8086 segment register addressing modes and physical memory calculations.',
      'Interrupt vector table (IVT) mapping and hardware ISR programming.',
      '8051 SFR timer mode 1 and mode 2 baud rate generator routines.'
    ],
    tags: ['microprocessors', '8086', '8051', 'assembly', 'ece']
  },
  {
    id: 'res-ml-09',
    title: 'Applied Machine Learning & Deep Learning - Midterm Notes & PyTorch Cheatsheet',
    subject: 'Machine Learning',
    category: 'CheatSheet',
    branch: 'CSE',
    year: '4th Year',
    semester: 7,
    format: 'PDF',
    fileSize: '6.4 MB',
    fileUrl: 'https://example.com/resources/cse-ml-dl-handbook.pdf',
    downloadUrl: 'https://example.com/resources/cse-ml-dl-handbook.pdf',
    uploadedBy: 'Rohan Mehra (Research Scholar)',
    uploadDate: '2026-09-18',
    downloads: 680,
    status: 'pending',
    upvotes: 34,
    approved: false,
    summary: 'Theoretical foundations of gradient descent, backpropagation, CNN architectures (ResNet, VGG), and Transformer self-attention mechanism with PyTorch training loops.',
    keyTakeaways: [
      'Loss backpropagation matrix calculus and vanishing gradient remedies.',
      'Residual skip connection derivations and spatial dimension reduction.',
      'Scaled dot-product attention equation and multi-head projection layers.'
    ],
    tags: ['machine-learning', 'deep-learning', 'pytorch', 'transformers', 'cse']
  },
  {
    id: 'res-survey-10',
    title: 'Surveying & Geomatics - Total Station & GPS Surveying Quick Reference',
    subject: 'Surveying',
    category: 'Reference',
    branch: 'CIVIL',
    year: '1st Year',
    semester: 2,
    format: 'PDF',
    fileSize: '3.1 MB',
    fileUrl: 'https://example.com/resources/civil-surveying-notes.pdf',
    downloadUrl: 'https://example.com/resources/civil-surveying-notes.pdf',
    uploadedBy: 'Kavita Sundaram (1st Year, CIVIL)',
    uploadDate: '2026-08-30',
    downloads: 510,
    status: 'approved',
    upvotes: 54,
    approved: true,
    summary: 'Basic principles of leveling, theodolite traversing, curve setting, and modern total station error adjustment techniques for engineering surveying field work.',
    keyTakeaways: [
      'Two-peg test procedure and collimation error determination.',
      'Bowditch and Transit methods for compass traverse adjustment.',
      'Total station prism constant and atmospheric correction parameters.'
    ],
    tags: ['surveying', 'geomatics', 'total-station', 'civil', 'first-year']
  }
];
