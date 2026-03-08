import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Upload, Camera, Loader2, X, ChevronDown, ChevronUp, AlertCircle, RotateCcw } from 'lucide-react';
import { ResultsDisplay } from './ResultsDisplay';
import { EventTimers } from './EventTimers';
import { scanItem, type ScanResult, type AnalysisContext } from '../services/gemini';
import { CLASS_DATA, BUILD_FOCUSES } from '../data/classData';

export function ScannerPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [playerClass, setPlayerClass] = useState('any');
  const [characterLevel, setCharacterLevel] = useState('');
  const [buildStyle, setBuildStyle] = useState('');
  const [buildMechanics, setBuildMechanics] = useState('');
  const [buildFocus, setBuildFocus] = useState('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current class data
  const currentClass = useMemo(
    () => CLASS_DATA.find((c) => c.id === playerClass) || CLASS_DATA[0],
    [playerClass]
  );

  // Reset build style and mechanics when class changes
  useEffect(() => {
    setBuildStyle('');
    setBuildMechanics('');
  }, [playerClass]);

  // Keyboard shortcuts: Ctrl+U = upload, Ctrl+Enter = analyze
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isModifier = e.ctrlKey || e.metaKey;
      if (!isModifier) return;

      if (e.key === 'u') {
        e.preventDefault();
        fileInputRef.current?.click();
      } else if (e.key === 'Enter' && selectedFile && !loading && !result) {
        e.preventDefault();
        handleAnalyze();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedFile, loading, result]
  );

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
      setError(null);
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
      setError(null);
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
        buildMechanics: buildStyle
          ? `${buildStyle}${buildMechanics ? ' / ' + buildMechanics : ''}`
          : buildMechanics,
        buildFocus,
      };

      const analysisResult = await scanItem(selectedFile, context);

      const resultWithImage: ScanResult = {
        ...analysisResult,
        image: selectedImage || undefined,
      };

      setResult(resultWithImage);

      // Save to history if auto-save is enabled
      const autoSaveEnabled = (() => {
        try {
          const saved = localStorage.getItem('horadric_auto_save');
          return saved === null ? true : saved === 'true';
        } catch {
          return true;
        }
      })();

      if (autoSaveEnabled) {
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
            build: buildStyle,
            mechanics: buildMechanics,
            focus: buildFocus,
          });
          const limitedHistory = history.slice(0, 20);
          localStorage.setItem('horadric_history', JSON.stringify(limitedHistory));
        } catch (storageError) {
          if (
            storageError instanceof DOMException &&
            storageError.name === 'QuotaExceededError'
          ) {
            try {
              const history = JSON.parse(localStorage.getItem('horadric_history') || '[]');
              localStorage.setItem(
                'horadric_history',
                JSON.stringify(history.slice(0, 10))
              );
            } catch (_retryError) {
              localStorage.removeItem('horadric_history');
            }
          }
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Analysis failed. Please try again.';
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

      {/* ── SCANNER FORM — hidden once a result or error is showing ── */}
      {!result && !error && (
        <>
          {/* Page heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Loot Scanner</h1>
            <p className="text-lg text-slate-400">
              Upload your Diablo IV loot for AI-powered analysis — from leveling to endgame
            </p>
          </div>

          {/* ── LIVE EVENT TIMERS ── */}
          <div className="max-w-2xl mx-auto w-full">
            <EventTimers />
          </div>

          {/* ── MAIN SCANNER CARD ── */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6 space-y-6">

                {/* Upload zone header */}
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

                {/* Upload zone */}
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
                        <p className="text-lg text-slate-300">
                          Drop image here or click to browse
                        </p>
                        <p className="text-sm text-slate-500">PNG, JPEG, WebP • Max 10MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Class selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Class</label>
                  <select
                    value={playerClass}
                    onChange={(e) => setPlayerClass(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {CLASS_DATA.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Character level */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Character Level{' '}
                    <span className="text-slate-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={characterLevel}
                    onChange={(e) => setCharacterLevel(e.target.value)}
                    placeholder="e.g. 45, 100, Paragon 120"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Advanced settings toggle */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    Advanced Settings
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 pt-4 border-t border-slate-700">

                      {/* Build style — class-specific builds */}
                      {currentClass.builds.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Build Style{' '}
                            <span className="text-slate-500">({currentClass.name})</span>
                          </label>
                          <select
                            value={buildStyle}
                            onChange={(e) => setBuildStyle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">None</option>
                            {currentClass.builds.map((build) => (
                              <option key={build} value={build}>
                                {build}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Key mechanic — class-specific */}
                      {currentClass.mechanics.length > 0 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Key Mechanic{' '}
                            <span className="text-slate-500">({currentClass.name})</span>
                          </label>
                          <select
                            value={buildMechanics}
                            onChange={(e) => setBuildMechanics(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="">None</option>
                            {currentClass.mechanics.map((mech) => (
                              <option key={mech} value={mech}>
                                {mech}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Build focus — universal */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Build Focus
                        </label>
                        <select
                          value={buildFocus}
                          onChange={(e) => setBuildFocus(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          {BUILD_FOCUSES.map((focus) => (
                            <option key={focus.id} value={focus.id}>
                              {focus.name}
                            </option>
                          ))}
                        </select>
                      </div>

                    </div>
                  )}
                </div>

                {/* Analyze button */}
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

              </div>
            </div>
          </div>
        </>
      )}

      {/* ── ERROR STATE — full takeover, hides scanner ── */}
      {error && !result && !loading && (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Analysis Error</h1>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-12 h-12 text-white flex-shrink-0" />
                  <div>
                    <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
                    <p className="text-red-100 text-sm mt-1">
                      The analysis could not be completed
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300 leading-relaxed">{error}</p>
                </div>
                <button
                  onClick={startNewScan}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-600/50 hover:shadow-red-500/60 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  New Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS VIEW ── */}
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
