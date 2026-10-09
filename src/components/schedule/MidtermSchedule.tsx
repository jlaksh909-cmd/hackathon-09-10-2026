import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import type { Branch, Year } from '../../data/mockData';
import { BRANCHES, YEARS } from '../../data/mockData';

interface MidtermScheduleProps {
  selectedBranch: Branch;
  selectedYear: Year;
  onNavigateToAssistant?: () => void;
}

interface ExamSlot {
  id: string;
  courseCode: string;
  courseName: string;
  branch: Branch;
  year: Year;
  date: string;
  time: string;
  room: string;
  units: string;
  weightage: string;
  daysRemaining: number;
  status: 'Upcoming' | 'Tomorrow' | 'Completed';
  studyGuideUrl?: string;
}

const ALL_EXAMS: ExamSlot[] = [
  {
    id: 'ex-1',
    courseCode: 'CS301',
    courseName: 'Data Structures & Algorithms',
    branch: 'CSE',
    year: '2nd Year',
    date: 'Oct 14, 2026',
    time: '09:30 AM - 12:30 PM',
    room: 'Hall A (LH-102)',
    units: 'Units 1, 2, 3 (Trees, Graphs, DP)',
    weightage: '30% Midterm',
    daysRemaining: 5,
    status: 'Upcoming',
  },
  {
    id: 'ex-2',
    courseCode: 'CS302',
    courseName: 'Database Management Systems',
    branch: 'CSE',
    year: '2nd Year',
    date: 'Oct 16, 2026',
    time: '02:00 PM - 05:00 PM',
    room: 'Hall B (LH-204)',
    units: 'Units 1-3 (Relational Algebra, SQL, Normalization)',
    weightage: '30% Midterm',
    daysRemaining: 7,
    status: 'Upcoming',
  },
  {
    id: 'ex-3',
    courseCode: 'CS303',
    courseName: 'Computer Organization & Architecture',
    branch: 'CSE',
    year: '2nd Year',
    date: 'Oct 19, 2026',
    time: '09:30 AM - 12:30 PM',
    room: 'Hall A (LH-101)',
    units: 'Units 1, 2 (Pipelining, Cache Mapping, ALU)',
    weightage: '30% Midterm',
    daysRemaining: 10,
    status: 'Upcoming',
  },
  {
    id: 'ex-4',
    courseCode: 'EC201',
    courseName: 'Digital Logic & Circuit Design',
    branch: 'ECE',
    year: '2nd Year',
    date: 'Oct 15, 2026',
    time: '09:30 AM - 12:30 PM',
    room: 'Lab Complex 3',
    units: 'Units 1-3 (K-Maps, Sequential Circuits, Multiplexers)',
    weightage: '30% Midterm',
    daysRemaining: 6,
    status: 'Upcoming',
  },
  {
    id: 'ex-5',
    courseCode: 'EC204',
    courseName: 'Digital Signal Processing',
    branch: 'ECE',
    year: '3rd Year',
    date: 'Oct 16, 2026',
    time: '09:30 AM - 12:30 PM',
    room: 'Room 302',
    units: 'Units 1-3 (DFT, FFT, IIR Filter Design)',
    weightage: '30% Midterm',
    daysRemaining: 7,
    status: 'Upcoming',
  },
  {
    id: 'ex-6',
    courseCode: 'CV202',
    courseName: 'Structural Mechanics & Analysis',
    branch: 'CIVIL',
    year: '3rd Year',
    date: 'Oct 18, 2026',
    time: '02:00 PM - 05:00 PM',
    room: 'Civil Design Lab 01',
    units: 'Units 1-3 (Bending Moments, Shear Forces, Deflection)',
    weightage: '30% Midterm',
    daysRemaining: 9,
    status: 'Upcoming',
  },
  {
    id: 'ex-7',
    courseCode: 'ME301',
    courseName: 'Thermodynamics & Heat Transfer',
    branch: 'MECH',
    year: '2nd Year',
    date: 'Oct 20, 2026',
    time: '09:30 AM - 12:30 PM',
    room: 'Mech Block Hall 4',
    units: 'Units 1-2 (First & Second Laws, Carnot Engine, Conduction)',
    weightage: '30% Midterm',
    daysRemaining: 11,
    status: 'Upcoming',
  },
];

export default function MidtermSchedule({
  selectedBranch,
  selectedYear,
  onNavigateToAssistant,
}: MidtermScheduleProps) {
  const [filterBranch, setFilterBranch] = useState<Branch | 'All'>(selectedBranch);
  const [filterYear, setFilterYear] = useState<Year | 'All'>(selectedYear);

  const filteredExams = useMemo(() => {
    return ALL_EXAMS.filter((exam) => {
      if (filterBranch !== 'All' && exam.branch !== filterBranch) return false;
      if (filterYear !== 'All' && exam.year !== filterYear) return false;
      return true;
    });
  }, [filterBranch, filterYear]);

  // Next imminent exam
  const nextExam = filteredExams.length > 0 ? filteredExams[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              Midterm Examination Timetable
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Fall 2026 Official Schedule • Verified seating & syllabus coverage
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value as Branch | 'All')}
              className="bg-transparent text-xs font-semibold text-zinc-800 outline-none cursor-pointer"
            >
              <option value="All">All Branches</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-2xs">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value as Year | 'All')}
              className="bg-transparent text-xs font-semibold text-zinc-800 outline-none cursor-pointer"
            >
              <option value="All">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Countdown / Next Exam Spotlight Card ── */}
      {nextExam && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-indigo-950 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-200 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Next Exam in {nextExam.daysRemaining} Days
              </div>
              
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {nextExam.courseCode} — {nextExam.courseName}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 flex flex-wrap items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-indigo-400" />
                  {nextExam.date} • {nextExam.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  {nextExam.room}
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {onNavigateToAssistant && (
                <button
                  type="button"
                  onClick={onNavigateToAssistant}
                  className="px-4 py-2.5 rounded-xl bg-white text-zinc-900 font-bold text-xs hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Prepare with AI Assistant
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Timetable Grid ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900">
            Scheduled Sessions ({filteredExams.length})
          </h3>
          <span className="text-xs text-zinc-500 font-medium">
            Hall tickets required at the entry
          </span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-zinc-200/80">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-zinc-700">No scheduled exams found</p>
            <p className="text-xs text-zinc-500 mt-1">Try changing the Branch or Year filter above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-zinc-100 text-zinc-800">
                      {exam.courseCode}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {exam.branch} • {exam.year}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900 mb-2">
                    {exam.courseName}
                  </h4>

                  {/* Time & Venue */}
                  <div className="space-y-1.5 text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-800">{exam.date}</span>
                      <span className="text-zinc-400">•</span>
                      <span>{exam.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{exam.room}</span>
                    </div>
                  </div>

                  {/* Syllabus / Units */}
                  <div className="mt-3 flex items-start gap-2 text-xs text-zinc-600">
                    <BookOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span><strong className="text-zinc-700">Scope:</strong> {exam.units}</span>
                  </div>
                </div>

                {/* Footer status */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {exam.weightage}
                  </span>
                  <span className="text-zinc-400 font-medium">
                    {exam.daysRemaining} days left
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
