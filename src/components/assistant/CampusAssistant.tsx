import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_RESOURCES, type Resource } from '../../data/mockData';
import {
  Sparkles,
  Send,
  Bot,
  User,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ThumbsUp,
  Download,
  Eye,
  RotateCcw,
  FileText,
  Copy,
  Check,
  X,
  Layers,
  GraduationCap
} from 'lucide-react';

export interface CampusAssistantProps {
  initialBranch?: string;
  initialYear?: string;
  selectedBranch?: string;
  selectedYear?: string;
  className?: string;
}

interface MessageResource {
  id: string;
  title: string;
  subject: string;
  branch: string;
  year: string;
  fileUrl: string;
  uploadedBy: string;
  upvotes: number;
  summary: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  resources?: MessageResource[];
  topicTag?: string;
}

const QUICK_PROMPTS = [
  'How do I prepare for DSA?',
  'Engineering Mathematics (M1) high-yield topics',
  'First-year study roadmap',
  'Recommended notes for CSE 2nd Year',
];

const TARGET_TOPICS = ['All Topics', 'DSA', 'M1', 'BEE', 'OS', 'DBMS', 'Discrete Math', 'Networks'];

export const CampusAssistant: React.FC<CampusAssistantProps> = ({
  className = '',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `### 👋 Welcome to Campus AI!
I am your **24/7 Academic Guidance & Resource Finder**.

* 📚 **Curriculum & Notes:** Ask about any semester subject, high-weightage topics, and formula sheets.
* ⚡ **Study Roadmaps:** Get step-by-step blueprints for exam prep and DSA mastery.
* 🔍 **Smart Recommendations:** I will automatically link verified faculty monographs and student-verified PDFs.

Choose a quick prompt below or type your question:`,
      timestamp: 'Just now',
      resources: INITIAL_RESOURCES.slice(0, 2),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Query matcher for smart linking
  const findMatchingResources = (query: string, topic: string): MessageResource[] => {
    const q = query.toLowerCase();
    const topicFiltered = topic !== 'All Topics' ? topic.toLowerCase() : '';

    const matched = INITIAL_RESOURCES.filter((res: Resource) => {
      const titleMatch = res.title.toLowerCase().includes(q) || (topicFiltered && res.title.toLowerCase().includes(topicFiltered));
      const subjectMatch = res.subject.toLowerCase().includes(q) || (topicFiltered && res.subject.toLowerCase().includes(topicFiltered));
      const summaryMatch = res.summary.toLowerCase().includes(q);
      const tagMatch = (res.tags || []).some(t => t.toLowerCase().includes(q) || (topicFiltered && t.toLowerCase().includes(topicFiltered)));

      // Keyword associations
      const dsaMatch = (q.includes('dsa') || q.includes('algorithm') || q.includes('tree') || q.includes('data structure')) && res.subject.toLowerCase().includes('data');
      const m1Match = (q.includes('m1') || q.includes('math') || q.includes('calculus') || q.includes('matrix') || q.includes('eigen')) && (res.subject.toLowerCase().includes('math') || res.title.toLowerCase().includes('math'));
      const osMatch = (q.includes('os') || q.includes('operating') || q.includes('scheduling') || q.includes('deadlock') || q.includes('banker')) && res.subject.toLowerCase().includes('operating');
      const dbmsMatch = (q.includes('dbms') || q.includes('sql') || q.includes('database') || q.includes('normalization') || q.includes('bcnf')) && res.subject.toLowerCase().includes('dbms');
      const networkMatch = (q.includes('network') || q.includes('tcp') || q.includes('ip') || q.includes('protocol')) && res.subject.toLowerCase().includes('network');

      return titleMatch || subjectMatch || summaryMatch || tagMatch || dsaMatch || m1Match || osMatch || dbmsMatch || networkMatch;
    });

    if (matched.length > 0) {
      return matched.slice(0, 3);
    }

    // Default top resources
    if (q.includes('recommend') || q.includes('cse') || q.includes('first-year') || q.includes('roadmap')) {
      return INITIAL_RESOURCES.slice(0, 2);
    }

    return [];
  };

  // Response Generator
  const generateResponse = (userQuery: string, topic: string) => {
    const q = userQuery.toLowerCase().trim();
    let text = '';

    if (q.includes('dsa') || q.includes('data structure') || topic === 'DSA') {
      text = `### ⚡ Master DSA: Step-by-Step Blueprint
1. **Language Proficiency:** Master STL (C++) or Collections (Java). Understand memory models and pointer arithmetic.
2. **Core Linear Structures (Weeks 1–3):**
   * Dynamic arrays & amortized $O(1)$ insertions.
   * Linked Lists: Two-pointer techniques (Floyd's cycle detection, fast & slow pointers).
   * Monotonic Stacks & Circular Queues.
3. **Non-Linear & Hierarchical (Weeks 4–7):**
   * Binary Search Trees & balanced AVL tree rotations (balance factor $\\in \\{-1, 0, +1\\}$).
   * Heaps: Min/Max heap priority queues for $O(\\log N)$ scheduling.
4. **Graph Algorithms & Dynamic Programming (Weeks 8–10):**
   * BFS/DFS traversals, Topological Sort (Kahn's), Dijkstra's shortest path.
   * Memoization vs Tabulation with state transition formulas.

*Verified lecture monographs with worked midterm solutions are attached below:*`;
    } else if (q.includes('m1') || q.includes('mathematics') || q.includes('math') || topic === 'M1') {
      text = `### 📐 Engineering Mathematics (M1) High-Yield Strategy
* **Unit 1: Matrices & Linear Systems (Guaranteed 15 Marks)**
  * Cayley-Hamilton Theorem: Use $A^{-1} = -\\frac{1}{a_n}(A^{n-1} + a_1 A^{n-2} + \\dots)$ for inverse and higher power proofs.
  * Eigenvalues & Eigenvectors: Always verify properties: $\\sum \\lambda_i = \\text{Trace}(A)$ and $\\prod \\lambda_i = \\det(A)$.
* **Unit 2: Differential Calculus & Taylor Expansions**
  * Lagrange Mean Value Theorem & Cauchy's MVT proofs.
  * Partial differentiation & Euler's theorem on homogeneous functions.
* **Exam Working Tip:** Draw clean matrix augmentations $[A|B]$ and state elementary row operations explicitly for full partial marking.

*Handwritten formula handouts and solved previous year papers are linked below:*`;
    } else if (q.includes('first-year') || q.includes('1st-year') || q.includes('freshman') || q.includes('roadmap')) {
      text = `### 🎓 First-Year Engineering Academic Roadmap
1. **Target 8.5+ CGPA Early:** First-year fundamental subjects (M1, BEE, Engineering Physics) carry 4 credits each. High grades here create a crucial buffer.
2. **Master One Language Deeply:** Focus on C or Python. Understand control flow, structs, recursion, and file I/O.
3. **Weekly PYQ Habit:** 70% of university exam patterns repeat high-frequency derivations. Revise every Sunday.
4. **Build Lab Rapport:** Ensure neat lab records and understand test-bench validations to score full internal marks.

*Top recommended first-year notes are attached below:*`;
    } else if (q.includes('2nd year') || q.includes('cse 2nd year') || q.includes('cse')) {
      text = `### 💻 CSE 2nd-Year Core Curriculum Focus
Second year introduces the pillars of Computer Science:
* **Data Structures & Algorithms:** Focus on tree traversals, shortest path algorithms, and Master Theorem complexity proofs.
* **Operating Systems:** Round-Robin time quantum tradeoffs, Banker's algorithm safe states, and Semaphore deadlock synchronization.
* **Database Management Systems (DBMS):** Normalization (1NF through BCNF), ACID transaction semantics, and B+ Tree indexing.

*Here are the top-rated monographs for 2nd Year CSE:*`;
    } else if (q.includes('os') || q.includes('operating') || topic === 'OS') {
      text = `### ⚙️ Operating Systems Core Concepts
* **CPU Scheduling:** Round-Robin (optimal time slice prevents FCFS degradation), Preemptive Priority Queues, Multi-level feedback queues.
* **Deadlock Management:**
  * 4 Coffman Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
  * Banker's Algorithm: Resource-allocation state vector verification.
* **Memory Management:** Paging, TLB hit ratios, LRU Page Replacement, and Thrashing prevention using the Working Set Model.`;
    } else if (q.includes('dbms') || q.includes('sql') || q.includes('normalization') || topic === 'DBMS') {
      text = `### 🗄️ DBMS & SQL Normalization Guidelines
* **1NF:** Atomic attribute domain, no repeating groups.
* **2NF:** 1NF + No partial functional dependency on composite candidate keys.
* **3NF:** 2NF + No transitive functional dependency ($X \\rightarrow Y$, $Y \\rightarrow Z$).
* **BCNF:** For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must strictly be a Super Key.
* **ACID Transactions:** Atomicity (Undo logs), Consistency (Invariants), Isolation (2-Phase Locking), Durability (Write-Ahead Logging).`;
    } else {
      text = `### 💡 Campus AI Academic Guidance
Regarding **"${userQuery}"** ${topic !== 'All Topics' ? `in **${topic}**` : ''}:
* **Core Academic Invariant:** Focus on standard syllabus proofs, base case verifications, and unit-by-unit definitions.
* **Exam Preparation:** Solve previous year midterm problems to calibrate time allocation per question.
* **Peer-Reviewed Reference:** Check the verified faculty notes in the CampusHub repository below:`;
    }

    const matchedResources = findMatchingResources(userQuery, topic);
    return { text, resources: matchedResources };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // 600ms realistic thinking/typing latency
    setTimeout(() => {
      const responseData = generateResponse(query, selectedTopic);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseData.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resources: responseData.resources,
        topicTag: selectedTopic !== 'All Topics' ? selectedTopic : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `### 🔄 Chat Cleared
Ready for your questions! Select a topic pill or prompt above.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resources: INITIAL_RESOURCES.slice(0, 2),
      },
    ]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto flex flex-col gap-4 animate-fade-in ${className}`}>
      
      {/* ── Glassmorphic Main Container ── */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[760px] text-white">
        
        {/* 1. Header & Assistant Status Bar */}
        <div className="px-5 py-4 border-b border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 border border-white/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                Campus AI • Academic Guidance & Resource Finder
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                  Active
                </span>
                <span className="text-[11px] text-slate-400">• Verified Syllabus Assistant</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearChat}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>
        </div>

        {/* 2. Messages Stream Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Bot Avatar */}
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-white/15 flex items-center justify-center text-indigo-300 shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[88%] sm:max-w-[80%] flex flex-col gap-2.5 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all shadow-xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600/80 backdrop-blur-md text-white border border-indigo-400/30 rounded-br-sm'
                    : 'bg-slate-800/60 backdrop-blur-md text-slate-100 border border-white/10 rounded-bl-sm'
                }`}
              >
                {/* Bubble Header */}
                <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/10 text-[11px] font-semibold text-slate-300">
                  <span className="flex items-center gap-1 text-white">
                    {msg.sender === 'user' ? (
                      <>
                        <User className="w-3 h-3 text-indigo-200" /> You
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-300" /> Campus AI
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>

                {/* Markdown text body */}
                <div className="whitespace-pre-wrap font-normal text-slate-100 space-y-2">
                  {msg.text}
                </div>

                {/* Embedded Smart Resource Recommendations */}
                {msg.resources && msg.resources.length > 0 && (
                  <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Recommended Study Notes ({msg.resources.length})
                      </span>
                      <span className="text-[10px] font-normal text-slate-400 lowercase">click to preview</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {msg.resources.map((res) => (
                        <div
                          key={res.id}
                          className="group/card bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl p-3 flex flex-col justify-between transition-all hover:border-indigo-400/40 shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 text-[10px] font-bold uppercase truncate max-w-[120px]">
                                {res.subject}
                              </span>
                              <span className="text-[10px] text-slate-300 flex items-center gap-1 shrink-0">
                                <ThumbsUp className="w-2.5 h-2.5 text-amber-300" /> {res.upvotes}
                              </span>
                            </div>

                            <h4 className="font-bold text-xs text-white group-hover/card:text-indigo-200 transition-colors line-clamp-1">
                              {res.title}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-slate-400" /> By {res.uploadedBy}
                            </p>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewResource(res as Resource)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>

                            <a
                              href={res.fileUrl}
                              download
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>PDF</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assistant Bubble Actions */}
                {msg.sender === 'assistant' && (
                  <div className="mt-1 flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setLikedMap((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                      className={`text-[11px] px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                        likedMap[msg.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{likedMap[msg.id] ? 'Helpful' : 'Helpful?'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.text, msg.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded-md hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-400/40 flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Animated 3-Dots Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-white/15 flex items-center justify-center text-indigo-300 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <span className="text-xs text-slate-300 ml-1 font-medium">Campus AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 3. Quick Prompt Chips Bar */}
        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Quick Prompts:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-slate-200 hover:text-white whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
            >
              <span>{prompt}</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          ))}
        </div>

        {/* 4. Targeted Study Mode Selector & Input Footer */}
        <div className="p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md border-t border-white/15 flex flex-col gap-2.5">
          
          {/* Targeted Study Mode Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" /> Study Mode:
            </span>
            {TARGET_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedTopic(topic)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-indigo-600 text-white shadow-sm border border-indigo-400/40'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedTopic !== 'All Topics'
                  ? `Ask specific question about ${selectedTopic} syllabus & proofs...`
                  : 'Ask about subjects, DSA, M1, BEE, exams, or syllabus...'
              }
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-inner"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Document Preview Modal Overlay (Glassmorphic) ── */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900/95 border border-white/20 shadow-2xl rounded-2xl max-w-2xl w-full p-6 text-white flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{previewResource.title}</h3>
                  <p className="text-[11px] text-slate-400">{previewResource.subject} • {previewResource.branch} ({previewResource.year})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] font-bold text-indigo-300 uppercase block mb-1">Executive Summary</span>
                <p className="text-slate-300 leading-relaxed">{previewResource.summary}</p>
              </div>

              {previewResource.keyTakeaways && previewResource.keyTakeaways.length > 0 && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase block mb-1">Key Exam Takeaways</span>
                  <ul className="space-y-1">
                    {previewResource.keyTakeaways.map((k, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                <span>Uploaded by: <strong className="text-white">{previewResource.uploadedBy}</strong></span>
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <ThumbsUp className="w-3 h-3" /> {previewResource.upvotes} Student Endorsements
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/15">
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
              <a
                href={previewResource.fileUrl}
                download
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusAssistant;
