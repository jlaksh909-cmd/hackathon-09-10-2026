import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import type { TabId } from './components/layout/Navbar';
import ResourceLibrary from './components/library/ResourceLibrary';
import CourseModules from './components/courses/CourseModules';
import ResourceArchive from './components/archive/ResourceArchive';
import CampusAssistant from './components/assistant/CampusAssistant';
import AdminDashboard from './components/admin/AdminDashboard';
import MidtermSchedule from './components/schedule/MidtermSchedule';
import { mockResources } from './data/mockData';
import type { Resource, Branch, Year } from './data/mockData';
import { fetchResources, upvoteResource } from './services/api';
import { initializeFirebaseSeed } from './services/firebaseService';

export default function App() {
  /* ── Shared State ── */
  const [activeTab, setActiveTab] = useState<TabId>('library');
  const [selectedBranch, setSelectedBranch] = useState<Branch>('CSE');
  const [selectedYear, setSelectedYear] = useState<Year>('2nd Year');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Initialize Firebase & Load Resources ── */
  const loadResources = useCallback(async () => {
    try {
      await initializeFirebaseSeed();
      const data = await fetchResources({ status: 'approved' });
      if (data && data.length > 0) {
        setResources(data);
      }
    } catch (err) {
      console.warn('Using local resource state:', err);
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  /* ── Handlers ── */
  const handleUpvote = useCallback(async (id: string) => {
    // Optimistic UI update
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    try {
      await upvoteResource(id);
    } catch (err) {
      console.warn('Failed to sync upvote:', err);
    }
  }, []);

  const handleAddResource = useCallback((newRes: Resource) => {
    setResources((prev) => [newRes, ...prev]);
  }, []);

  /* ── Tab Content Router ── */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'library':
        return (
          <ResourceLibrary
            resources={resources}
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
            onUpvote={handleUpvote}
            onAddResource={handleAddResource}
            searchQuery={searchQuery}
          />
        );
      case 'courses':
        return (
          <CourseModules
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
            resources={resources}
            onUpvote={handleUpvote}
            onNavigateToNotes={() => setActiveTab('library')}
          />
        );
      case 'resources':
        return (
          <ResourceArchive
            resources={resources}
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
            onUpvote={handleUpvote}
            onAddResource={handleAddResource}
          />
        );
      case 'assistant':
        return (
          <CampusAssistant
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            onResourceApproved={loadResources}
          />
        );
      case 'schedule':
        return (
          <MidtermSchedule
            selectedBranch={selectedBranch}
            selectedYear={selectedYear}
            onNavigateToAssistant={() => setActiveTab('assistant')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      {/* ── Fixed Left Sidebar (256px / w-64) ── */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedBranch={selectedBranch}
        selectedYear={selectedYear}
        onBranchChange={setSelectedBranch}
        onYearChange={setSelectedYear}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Layout (Left-padded on lg screens) ── */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* ── Fixed Top Header ── */}
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedBranch={selectedBranch}
          selectedYear={selectedYear}
          onBranchChange={setSelectedBranch}
          onYearChange={setSelectedYear}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        {/* ── Scrollable Content Area ── */}
        <main className="w-full pt-20 px-4 sm:px-8 pb-12 flex-1">
          <div className="max-w-[1440px] mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
