import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { getStoredReports } from './services/dbService';
import { CivicReport } from './types';
import { Loader2, Sparkles } from 'lucide-react';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Feature Views & Auth
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { CitizenDashboard } from './components/dashboard/CitizenDashboard';
import { ReportWizard } from './components/reports/ReportWizard';
import { CivicMap } from './components/map/CivicMap';
import { IssueDetailsView } from './components/reports/IssueDetailsView';
import { ModeratorDashboard } from './components/dashboard/ModeratorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { CivicAIChat } from './components/ai/CivicAIChat';
import { CivicPulseView } from './components/dashboard/CivicPulseView';
import { LeaderboardView } from './components/dashboard/LeaderboardView';
import { ProfileView } from './components/dashboard/ProfileView';
import { PersonalImpactView } from './components/dashboard/PersonalImpactView';
import { NearbyIssuesView } from './components/dashboard/NearbyIssuesView';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAuthLoading, user } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);

  // Load initial reports
  const refreshReports = () => {
    const data = getStoredReports();
    setReports(data);
  };

  useEffect(() => {
    refreshReports();
  }, []);

  const handleSelectReport = (report: CivicReport) => {
    setSelectedReport(report);
    setActiveTab('report-detail');
  };

  const handleReportCreated = (report: CivicReport) => {
    refreshReports();
    setSelectedReport(report);
    setActiveTab('report-detail');
  };

  // SHOW SLEEK LOADING SCREEN WHILE DETERMINING AUTH SESSION STATE
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-sky-500/30 animate-pulse">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-sky-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verifying CivicLens AI Session & Auth...</span>
        </div>
      </div>
    );
  }

  // IF NOT AUTHENTICATED -> SHOW LOGIN SCREEN FIRST!
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white transition-colors duration-200">
      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setActiveTab('report')}
      />

      {/* Main Body Container */}
      {activeTab === 'landing' ? (
        <LandingPage
          onNavigate={setActiveTab}
          onReportClick={() => setActiveTab('report')}
        />
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
          {/* Left Sidebar Menu */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main View Panel */}
          <main className="flex-1 overflow-x-hidden">
            {activeTab === 'dashboard' && (
              <CitizenDashboard
                reports={reports}
                onNavigate={setActiveTab}
                onSelectReport={handleSelectReport}
                onReportClick={() => setActiveTab('report')}
              />
            )}

            {activeTab === 'report' && (
              <ReportWizard
                onSuccess={handleReportCreated}
                onCancel={() => setActiveTab('dashboard')}
              />
            )}

            {activeTab === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Full-Screen Interactive Civic Map</h2>
                  <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">{reports.length} Pins Loaded</span>
                </div>
                <CivicMap
                  reports={reports}
                  onSelectReport={handleSelectReport}
                  className="h-[680px]"
                />
              </div>
            )}

            {activeTab === 'report-detail' && selectedReport && (
              <IssueDetailsView
                report={selectedReport}
                onBack={() => setActiveTab('dashboard')}
                onUpdate={(updated) => {
                  refreshReports();
                  setSelectedReport(updated);
                }}
              />
            )}

            {activeTab === 'my-reports' && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">My Reported Issues ({reports.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map(r => (
                    <div
                      key={r.id}
                      onClick={() => handleSelectReport(r)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 cursor-pointer flex gap-4 transition-all shadow-sm hover:shadow-md"
                    >
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        className="w-24 h-24 object-cover rounded-xl shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="space-y-1 overflow-hidden">
                        <div className="text-xs text-sky-600 dark:text-sky-400 font-bold">#{r.id} • {r.status}</div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{r.title}</h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">📍 {r.location.address}</div>
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2">Priority: {r.priorityScore}/100</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'nearby' && (
              <NearbyIssuesView reports={reports} onSelectReport={handleSelectReport} />
            )}

            {activeTab === 'impact' && <PersonalImpactView />}

            {activeTab === 'moderator-dashboard' && (
              <ModeratorDashboard
                reports={reports}
                onSelectReport={handleSelectReport}
                onRefresh={refreshReports}
              />
            )}

            {activeTab === 'admin-dashboard' && (
              <AdminDashboard
                reports={reports}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === 'ai-assistant' && (
              <CivicAIChat
                reports={reports}
                onSelectReport={handleSelectReport}
              />
            )}

            {activeTab === 'civic-pulse' && <CivicPulseView />}

            {activeTab === 'leaderboard' && <LeaderboardView />}

            {activeTab === 'profile' && <ProfileView />}

            {activeTab === 'settings' && <ProfileView />}
          </main>
        </div>
      )}

      {/* Global Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
