import React, { useState } from 'react';
import AdminDashboard from './components/admin/AdminDashboard';
import { CampusAssistant } from './components/assistant/CampusAssistant';

export function App() {
  const [activeView, setActiveView] = useState<'admin' | 'assistant'>('admin');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Header & Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 text-lg">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-white">CampusHub</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                Academic Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Senior Peer Review & AI Study Assistant
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
          <button
            onClick={() => setActiveView('admin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeView === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <span>🛡️</span>
            <span>Moderation Dashboard</span>
          </button>
          <button
            onClick={() => setActiveView('assistant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeView === 'assistant'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <span>🤖</span>
            <span>AI Academic Mentor</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <div className="min-h-[calc(100vh-65px)] p-4 flex items-center justify-center bg-slate-900/60">
            <div className="w-full max-w-5xl h-[88vh] max-h-[920px] flex flex-col">
              <CampusAssistant className="flex-1 shadow-2xl rounded-2xl overflow-hidden border border-slate-800" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
