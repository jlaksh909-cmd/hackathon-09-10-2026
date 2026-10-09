export type Branch = 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
export type Year = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
export type ResourceStatus = 'pending' | 'approved' | 'rejected';

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

export const BRANCH_OPTIONS: Branch[] = ['CSE', 'ECE', 'MECH', 'CIVIL'];
export const YEAR_OPTIONS: Year[] = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms - Complete Visual Notes & LeetCode Patterns',
    subject: 'Data Structures',
    branch: 'CSE',
    year: '2nd Year',
    fileUrl: 'https://example.com/resources/cse-dsa-visual-guide.pdf',
    uploadedBy: 'Aarav Sharma (Senior, 4th Year)',
    status: 'approved',
    upvotes: 142,
    summary: 'Comprehensive handwritten & typed breakdown of Binary Search Trees, Graphs, Dynamic Programming paradigms, and recursion trees with ASCII diagrams.',
  },
  {
    id: 'res-2',
    title: 'Operating Systems - Concurrency, Scheduling & Memory Paging Manual',
    subject: 'Operating Systems',
    branch: 'CSE',
    year: '3rd Year',
    fileUrl: 'https://example.com/resources/os-concurrency-cheatsheet.pdf',
    uploadedBy: 'Prof. S. Ranganathan',
    status: 'approved',
    upvotes: 98,
    summary: 'Detailed explanation of Peterson algorithm, semaphores, deadlock detection algorithms, and virtual memory page replacement policies with previous year university questions.',
  },
  {
    id: 'res-3',
    title: 'Digital Signal Processing - FFT & IIR/FIR Filter Design Question Bank',
    subject: 'Digital Signal Processing',
    branch: 'ECE',
    year: '3rd Year',
    fileUrl: 'https://example.com/resources/ece-dsp-filter-design.pdf',
    uploadedBy: 'Neha Verma (TA, ECE)',
    status: 'approved',
    upvotes: 76,
    summary: 'Step-by-step derivations of Radix-2 DIT/DIF FFT algorithms, Butterworth filter design formulas, bilinear transformation methods, and MATLAB code samples.',
  },
  {
    id: 'res-4',
    title: 'Thermodynamics & Heat Transfer - Formula Pocketbook & Solved Numericals',
    subject: 'Thermodynamics',
    branch: 'MECH',
    year: '2nd Year',
    fileUrl: 'https://example.com/resources/mech-thermo-handbook.pdf',
    uploadedBy: 'Vikram Joshi (Senior, MECH)',
    status: 'approved',
    upvotes: 115,
    summary: 'All first and second law derivations, Carnot cycle analysis, steam table usage guidelines, and transient heat conduction numerical problems with detailed solutions.',
  },
  {
    id: 'res-5',
    title: 'Structural Analysis II - Moment Distribution & Slope Deflection Solved Examples',
    subject: 'Structural Engineering',
    branch: 'CIVIL',
    year: '3rd Year',
    fileUrl: 'https://example.com/resources/civil-structural-analysis-2.pdf',
    uploadedBy: 'Pooja Kulkarni (3rd Year, CIVIL)',
    status: 'pending',
    upvotes: 12,
    summary: 'Collection of 20+ past semester solved questions on continuous beams, non-sway portal frames using Hardy Cross moment distribution method with step-by-step free body diagrams.',
  },
  {
    id: 'res-6',
    title: 'Microprocessors & Microcontrollers (8086/8051) Lab Manual with Assembly Code',
    subject: 'Microprocessors',
    branch: 'ECE',
    year: '2nd Year',
    fileUrl: 'https://example.com/resources/ece-8086-lab-manual.pdf',
    uploadedBy: 'Devendra Patel (2nd Year, ECE)',
    status: 'pending',
    upvotes: 8,
    summary: 'Verified MASM code listings for string manipulation, sorting, 8255 PPI interfacing, and 8051 timer configuration experiments with wiring diagrams and register maps.',
  },
  {
    id: 'res-7',
    title: 'Applied Machine Learning & Deep Learning - Midterm Notes & PyTorch Cheatsheet',
    subject: 'Machine Learning',
    branch: 'CSE',
    year: '4th Year',
    fileUrl: 'https://example.com/resources/cse-ml-dl-handbook.pdf',
    uploadedBy: 'Rohan Mehra (Research Scholar)',
    status: 'pending',
    upvotes: 34,
    summary: 'Theoretical foundations of gradient descent, backpropagation, CNN architectures (ResNet, VGG), and Transformer self-attention mechanism with PyTorch training loops.',
  },
  {
    id: 'res-8',
    title: 'Surveying & Geomatics - Total Station & GPS Surveying Quick Reference',
    subject: 'Surveying',
    branch: 'CIVIL',
    year: '1st Year',
    fileUrl: 'https://example.com/resources/civil-surveying-notes.pdf',
    uploadedBy: 'Kavita Sundaram (1st Year, CIVIL)',
    status: 'approved',
    upvotes: 54,
    summary: 'Basic principles of leveling, theodolite traversing, curve setting, and modern total station error adjustment techniques for engineering surveying field work.',
  }
];
