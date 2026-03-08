// ── ICON CONTRACT (must match ResultsDisplay.tsx, HistoryPage.tsx, RatingGuide.tsx) ──
//  S → Crown   A → Sparkles   B → Star   C → AlertTriangle   D → Trash2
// ────────────────────────────────────────────────────────────────────────────────────
import { Upload, Camera, Sparkles, CheckCircle, BookOpen, Crown, Star, AlertTriangle, Trash2, Droplets, Layers } from 'lucide-react';
import { useState } from 'react';
import { ResultsDisplay } from './ResultsDisplay';

export function TutorialPage() {
  const [showDemoResult, setShowDemoResult] = useState(false);

  // Demo analysis updated: no sanctified flag, Season 12 framing
  const demoResult = {
    title: 'Harlequin Crest (Shako)',
    rarity: 'mythic',
    grade: 'S',
    verdict: 'keep',
    sanctified: false,
    analysis:
      'A Mythic Unique helmet — the rarest item tier in Diablo IV. This is universally considered Best-in-Slot for virtually every endgame build across all classes.\n\n**Key Stats:**\n• +4 to All Skills\n• +20.0% Cooldown Reduction\n• +1,000 Maximum Life\n• +20.0% Damage Reduction\n• Item Power: 925\n\n**Build Synergy:**\nUniversal Best-in-Slot — works for all classes and build types. The +4 All Skills is one of the most powerful effects in the game, scaling your entire build. Cooldown reduction, life, and damage reduction provide excellent defensive layers while maximizing offensive output.\n\nFor Season 12 Pit Pushing, the Shako base is a 1-socket helm — the scanner notes the socket count. If you can find a 2-socket version or use a gem-socket Runeword workaround, this item becomes even stronger.\n\n**Recommendation:**\nKEEP PERMANENTLY — This is an ultra-rare Mythic Unique. Lock this item immediately and never salvage it. Valid for every class at all levels of play including Pit Pushing, Speed Farming, and PvP.',
    image: '/assets/example-shako.png',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">How to Use Horadric AI</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          Learn how to scan your gear and get the most out of AI-powered Season 12 analysis
        </p>
      </div>

      {/* ── Season 12 callout ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-600/40 rounded-xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🩸</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold">Season 12 — Season of Slaughter (Patch 2.6.0)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The scanner is fully updated for Season 12 mechanics. It evaluates{' '}
              <strong className="text-white">Bloodied item scaling</strong> (with the IP ≥ 750 threshold gate),{' '}
              <strong className="text-white">socket count</strong> as a Runeword-eligibility factor on Helms,
              Chests, and 2H Weapons, and <strong className="text-white">Build Focus overrides</strong>{' '}
              including the new Slaughterhouse focus for Butcher Transformation builds.
            </p>
          </div>
        </div>
      </div>

      {/* ── Step-by-step Guide ───────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Step 1 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">Take a Screenshot of Your Gear</h2>
              <p className="text-slate-300 leading-relaxed">
                In Diablo IV, hover over any item in your inventory or ground loot and take a screenshot.
                Make sure the full item tooltip is visible and legible — cropping tightly to the tooltip
                gives the best results and keeps file size small.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Single item tooltip
                  </div>
                  <p className="text-sm text-slate-400">One tooltip fully visible — AI will perform a single-item analysis.</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Side-by-side comparison
                  </div>
                  <p className="text-sm text-slate-400">Two tooltips visible (new vs equipped) — AI auto-detects and compares both.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">Upload Your Screenshot</h2>
              <p className="text-slate-300 leading-relaxed">
                Head to the Scanner tab and upload your screenshot. You can:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Upload className="w-5 h-5 text-red-400" />
                    Drag & Drop
                  </div>
                  <p className="text-sm text-slate-400">Drag your screenshot directly into the upload zone.</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Camera className="w-5 h-5 text-red-400" />
                    Click to Browse
                  </div>
                  <p className="text-sm text-slate-400">Click the upload zone to select a file from your device.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">Select Your Class & Build Settings</h2>
              <p className="text-slate-300 leading-relaxed">
                Choose your character class from the dropdown. Optionally enter your character level
                (e.g. "45" or "Paragon 120") for level-appropriate recommendations. Expand Advanced Settings
                to get the most precise analysis:
              </p>
              <div className="space-y-2 ml-6 text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Build Style:</strong> Select your primary skill/playstyle (e.g. Whirlwind, Bone Spear).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Key Mechanic:</strong> What your build revolves around — Overpower, Crit, Minion Only, etc.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">Build Focus:</strong> Balanced, Max Damage, Survivability, Speed Farming, Pit Pushing, or the new{' '}
                    <strong className="text-orange-300">Slaughterhouse</strong> focus for Butcher Transformation builds.
                  </span>
                </div>
              </div>

              {/* Season 12 tip block */}
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4 mt-2 space-y-3">
                <div className="flex items-start gap-3">
                  <Droplets className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-orange-100 font-semibold">Season 12: Bloodied Items</p>
                    <p className="text-sm text-orange-200/80">
                      Bloodied items have dynamic affixes that scale with your Killstreak. The scanner checks
                      for IP ≥ 750 before applying the Bloodied bonus multiplier — below 750, scaling is
                      negligible. Check Item Power on every Bloodied drop before deciding to keep it.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm text-amber-100 font-semibold">Season 12: Socket Economy</p>
                    <p className="text-sm text-amber-200/80">
                      Runewords require 2 sockets (Ritual Rune + Invocation Rune) in the same item.
                      Helms, Chest Armor, and 2H Weapons with only 1 socket are scored negatively —
                      they can't host a complete Runeword and are capped at B-tier for endgame.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">4</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">Analyze & Review Results</h2>
              <p className="text-slate-300 leading-relaxed">
                Click <strong className="text-white">Analyze Item</strong> and wait a few seconds while the AI
                processes your screenshot. Results include:
              </p>
              <div className="grid md:grid-cols-2 gap-3 mt-2">
                {[
                  { icon: Crown, color: 'text-purple-400', label: 'Grade (S–D)', desc: 'Overall quality rating for your build and progression.' },
                  { icon: CheckCircle, color: 'text-green-400', label: 'Verdict', desc: 'A clear KEEP or SALVAGE recommendation.' },
                  { icon: Sparkles, color: 'text-blue-400', label: 'Key Stats', desc: 'Which affixes matter most and why.' },
                  { icon: BookOpen, color: 'text-orange-400', label: 'Build Synergy', desc: 'How the item interacts with your specific build and Season 12 mechanics.' },
                ].map(({ icon: Icon, color, label, desc }) => (
                  <div key={label} className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-white text-sm font-semibold">{label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 — Interactive Demo */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">5</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">See a Live Example</h2>
              <p className="text-slate-300 leading-relaxed">
                Click below to see what an actual AI result looks like, using a Mythic Unique Harlequin Crest
                as the example. This shows a typical S-grade analysis with Season 12 socket commentary included.
              </p>
              <button
                onClick={() => setShowDemoResult(!showDemoResult)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium shadow-lg shadow-purple-600/50 hover:shadow-purple-500/60 transition-all"
              >
                {showDemoResult ? 'Hide Example' : '🎮 Show Example Analysis'}
              </button>
            </div>
          </div>
        </div>

        {showDemoResult && (
          <div className="mt-2">
            <ResultsDisplay result={demoResult} onNewScan={() => setShowDemoResult(false)} />
          </div>
        )}

      </div>

      {/* ── Grade Quick Reference ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Grade Quick Reference</h2>
          <p className="text-slate-400 text-sm">
            The same icon system is used everywhere — in scan results, history, and the rating guide.
          </p>
          <div className="grid gap-2">
            {[
              { grade: 'S', Icon: Crown, bg: 'bg-gradient-to-br from-purple-600 to-pink-600', shadow: 'shadow-purple-600/40', label: 'Best-in-Slot', action: 'Lock permanently — never salvage.' },
              { grade: 'A', Icon: Sparkles, bg: 'bg-gradient-to-br from-green-600 to-emerald-600', shadow: 'shadow-green-600/40', label: 'Near Best-in-Slot', action: 'Keep and masterwork.' },
              { grade: 'B', Icon: Star, bg: 'bg-gradient-to-br from-blue-600 to-cyan-600', shadow: 'shadow-blue-600/40', label: 'Solid', action: 'Keep — consider enchanting to improve.' },
              { grade: 'C', Icon: AlertTriangle, bg: 'bg-gradient-to-br from-yellow-600 to-orange-600', shadow: 'shadow-yellow-600/40', label: 'Below Average', action: 'Use temporarily — replace when possible.' },
              { grade: 'D', Icon: Trash2, bg: 'bg-gradient-to-br from-red-600 to-rose-600', shadow: 'shadow-red-600/40', label: 'Salvage', action: 'Break down immediately for materials.' },
            ].map(({ grade, Icon, bg, shadow, label, action }) => (
              <div key={grade} className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 rounded-lg p-3">
                <div className={`w-12 h-12 ${bg} rounded-xl flex flex-col items-center justify-center shadow-lg ${shadow} flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white leading-none mt-0.5">{grade}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Best Practices ────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Best Practices</h2>
          <ul className="space-y-3 text-slate-300">
            {[
              'Always set Build Focus before scanning — the same item can score a full letter grade differently between Speed Farming and Pit Pushing.',
              'Select the correct class. Weapon compatibility rules, class skill rank weighting, and build synergy all depend on your class choice.',
              'Enter your character level for level-appropriate analysis — the AI adjusts recommendations for leveling players vs. Paragon endgame.',
              "Check Item Power on every Bloodied drop. Below 750 IP, Bloodied scaling is negligible — the bonus only activates at the 750 threshold.",
              'On Helms, Chests, and 2H Weapons: 2 sockets = Runeword-ready (positive). 1 socket = capped at B-tier (cannot host a full Runeword).',
              'Use comparison mode to decide between a Bloodied item and a standard Ancestral — the AI evaluates both side-by-side against your active focus.',
              'Ratings reflect current Season 12 meta. Check back after major patches — balance updates can change the value of specific affixes.',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-400 font-bold mt-1 flex-shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
