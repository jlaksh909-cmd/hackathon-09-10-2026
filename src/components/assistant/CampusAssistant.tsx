import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  BookOpen,
  Lightbulb,
  FileCheck2,
  Trash2,
  Loader2,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import type { Branch, Year } from '../../data/mockData';
import { queryAssistant } from '../../services/api';

interface CampusAssistantProps {
  selectedBranch: Branch;
  selectedYear: Year;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: string[];
}

export default function CampusAssistant({
  selectedBranch,
  selectedYear,
}: CampusAssistantProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello Alex! I am your **CampusHub AI Study Assistant** for **${selectedBranch} (${selectedYear})**.\n\nAsk me anything about algorithms, time complexities, operating system scheduling, database normalization, or exam formulas.`,
      timestamp: '12:00 PM',
      citations: ['Firebase Syllabus Store', `${selectedBranch} Lecture Notes`],
    },
  ]);

  const quickPrompts = [
    'Explain Master Theorem Case 2 for Time Complexity',
    'How does Banker\'s Algorithm prevent Deadlock in OS?',
    'What are the rules for BCNF (Boyce-Codd Normal Form)?',
    'Compare QuickSort vs MergeSort auxiliary space tradeoffs',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const reply = await queryAssistant(userMsg.text, selectedBranch, 'Curriculum');
      if (reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: reply.id || `ai-${Date.now()}`,
            sender: 'assistant',
            text: reply.text,
            timestamp: reply.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citations: reply.citations,
          },
        ]);
      }
    } catch (err) {
      console.warn('AI query fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Chat cleared. Ready for your questions on **${selectedBranch} (${selectedYear})**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['Course Catalog Archive'],
      },
    ]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in">
      {/* ── Top Minimalist Header ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                Firebase AI Engine
              </span>
              <span className="text-xs font-medium text-zinc-500">
                Cohort: <strong className="text-zinc-800">{selectedBranch}</strong> • {selectedYear}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              AI Study Assistant
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearChat}
          className="px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Thread</span>
        </button>
      </div>

      {/* ── Chat Grid (8 Cols Chat / 4 Cols Inquiries) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Chat Stream (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col h-[650px] overflow-hidden">
          
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed transition-all ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'bg-zinc-50 text-zinc-900 border border-zinc-200/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-black/[0.06] dark:border-white/10">
                    <span className="font-bold text-[11px] opacity-75">
                      {msg.sender === 'user' ? 'You' : 'CampusHub AI'}
                    </span>
                    <span className="text-[10px] opacity-50">{msg.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap space-y-2 font-normal">
                    {msg.text}
                  </div>

                  {/* Citations Badges */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-200/60 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-600" /> Sources:
                      </span>
                      {msg.citations.map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-200/70 text-zinc-700 text-[10px] font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'assistant' && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(msg.text, msg.id)}
                        className="text-[10px] text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy note
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-xs text-zinc-600 font-medium p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-800" />
                <span>Synthesizing notes from {selectedBranch} database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask a question about ${selectedBranch} curriculum...`}
                className="flex-1 px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 shadow-2xs font-medium"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Suggested Questions (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-zinc-900">Suggested Inquiries</h3>
            </div>
            <p className="text-xs text-zinc-500">Click any topic to query the verified syllabus base:</p>

            <div className="flex flex-col gap-2 pt-1">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/60 text-left text-xs font-medium text-zinc-800 hover:text-zinc-900 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2">{prompt}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-zinc-800" />
              <h3 className="font-bold text-sm text-zinc-900">Knowledge Base</h3>
            </div>

            <div className="space-y-2 text-xs text-zinc-600">
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
                <span className="font-semibold text-zinc-800">Peer-Reviewed Notes</span>
                <span className="font-mono text-emerald-600 font-bold">100% Synced</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between">
                <span className="font-semibold text-zinc-800">Formulas & Lemmas</span>
                <span className="font-mono text-zinc-700 font-bold">LaTeX Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
