import React from 'react';
import { CampusAssistant } from './components/assistant/CampusAssistant';

export function App() {
  return (
    <div className="bg-slate-900 min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-5xl h-[92vh] max-h-[960px] flex flex-col">
        <CampusAssistant className="flex-1" />
      </div>
    </div>
  );
}

export default App;
