import { INITIAL_RESOURCES, Resource } from '../../data/mockData';
import { CURATED_VIDEO_LECTURES } from './videoLecturesData';
import {
  ChatMessage,
  LanguageFilter,
  PdfSummary,
  StudyRoadmap,
  VideoLecture,
} from './types';

// Default Study Roadmap Generator
export function generateTwoWeekStudyRoadmap(subjectName = 'Semester Examinations'): StudyRoadmap {
  return {
    id: 'roadmap-2week-prep',
    title: '2-Week Comprehensive Exam Roadmap',
    totalDays: 14,
    subject: subjectName,
    dailyCommitment: '3.5 - 4 Hours / day',
    phases: [
      {
        name: 'Phase 1 (Days 1–7)',
        subtitle: 'Core Concept Mastery, High-Weightage Units & Derivations',
        tasks: [
          {
            id: 'task-1',
            day: 'Day 1–2',
            title: 'Unit 1 Foundations & Guaranteed 15-Mark Derivations',
            description:
              'Complete Unit 1 theory, master standard matrix / circuit derivations, and solve 3 previous year model problems.',
            completed: false,
            highWeightage: true,
            estimatedHours: '3.5 hrs',
            targetTopics: ['Eigenvalues', 'KCL/KVL Supermesh', 'Big-O Complexity'],
          },
          {
            id: 'task-2',
            day: 'Day 3–4',
            title: 'Unit 2 & 3 Core Problem Types & Formula Sheet',
            description:
              'Consolidate all essential formulas onto a 2-page quick sheet. Solve 8-10 textbook numericals focusing on edge cases.',
            completed: false,
            highWeightage: true,
            estimatedHours: '4 hrs',
            targetTopics: ['Taylor Series', 'Transformer Losses', 'Binary Tree Traversals'],
          },
          {
            id: 'task-3',
            day: 'Day 5–6',
            title: 'Mid-Syllabus Self-Diagnostic & Doubt Resolution',
            description:
              'Take a 45-minute timed quiz on Units 1–3 without referring to notes. Watch video tutorials in your preferred language for weak concepts.',
            completed: false,
            highWeightage: false,
            estimatedHours: '3 hrs',
            targetTopics: ['Self-Quiz', 'Video Lecture Revision', 'Notes Annotation'],
          },
          {
            id: 'task-4',
            day: 'Day 7',
            title: 'Buffer Day & Unit 4 High-Yield Summary Review',
            description:
              'Catch up on any backlog from Days 1–6 and review Unit 4 high-frequency definitions.',
            completed: false,
            highWeightage: false,
            estimatedHours: '2.5 hrs',
            targetTopics: ['Buffer Revision', 'Definition Flashcards'],
          },
        ],
      },
      {
        name: 'Phase 2 (Days 8–14)',
        subtitle: 'Past 5-Year PYQ Drills, Speed Tests & Exam Simulation',
        tasks: [
          {
            id: 'task-5',
            day: 'Day 8–9',
            title: 'Past 3-Year University Exam Papers (Full Paper Drill)',
            description:
              'Solve 2 full official university semester question papers under 3-hour strict exam conditions.',
            completed: false,
            highWeightage: true,
            estimatedHours: '4.5 hrs',
            targetTopics: ['PYQ 2024 Paper', 'PYQ 2025 Paper', 'Speed Calibration'],
          },
          {
            id: 'task-6',
            day: 'Day 10–11',
            title: 'High-Weightage "Must-Score" Question Bank Drill',
            description:
              'Zero in on recurring 10-mark and 15-mark questions that appear in every university exam cycle.',
            completed: false,
            highWeightage: true,
            estimatedHours: '4 hrs',
            targetTopics: ['Cayley-Hamilton Proof', 'Graph Dijkstra Algorithm', 'Star-Delta Conversion'],
          },
          {
            id: 'task-7',
            day: 'Day 12–13',
            title: 'Speed Review: Clean Diagrams & Presentation Formatting',
            description:
              'Practice neat circuit diagrams, tree representations, and step-by-step mathematical working to maximize partial marks.',
            completed: false,
            highWeightage: false,
            estimatedHours: '3 hrs',
            targetTopics: ['Diagram Accuracy', 'Step Marking Techniques', 'Formula Memorization'],
          },
          {
            id: 'task-8',
            day: 'Day 14',
            title: 'Final Light Review & Mental Rest',
            description:
              'Skim formula cheat-sheet, ensure exam hall supplies are packed, sleep at least 7.5 hours.',
            completed: false,
            highWeightage: false,
            estimatedHours: '2 hrs',
            targetTopics: ['Formula Sheet Skim', 'Exam Bag Check', 'Stress Relief'],
          },
        ],
      },
    ],
  };
}

