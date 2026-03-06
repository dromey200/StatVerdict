import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, HelpCircle, Scan, History, BookOpen, GraduationCap } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { SettingsPanel } from './SettingsPanel';
import { HelpGuide } from './HelpGuide';

export function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isModifier = e.ctrlKey || e.metaKey;
    if (!isModifier) return;

    switch (e.key.toLowerCase()) {
      case 'h':
        e.preventDefault();
        navigate('/history');
        break;
      case ',':
        e.preventDefault();
        setSettingsOpen(true);
        break;
      case '/':
      case '?':
        e.preventDefault();
        setHelpOpen(true);
        break;
      case 'n':
        e.preventDefault();
        navigate('/');
        break;
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-red-900/30 shadow-lg shadow-red-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a
                href="https://statverdict.com"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all group"
                aria-label="Back to StatVerdict"
              >
                <img
                  src="/assets/images/statverdict-icon.png"
                  alt="StatVerdict Icon"
                  className="w-8 h-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">Stat Verdict</h1>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-slate-400">Diablo IV Loot Analyzer</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" active={isActive('/') && (location.pathname === '/' || location.pathname === '')} icon={<Scan className="w-4 h-4" />} label="Scanner" tourId="scanner" />
              <NavLink to="/tutorial" active={isActive('/tutorial')} icon={<GraduationCap className="w-4 h-4" />} label="Tutorial" tourId="tutorial" />
              <NavLink to="/guide" active={isActive('/guide')} icon={<BookOpen className="w-4 h-4" />} label="Rating Guide" tourId="guide" />
              <NavLink to="/history" active={isActive('/history')} icon={<History className="w-4 h-4" />} label="History" tourId="history" />
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSettingsOpen(true)}
                data-tour="settings"
                className="p-2 rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setHelpOpen(true)}
                className="p-2 rounded-lg bg-transparent text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-red-900/30 px-2 py-2">
          <nav className="flex items-center justify-around">
            <MobileNavLink to="/" active={isActive('/') && (location.pathname === '/' || location.pathname === '')} icon={<Scan className="w-5 h-5" />} label="Scanner" tourId="scanner" />
            <MobileNavLink to="/tutorial" active={isActive('/tutorial')} icon={<GraduationCap className="w-5 h-5" />} label="Tutorial" tourId="tutorial" />
            <MobileNavLink to="/guide" active={isActive('/guide')} icon={<BookOpen className="w-5 h-5" />} label="Guide" tourId="guide" />
            <MobileNavLink to="/history" active={isActive('/history')} icon={<History className="w-5 h-5" />} label="History" tourId="history" />
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <HelpGuide isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <footer className="border-t border-red-900/30 bg-slate-900/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            Horadric AI and this application are not affiliated with or endorsed by Blizzard Entertainment, Inc.
            Diablo is a trademark or registered trademark of Blizzard Entertainment, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, active, icon, label, tourId }: { to: string; active: boolean; icon: React.ReactNode; label: string; tourId: string }) {
  return (
    <Link to={to} data-tour={tourId} className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${active ? 'bg-red-600 text-white shadow-md shadow-red-600/50' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, active, icon, label, tourId }: { to: string; active: boolean; icon: React.ReactNode; label: string; tourId: string }) {
  return (
    <Link to={to} data-tour={tourId} className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all ${active ? 'text-red-400' : 'text-slate-400 hover:text-white'}`}>
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}
