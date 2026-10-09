import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_RESOURCES, Resource } from '../../data/mockData';
import {
  ChatMessage,
  LanguageFilter,
  BranchFilter,
  YearFilter,
  VideoLecture,
} from './types';
import { getAssistantResponse } from './assistantResponses';
import { VideoLectureCard } from './VideoLectureCard';
import { ResourceCard } from './ResourceCard';
import { StudyRoadmapCard } from './StudyRoadmapCard';
import { PdfSummaryCard } from './PdfSummaryCard';
import {
  Sparkles,
  Send,
  Globe,
  Trash2,
  Copy,
  Check,
  FileText,
  Youtube,
  ChevronDown,
  BookOpen,
  Filter,
  GraduationCap,
  X,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Calendar,
  Flame,
  CheckCircle,
} from './icons';

interface CampusAssistantProps {
  initialBranch?: BranchFilter;
  initialYear?: YearFilter;
  className?: string;
}

export const CampusAssistant: React.FC<CampusAssistantProps> = ({
  initialBranch = 'CSE',
  initialYear = '1st Year',
  className = '',
}) => {
  // Student Profile State
  const [selectedBranch, setSelectedBranch] = useState<BranchFilter>(initialBranch);
  const [selectedYear, setSelectedYear] = useState<YearFilter>(initialYear);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Language Filter State: 'all' | 'english' | 'hindi' | 'telugu'
  const [activeLanguage, setActiveLanguage] = useState<LanguageFilter>('all');

  // Document Context State: null = "General Guidance", or a specific Resource
  const [selectedContextResource, setSelectedContextResource] = useState<Resource | null>(null);
  const [isDocSelectorOpen, setIsDocSelectorOpen] = useState(false);

  // Chat Stream State
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      timestamp: 'Just now',
      content: `### 👋 Welcome to CampusHub AI Academic Mentor!
I am your 24/7 intelligent academic companion for **engineering coursework, syllabus mastery, and exam preparation**.

* 📚 **Verified Resources:** Access handwritten faculty notes, syllabus copies, and solved question banks.
* 🎥 **Multilingual Lectures:** Curated video tutorials in **English, Hindi (हिंदी), and Telugu (తెలుగు)**.
* 📅 **Study Plans & Roadmaps:** Step-by-step revision schedules and high-yield question breakdowns.
* 📄 **Document QA:** Select any uploaded PDF above the input box to get instant 3-bullet summaries and exam takeaways.

Select a quick question below or ask anything about your courses:`,
      matchedResources: INITIAL_RESOURCES.slice(0, 2),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'up' | 'down'>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages or typing state changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Quick Action Prompts
  const quickActionPrompts = [
    {
      label: '🎯 What should a 1st-year focus on?',
      query: 'What should a 1st-year engineering student focus on to maintain a high CGPA and build skills?',
    },
    {
      label: '⚡ How to prepare for DSA from scratch?',
      query: 'How to prepare for DSA from scratch for college exams and placements?',
    },
    {
      label: '🎥 Show M1 video lectures in Telugu & Hindi',
      query: 'Show M1 Engineering Mathematics video lectures in Telugu and Hindi',
    },
    {
      label: '📅 Generate a 2-week exam preparation plan',
      query: 'Generate a 2-week exam preparation plan with daily study roadmap',
    },
  ];

  // Handle Send Message
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: query,
      contextResourceTitle: selectedContextResource ? selectedContextResource.title : undefined,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Realistic 600ms animated typing indicator before response arrival
    setTimeout(() => {
      const responseData = getAssistantResponse(
        query,
        selectedContextResource,
        activeLanguage,
        { branch: selectedBranch, year: selectedYear }
      );

      const newAssistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...responseData,
      };

      setMessages((prev) => [...prev, newAssistantMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        content: `### 🧹 Chat History Cleared
I am ready for your next question! Ask about specific subjects (**DSA, M1, BEE, Python**), attach a PDF above to summarize, or generate a custom study plan.`,
      },
    ]);
  };

  const handleCopyAnswer = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down') => {
    setFeedbackState((prev) => {
      const next = { ...prev };
      if (next[messageId] === type) {
        delete next[messageId];
      } else {
        next[messageId] = type;
      }
      return next;
    });
  };

  const handleSummarizeSpecificPdf = (resource: Resource) => {
    setSelectedContextResource(resource);
    handleSendMessage(`Summarize "${resource.title}" in 3 bullet points with key exam takeaways.`);
  };

  // Helper for rendering simple markdown typography cleanly
  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={index} className="h-1" />;
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={index} className="pt-1 text-sm font-bold text-slate-900 sm:text-base">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }

          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const bulletContent = trimmed.substring(2);
            return (
              <div key={index} className="flex items-start gap-2 pl-1">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(bulletContent) }} />
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+\./)?.[0];
            const numContent = trimmed.replace(/^\d+\.\s*/, '');
            return (
              <div key={index} className="flex items-start gap-2 pl-1">
                <span className="shrink-0 font-bold text-indigo-600">{num}</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numContent) }} />
              </div>
            );
          }

          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-700">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-indigo-700 ring-1 ring-slate-200">$1</code>');
  };

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 shadow-xl ${className}`}
      style={{ minHeight: '680px' }}
    >
      {/* 1. Header with Active Presence Indicator, Academic Filter, and Actions */}
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6">
        {/* Left: Brand & Presence Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-md shadow-indigo-600/20 ring-1 ring-white/30">
            <Sparkles className="h-5 w-5" />
            {/* Pulsing Emerald Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
                CampusHub AI
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Verified Academic Portal Guidance & Syllabus Mentor
            </p>
          </div>
        </div>

        {/* Right: Academic Year/Branch Filter Badge & Clear Chat Action */}
        <div className="flex items-center gap-2">
          {/* Academic Profile Badge (Dropdown Trigger) */}
          <div className="relative z-40">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900"
              title="Filter by Academic Year and Branch"
            >
              <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
              <span>
                {selectedYear} • {selectedBranch}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Academic Profile Dropdown Modal */}
            {isProfileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setIsProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 z-[100] mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xl ring-1 ring-black/10">
                  <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold text-slate-900">Student Profile</span>
                    <button
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Academic Year
                      </label>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as YearFilter[]).map((y) => (
                          <button
                            key={y}
                            onClick={() => {
                              setSelectedYear(y);
                            }}
                            className={`rounded-md px-2 py-1 text-xs font-medium text-left transition-colors ${
                              selectedYear === y
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Engineering Branch
                      </label>
                      <div className="mt-1 grid grid-cols-3 gap-1">
                        {(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'All'] as BranchFilter[]).map((b) => (
                          <button
                            key={b}
                            onClick={() => {
                              setSelectedBranch(b);
                            }}
                            className={`rounded-md px-2 py-1 text-xs font-medium text-center transition-colors ${
                              selectedBranch === b
                                ? 'bg-indigo-600 text-white font-semibold'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full rounded-lg bg-slate-900 py-1.5 text-center text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Multilingual Toggle Filter */}
          <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1 px-1.5 text-slate-400">
              <Globe className="h-3 w-3" />
            </span>
            {(['all', 'english', 'hindi', 'telugu'] as LanguageFilter[]).map((lang) => {
              const labels = {
                all: 'All',
                english: 'EN',
                hindi: 'हिंदी',
                telugu: 'తెలుగు',
              };
              return (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-all ${
                    activeLanguage === lang
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {labels[lang]}
                </button>
              );
            })}
          </div>

          {/* Clear Chat Action */}
          <button
            onClick={handleClearChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. Message Bubble Stream with Auto-Scroll */}
      <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-5">
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex max-w-[92%] sm:max-w-[85%] md:max-w-[78%] items-start gap-2.5 sm:gap-3 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar Badge */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs shadow-sm ${
                    isUser
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white text-indigo-700'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble Container */}
                <div className="flex-1">
                  {/* Context resource tag if query was grounded */}
                  {message.contextResourceTitle && (
                    <div
                      className={`mb-1 flex items-center gap-1 text-[11px] font-medium ${
                        isUser ? 'justify-end text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      <FileText className="h-3 w-3 text-indigo-500" />
                      <span>Context: {message.contextResourceTitle}</span>
                    </div>
                  )}

                  {/* Bubble Surface */}
                  <div
                    className={`relative rounded-2xl p-4 shadow-sm transition-all ${
                      isUser
                        ? 'rounded-tr-sm bg-indigo-600 text-white selection:bg-indigo-400 selection:text-white'
                        : 'rounded-tl-sm border border-slate-200/80 bg-white text-slate-800 ring-1 ring-black/[0.02]'
                    }`}
                  >
                    {/* Render content */}
                    {isUser ? (
                      <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <>
                        {renderFormattedMarkdown(message.content)}

                        {/* Interactive Rich Embed 1: PDF Summary Card */}
                        {message.pdfSummary && (
                          <PdfSummaryCard
                            summary={message.pdfSummary}
                            onDownloadPdf={() => {}}
                          />
                        )}

                        {/* Interactive Rich Embed 2: Study Plan Generator Card */}
                        {message.studyRoadmap && (
                          <StudyRoadmapCard roadmap={message.studyRoadmap} />
                        )}

                        {/* Interactive Rich Embed 3: Matching Resource Cards */}
                        {message.matchedResources && message.matchedResources.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                                <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                                <span>Recommended Academic Resources</span>
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {message.matchedResources.length} verified PDF{message.matchedResources.length > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {message.matchedResources.map((res) => (
                                <ResourceCard
                                  key={res.id}
                                  resource={res}
                                  onSummarizeNow={handleSummarizeSpecificPdf}
                                  onSelectAsContext={(r) => setSelectedContextResource(r)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Rich Embed 4: Curated Multilingual Video Lectures */}
                        {message.videoLectures && message.videoLectures.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600">
                                <Youtube className="h-3.5 w-3.5" />
                                <span>Curated Video Lectures (English • Hindi • Telugu)</span>
                              </span>

                              {/* Language Filter Pills */}
                              <div className="flex items-center gap-1">
                                {(['all', 'english', 'hindi', 'telugu'] as LanguageFilter[]).map((lang) => (
                                  <button
                                    key={lang}
                                    onClick={() => setActiveLanguage(lang)}
                                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                      activeLanguage === lang
                                        ? 'bg-red-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {lang}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                              {message.videoLectures.map((video) => (
                                <VideoLectureCard key={video.id} video={video} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom Action Footer on AI Bubble: Copy Answer & Feedback */}
                        <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                          <span className="text-[10px] text-slate-400">{message.timestamp}</span>

                          <div className="flex items-center gap-2">
                            {/* Copy Answer Button */}
                            <button
                              onClick={() => handleCopyAnswer(message.id, message.content)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                              title="Copy response text"
                            >
                              {copiedMessageId === message.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                  <span className="font-semibold text-emerald-700">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                                  <span>Copy Answer</span>
                                </>
                              )}
                            </button>

                            {/* Feedback Buttons */}
                            <div className="flex items-center gap-0.5 border-l border-slate-200 pl-2">
                              <button
                                onClick={() => handleFeedback(message.id, 'up')}
                                className={`rounded p-1 text-slate-400 hover:text-indigo-600 transition-colors ${
                                  feedbackState[message.id] === 'up' ? 'text-indigo-600' : ''
                                }`}
                                title="Helpful"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleFeedback(message.id, 'down')}
                                className={`rounded p-1 text-slate-400 hover:text-rose-600 transition-colors ${
                                  feedbackState[message.id] === 'down' ? 'text-rose-600' : ''
                                }`}
                                title="Not helpful"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Realistic 600ms Animated Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-200 bg-white text-indigo-700 shadow-sm">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
              <span className="ml-2 text-xs font-medium text-slate-500">
                CampusHub AI is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 3. Quick Action Prompt Chips */}
      <div className="border-t border-slate-200/60 bg-white/70 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Suggested:
          </span>
          {quickActionPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 active:scale-95"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Document Context Selector & Quick Action Pill */}
      <div className="relative z-20 border-t border-slate-200 bg-white px-4 pt-2.5 pb-1 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Document Context Selector Pill */}
          <div className="relative flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Context:</span>
            <button
              onClick={() => setIsDocSelectorOpen(!isDocSelectorOpen)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                selectedContextResource
                  ? 'border-indigo-300 bg-indigo-50/80 text-indigo-700 ring-1 ring-indigo-500/10'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText
                className={`h-3.5 w-3.5 ${
                  selectedContextResource ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <span className="max-w-[170px] truncate sm:max-w-[220px]">
                {selectedContextResource ? selectedContextResource.title : 'General Guidance (All)'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Clear Context Resource Button */}
            {selectedContextResource && (
              <button
                onClick={() => setSelectedContextResource(null)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Reset to General Guidance"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Context Selector Dropdown Menu */}
            {isDocSelectorOpen && (
              <>
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setIsDocSelectorOpen(false)}
                />
                <div className="absolute bottom-9 left-12 z-[100] w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/10">
                  <div className="mb-1.5 flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Select Document Context</span>
                    <button
                      onClick={() => setIsDocSelectorOpen(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                <div className="max-h-56 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      setSelectedContextResource(null);
                      setIsDocSelectorOpen(false);
                    }}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                      !selectedContextResource
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🌐 General Guidance (Search across all notes)
                  </button>

                  {INITIAL_RESOURCES.map((res) => {
                    const isSelected = selectedContextResource?.id === res.id;
                    return (
                      <button
                        key={res.id}
                        onClick={() => {
                          setSelectedContextResource(res);
                          setIsDocSelectorOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-medium">{res.title}</p>
                          <p
                            className={`text-[10px] ${
                              isSelected ? 'text-indigo-100' : 'text-slate-400'
                            }`}
                          >
                            {res.format} • {res.fileSize} • {res.subject}
                          </p>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

          {/* Quick Action Pill when specific PDF is selected */}
          {selectedContextResource && (
            <button
              onClick={() => handleSummarizeSpecificPdf(selectedContextResource)}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-95 animate-fadeIn"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>📄 Summarize this PDF in 3 bullet points</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Modern Chat Input Area */}
      <footer className="border-t border-slate-200 bg-white p-3 sm:p-4">
        <div className="relative flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedContextResource
                ? `Ask anything about "${selectedContextResource.title}"...`
                : 'Ask about subjects, DSA, M1, BEE, exams, or syllabus...'
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-12 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className={`absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
              inputValue.trim() && !isTyping
                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Send query"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Disclaimer footer */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-500" />
            <span>CampusHub AI uses verified university syllabus & peer recommendations</span>
          </span>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </footer>
    </div>
  );
};

export default CampusAssistant;