// Generate PDF Summary Object from a Resource
export function generatePdfSummary(resource: Resource): PdfSummary {
  return {
    documentId: resource.id,
    documentTitle: resource.title,
    fileSize: resource.fileSize,
    summaryBullets: [
      resource.summary,
      `Curated specifically for ${resource.branch} (Year ${resource.year}) with ${resource.upvotes} faculty and peer endorsements.`,
      `Includes verified university exam patterns, step-by-step proofs, and high-frequency problem walkthroughs.`,
    ],
    keyExamTakeaways: resource.keyTakeaways || [
      'Focus heavily on Unit 1 and Unit 2 definitions for guaranteed section A marks.',
      'Always write standard assumptions and draw neat labeled diagrams for full step marks.',
      'Practice past 3 years university question papers provided at the end of this document.',
    ],
    highWeightageTopics: resource.tags.map((t) => t.toUpperCase()),
  };
}

// Filter Video Lectures based on language filter & subject
export function filterVideoLectures(
  subjectKeywords: string[],
  languageFilter: LanguageFilter
): VideoLecture[] {
  let matches = CURATED_VIDEO_LECTURES.filter((video) => {
    const text = `${video.title} ${video.subject} ${video.topic} ${video.channel}`.toLowerCase();
    return subjectKeywords.some((kw) => text.includes(kw.toLowerCase()));
  });

  if (matches.length === 0) {
    // If no direct keyword match, default to a balanced set
    matches = CURATED_VIDEO_LECTURES.slice(0, 4);
  }

  if (languageFilter !== 'all') {
    const targetLang =
      languageFilter === 'english'
        ? 'English'
        : languageFilter === 'hindi'
        ? 'Hindi'
        : 'Telugu';
    const filteredByLang = matches.filter((v) => v.language === targetLang);
    return filteredByLang.length > 0 ? filteredByLang : matches;
  }

  return matches;
}

// Search matching resources from INITIAL_RESOURCES
export function findMatchingResources(query: string, branch = 'All', year = 'All'): Resource[] {
  const q = query.toLowerCase();

  let matched = INITIAL_RESOURCES.filter((res) => {
    const searchSpace = `${res.title} ${res.subject} ${res.tags.join(' ')} ${res.summary}`.toLowerCase();
    return (
      searchSpace.includes(q) ||
      (q.includes('dsa') && searchSpace.includes('dsa')) ||
      (q.includes('m1') && searchSpace.includes('m1')) ||
      (q.includes('math') && searchSpace.includes('mathematics')) ||
      (q.includes('bee') && searchSpace.includes('bee')) ||
      (q.includes('electrical') && searchSpace.includes('electrical')) ||
      (q.includes('physics') && searchSpace.includes('physics')) ||
      (q.includes('python') && searchSpace.includes('python')) ||
      (q.includes('digital') && searchSpace.includes('digital'))
    );
  });

  if (matched.length === 0) {
    // Return top approved resources as helpful recommendations
    matched = INITIAL_RESOURCES.filter((r) => r.approved).slice(0, 2);
  }

  return matched;
}

