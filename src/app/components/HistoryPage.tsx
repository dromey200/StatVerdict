import { useState, useEffect } from 'react';
import { Trash2, Filter, Search, Calendar, X, Eye, CheckCircle2, XCircle, TrendingUp, Zap } from 'lucide-react';

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
}

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('horadric_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all scan history?')) {
      localStorage.removeItem('horadric_history');
      setHistory([]);
    }
  };

  const deleteItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    try {
      localStorage.setItem('horadric_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = filterRarity === 'all' || item.rarity === filterRarity;
    const matchesGrade = filterGrade === 'all' || item.grade === filterGrade;
    return matchesSearch && matchesRarity && matchesGrade;
  });

  const rarityColors: Record<string, string> = {
    mythic: 'border-purple-500',
    unique: 'border-amber-500',
    legendary: 'border-orange-500',
    rare: 'border-yellow-500',
    magic: 'border-blue-500',
    common: 'border-gray-500',
  };

  const gradeColors: Record<string, string> = {
    S: 'bg-purple-600',
    A: 'bg-green-600',
    B: 'bg-blue-600',
    C: 'bg-yellow-600',
    D: 'bg-red-600',
  };

  const parseAnalysis = (analysis: string) => {
    const sections: { type: string; content: string }[] = [];
    const parts = analysis.split(/\*\*([^*]+):\*\*/);

    if (parts[0].trim()) {
      sections.push({ type: 'summary', content: parts[0].trim() });
    }

    for (let i = 1; i < parts.length; i += 2) {
      const heading = parts[i].trim();
      const content = parts[i + 1]?.trim() || '';
      sections.push({ type: heading.toLowerCase().replace(/\s+/g, '_'), content });
    }

    return sections;
  };

  const extractStats = (content: string) => {
    const lines = content.split('\n').filter((line) => line.trim());
    return lines.map((line) => line.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean);
  };

  return (
    <div className="space-y-8">
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

      {/* Search & Filters */}
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

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="grid gap-4">
          {filteredHistory.map((item, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 backdrop-blur-sm border-l-4 ${rarityColors[item.rarity] || rarityColors.common} border-t border-r border-b border-red-900/30 rounded-lg p-6 hover:bg-slate-800/70 transition-all group`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 capitalize">{item.rarity}</span>
                        <span className={`px-2 py-0.5 ${gradeColors[item.grade]} text-white rounded text-xs font-bold`}>
                          Grade {item.grade}
                        </span>
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
                  </div>
                  <p className="text-sm text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
            </div>
          ))}
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
            <p className="text-slate-500">Your scan history will appear here</p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-900/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-slate-900 border-b border-red-900/30 p-6 flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedItem.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 capitalize">{selectedItem.rarity}</span>
                  <span className={`px-3 py-1 ${gradeColors[selectedItem.grade]} text-white rounded-full text-sm font-bold`}>
                    Grade {selectedItem.grade}
                  </span>
                  <span className={`px-3 py-1 ${selectedItem.verdict === 'keep' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-full text-sm`}>
                    {selectedItem.verdict === 'keep' ? '✓ Keep' : '✗ Salvage'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 text-slate-400 hover:text-red-400 transition-colors" aria-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Metadata */}
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
                      <span className="text-slate-400">Mechanics:</span>
                      <span className="ml-2 text-white capitalize">{selectedItem.mechanics}</span>
                    </div>
                  )}
                  {selectedItem.focus && (
                    <div>
                      <span className="text-slate-400">Focus:</span>
                      <span className="ml-2 text-white capitalize">{selectedItem.focus}</span>
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

              {/* Analysis */}
              <div className="space-y-4">
                {(() => {
                  const sections = parseAnalysis(selectedItem.analysis);
                  const summarySection = sections.find((s) => s.type === 'summary');
                  const keyStatsSection = sections.find((s) => s.type.includes('key') || s.type.includes('stat'));
                  const buildSynergySection = sections.find((s) => s.type.includes('build') || s.type.includes('synergy'));
                  const recommendationSection = sections.find((s) => s.type.includes('recommend'));

                  return (
                    <>
                      {/* Verdict Banner */}
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
                            <TrendingUp className="w-5 h-5 text-orange-400" />
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