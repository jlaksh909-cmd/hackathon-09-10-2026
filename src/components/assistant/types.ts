import { Resource } from '../../data/mockData';

export type LanguageFilter = 'all' | 'english' | 'hindi' | 'telugu';

export type BranchFilter = 'All' | 'CSE' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';

export type YearFilter = 'All' | '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export interface VideoLecture {
  id: string;
  title: string;
  channel: string;
  duration: string;
  language: 'English' | 'Hindi' | 'Telugu';
  url: string;
  topic: string;
  views: string;
  subject: string;
  thumbnailColor: string; // Tailwind gradient for high-aesthetic card
  recommendedFor: string;
}

export interface StudyRoadmapTask {
  id: string;
  day: string;
  title: string;
  description: string;
  completed: boolean;
  highWeightage?: boolean;
  estimatedHours: string;
  targetTopics: string[];
}

export interface StudyRoadmapPhase {
  name: string;
  subtitle: string;
  tasks: StudyRoadmapTask[];
}

export interface StudyRoadmap {
  id: string;
  title: string;
  totalDays: number;
  subject: string;
  dailyCommitment: string;
  phases: StudyRoadmapPhase[];
}

export interface PdfSummary {
  documentId: string;
  documentTitle: string;
  fileSize: string;
  summaryBullets: string[];
  keyExamTakeaways: string[];
  highWeightageTopics: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  contextResourceTitle?: string;
  matchedResources?: Resource[];
  videoLectures?: VideoLecture[];
  studyRoadmap?: StudyRoadmap;
  pdfSummary?: PdfSummary;
}
