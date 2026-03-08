import { Star, Gem, Sparkles, Trophy, Info, Crown, AlertTriangle, Trash2 } from 'lucide-react';

export function RatingGuide() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Rating Guide</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          Learn how items are evaluated and what each grade means for your build
        </p>
      </div>

      {/* How Items Are Graded */}
      <section className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">How Items Are Graded</h2>
            <p className="text-slate-300 leading-relaxed">
              Every item is evaluated against your class, build, current meta, and character progression.
              Grades reflect real value for your specific situation — whether you're leveling through the campaign
              or pushing endgame content. Our AI considers stat rolls, build synergy, greater affixes, and
              seasonal mechanics to provide accurate, level-appropriate recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Grade System */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Grade System</h2>

        <div className="grid gap-4">
          {/* S Grade */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/50 flex-shrink-0">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Best-in-Slot</h3>
                <p className="text-purple-100 leading-relaxed">
                  Perfect or near-perfect rolls for meta builds. Keep permanently — this is endgame gear.
                  Items with this grade feature optimal stat combinations, high roll percentages, and
                  exceptional synergy with popular builds.
                </p>
                <div className="bg-purple-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-purple-200 text-sm"><span className="font-semibold">Endgame:</span> BiS items — lock immediately and prioritize masterworking</p>
                  <p className="text-purple-200 text-sm"><span className="font-semibold">Leveling:</span> Exceptional for your level — use until max level</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-600/40 text-purple-100 rounded-full text-sm font-bold border border-purple-400/30">
                    <Crown className="w-3.5 h-3.5" />
                    BiS — LOCK THIS ITEM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* A Grade */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/50 flex-shrink-0">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Excellent</h3>
                <p className="text-green-100 leading-relaxed">
                  Strong rolls with high build synergy. Ready for Pit pushing and endgame content.
                  These items have great stat combinations and solid rolls, making them viable for
                  high-tier content with minimal investment.
                </p>
                <div className="bg-green-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-green-200 text-sm"><span className="font-semibold">Endgame:</span> Ready for high-tier content — worth masterworking</p>
                  <p className="text-green-200 text-sm"><span className="font-semibold">Leveling:</span> Very strong for your level — keep equipped</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/40 text-green-100 rounded-full text-sm font-bold border border-green-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    KEEP & USE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* B Grade */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/50 flex-shrink-0">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Solid</h3>
                <p className="text-blue-100 leading-relaxed">
                  Good foundation with room to grow. Usable for progression; worth upgrading at the Enchantress.
                  These items have decent stats but may need rerolling or greater affix upgrades to reach full potential.
                </p>
                <div className="bg-blue-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-blue-200 text-sm"><span className="font-semibold">Endgame:</span> Has potential — consider enchanting or masterworking low tiers</p>
                  <p className="text-blue-200 text-sm"><span className="font-semibold">Leveling:</span> Good stats — suitable for progression</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/40 text-blue-100 rounded-full text-sm font-bold border border-blue-400/30">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    CONSIDER — UPGRADE POTENTIAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* C Grade */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/50 flex-shrink-0">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Below Average</h3>
                <p className="text-yellow-100 leading-relaxed">
                  Some useful stats but too many wasted affixes. Replace when something better drops.
                  These items may work temporarily but should be upgraded as soon as possible.
                </p>
                <div className="bg-yellow-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-yellow-200 text-sm"><span className="font-semibold">Endgame:</span> Too many wasted affixes — replace ASAP</p>
                  <p className="text-yellow-200 text-sm"><span className="font-semibold">Leveling:</span> Usable if nothing better — replace when possible</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600/40 text-orange-100 rounded-full text-sm font-bold border border-orange-400/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    REPLACE SOON
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* D Grade */}
          <div className="bg-gradient-to-r from-red-600/20 to-rose-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/50 flex-shrink-0">
                <Trash2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Salvage</h3>
                <p className="text-red-100 leading-relaxed">
                  Poor synergy, low rolls, or wrong stats for your build. Salvage for materials. These items
                  provide little to no benefit and should be broken down immediately.
                </p>
                <div className="bg-red-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-red-200 text-sm"><span className="font-semibold">Endgame:</span> No value — salvage immediately for materials</p>
                  <p className="text-red-200 text-sm"><span className="font-semibold">Leveling:</span> Wrong stats or very low rolls — salvage</p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/40 text-red-100 rounded-full text-sm font-bold border border-red-400/30">
                    <Trash2 className="w-3.5 h-3.5" />
                    SALVAGE NOW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rarity System */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Item Rarities</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border-l-4 border-purple-500 border-t border-r border-b border-red-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Gem className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-purple-300">Mythic Unique</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ultra-rare unique items with game-changing effects. Almost always S-tier — the AI evaluates
              build fit, not just rarity. Examples: Harlequin Crest, The Grandfather.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border-l-4 border-amber-500 border-t border-r border-b border-red-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-300">Unique</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Named items with fixed unique powers. Build-defining gear that can range from S to C tier
              depending on synergy with your build and stat rolls.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border-l-4 border-orange-500 border-t border-r border-b border-red-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-bold text-orange-300">Legendary</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Items with legendary powers and aspects. These form the backbone of most builds and can
              be excellent when rolled correctly with the right aspects.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border-l-4 border-yellow-500 border-t border-r border-b border-red-900/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-yellow-300">Rare / Magic / Common</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Leveling items graded on a separate curve based on level-appropriate usefulness.
              At endgame, these are typically salvaged immediately.
            </p>
          </div>
        </div>
      </section>

      {/* Special Modifiers */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Special Modifiers</h2>

        <div className="grid gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🦋</span>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-white">Sanctified Items</h3>
                <p className="text-slate-300 leading-relaxed">
                  Items blessed at the Heavenly Forge with special sanctified powers. These are evaluated
                  for permanent upgrade potential and typically receive higher grades when the sanctified
                  power synergizes with your build.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">✨</span>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-white">Greater Affixes</h3>
                <p className="text-slate-300 leading-relaxed">
                  Gold-bordered stats with 1.5× value. Each greater affix significantly boosts the grade.
                  Multiple greater affixes on synergistic stats can elevate even legendary items to S-tier.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚡</span>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-white">Masterworked Items</h3>
                <p className="text-slate-300 leading-relaxed">
                  Items upgraded through the Pit's masterworking system. Masterwork levels improve all
                  affixes and can turn good items into exceptional ones. Higher masterwork tiers are
                  considered in the final grade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-white">Pro Tips</h2>
        <ul className="space-y-3 text-slate-200">
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>Always consider your specific build when evaluating items. An S-tier item for one build might be D-tier for another.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>Greater affixes on the right stats are more valuable than higher item power on wrong stats.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>Don't salvage unique items immediately - they might be valuable for alternate builds or future patches.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>B-grade items with the right affixes can be worth masterworking if you're missing better drops.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 font-bold mt-1">•</span>
            <span>Use the comparison mode to decide between two similar items for your specific playstyle.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}