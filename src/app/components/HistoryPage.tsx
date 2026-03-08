// ── ICON CONTRACT ────────────────────────────────────────────────────────────
//  S → Crown   A → Sparkles   B → Star   C → AlertTriangle   D → Trash2
//  Matches: ResultsDisplay.tsx · RatingGuide.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import {
  Trash2,
  Filter,
  Search,
  Calendar,
  X,
  Eye,
  CheckCircle2,
  XCircle,
  BarChart2,
  Zap,
  Crown,
  Sparkles,
  Star,
  AlertTriangle,
  Droplets,
} from 'lucide-react';

// ── HistoryItem (Season 12) ───────────────────────────────────────────────────
// `sanctified` kept for backward-compat with existing localStorage items
// but is no longer displayed. `bloodied` and `socket_count` are S12 additions.
interface HistoryItem {
  title: string;
  rarity: string;
  grade: string;
  verdict: string;
  analysis: string;
  image?: string;
  timestamp: number;
  class: string;
  level?: string;
  mechanics?: string;
  focus?: string;
  sanctified?: boolean;    // S11 legacy — kept for compat, not displayed
  bloodied?: boolean;      // S12
  socket_count?: number;   // S12
}

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('horadric_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all scan history?')) {
      localStorage.removeItem('horadric_history');
      setHistory([]);
    }
  };

  const deleteItem = (index: number) => {
    const next = history.filter((_, i) => i !== index);
    setHistory(next);
    try {
      localStorage.setItem('horadric_history', JSON.stringify(next));
    } catch (e) {
      console.error('Error updating history:', e);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity;
    const matchesGrade  = filterGrade  === 'all' || item.grade  === filterGrade;
    return matchesSearch && matchesRarity && matchesGrade;
  });

  // ── Visual maps ──────────────────────────────────────────────────────────
  const rarityColors: Record<string, string> = {
    mythic:    'border-purple-500',
    unique:    'border-amber-500',
    legendary: 'border-orange-500',
    rare:      'border-yellow-500',
    magic:     'border-blue-500',
    common:    'border-gray-500',
  };

  // Flat bg colours for small badges (list + modal header pills)
  const gradeColors: Record<string, string> = {
    S: 'bg-purple-600',
    A: 'bg-green-600',
    B: 'bg-blue-600',
    C: 'bg-yellow-600',
    D: 'bg-red-600',
  };

  // ── Canonical grade icon map ──────────────────────────────────────────────
  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case 'S': return Crown;
      case 'A': return Sparkles;
      case 'B': return Star;
      case 'C': return AlertTriangle;
      case 'D': return Trash2;
      default:  return Trash2;
    }
  };

  const parseAnalysis = (analysis: string) => {
    const sections: { type: string; content: string }[] = [];
    const parts = analysis.split(/\*\*([^*]+):\*\*/);
    if (parts[0].trim()) sections.push({ type: 'summary', content: parts[0].trim() });
    for (let i = 1; i < parts.length; i += 2) {
      const heading = parts[i].trim();
      const content = parts[i + 1]?.trim() || '';
      sections.push({ type: heading.toLowerCase().replace(/\s+/g, '_'), content });
    }
    return sections;
  };

  const extractStats = (content: string) => {
    return content
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
      .filter(Boolean);
  };

  // ── Focus label helper (maps id → display name) ──────────────────────────
  const formatFocus = (focus: string | undefined) => {
    if (!focus) return null;
    const map: Record<string, string> = {
      balanced:       'Balanced',
      damage:         'Max Damage',
      survivability:  'Survivability',
      speed_farming:  'Speed Farming',
      pit_pushing:    'Pit Pushing',
      pvp:            'PvP',
      slaughterhouse: 'Slaughterhouse',
    };
    return map[focus] ?? focus;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Scan History</h1>
          <p className="text-lg text-slate-400 mt-2">
            {history.length} {history.length === 1 ? 'scan' : 'scans'} recorded
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Search & filters */}
      {history.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Rarities</option>
                <option value="mythic">Mythic</option>
                <option value="unique">Unique</option>
                <option value="legendary">Legendary</option>
                <option value="rare">Rare</option>
                <option value="magic">Magic</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Grades</option>
                <option value="S">S Grade</option>
                <option value="A">A Grade</option>
                <option value="B">B Grade</option>
                <option value="C">C Grade</option>
                <option value="D">D Grade</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ── History list ── */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((item, index) => {
            const GradeIcon = getGradeIcon(item.grade);
            return (
              <div
                key={index}
                className={`group bg-slate-800/50 backdrop-blur-sm border-l-4 ${rarityColors[item.rarity] || rarityColors.common} border-t border-r border-b border-red-900/20 rounded-xl p-4 flex items-center gap-4 hover:bg-slate-800/70 transition-all`}
              >
                {/* Grade badge */}
                <div className={`w-12 h-12 ${gradeColors[item.grade] || gradeColors.D} rounded-lg flex flex-col items-center justify-center gap-0.5 flex-shrink-0`}>
                  <GradeIcon className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">{item.grade}</span>
                </div>

                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{item.title}</h3>

                    {/* Season 12 — Bloodied badge */}
                    {item.bloodied && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-red-700/40 text-red-300 border border-red-600/40 rounded text-xs">
                        <Droplets className="w-3 h-3" />
                        Bloodied
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 ${item.verdict === 'keep' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'} rounded text-xs`}>
                      {item.verdict === 'keep' ? '✓ Keep' : '✗ Salvage'}
                    </span>
                    {item.class && item.class !== 'any' && (
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 capitalize">{item.class}</span>
                    )}
                    {item.level && (
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">{item.level}</span>
                    )}
                  </div>
                </div>

                {/* Timestamp */}
                <p className="text-sm text-slate-400 hidden sm:block flex-shrink-0">
                  {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="p-2 text-slate-400 hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="View details"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : history.length > 0 ? (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-red-900/20 rounded-xl p-12 text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-400">No Results Found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-red-900/20 rounded-xl p-12 text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-slate-700/50 rounded-full flex items-center justify-center">
            <Calendar className="w-10 h-10 text-slate-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-400">No Scans Yet</h3>
            <p className="text-slate-500">Your scan history will appear here after your first analysis</p>
          </div>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-900/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-slate-900 border-b border-red-900/30 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 capitalize">{selectedItem.rarity}</span>

                  {/* Grade pill */}
                  <span className={`flex items-center gap-1 px-3 py-1 ${gradeColors[selectedItem.grade]} text-white rounded-full text-sm font-bold`}>
                    {(() => { const Icon = getGradeIcon(selectedItem.grade); return <Icon className="w-3.5 h-3.5" />; })()}
                    Grade {selectedItem.grade}
                  </span>

                  {/* Verdict pill */}
                  <span className={`px-3 py-1 ${selectedItem.verdict === 'keep' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-full text-sm`}>
                    {selectedItem.verdict === 'keep' ? '✓ Keep' : '✗ Salvage'}
                  </span>

                  {/* Season 12 — Bloodied pill */}
                  {selectedItem.bloodied && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-700/50 text-red-200 border border-red-600/40 rounded-full text-sm">
                      <Droplets className="w-3.5 h-3.5" />
                      Bloodied
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">

              {/* Scan metadata */}
              <div className="bg-slate-800/50 border border-red-900/30 rounded-lg p-4 space-y-2">
                <h3 className="font-bold text-white mb-3">Scan Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Class:</span>
                    <span className="ml-2 text-white capitalize">{selectedItem.class}</span>
                  </div>
                  {selectedItem.level && (
                    <div>
                      <span className="text-slate-400">Level:</span>
                      <span className="ml-2 text-white">{selectedItem.level}</span>
                    </div>
                  )}
                  {selectedItem.mechanics && (
                    <div>
                      <span className="text-slate-400">Build Style:</span>
                      <span className="ml-2 text-white capitalize">{selectedItem.mechanics}</span>
                    </div>
                  )}
                  {selectedItem.focus && (
                    <div>
                      <span className="text-slate-400">Build Focus:</span>
                      <span className="ml-2 text-white">{formatFocus(selectedItem.focus)}</span>
                    </div>
                  )}
                  {/* Season 12 — Socket count */}
                  {selectedItem.socket_count !== undefined && selectedItem.socket_count > 0 && (
                    <div>
                      <span className="text-slate-400">Sockets:</span>
                      <span className={`ml-2 font-semibold ${selectedItem.socket_count >= 2 ? 'text-amber-300' : 'text-slate-300'}`}>
                        {selectedItem.socket_count} {selectedItem.socket_count === 1 ? '(limited Runeword eligibility)' : '(Runeword-ready)'}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Scanned:</span>
                    <span className="ml-2 text-white">
                      {new Date(selectedItem.timestamp).toLocaleDateString()} at {new Date(selectedItem.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis sections */}
              <div className="space-y-4">
                {(() => {
                  const sections = parseAnalysis(selectedItem.analysis);
                  const summarySection        = sections.find((s) => s.type === 'summary');
                  const keyStatsSection       = sections.find((s) => s.type.includes('key') || s.type.includes('stat'));
                  const buildSynergySection   = sections.find((s) => s.type.includes('build') || s.type.includes('synergy'));
                  const recommendationSection = sections.find((s) => s.type.includes('recommend'));

                  return (
                    <>
                      {/* Verdict banner */}
                      <div className={`${selectedItem.verdict === 'keep' ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-500' : 'bg-gradient-to-r from-red-600 to-red-700 border-red-500'} border-2 rounded-lg p-4 flex items-center gap-4 shadow-lg`}>
                        {selectedItem.verdict === 'keep' ? (
                          <CheckCircle2 className="w-10 h-10 text-white flex-shrink-0" />
                        ) : (
                          <XCircle className="w-10 h-10 text-white flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-xl">
                            {selectedItem.verdict === 'keep' ? 'KEEP THIS ITEM' : 'SALVAGE THIS ITEM'}
                          </h3>
                          {recommendationSection && (
                            <p className="text-white/90 text-sm mt-1">
                              {recommendationSection.content.replace(/^(KEEP|SALVAGE)\s*-?\s*/, '')}
                            </p>
                          )}
                        </div>
                      </div>

                      {summarySection && (
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                          {summarySection.content.split('\n').filter(Boolean).map((line, idx) => (
                            <p key={idx} className="text-slate-300 leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}

                      {keyStatsSection && (
                        <div className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border border-blue-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5 text-blue-400" />
                            <h3 className="font-bold text-white">Key Stats</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {extractStats(keyStatsSection.content).map((stat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <span className="text-green-400 mt-1">▸</span>
                                <span className="text-slate-200">{stat}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {buildSynergySection && (
                        <div className="bg-gradient-to-br from-orange-950/50 to-red-950/50 border border-orange-700/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart2 className="w-5 h-5 text-orange-400" />
                            <h3 className="font-bold text-white">Build Synergy</h3>
                          </div>
                          {buildSynergySection.content.split('\n').filter(Boolean).map((line, idx) => (
                            <p key={idx} className="text-slate-300 text-sm leading-relaxed">{line}</p>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-600/50 hover:shadow-red-500/60 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
