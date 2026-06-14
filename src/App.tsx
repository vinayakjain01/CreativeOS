import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Templates from './pages/Templates/Templates';
import Rules from './pages/Rules/Rules';
import Generation from './pages/Generation/Generation';
import MetaCatalog from './pages/MetaCatalog/MetaCatalog';
import FeedCenter from './pages/FeedCenter/FeedCenter';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';
import Admin from './pages/Admin/Admin';
import Onboarding from './components/Onboarding/Onboarding';
import SignIn from './components/Auth/SignIn';
import { useAuth } from './lib/auth';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your automation and performance' },
  products: { title: 'Products', subtitle: 'Manage your product catalog and creatives' },
  templates: { title: 'Templates', subtitle: 'Create and manage creative templates' },
  rules: { title: 'Rules Engine', subtitle: 'Automate creative generation with rules' },
  generation: { title: 'Image Generation', subtitle: 'Monitor and manage your generation queue' },
  creatives: { title: 'Generated Creatives', subtitle: 'View and manage generated images' },
  meta: { title: 'Meta Catalog', subtitle: 'Manage your Meta Commerce integration' },
  feeds: { title: 'Feed Center', subtitle: 'Generate and validate product feeds' },
  'automation-queue': { title: 'Queue Monitoring', subtitle: 'Monitor automation queue status' },
  'automation-analytics': { title: 'Analytics', subtitle: 'Track performance and metrics' },
  settings: { title: 'Settings', subtitle: 'Manage your preferences' },
  admin: { title: 'Admin', subtitle: 'Workspace administration' },
};

function App() {
  const { configured, loading: authLoading, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onboardingComplete = localStorage.getItem('onboarding_complete');
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'templates':
        return <Templates />;
      case 'rules':
        return <Rules />;
      case 'generation':
        return <Generation />;
      case 'creatives':
        return <Templates />;
      case 'meta':
        return <MetaCatalog />;
      case 'feeds':
        return <FeedCenter />;
      case 'automation-queue':
        return <Generation />;
      case 'automation-analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoaded || authLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth gate: when a backend is configured, require a session before the app
  // (so RLS-protected queries return rows). In demo mode (unconfigured), skip.
  if (configured && !user) {
    return <SignIn />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const pageInfo = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-secondary))] flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col transition-all duration-200"
        style={{
          marginLeft: sidebarCollapsed ? 72 : 280,
        }}
      >
        {/* Header */}
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
