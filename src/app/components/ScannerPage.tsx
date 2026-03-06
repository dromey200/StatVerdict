import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Camera, Loader2, X, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { scanItem, type ScanResult, type AnalysisContext } from '../services/gemini';

export function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerClass, setPlayerClass] = useState('any');
  const [characterLevel, setCharacterLevel] = useState('');
  const [buildMechanics, setBuildMechanics] = useState('general');
  const [buildFocus, setBuildFocus] = useState('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts: Ctrl+U = upload, Ctrl+Enter = analyze
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isModifier = e.ctrlKey || e.metaKey;
    if (!isModifier) return;

    if (e.key === 'u') {
      e.preventDefault();
      fileInputRef.current?.click();
    } else if (e.key === 'Enter' && selectedFile && !loading && !result) {
      e.preventDefault();
      handleAnalyze();
    }
  }, [selectedFile, loading, result]);

  const classes = [
    { id: 'any', name: 'Any Class' },
    { id: 'barbarian', name: 'Barbarian' },
    { id: 'druid', name: 'Druid' },
    { id: 'necromancer', name: 'Necromancer' },
    { id: 'rogue', name: 'Rogue' },
    { id: 'sorcerer', name: 'Sorcerer' },
    { id: 'spiritborn', name: 'Spiritborn' },
  ];

  const mechanics = [
    { id: 'general', name: 'General' },
    { id: 'crit', name: 'Critical Strike' },
    { id: 'dot', name: 'Damage Over Time' },
    { id: 'summon', name: 'Summoner' },
    { id: 'tank', name: 'Tank/Defensive' },
    { id: 'speed', name: 'Movement/Speed' },
    { id: 'resource', name: 'Resource Generation' },
  ];

  const focuses = [
    { id: 'balanced', name: 'Balanced' },
    { id: 'damage', name: 'Max Damage' },
    { id: 'survivability', name: 'Survivability' },
    { id: 'speed', name: 'Speed Farming' },
    { id: 'pit', name: 'Pit Pushing' },
    { id: 'pvp', name: 'PvP' },
  ];

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-500');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-500');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    try {
      const context: AnalysisContext = {
        playerClass,
        characterLevel,
        buildMechanics,
        buildFocus,
      };

      const analysisResult = await scanItem(selectedFile, context);

      // Attach the uploaded image to the result for display
      const resultWithImage: ScanResult = {
        ...analysisResult,
        image: selectedImage || undefined,
      };

      setResult(resultWithImage);

      // Save to history (without image to prevent storage quota issues)
      try {
        const history = JSON.parse(localStorage.getItem('horadric_history') || '[]');
        history.unshift({
          title: resultWithImage.title,
          rarity: resultWithImage.rarity,
          grade: resultWithImage.grade,
          verdict: resultWithImage.verdict,
          analysis: resultWithImage.analysis,
          sanctified: resultWithImage.sanctified,
          timestamp: Date.now(),
          class: playerClass,
          level: characterLevel,
          mechanics: buildMechanics,
          focus: buildFocus,
        });
        const limitedHistory = history.slice(0, 20);
        localStorage.setItem('horadric_history', JSON.stringify(limitedHistory));
      } catch (storageError) {
        if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded. Clearing old history...');
          try {
            const history = JSON.parse(localStorage.getItem('horadric_history') || '[]');
            localStorage.setItem('horadric_history', JSON.stringify(history.slice(0, 10)));
          } catch (_retryError) {
            localStorage.removeItem('horadric_history');
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewScan = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Show scanner section only when no result */}
      {!result && (
        <>
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Gear Scanner
            </h1>
            <p className="text-lg text-slate-400">Upload your Diablo IV loot for AI-powered analysis — from leveling to endgame</p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Upload Section */}
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Upload Image</h2>
                  {selectedImage && (
                    <button
                      onClick={startNewScan}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      aria-label="Clear image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-700 hover:border-red-500 rounded-xl p-8 text-center cursor-pointer transition-all group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedImage ? (
                    <div className="space-y-4">
                      <img
                        src={selectedImage}
                        alt="Selected gear"
                        className="max-h-64 mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-slate-400">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-slate-700 group-hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg text-slate-300">Drop image here or click to browse</p>
                        <p className="text-sm text-slate-500">PNG, JPEG, WebP • Max 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Class Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Class</label>
                  <select
                    value={playerClass}
                    onChange={(e) => setPlayerClass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>

                {/* Character Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Character Level <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={characterLevel}
                    onChange={(e) => setCharacterLevel(e.target.value)}
                    placeholder="e.g., 45 or Paragon 120"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500">
                    Enter your level (1-60) or Paragon level (e.g., "Paragon 150" or "P150") for level-appropriate analysis
                  </p>
                </div>

                {/* Advanced Settings */}
                {playerClass !== 'any' && (
                  <>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full py-3 px-4 bg-slate-800 text-slate-400 hover:text-white border border-slate-700 rounded-lg font-medium transition-all"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          Advanced Settings
                        </span>
                      </button>
                    </div>

                    {showAdvanced && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">Build Mechanics</label>
                          <select
                            value={buildMechanics}
                            onChange={(e) => setBuildMechanics(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            {mechanics.map((mech) => (
                              <option key={mech.id} value={mech.id}>{mech.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">Build Focus</label>
                          <select
                            value={buildFocus}
                            onChange={(e) => setBuildFocus(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            {focuses.map((focus) => (
                              <option key={focus.id} value={focus.id}>{focus.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || loading}
                    className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg font-medium shadow-lg shadow-red-600/50 hover:shadow-red-500/60 disabled:shadow-none transition-all disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Consulting the archives...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Camera className="w-5 h-5" />
                        Analyze Item
                      </span>
                    )}
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-200">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="text-xs text-red-400 hover:text-red-300 mt-2 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Show results when available */}
      {result && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Analysis Results</h1>
          </div>
          <ResultsDisplay result={result} onNewScan={startNewScan} />
        </div>
      )}
    </div>
  );
}