import { Star, Gem, Sparkles, Trophy, Info, Crown, AlertTriangle, Trash2, Droplets, Layers } from 'lucide-react';

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
              or pushing endgame content. Our AI considers stat rolls, build synergy, greater affixes, socket count,
              and Season 12 mechanics (including Bloodied item scaling and Runeword socket economy) to provide
              accurate, level-appropriate recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Season 12 Special Modifiers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">Season 12 Special Modifiers</h2>
        <p className="text-slate-400 text-center text-sm max-w-2xl mx-auto">
          These mechanics are unique to the Season of Slaughter and directly influence how items are scored.
        </p>

        <div className="grid gap-4 md:grid-cols-2">

          {/* Bloodied Items */}
          <div className="bg-gradient-to-br from-red-950/60 to-slate-900/60 backdrop-blur-sm border border-red-700/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Bloodied Items</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Bloodied items carry dynamic affixes that scale in real-time based on your active Killstreak tier
              or total kill count — making them significantly stronger during high-momentum play. There are three
              Bloodied affix categories:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">Rampage</span>
                <span className="text-slate-300">Armor slots — mitigation and defense stats that scale with Killstreak momentum.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-bold mt-0.5 flex-shrink-0">Feast</span>
                <span className="text-slate-300">Weapon slots — damage stats that scale with clear speed and rapid kills.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5 flex-shrink-0">Hunger</span>
                <span className="text-slate-300">Jewelry slots — resource pool stats that scale with sustained kill drain mechanics.</span>
              </li>
            </ul>
            <div className="bg-red-900/30 rounded-lg p-3 border border-red-700/30">
              <p className="text-red-200 text-sm">
                <span className="font-semibold">Scanner logic:</span> Horadric AI checks for a minimum Item Power of 750.
                At this threshold, Bloodied items display a UI visual indicator in-game, confirming the dynamic
                scaling ceiling is fully unlocked. Items at 750+ IP receive a bonus scoring multiplier.
              </p>
            </div>
          </div>

          {/* Runewords & Socket Economy */}
          <div className="bg-gradient-to-br from-amber-950/60 to-slate-900/60 backdrop-blur-sm border border-amber-700/40 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-yellow-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">Runewords & Socket Economy</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              The Season 12 endgame revolves around Runewords — powerful combinations that require slotting one
              Rune of Ritual alongside one Rune of Invocation into the same item. This makes socket count
              a critical evaluation factor, particularly for these base item types:
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                Helms
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                Chest Armor
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0"></span>
                Two-Handed Weapons (any type)
              </li>
            </ul>
            <div className="space-y-2">
              <div className="bg-green-900/30 rounded-lg p-2.5 border border-green-700/30">
                <p className="text-green-200 text-sm">
                  <span className="font-semibold">2 sockets:</span> Runeword-ready — positive score weight applied. Can house a full Ritual + Invocation pair.
                </p>
              </div>
              <div className="bg-red-900/30 rounded-lg p-2.5 border border-red-700/30">
                <p className="text-red-200 text-sm">
                  <span className="font-semibold">1 socket:</span> Suboptimal — negative weight applied. Cannot host both required runes; avoid for endgame.
                </p>
              </div>
            </div>
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
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">Endgame:</span> BiS items — lock immediately and prioritize masterworking.
                    For Pit Pushing, S-tier requires 2-socket Ancestral bases on Helms, Chests, and 2H Weapons to
                    support mandatory Runeword combinations.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">Speed Farming:</span> Bloodied items with IP ≥ 750 can achieve S-tier
                    even on average rolls — Killstreak scaling elevates their effective power ceiling significantly
                    during high-momentum clears.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <span className="font-semibold">Leveling:</span> Exceptional for your level — use until max level, this will carry you.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-bold">
                    <Crown className="w-3.5 h-3.5" />
                    KEEP — LOCK PERMANENTLY
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* A Grade */}
          <div className="bg-gradient-to-r from-yellow-600/20 to-amber-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-600/50 flex-shrink-0">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Near Best-in-Slot</h3>
                <p className="text-yellow-100 leading-relaxed">
                  Excellent item with strong synergy and solid rolls. Keep and consider upgrading.
                  These items are top-tier for most content and may only be replaced by min-maxed endgame pieces.
                </p>
                <div className="bg-yellow-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-yellow-200 text-sm">
                    <span className="font-semibold">Endgame:</span> Strong item — masterwork and use as your main piece.
                    A-tier Bloodied gear with the Feast affix on a weapon is often the Speed Farming sweet spot:
                    top-end damage scaling without needing a perfect roll to perform.
                  </p>
                  <p className="text-yellow-200 text-sm">
                    <span className="font-semibold">Pit Pushing:</span> 2-socket A-tier Ancestral bases are worth keeping
                    even pending a better drop — they can host your Runeword immediately while you hunt an S-tier replacement.
                  </p>
                  <p className="text-yellow-200 text-sm">
                    <span className="font-semibold">Leveling:</span> Very strong for your level — equip and use until something better drops.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-full text-sm font-bold">
                    <Trophy className="w-3.5 h-3.5" />
                    KEEP — STRONG UPGRADE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* B Grade */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 hover:border-green-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-600/50 flex-shrink-0">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Solid</h3>
                <p className="text-green-100 leading-relaxed">
                  Good foundation with room to grow. Usable for progression; worth upgrading at the Enchantress.
                  These items have decent stats but may need rerolling or greater affix upgrades to reach full potential.
                </p>
                <div className="bg-green-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-green-200 text-sm">
                    <span className="font-semibold">Endgame:</span> Has potential — consider enchanting or masterworking low tiers.
                    A 1-socket item in a Helm, Chest, or 2H Weapon slot will score no higher than B-tier in endgame evaluation
                    regardless of affix quality, as it cannot support a complete Runeword.
                  </p>
                  <p className="text-green-200 text-sm">
                    <span className="font-semibold">Leveling:</span> Good stats — suitable for progression.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/40 text-green-100 rounded-full text-sm font-bold border border-green-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    KEEP — UPGRADE POTENTIAL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* C Grade */}
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/50 flex-shrink-0">
                <Star className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-2xl font-bold text-white">Below Average</h3>
                <p className="text-blue-100 leading-relaxed">
                  Some useful stats but too many wasted affixes. Replace when something better drops.
                  These items may work temporarily but should be upgraded as soon as possible.
                </p>
                <div className="bg-blue-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-blue-200 text-sm">
                    <span className="font-semibold">Endgame:</span> Not worth investing in — replace at the next opportunity.
                    Bloodied C-tier items with low Item Power (under 750) are typically not worth holding;
                    the Killstreak scaling benefit is negligible without hitting the 750 IP threshold.
                  </p>
                  <p className="text-blue-200 text-sm">
                    <span className="font-semibold">Leveling:</span> Usable if nothing better is available — replace soon.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/40 text-blue-100 rounded-full text-sm font-bold border border-blue-400/30">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    CONSIDER — LIMITED VALUE
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
                  Wrong stats, poor rolls, or completely off-meta. Break it down for crafting materials.
                  Even strong-looking affixes at D-tier indicate a fundamental mismatch with your build or
                  an item too underleveled to be relevant.
                </p>
                <div className="bg-red-900/30 rounded-lg p-3 mt-3 space-y-1">
                  <p className="text-red-200 text-sm">
                    <span className="font-semibold">Endgame:</span> Salvage immediately for materials.
                  </p>
                  <p className="text-red-200 text-sm">
                    <span className="font-semibold">Leveling:</span> Wrong stats or very low rolls — salvage and move on.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/40 text-red-100 rounded-full text-sm font-bold border border-red-400/30">
                    <Trash2 className="w-3.5 h-3.5" />
                    SALVAGE — NO VALUE
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Evaluation Factors */}
      <section className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Gem className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-bold text-white">What the AI Evaluates</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: 'Item Power', desc: '700–925 scale — higher is always better; 925 is the current cap.' },
                { label: 'Rarity', desc: 'Legendary → Unique → Mythic. Mythic Uniques are fixed 925 IP and extremely rare.' },
                { label: 'Greater Affixes', desc: 'Gold-colored text. More greater affixes means a significantly stronger item.' },
                { label: 'Stat Synergy', desc: 'How well the affixes align with your chosen class, build style, and key mechanic.' },
                { label: 'Roll Quality', desc: 'Whether stat values are near their maximum possible range for that affix tier.' },
                { label: 'Bloodied Tag + IP Gate', desc: 'Bloodied items at IP ≥ 750 receive a bonus multiplier; the dynamic scaling ceiling is confirmed active.' },
                { label: 'Socket Count', desc: 'On Helms, Chests, and 2H Weapons — 2 sockets scores positive; 1 socket scores negative for Runeword eligibility.' },
                { label: 'Build Focus Overrides', desc: 'Speed Farming boosts Rampage/Feast Bloodied affixes. Slaughterhouse mode deprioritizes class skill ranks entirely.' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-semibold text-sm">{label}: </span>
                    <span className="text-slate-400 text-sm">{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
