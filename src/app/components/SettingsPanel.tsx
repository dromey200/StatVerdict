import { X, Info } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [autoSave, setAutoSave] = useState(() => {
    try {
      const saved = localStorage.getItem('horadric_auto_save');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    try {
      localStorage.setItem('horadric_auto_save', String(checked));
    } catch {
      // Storage unavailable
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-red-900/30 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-red-900/30 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* AI Engine Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">AI Engine</h3>
            <div className="bg-slate-800/50 border border-red-900/30 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-200">
                  Analysis is performed using advanced AI to evaluate gear based on current meta,
                  class synergies, and your character's progression stage — from campaign leveling to endgame content.
                </p>
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">Preferences</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleAutoSaveChange(!autoSave)}
                className="flex items-center justify-between w-full p-4 bg-slate-800/50 border border-red-900/30 rounded-lg hover:bg-slate-800/70 transition-all"
              >
                <span className="text-sm text-slate-300">Auto-save scan results</span>
                <div className={`relative w-11 h-6 rounded-full transition-colors ${autoSave ? 'bg-red-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoSave ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">About</h3>
            <div className="bg-slate-800/50 border border-red-900/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-slate-400">Season 11 Update</p>
              <p className="text-sm text-slate-400">Made with ❤️ for Sanctuary</p>
              <div className="pt-3 space-y-2 border-t border-slate-700">
                <a
                  href="https://forms.gle/4r3pkCsFuD4Ckaqa8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  🐛 Report Issue
                </a>
                <a
                  href="https://forms.gle/MappsrQeiSyskmYb6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  💡 Submit Enhancement
                </a>
              </div>
            </div>
          </section>

          {/* API Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white">API Information</h3>
            <div className="bg-slate-800/50 border border-red-900/30 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-400">
                For developers and integrators, access to our API is available upon request.
              </p>
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-200">
                  Contact us at{' '}
                  <a href="mailto:support@horadricai.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    statverdict@gmail.com
                  </a>{' '}
                  for more details.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
