import { useState, useMemo } from 'react';
import {
  BookOpen,
  Layers,
  Cpu,
  Database,
  Calculator,
  Code2,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  FileText,
  Search,
  ExternalLink
} from 'lucide-react';
import type { Branch, Year, Resource } from '../../data/mockData';
import { SUBJECTS } from '../../data/mockData';
import DocumentPreviewModal from '../library/DocumentPreviewModal';

interface CourseModulesProps {
  selectedBranch: Branch;
  selectedYear: Year;
  resources: Resource[];
  onUpvote: (id: string) => void;
  onNavigateToNotes?: (subject: string) => void;
}

interface UnitDetail {
  unitNumber: number;
  title: string;
  topics: string[];
  weightage: string;
  completed: boolean;
}

interface CourseData {
  id: string;
  name: string;
  code: string;
  credits: number;
  faculty: string;
  progress: number;
  description: string;
  units: UnitDetail[];
}

export default function CourseModules({
  selectedBranch,
  selectedYear,
  resources,
  onUpvote,
}: CourseModulesProps) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const subjectList = SUBJECTS[selectedBranch] || [];

  // Generate detailed course modules based on selected branch and year
  const courses: CourseData[] = useMemo(() => {
    return subjectList.map((subj, idx) => {
      const codeMap: Record<string, string> = {
        'Data Structures': 'CS201',
        'Operating Systems': 'CS202',
        'DBMS': 'CS203',
        'Computer Networks': 'CS301',
        'Machine Learning': 'CS401',
        'Web Development': 'CS205',
        'Discrete Mathematics': 'MA201',
        'Signal Processing': 'EC201',
        'VLSI Design': 'EC301',
        'Embedded Systems': 'EC203',
        'Thermodynamics': 'ME201',
        'Fluid Mechanics': 'ME202',
        'Structural Analysis': 'CE201',
      };

      const facultyMap: Record<string, string> = {
        'Data Structures': 'Prof. Linda Wright',
        'Operating Systems': 'Dr. Marcus Vane',
        'DBMS': 'Prof. Rachel Evans',
        'Computer Networks': 'Divya Nair',
        'Machine Learning': 'Sneha Patel',
        'Web Development': 'Alex Morgan',
        'Discrete Mathematics': 'Dr. Kenneth Cho',
        'Signal Processing': 'Rohit Kapoor',
        'VLSI Design': 'Vikram Joshi',
        'Thermodynamics': 'Neha Gupta',
        'Fluid Mechanics': 'Amit Rao',
        'Structural Analysis': 'Anita Deshmukh',
      };

      return {
        id: `course-${idx + 1}`,
        name: subj,
        code: codeMap[subj] || `${selectedBranch.slice(0, 2)}${200 + idx}`,
        credits: idx === 0 || idx === 1 ? 4 : 3,
        faculty: facultyMap[subj] || 'Faculty Chair',
        progress: idx === 0 ? 85 : idx === 1 ? 70 : idx === 2 ? 60 : 45,
        description: `Comprehensive core curriculum syllabus covering theoretical proofs, worked problems, and university exam questions for ${subj}.`,
        units: [
          {
            unitNumber: 1,
            title: 'Foundational Principles & Mathematical Formulations',
            topics: ['Asymptotic notations', 'Fundamental theorems', 'Base case proofs', 'Model question sets'],
            weightage: '20% (15 Marks)',
            completed: true,
          },
          {
            unitNumber: 2,
            title: 'Algorithmic Paradigms & Core Architecture',
            topics: ['State space models', 'Recurrence relations', 'Optimization invariants', 'Midterm derivations'],
            weightage: '25% (20 Marks)',
            completed: idx <= 1,
          },
          {
            unitNumber: 3,
            title: 'Advanced Applications & Systematic Case Studies',
            topics: ['Distributed models', 'System integration', 'Performance bounds', 'End-semester numericals'],
            weightage: '30% (25 Marks)',
            completed: false,
          },
          {
            unitNumber: 4,
            title: 'Specialized Topics & University Review Pack',
            topics: ['Industry case studies', 'Previous 5-year PYQ synthesis', 'Formula cheat sheet review'],
            weightage: '25% (20 Marks)',
            completed: false,
          },
        ],
      };
    });
  }, [subjectList, selectedBranch]);

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.faculty.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const courseResources = resources.filter(
    (r) => activeCourse && (r.subject.toLowerCase() === activeCourse.name.toLowerCase() || r.title.toLowerCase().includes(activeCourse.name.toLowerCase()))
  );

  const getSubjectIcon = (subj: string) => {
    const s = subj.toLowerCase();
    if (s.includes('data') || s.includes('structure') || s.includes('algorithm')) return <Layers className="w-5 h-5 text-indigo-600" />;
    if (s.includes('os') || s.includes('operating') || s.includes('network') || s.includes('embedded') || s.includes('vlsi')) return <Cpu className="w-5 h-5 text-indigo-600" />;
    if (s.includes('dbms') || s.includes('database') || s.includes('sql')) return <Database className="w-5 h-5 text-indigo-600" />;
    if (s.includes('math') || s.includes('discrete') || s.includes('fluid') || s.includes('thermo')) return <Calculator className="w-5 h-5 text-indigo-600" />;
    return <Code2 className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      
      {/* ── Top Header & Stats ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                Syllabus & Units Guide
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {selectedBranch} • {selectedYear}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Course Modules & Unit Breakdown
            </h1>
          </div>
        </div>

        {/* Search inside Course Modules */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search courses or codes..."
            className="w-full pl-9.5 pr-4 py-2 text-xs bg-zinc-50 hover:bg-zinc-100/80 focus:bg-white border border-zinc-200 rounded-full text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-all font-medium"
          />
        </div>
      </div>

      {/* ── Main Bento Split: Course List (5 Cols) & Active Course Syllabus (7 Cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Course Module Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Registered Courses ({filteredCourses.length})
            </h2>
            <span className="text-xs font-semibold text-zinc-500">
              Spring Semester
            </span>
          </div>

          <div className="space-y-3">
            {filteredCourses.map((course) => {
              const isSelected = (activeCourse && activeCourse.id === course.id);
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`
                    p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3
                    ${
                      isSelected
                        ? 'bg-white border-zinc-900 shadow-md shadow-zinc-900/5 ring-1 ring-zinc-900'
                        : 'bg-white border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-zinc-100' : 'bg-zinc-50'}`}>
                        {getSubjectIcon(course.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase bg-zinc-100 px-1.5 py-0.5 rounded">
                            {course.code}
                          </span>
                          <span className="text-[11px] font-semibold text-zinc-400">
                            {course.credits} Credits
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-zinc-900 mt-0.5">
                          {course.name}
                        </h3>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-zinc-900 translate-x-1' : 'text-zinc-300'}`} />
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 flex items-center gap-1 font-medium">
                        <GraduationCap className="w-3.5 h-3.5" /> {course.faculty}
                      </span>
                      <span className="font-bold text-zinc-800">{course.progress}% Complete</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded-full bg-zinc-900" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Syllabus & Associated Lecture Monographs (7 Cols) */}
        {activeCourse && (
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Active Course Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-4">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 font-mono font-bold text-xs">
                      {activeCourse.code}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Core Requirement • {activeCourse.credits} Credits
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-zinc-900">
                    {activeCourse.name}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Instructor: <strong className="text-zinc-800">{activeCourse.faculty}</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                {activeCourse.description}
              </p>

              {/* Units Accordion / Breakdown */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Unit-By-Unit Syllabus & Exam Weightage
                </h3>

                {activeCourse.units.map((unit) => (
                  <div
                    key={unit.unitNumber}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 font-bold text-[10px] flex items-center justify-center">
                          {unit.unitNumber}
                        </span>
                        <h4 className="font-bold text-xs text-zinc-900">
                          {unit.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {unit.weightage}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {unit.topics.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white border border-zinc-200 text-[10px] font-medium text-zinc-600 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Verified Notes & Handouts */}
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-800" />
                  <h3 className="font-bold text-sm text-zinc-900">
                    Verified Notes for {activeCourse.name} ({courseResources.length})
                  </h3>
                </div>
              </div>

              {courseResources.length > 0 ? (
                <div className="space-y-2.5">
                  {courseResources.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => setPreviewResource(res)}
                      className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                          {res.title}
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                          By {res.uploadedBy} • {res.upvotes} Student Endorsements
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewResource(res);
                        }}
                        className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span>Preview Note</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-zinc-400">
                  No uploaded notes found for this subject yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Document Reader Preview Modal */}
      {previewResource && (
        <DocumentPreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onUpvote={onUpvote}
        />
      )}
    </div>
  );
}
