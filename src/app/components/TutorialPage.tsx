import { Upload, Camera, Sparkles, CheckCircle, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { ResultsDisplay } from './ResultsDisplay';

export function TutorialPage() {
  const [showDemoResult, setShowDemoResult] = useState(false);

  const demoResult = {
    title: 'Harlequin Crest (Shako)',
    rarity: 'mythic',
    grade: 'S',
    verdict: 'keep',
    sanctified: true,
    analysis: 'A Mythic Unique helmet - the rarest item tier in Diablo IV. This is universally considered Best-in-Slot for virtually every endgame build across all classes.\n\n**Key Stats:**\n• +4 to All Skills\n• +20.0% Cooldown Reduction\n• +1,000 Maximum Life\n• +20.0% Damage Reduction\n• Item Power: 925\n\n**Unique Power:**\nGain +4 Ranks to all Skills. This massive skill boost affects every ability in your arsenal, dramatically increasing your damage, survivability, and utility.\n\n**Build Synergy:**\nUniversal Best-in-Slot - Works for all classes and build types. The +4 All Skills is one of the most powerful effects in the game, scaling with your entire build. The combination of cooldown reduction, life, and damage reduction provides excellent defensive layers while maximizing offensive potential.\n\n**Recommendation:**\nKEEP PERMANENTLY - This is an ultra-rare Mythic Unique. Lock this item immediately and never salvage it. This helm is build-defining and works for every class at all levels of play including Pit pushing, PvP, and speed farming.',
    image: '/public/assets/example-shako.png',
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">How to Use Stat Verdict</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">
          Learn how to scan your gear and get the most out of AI-powered analysis
        </p>
      </div>

      {/* Step-by-step Guide */}
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
                In Diablo IV, hover over any item in your inventory and take a screenshot. Make sure the
                item tooltip is fully visible and legible. You can use:
              </p>
              <ul className="space-y-2 text-slate-300 ml-6">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Windows:</strong> Press <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">Print Screen</kbd> or use Windows Snipping Tool</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Mobile:</strong> Use your phone's camera to take a photo of the screen</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Console:</strong> Use your system's screenshot feature</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Formats:</strong> PNG, JPEG, or WebP (max 10MB)</span>
                </li>
              </ul>
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
              <h2 className="text-2xl font-bold text-white">Upload to the Scanner</h2>
              <p className="text-slate-300 leading-relaxed">
                Navigate to the Scanner tab and upload your screenshot. You can either:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Upload className="w-5 h-5 text-red-400" />
                    Drag & Drop
                  </div>
                  <p className="text-sm text-slate-400">Drag your screenshot directly into the upload zone</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Camera className="w-5 h-5 text-red-400" />
                    Click to Browse
                  </div>
                  <p className="text-sm text-slate-400">Click the upload zone to select a file from your device</p>
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
                (e.g., "45" or "Paragon 120") for level-appropriate analysis. For more precise recommendations,
                expand the Advanced Settings to specify:
              </p>
              <div className="space-y-2 ml-6 text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Character Level:</strong> Get analysis tailored to your progression (leveling or endgame)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Build Mechanics:</strong> Critical Strike, DoT, Summoner, Tank, etc.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span><strong className="text-white">Build Focus:</strong> Max Damage, Survivability, Pit Pushing, Speed Farming, etc.</span>
                </div>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-100">
                    <strong>Pro Tip:</strong> Adding your character level helps the AI provide recommendations
                    specific to your progression — whether you're leveling through the campaign or pushing endgame content!
                  </p>
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
                Click the "Analyze Item" button and wait a few seconds while the AI processes your gear. You'll receive:
              </p>
              <div className="space-y-2 ml-6 text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Grade:</strong> S, A, B, C, or D tier rating</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Verdict:</strong> Keep or Salvage recommendation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-white">Detailed Analysis:</strong> Stats breakdown, build synergy, and recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5 */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-white">5</span>
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">View Your Scan History</h2>
              <p className="text-slate-300 leading-relaxed">
                All your scans are automatically saved in the History tab. You can search, filter by grade
                or class, and review past analyses anytime. This helps you track your gear progression
                and compare items over time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-bold text-white">Try an Example Analysis</h2>
              <p className="text-purple-100 leading-relaxed">
                Click the button below to see what a real analysis looks like. This example shows a
                Mythic Unique item with an S-tier rating.
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
          <div className="mt-8">
            <ResultsDisplay result={demoResult} onNewScan={() => setShowDemoResult(false)} />
          </div>
        )}
      </div>

      {/* Best Practices */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Best Practices</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span>Ensure your screenshots are clear and the item text is readable - blurry images may produce inaccurate results</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span>Always select the correct class - a Necromancer item might be rated differently for a Barbarian</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span>Use Advanced Settings for build-specific recommendations rather than general analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span>Check the Rating Guide tab to understand what each grade means for your progression</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold mt-1">•</span>
              <span>Remember that the AI evaluates items based on current meta - ratings may change with game updates</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}