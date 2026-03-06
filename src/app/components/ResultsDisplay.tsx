import { CheckCircle, XCircle, RotateCcw, Sparkles, CheckCircle2, Zap, TrendingUp } from 'lucide-react';

interface ScanResult {
  title: string;
  rarity: string;
  grade: string;
  verdict: string;
  analysis: string;
  image?: string;
  sanctified?: boolean;
}

interface ResultsDisplayProps {
  result: ScanResult;
  onNewScan: () => void;
}

export function ResultsDisplay({ result, onNewScan }: ResultsDisplayProps) {
  const rarityColors: Record<string, string> = {
    mythic: 'from-purple-600 to-pink-600',
    unique: 'from-amber-600 to-orange-600',
    legendary: 'from-orange-600 to-red-600',
    rare: 'from-yellow-600 to-yellow-500',
    magic: 'from-blue-600 to-blue-500',
    common: 'from-gray-600 to-gray-500',
  };

  const gradeColors: Record<string, string> = {
    S: 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-600/50',
    A: 'bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg shadow-green-600/50',
    B: 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-600/50',
    C: 'bg-gradient-to-br from-yellow-600 to-orange-600 shadow-lg shadow-yellow-600/50',
    D: 'bg-gradient-to-br from-red-600 to-rose-600 shadow-lg shadow-red-600/50',
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
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* Image Display */}
      {result.image && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Scanned Item</h3>
          <img
            src={result.image}
            alt="Scanned gear"
            className="w-full rounded-lg shadow-lg border border-slate-700"
          />
        </div>
      )}

      {/* Results Card */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${rarityColors[result.rarity] || rarityColors.common} p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-white">{result.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-sm text-white capitalize">
                  {result.rarity}
                </span>
                {result.verdict === 'keep' ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-600/30 backdrop-blur-sm rounded-full text-sm text-white">
                    <CheckCircle className="w-4 h-4" />
                    Keep
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-600/30 backdrop-blur-sm rounded-full text-sm text-white">
                    <XCircle className="w-4 h-4" />
                    Salvage
                  </span>
                )}
                {result.sanctified && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-yellow-600/30 backdrop-blur-sm rounded-full text-sm text-white">
                    <Sparkles className="w-4 h-4" />
                    Sanctified
                  </span>
                )}
              </div>
            </div>
            <div className={`w-20 h-20 rounded-xl ${gradeColors[result.grade] || gradeColors.D} flex items-center justify-center`}>
              <span className="text-4xl font-bold text-white">{result.grade}</span>
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="p-6 space-y-4">
          {(() => {
            const sections = parseAnalysis(result.analysis);
            const summarySection = sections.find((s) => s.type === 'summary');
            const keyStatsSection = sections.find((s) => s.type.includes('key') || s.type.includes('stat'));
            const buildSynergySection = sections.find((s) => s.type.includes('build') || s.type.includes('synergy'));
            const recommendationSection = sections.find((s) => s.type.includes('recommend'));

            return (
              <>
                {/* Quick Verdict Banner */}
                <div
                  className={`${
                    result.verdict === 'keep'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 border-green-500'
                      : 'bg-gradient-to-r from-red-600 to-red-700 border-red-500'
                  } border-2 rounded-lg p-4 flex items-center gap-4 shadow-lg`}
                >
                  {result.verdict === 'keep' ? (
                    <CheckCircle2 className="w-10 h-10 text-white flex-shrink-0" />
                  ) : (
                    <XCircle className="w-10 h-10 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-xl">
                      {result.verdict === 'keep' ? 'KEEP THIS ITEM' : 'SALVAGE THIS ITEM'}
                    </h3>
                    {recommendationSection && (
                      <p className="text-white/90 text-sm mt-1">
                        {recommendationSection.content.replace(/^(KEEP|SALVAGE)\s*-?\s*/, '')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {summarySection && (
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    {summarySection.content.split('\n').filter(Boolean).map((line, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed">{line}</p>
                    ))}
                  </div>
                )}

                {/* Key Stats */}
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

                {/* Build Synergy */}
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

          {/* New Scan Button */}
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={onNewScan}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-600/50 hover:shadow-red-500/60 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              New Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}