// Core intelligent response generator
export function getAssistantResponse(
  userQuery: string,
  contextResource: Resource | null,
  languageFilter: LanguageFilter,
  studentProfile: { branch: string; year: string }
): Omit<ChatMessage, 'id' | 'timestamp'> {
  const query = userQuery.toLowerCase().trim();

  // SCENARIO 1: Specific PDF Summarization (Stretch Goal: Ask Specific PDF)
  if (
    contextResource &&
    (query.includes('summarize') ||
      query.includes('summary') ||
      query.includes('bullet') ||
      query.includes('takeaway') ||
      query.includes('explain this pdf') ||
      query.includes('pdf in 3 bullet points'))
  ) {
    const summary = generatePdfSummary(contextResource);

    // Subject keywords for accompanying videos
    const subjectKeywords = [contextResource.subject, ...contextResource.tags];
    const relatedVideos = filterVideoLectures(subjectKeywords, languageFilter);

    return {
      sender: 'assistant',
      contextResourceTitle: contextResource.title,
      content: `### 📄 AI Executive Summary: ${contextResource.title}
Here is a concise **3-bullet point breakdown** and **key exam takeaways** synthesized from this verified faculty document:

* **Core Focus:** ${summary.summaryBullets[0]}
* **Pedagogical Alignment:** ${summary.summaryBullets[1]}
* **Exam Relevance:** ${summary.summaryBullets[2]}

Below you will find the interactive summary card with high-weightage topics and recommended video tutorials to cement your understanding:`,
      matchedResources: [contextResource],
      pdfSummary: summary,
      videoLectures: relatedVideos.slice(0, 3),
    };
  }

  // SCENARIO 2: If context resource is active and user asks a generic question about it
  if (contextResource && !query.includes('2-week') && !query.includes('roadmap')) {
    const summary = generatePdfSummary(contextResource);
    return {
      sender: 'assistant',
      contextResourceTitle: contextResource.title,
      content: `### Context Grounded in: "${contextResource.title}"
Regarding your query on **${userQuery}** using **${contextResource.title}**:

1. **Direct Alignment:** This document directly addresses this topic in **${contextResource.subject}**.
2. **Faculty Guidance:** Review the key derivations in Section 2, as they carry significant partial marking.
3. **Download:** The verified PDF is attached below for immediate offline revision.`,
      matchedResources: [contextResource],
      pdfSummary: summary,
      videoLectures: filterVideoLectures([contextResource.subject], languageFilter).slice(0, 2),
    };
  }

  // SCENARIO 3: "🎯 What should a 1st-year focus on?"
  if (
    query.includes('1st-year') ||
    query.includes('first year') ||
    query.includes('freshman') ||
    query.includes('focus on')
  ) {
    const m1Res = INITIAL_RESOURCES.find((r) => r.id === 'res-m1-02');
    const beeRes = INITIAL_RESOURCES.find((r) => r.id === 'res-bee-03');
    const pyRes = INITIAL_RESOURCES.find((r) => r.id === 'res-py-05');
    const recommendedResources = [m1Res, beeRes, pyRes].filter(Boolean) as Resource[];

    return {
      sender: 'assistant',
      content: `### 🎓 Essential Roadmap for First-Year Engineers
Welcome to your engineering journey! The first year builds the structural foundation for your entire academic and career trajectory. Here is how to prioritize:

1. **Maintain a Strong CGPA (Target 8.5+) early on:**
   * Subjects like **Engineering Mathematics (M1)** and **Basic Electrical Engineering (BEE)** carry 4 credits each. High grades here create a cushion for subsequent tougher semesters.
2. **Master One Core Programming Language:**
   * Don't jump across 5 technologies. Get rock-solid with **C** or **Python**—understand data types, memory, loops, and basic functions.
3. **Build Consistent Habit with Handwritten Notes & PYQs:**
   * 70% of semester exams test high-frequency concepts from the last 3-5 years. Revise weekly rather than pulling all-nighters.
4. **Join 1 Technical Club & 1 Cultural Club:**
   * Networking with seniors is how you discover hackathons, internships, and resource drives.

Here are the **top faculty-approved notes** and **recommended introductory video lectures** across English, Hindi, and Telugu:`,
      matchedResources: recommendedResources,
      videoLectures: filterVideoLectures(['m1', 'bee', 'python'], languageFilter).slice(0, 3),
    };
  }

  // SCENARIO 4: "⚡ How to prepare for DSA from scratch?"
  if (
    query.includes('dsa') ||
    query.includes('data structure') ||
    query.includes('from scratch') ||
    query.includes('prepare for dsa')
  ) {
    const dsaRes = INITIAL_RESOURCES.find((r) => r.id === 'res-dsa-01');
    const matchingVideos = filterVideoLectures(['dsa', 'data structures'], languageFilter);

    return {
      sender: 'assistant',
      content: `### ⚡ Step-by-Step Blueprint: Master DSA from Scratch
Preparing for Data Structures & Algorithms requires a balance between theoretical intuition and disciplined problem-solving:

1. **Step 1: Pick One Language (C++, Java, or Python)**
   * Learn the Standard Template Library (STL / Collections). Never switch languages midway.
2. **Step 2: Linear Data Structures (Weeks 1–3)**
   * Arrays, Dynamic Arrays, Linked Lists (Singly, Doubly, Fast & Slow pointers), Stacks & Queues.
3. **Step 3: Algorithmic Paradigms (Weeks 4–6)**
   * Recursion, Backtracking, Binary Search (on arrays and answer spaces), Two Pointers & Sliding Window.
4. **Step 4: Non-Linear & Hierarchical Structures (Weeks 7–10)**
   * Binary Trees, Binary Search Trees (BST), Heaps / Priority Queues, and Graph Traversals (BFS/DFS, Topological Sort, Dijkstra).
5. **Practice Strategy:**
   * Solve 3–5 problems daily on LeetCode/GeeksforGeeks following the **Striver A2Z Sheet** or **NeetCode Blind 75**.

Check out the **DSA Complete Notes** and **Curated Multilingual Video Tutorials** below (toggle between English, Hindi, and Telugu):`,
      matchedResources: dsaRes ? [dsaRes] : [],
      videoLectures: matchingVideos.slice(0, 4),
    };
  }

  // SCENARIO 5: "🎥 Show M1 video lectures in Telugu & Hindi" or M1 queries
  if (
    query.includes('m1') ||
    query.includes('mathematics') ||
    query.includes('matrices') ||
    query.includes('eigenvalue') ||
    (query.includes('video') && (query.includes('telugu') || query.includes('hindi')))
  ) {
    const m1Res = INITIAL_RESOURCES.find((r) => r.id === 'res-m1-02');
    const m1Videos = filterVideoLectures(['m1', 'matrices', 'calculus'], languageFilter);

    return {
      sender: 'assistant',
      content: `### 🎥 Curated Multilingual Video Lectures: Engineering Mathematics - I (M1)
Engineering Mathematics (M1) is concept-heavy with high credit weightage. Here are verified video lectures taught in **Telugu, Hindi, and English** by renowned educators:

* **Telugu Lectures:** Step-by-step explanations covering JNTU/VTU/OU syllabi by *Harsha Tech* and *Telugu Engineering Tutorials*.
* **Hindi Lectures:** Comprehensive one-shot matrix modules by *Pradeep Giri Academy* and *Last Moment Tuitions*.
* **English Lectures:** Visual conceptual mastery by *Dr. Gajendra Purohit* and *Neso Academy*.

Accompanying handwritten formula notes with solved Cayley-Hamilton and Eigenvalue derivations are attached below:`,
      matchedResources: m1Res ? [m1Res] : [],
      videoLectures: m1Videos,
    };
  }

  // SCENARIO 6: "📅 Generate a 2-week exam preparation plan" or Exam Prep Roadmap
  if (
    query.includes('2-week') ||
    query.includes('exam preparation') ||
    query.includes('study plan') ||
    query.includes('roadmap') ||
    query.includes('exam prep') ||
    query.includes('schedule') ||
    query.includes('midterm')
  ) {
    const roadmap = generateTwoWeekStudyRoadmap('Engineering Semester & Midterm Examinations');
    const dsaRes = INITIAL_RESOURCES.find((r) => r.id === 'res-dsa-01');
    const m1Res = INITIAL_RESOURCES.find((r) => r.id === 'res-m1-02');

    return {
      sender: 'assistant',
      content: `### 📅 Interactive 2-Week Exam Preparation Roadmap
I have generated a high-yield, structured 14-day study plan calibrated for your upcoming semester examinations.

* **Phase 1 (Days 1–7):** Focus on Unit 1–3 foundational concepts, high-scoring derivations, and concise formula sheets.
* **Phase 2 (Days 8–14):** Timed past 5-year PYQ solving, error analysis, and presentation drills.

Use the **interactive checklist tabs** below to track your progress daily:`,
      studyRoadmap: roadmap,
      matchedResources: [dsaRes, m1Res].filter(Boolean) as Resource[],
      videoLectures: filterVideoLectures(['m1', 'dsa'], languageFilter).slice(0, 3),
    };
  }

  // SCENARIO 7: Basic Electrical Engineering (BEE)
  if (query.includes('bee') || query.includes('electrical') || query.includes('kcl') || query.includes('kvl') || query.includes('transformer')) {
    const beeRes = INITIAL_RESOURCES.find((r) => r.id === 'res-bee-03');
    const beeVideos = filterVideoLectures(['bee', 'electrical', 'kcl', 'transformers'], languageFilter);

    return {
      sender: 'assistant',
      content: `### ⚡ Basic Electrical Engineering (BEE) Guidance
BEE can feel challenging due to circuit calculations and sign conventions. Key strategies to score high:

1. **Master KCL & KVL Mesh/Nodal Equations:** Standardize your sign convention (entering positive, leaving negative).
2. **AC Fundamentals & Star-Delta:** Derivations of line voltage vs phase voltage ($V_L = \\sqrt{3}V_{ph}$) always carry 10 marks.
3. **Transformers & DC Machines:** Draw clean schematic diagrams showing flux linkages and winding turns.

Verified faculty question bank and multilingual video tutorials are attached below:`,
      matchedResources: beeRes ? [beeRes] : [],
      videoLectures: beeVideos,
    };
  }

  // DEFAULT / GENERAL RESPONSE WITH SMART MATCHING
  const matches = findMatchingResources(userQuery, studentProfile.branch, studentProfile.year);
  const keywords = userQuery.split(' ').filter((w) => w.length > 2);
  const matchedVideos = filterVideoLectures(keywords.length ? keywords : ['dsa', 'm1'], languageFilter);

  return {
    sender: 'assistant',
    content: `### 🎓 CampusHub Academic Guidance
Here is targeted guidance regarding **"${userQuery}"**:

* **Recommended Strategy:** Start with the verified faculty notes in the resource library to establish syllabus boundaries.
* **Exam Practice:** Review previous year university questions (PYQs) to identify recurring 10-mark and 15-mark questions.
* **Multimedia Learning:** Watch concept walkthroughs in your preferred language (English, Hindi, or Telugu) to resolve any difficult doubts.

Below are the most relevant academic resources and curated video lectures matched to your query:`,
    matchedResources: matches.slice(0, 2),
    videoLectures: matchedVideos.slice(0, 3),
  };
}
