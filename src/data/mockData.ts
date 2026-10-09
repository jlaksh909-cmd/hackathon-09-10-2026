export interface Resource {
  id: string;
  title: string;
  subject: string;
  category: 'Notes' | 'PYQ' | 'Syllabus' | 'Reference' | 'CheatSheet';
  branch: string;
  year: number;
  semester: number;
  format: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  downloadUrl: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  upvotes: number;
  approved: boolean;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
}

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-dsa-01',
    title: 'DSA Complete Notes',
    subject: 'Data Structures & Algorithms',
    category: 'Notes',
    branch: 'CSE',
    year: 2,
    semester: 3,
    format: 'PDF',
    fileSize: '4.8 MB',
    downloadUrl: '#dsa-complete-notes',
    uploadedBy: 'Dr. R. Sharma (HOD CSE)',
    uploadDate: '2026-08-15',
    downloads: 1420,
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
    title: 'M1 Handwritten Complete Formula & Notes',
    subject: 'Engineering Mathematics - I (M1)',
    category: 'Notes',
    branch: 'Common (All Branches)',
    year: 1,
    semester: 1,
    format: 'PDF',
    fileSize: '6.2 MB',
    downloadUrl: '#m1-handwritten-notes',
    uploadedBy: 'Prof. K. Venkat (Senior Faculty)',
    uploadDate: '2026-09-01',
    downloads: 2150,
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
    id: 'res-bee-03',
    title: 'Basic Electrical Engineering (BEE) Question Bank',
    subject: 'Basic Electrical Engineering (BEE)',
    category: 'PYQ',
    branch: 'Common (All Branches)',
    year: 1,
    semester: 1,
    format: 'PDF',
    fileSize: '3.4 MB',
    downloadUrl: '#bee-question-bank',
    uploadedBy: 'Academic Cell',
    uploadDate: '2026-08-20',
    downloads: 1180,
    upvotes: 245,
    approved: true,
    summary: 'Topic-wise solved question bank containing KCL/KVL mesh analysis, AC fundamentals (phasors, power factor), DC Machines, Transformers, and Three-Phase circuits with labeled circuit diagrams.',
    keyTakeaways: [
      'Node & Mesh analysis are foundational—master sign conventions first.',
      'Transformer equivalent circuits and efficiency equations are top exam favorites.',
      '3-Phase star and delta relationship derivations yield guaranteed full scores.',
      'Includes common pitfalls in AC sinusoidal phasor diagrams.'
    ],
    tags: ['bee', 'electrical', 'kcl', 'kvl', 'transformers', 'first-year']
  },
  {
    id: 'res-phy-04',
    title: 'Engineering Physics Formula & Lab Guide',
    subject: 'Engineering Physics',
    category: 'Reference',
    branch: 'Common (All Branches)',
    year: 1,
    semester: 1,
    format: 'PDF',
    fileSize: '2.9 MB',
    downloadUrl: '#engineering-physics-guide',
    uploadedBy: 'Prof. Ananya Sen',
    uploadDate: '2026-09-10',
    downloads: 980,
    upvotes: 198,
    approved: true,
    summary: 'Essential derivations for Quantum Mechanics (Schrödinger wave equation), Wave Optics (Interference, Diffraction gratings), Lasers, and Fiber Optics with numerical problem walkthroughs.',
    keyTakeaways: [
      '1D Particle in a box energy quantization derivation is mandatory for section B.',
      'Distinguish clearly between Step Index and Graded Index fiber numerical aperture.',
      'Newton\'s Rings experimental setup and formula derivations with diagrams.'
    ],
    tags: ['physics', 'lasers', 'quantum', 'optics', 'first-year']
  },
  {
    id: 'res-py-05',
    title: 'Python Programming Lab Manual & Solutions',
    subject: 'Programming for Problem Solving (Python)',
    category: 'Notes',
    branch: 'CSE',
    year: 1,
    semester: 2,
    format: 'PDF',
    fileSize: '3.1 MB',
    downloadUrl: '#python-lab-manual',
    uploadedBy: 'Tech Club Mentors',
    uploadDate: '2026-07-28',
    downloads: 1650,
    upvotes: 420,
    approved: true,
    summary: 'Beginner-friendly lab solutions covering conditionals, loops, functions, lists/dictionaries, file I/O, OOP principles, and basic Numpy/Matplotlib visualization with clean comments.',
    keyTakeaways: [
      'Understand mutable vs immutable data types (List vs Tuple vs Dictionary).',
      'File handling best practices using Python context managers (`with` statements).',
      'Exception handling mechanisms (try-except-finally) and custom exceptions.'
    ],
    tags: ['python', 'programming', 'first-year', 'lab', 'cse']
  },
  {
    id: 'res-de-06',
    title: 'Digital Electronics & Logic Design PYQs',
    subject: 'Digital Electronics (DE)',
    category: 'PYQ',
    branch: 'ECE / CSE',
    year: 2,
    semester: 3,
    format: 'PDF',
    fileSize: '5.1 MB',
    downloadUrl: '#de-pyq-solved',
    uploadedBy: 'ECE Department',
    uploadDate: '2026-08-30',
    downloads: 870,
    upvotes: 210,
    approved: true,
    summary: 'Past 5 years solved university exam question papers covering Boolean algebra, K-Maps (up to 5 variables), Multiplexers, Flip-Flops, Counters, and Finite State Machines (FSM).',
    keyTakeaways: [
      'K-map grouping rules and don\'t care conditions simplify complex logic circuits.',
      'Master state transition tables and excitation tables for JK and D Flip-Flops.',
      'Synchronous up/down counter design steps are recurring 10-mark questions.'
    ],
    tags: ['digital-electronics', 'de', 'kmaps', 'flipflops', 'ece', 'cse']
  }
];
