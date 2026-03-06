# Technical Implementation Guide
## Horadric AI (StatVerdict) - Developer Documentation

**Version:** 2.0  
**Last Updated:** March 6, 2026  
**Audience:** Developers, Engineers, Technical Stakeholders

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Deep Dive](#component-deep-dive)
3. [State Management Patterns](#state-management-patterns)
4. [Data Flow & Persistence](#data-flow--persistence)
5. [Algorithm Details](#algorithm-details)
6. [Styling System](#styling-system)
7. [Performance Considerations](#performance-considerations)
8. [Testing Strategy](#testing-strategy)
9. [Deployment & CI/CD](#deployment--cicd)
10. [API Integration Guide](#api-integration-guide)

---

## Architecture Overview

### Tech Stack Details

```yaml
Runtime: Browser (ES2022+)
Framework: React 18.3.x
Language: TypeScript 5.x
Styling: Tailwind CSS 4.0
Routing: React Router 6.x (Data mode)
Build Tool: Vite 5.x
Package Manager: pnpm
Icons: Lucide React 0.x
State: React hooks (no external state library)
```

### Project Structure

```
horadric-ai/
├── src/
│   ├── app/
│   │   ├── components/           # React components
│   │   │   ├── Layout.tsx        # App shell (header, nav, footer)
│   │   │   ├── ScannerPage.tsx   # Main scanner interface
│   │   │   ├── TutorialPage.tsx  # Tutorial content
│   │   │   ├── RatingGuide.tsx   # Grade explanations
│   │   │   ├── HistoryPage.tsx   # Scan history
│   │   │   ├── ResultsDisplay.tsx # Analysis results UI
│   │   │   ├── SettingsPanel.tsx # Settings modal
│   │   │   └── HelpGuide.tsx     # Help modal
│   │   ├── routes.ts             # Route configuration
│   │   └── App.tsx               # Root component
│   ├── styles/
│   │   ├── theme.css             # Tailwind theme + custom CSS
│   │   ├── fonts.css             # Font imports
│   │   └── global.css            # Global styles
│   ├── imports/                  # Static assets (Figma exports)
│   └── main.tsx                  # App entry point
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Component Deep Dive

### ScannerPage.tsx

**Purpose:** Main landing page for gear scanning with contextual settings.

**State Schema:**
```typescript
interface ScannerPageState {
  selectedImage: string | null;           // Data URL of uploaded image
  selectedFile: File | null;              // Raw file object
  loading: boolean;                       // Analysis in progress
  result: ScanResult | null;              // Analysis result
  playerClass: string;                    // Selected class
  characterLevel: string;                 // User-entered level
  buildMechanics: string;                 // Selected mechanics
  buildFocus: string;                     // Selected focus
  showAdvanced: boolean;                  // Advanced settings visibility
}

interface ScanResult {
  title: string;                          // Item name
  rarity: string;                         // Item rarity tier
  grade: string;                          // S, A, B, C, D
  verdict: string;                        // keep, salvage, etc.
  analysis: string;                       // Markdown-formatted analysis
  image?: string;                         // Optional image URL
}
```

**Key Functions:**

#### 1. Level Context Parser
```typescript
const getLevelContext = (): ProgressionTier => {
  if (!characterLevel) return 'endgame';
  
  const levelStr = characterLevel.toLowerCase().replace(/\s/g, '');
  
  // Match "Paragon 120", "P120", "p120"
  const paragonMatch = levelStr.match(/p(?:aragon)?(\d+)/);
  if (paragonMatch) {
    const paragonLevel = parseInt(paragonMatch[1]);
    if (paragonLevel < 50) return 'early-paragon';
    if (paragonLevel < 150) return 'mid-paragon';
    return 'endgame';
  }
  
  // Match "45", "60"
  const levelMatch = levelStr.match(/^(\d+)$/);
  if (levelMatch) {
    const level = parseInt(levelMatch[1]);
    if (level < 30) return 'early-leveling';
    if (level < 60) return 'late-leveling';
    return 'fresh-60';
  }
  
  return 'endgame';
};

type ProgressionTier = 
  | 'early-leveling'   // Level 1-29
  | 'late-leveling'    // Level 30-59
  | 'fresh-60'         // Level 60, no Paragon
  | 'early-paragon'    // Paragon 1-49
  | 'mid-paragon'      // Paragon 50-149
  | 'endgame';         // Paragon 150+
```

**Design Rationale:**
- Flexible regex accepts multiple formats without user friction
- Falls back to 'endgame' for safety (better to be conservative)
- Case-insensitive and whitespace-tolerant
- Tier thresholds based on Diablo IV progression curve

#### 2. Contextual Analysis Generator
```typescript
const getContextualAnalysis = (): string => {
  const levelContext = getLevelContext();
  
  const baseAnalysis = `This is a Best-in-Slot two-handed sword...`;
  const stats = `\\n\\n**Key Stats:**\\n• +95% Crit Damage...`;
  const buildSynergy = `\\n\\n**Build Synergy:** Exceptional for ${playerClass}...`;
  
  let levelAdvice = '';
  
  switch (levelContext) {
    case 'early-leveling':
      levelAdvice = `\\n\\n**Level ${characterLevel} Analysis:** 
        This is an INCREDIBLE find for your level! The Grandfather will carry you 
        through the entire campaign and beyond. This weapon alone will make leveling 
        significantly faster and easier. Keep this equipped until you reach max level.`;
      break;
    
    case 'late-leveling':
      levelAdvice = `\\n\\n**Level ${characterLevel} Analysis:** 
        Exceptional weapon for late-game leveling. This will dominate through level 60 
        and remains Best-in-Slot even in endgame. You've found endgame gear early — 
        definitely keep this.`;
      break;
    
    case 'fresh-60':
      levelAdvice = `\\n\\n**Fresh Level 60 Analysis:** 
        Perfect timing! This is a Best-in-Slot weapon that will serve you through all 
        of Torment progression. Start masterworking this immediately as you farm Pit 
        materials.`;
      break;
    
    case 'early-paragon':
      levelAdvice = `\\n\\n**${characterLevel} Analysis:** 
        Excellent endgame weapon for early Paragon progression. This will carry you 
        through Torment tiers and early Pit pushing. Prioritize masterworking this as 
        you collect materials.`;
      break;
    
    case 'mid-paragon':
      levelAdvice = `\\n\\n**${characterLevel} Analysis:** 
        Best-in-Slot weapon for your Paragon tier. This is worth full masterworking 
        investment. The high rolls make this perfect for pushing higher Pit tiers and 
        Torment difficulties.`;
      break;
    
    case 'endgame':
    default:
      levelAdvice = `\\n\\n**Recommendation:** 
        KEEP - This is an endgame Best-in-Slot weapon perfect for high-tier Pit pushing 
        and Torment farming. Worth full masterworking investment.`;
      break;
  }
  
  return baseAnalysis + stats + buildSynergy + levelAdvice;
};
```

**Design Rationale:**
- Modular structure makes it easy to customize base vs contextual content
- Each tier has distinct messaging that reflects player's actual situation
- Uses template literals for maintainability
- Preserves markdown formatting for ResultsDisplay component

#### 3. History Persistence with Quota Handling
```typescript
const saveToHistory = (result: ScanResult) => {
  try {
    const history = JSON.parse(localStorage.getItem('horadric_history') || '[]');
    
    // Add new item to beginning
    history.unshift({
      title: result.title,
      rarity: result.rarity,
      grade: result.grade,
      verdict: result.verdict,
      analysis: result.analysis,
      timestamp: Date.now(),
      class: playerClass,
      level: characterLevel,          // NEW: Track level
      mechanics: buildMechanics,
      focus: buildFocus,
      // NOTE: Image NOT saved to prevent quota issues
    });
    
    // Keep only last 20 items
    const limitedHistory = history.slice(0, 20);
    localStorage.setItem('horadric_history', JSON.stringify(limitedHistory));
    
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded. Clearing old history...');
      
      try {
        // Reduce to last 10 items and retry
        const history = JSON.parse(localStorage.getItem('horadric_history') || '[]');
        const reducedHistory = history.slice(0, 10);
        localStorage.setItem('horadric_history', JSON.stringify(reducedHistory));
        
        // Try adding new item again
        reducedHistory.unshift({
          title: result.title,
          rarity: result.rarity,
          grade: result.grade,
          verdict: result.verdict,
          analysis: result.analysis,
          timestamp: Date.now(),
          class: playerClass,
          level: characterLevel,
          mechanics: buildMechanics,
          focus: buildFocus,
        });
        localStorage.setItem('horadric_history', JSON.stringify(reducedHistory.slice(0, 10)));
        
      } catch (retryError) {
        console.error('Unable to save to history:', retryError);
        // Clear history as last resort
        localStorage.removeItem('horadric_history');
      }
    } else {
      console.error('Error saving to history:', error);
    }
  }
};
```

**Design Rationale:**
- Progressive degradation: 20 items → 10 items → clear all
- Never throws error to user (silent failure with logging)
- Images excluded from storage to reduce quota usage
- Metadata-only approach allows ~500KB per item vs ~5MB with images

---

### ResultsDisplay.tsx

**Purpose:** Render analysis results with grade badges and formatted content.

**Props Schema:**
```typescript
interface ResultsDisplayProps {
  result: {
    title: string;
    rarity: string;
    grade: string;
    verdict: string;
    analysis: string;
    image?: string;
    sanctified?: boolean;
  };
  onNewScan: () => void;
}
```

**Badge Rendering Logic:**
```typescript
const GradeBadge: React.FC<{ grade: string }> = ({ grade }) => {
  const badges = {
    S: {
      icon: Crown,
      label: 'BiS',
      gradient: 'from-purple-600 to-pink-600',
      iconColor: 'text-yellow-300',
    },
    A: {
      icon: Sparkles,
      label: 'KEEP & USE',
      gradient: 'from-green-600 to-emerald-600',
      iconColor: 'text-green-200',
    },
    B: {
      icon: Star,
      label: 'UPGRADE POTENTIAL',
      gradient: 'from-blue-600 to-cyan-600',
      iconColor: 'text-blue-200',
    },
    C: {
      icon: AlertTriangle,
      label: 'REPLACE SOON',
      gradient: 'from-yellow-600 to-orange-600',
      iconColor: 'text-yellow-200',
    },
    D: {
      icon: Trash2,
      label: 'SALVAGE NOW',
      gradient: 'from-red-600 to-red-700',
      iconColor: 'text-red-200',
    },
  };
  
  const config = badges[grade as keyof typeof badges];
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${config.gradient} rounded-full`}>
      <Icon className={`w-5 h-5 ${config.iconColor}`} />
      <span className="font-bold text-white">{config.label}</span>
    </div>
  );
};
```

**Markdown Rendering:**
```typescript
const AnalysisText: React.FC<{ text: string }> = ({ text }) => {
  // Split by double newlines for paragraphs
  const paragraphs = text.split('\\n\\n');
  
  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        // Handle markdown headers (e.g., **Build Synergy:**)
        if (para.startsWith('**') && para.includes(':**')) {
          const [header, ...content] = para.split(':**');
          return (
            <div key={idx}>
              <h3 className="font-bold text-white mb-2">
                {header.replace(/\*\*/g, '')}:
              </h3>
              <p className="text-slate-300">{content.join(':**')}</p>
            </div>
          );
        }
        
        // Handle bullet lists
        if (para.includes('\\n•')) {
          const items = para.split('\\n').filter(line => line.trim());
          return (
            <ul key={idx} className="space-y-1 ml-4">
              {items.map((item, i) => (
                <li key={i} className="text-slate-300">
                  {item.replace('•', '').trim()}
                </li>
              ))}
            </ul>
          );
        }
        
        // Regular paragraph
        return (
          <p key={idx} className="text-slate-300 leading-relaxed">
            {para}
          </p>
        );
      })}
    </div>
  );
};
```

---

### HistoryPage.tsx

**Purpose:** Display scan history with search and filter capabilities.

**State Schema:**
```typescript
interface HistoryPageState {
  searchQuery: string;
  filterGrade: string;      // 'all', 'S', 'A', 'B', 'C', 'D'
  filterClass: string;      // 'all', 'barbarian', etc.
  sortBy: string;           // 'date', 'grade', 'class'
}

interface HistoryItem {
  title: string;
  rarity: string;
  grade: string;
  verdict: string;
  analysis: string;
  timestamp: number;
  class: string;
  level?: string;           // NEW: Optional level tracking
  mechanics: string;
  focus: string;
}
```

**Filter Logic:**
```typescript
const filteredHistory = useMemo(() => {
  let filtered = history;
  
  // Search filter
  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.analysis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Grade filter
  if (filterGrade !== 'all') {
    filtered = filtered.filter(item => item.grade === filterGrade);
  }
  
  // Class filter
  if (filterClass !== 'all') {
    filtered = filtered.filter(item => item.class === filterClass);
  }
  
  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'date') return b.timestamp - a.timestamp;
    if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
    if (sortBy === 'class') return a.class.localeCompare(b.class);
    return 0;
  });
  
  return filtered;
}, [history, searchQuery, filterGrade, filterClass, sortBy]);
```

---

## State Management Patterns

### Why No Redux/Zustand?

**Decision:** Use React's built-in state management (useState, useContext) instead of external libraries.

**Reasoning:**
1. **Simplicity:** App state is mostly component-local
2. **Performance:** No global re-renders needed
3. **Bundle Size:** Avoid 10-20KB dependency overhead
4. **Learning Curve:** Team familiar with React hooks

**State Location Strategy:**

| State Type | Location | Persistence |
|------------|----------|-------------|
| Uploaded image | ScannerPage (local) | None (temporary) |
| Analysis result | ScannerPage (local) | localStorage (history) |
| Advanced settings visibility | ScannerPage (local) | None |
| Modal visibility | Layout (local) | None |
| History data | HistoryPage (local) | localStorage |
| Settings preferences | SettingsPanel (local) | localStorage |

**Future Considerations:**
If app grows to need:
- Cross-component state sharing
- Complex state updates
- Time-travel debugging

Then consider: **Zustand** (lightweight) or **React Context + useReducer** (no dependencies)

---

## Data Flow & Persistence

### localStorage Schema

**Key:** `horadric_history`  
**Type:** JSON array  
**Max Items:** 20 (hard limit)  
**Max Size:** ~500KB (estimated)

**Item Schema:**
```typescript
interface StoredHistoryItem {
  title: string;            // Item name (e.g., "The Grandfather")
  rarity: string;           // "legendary", "unique", "mythic"
  grade: string;            // "S", "A", "B", "C", "D"
  verdict: string;          // "keep", "salvage"
  analysis: string;         // Full markdown analysis text
  timestamp: number;        // Unix timestamp (Date.now())
  class: string;            // "barbarian", "druid", etc.
  level?: string;           // "45", "Paragon 120" (optional)
  mechanics: string;        // "crit", "dot", "general", etc.
  focus: string;            // "damage", "survivability", etc.
  // NOTE: image field intentionally excluded
}
```

**Example:**
```json
[
  {
    "title": "The Grandfather",
    "rarity": "unique",
    "grade": "S",
    "verdict": "keep",
    "analysis": "This is a Best-in-Slot...",
    "timestamp": 1741377600000,
    "class": "barbarian",
    "level": "Paragon 120",
    "mechanics": "crit",
    "focus": "damage"
  }
]
```

### Data Migration Strategy

When adding new fields to history items:

```typescript
// Load history with backward compatibility
const loadHistory = (): HistoryItem[] => {
  const raw = localStorage.getItem('horadric_history');
  if (!raw) return [];
  
  const items = JSON.parse(raw);
  
  // Migrate old items to new schema
  return items.map((item: any) => ({
    ...item,
    level: item.level || '',           // Add default if missing
    mechanics: item.mechanics || 'general',
    focus: item.focus || 'balanced',
  }));
};
```

---

## Algorithm Details

### Level Context Detection

**Input:** User-entered string (freeform text)  
**Output:** Progression tier enum  

**Supported Formats:**
```
Standard Levels:
  "1", "25", "45", "60"

Paragon (all case-insensitive):
  "Paragon 120"
  "P120"
  "p 150"
  "PARAGON200"
```

**Tier Mapping:**

```typescript
const TIER_THRESHOLDS = {
  EARLY_LEVELING_MAX: 29,
  LATE_LEVELING_MAX: 59,
  EARLY_PARAGON_MAX: 49,
  MID_PARAGON_MAX: 149,
};

function categorizeTier(input: string): ProgressionTier {
  const normalized = input.toLowerCase().replace(/\s+/g, '');
  
  // Try Paragon patterns first (more specific)
  const paragonRegex = /p(?:aragon)?(\d+)/;
  const paragonMatch = normalized.match(paragonRegex);
  
  if (paragonMatch) {
    const level = parseInt(paragonMatch[1]);
    if (level <= TIER_THRESHOLDS.EARLY_PARAGON_MAX) return 'early-paragon';
    if (level <= TIER_THRESHOLDS.MID_PARAGON_MAX) return 'mid-paragon';
    return 'endgame';
  }
  
  // Try numeric level
  const levelRegex = /^(\d+)$/;
  const levelMatch = normalized.match(levelRegex);
  
  if (levelMatch) {
    const level = parseInt(levelMatch[1]);
    if (level <= TIER_THRESHOLDS.EARLY_LEVELING_MAX) return 'early-leveling';
    if (level <= TIER_THRESHOLDS.LATE_LEVELING_MAX) return 'late-leveling';
    return 'fresh-60';
  }
  
  // Fallback for invalid/empty input
  return 'endgame';
}
```

**Edge Cases Handled:**
- Empty string → 'endgame'
- Invalid text ("abc") → 'endgame'
- Negative numbers ("-5") → No match, fallback to 'endgame'
- Very high numbers ("9999") → Clamps to 'endgame'
- Mixed formats ("Level Paragon 50") → First match wins

---

## Styling System

### Tailwind CSS v4 Configuration

**File:** `/src/styles/theme.css`

```css
@import "tailwindcss";

@theme {
  /* Color Palette */
  --color-background: #0f172a;     /* slate-950 */
  --color-surface: #1e293b;        /* slate-800 */
  --color-primary: #dc2626;        /* red-600 */
  --color-primary-hover: #b91c1c; /* red-700 */
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #dc2626, #ea580c);
  --gradient-background: linear-gradient(135deg, #0f172a, #1e293b, #7f1d1d);
  
  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Exocet', serif;
}

/* Base Styles */
h1, h2, h3, h4, h5, h6 {
  @apply font-bold text-white;
}

h1 {
  @apply text-4xl md:text-5xl;
}

h2 {
  @apply text-2xl md:text-3xl;
}

/* Custom Utilities */
.glass-panel {
  @apply bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl;
}

.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 
         hover:from-red-500 hover:to-red-600 text-white rounded-lg 
         font-medium shadow-lg shadow-red-600/50 transition-all;
}
```

### Component Styling Patterns

**Pattern 1: Glass Morphism Cards**
```tsx
<div className="bg-slate-800/50 backdrop-blur-sm border border-red-900/30 rounded-xl p-6">
  {/* Content */}
</div>
```

**Pattern 2: Gradient Buttons**
```tsx
<button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium shadow-lg shadow-red-600/50 hover:shadow-red-500/60 transition-all">
  Analyze
</button>
```

**Pattern 3: Grade-Specific Badges**
```tsx
// S-tier (purple/pink)
<div className="bg-gradient-to-r from-purple-600 to-pink-600">

// A-tier (green)
<div className="bg-gradient-to-r from-green-600 to-emerald-600">

// B-tier (blue)
<div className="bg-gradient-to-r from-blue-600 to-cyan-600">

// C-tier (yellow/orange)
<div className="bg-gradient-to-r from-yellow-600 to-orange-600">

// D-tier (red)
<div className="bg-gradient-to-r from-red-600 to-red-700">
```

---

## Performance Considerations

### Image Handling

**Problem:** Large images (5-10MB screenshots) cause:
- localStorage quota exceeded errors
- Slow re-renders
- Memory leaks in long sessions

**Solutions Implemented:**

1. **Exclude Images from History:**
```typescript
// Save metadata only, not image
history.unshift({
  title: result.title,
  analysis: result.analysis,
  // image: result.image, // ❌ NOT SAVED
});
```

2. **Use Data URLs for Preview:**
```typescript
const reader = new FileReader();
reader.onload = (event) => {
  setSelectedImage(event.target?.result as string); // Temporary preview only
};
reader.readAsDataURL(file);
```

3. **Cleanup on New Scan:**
```typescript
const startNewScan = () => {
  setSelectedImage(null);  // Release memory
  setSelectedFile(null);
  setResult(null);
};
```

### Bundle Size Optimization

**Current Bundle:** ~180KB gzipped

**Breakdown:**
- React + React Router: ~120KB
- Lucide Icons (tree-shaken): ~30KB
- Tailwind CSS: ~20KB
- App Code: ~10KB

**Optimization Techniques:**
1. **Icon Tree-Shaking:**
```typescript
// ✅ Good: Import only used icons
import { Crown, Sparkles, Star } from 'lucide-react';

// ❌ Bad: Import entire library
import * as Icons from 'lucide-react';
```

2. **Route Code-Splitting:**
```typescript
// React Router automatically code-splits routes
const router = createBrowserRouter([
  { path: "/", Component: ScannerPage },    // Separate chunk
  { path: "/tutorial", Component: TutorialPage },  // Separate chunk
]);
```

3. **Lazy Load Modals:**
```typescript
const SettingsPanel = lazy(() => import('./SettingsPanel'));
const HelpGuide = lazy(() => import('./HelpGuide'));
```

---

## Testing Strategy

### Unit Tests (Recommended)

**Tools:** Vitest + React Testing Library

**Critical Test Cases:**

1. **Level Parser:**
```typescript
describe('getLevelContext', () => {
  it('parses standard levels', () => {
    expect(getLevelContext('25')).toBe('early-leveling');
    expect(getLevelContext('45')).toBe('late-leveling');
    expect(getLevelContext('60')).toBe('fresh-60');
  });
  
  it('parses Paragon levels', () => {
    expect(getLevelContext('Paragon 30')).toBe('early-paragon');
    expect(getLevelContext('P100')).toBe('mid-paragon');
    expect(getLevelContext('p200')).toBe('endgame');
  });
  
  it('handles edge cases', () => {
    expect(getLevelContext('')).toBe('endgame');
    expect(getLevelContext('invalid')).toBe('endgame');
  });
});
```

2. **History Persistence:**
```typescript
describe('saveToHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  it('saves scan to localStorage', () => {
    const result = { title: 'Test Item', grade: 'S', ... };
    saveToHistory(result);
    
    const history = JSON.parse(localStorage.getItem('horadric_history'));
    expect(history).toHaveLength(1);
    expect(history[0].title).toBe('Test Item');
  });
  
  it('limits history to 20 items', () => {
    // Add 25 items
    for (let i = 0; i < 25; i++) {
      saveToHistory({ title: `Item ${i}`, ... });
    }
    
    const history = JSON.parse(localStorage.getItem('horadric_history'));
    expect(history).toHaveLength(20);
  });
  
  it('handles quota exceeded error', () => {
    // Mock localStorage to throw quota error
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });
    
    expect(() => saveToHistory({ ... })).not.toThrow();
  });
});
```

### E2E Tests (Recommended)

**Tools:** Playwright or Cypress

**Critical User Flows:**

1. **Happy Path:**
```typescript
test('user can scan gear and view results', async ({ page }) => {
  await page.goto('/');
  
  // Upload image
  await page.setInputFiles('input[type="file"]', 'test-gear.png');
  
  // Select class
  await page.selectOption('select', 'barbarian');
  
  // Enter level
  await page.fill('input[placeholder*="level"]', 'Paragon 120');
  
  // Analyze
  await page.click('button:has-text("Analyze")');
  
  // Wait for results
  await page.waitForSelector('[data-testid="results"]');
  
  // Verify grade badge appears
  expect(await page.textContent('[data-testid="grade-badge"]')).toBeTruthy();
});
```

2. **History Persistence:**
```typescript
test('scan is saved to history', async ({ page }) => {
  // Perform scan
  await scanGear(page);
  
  // Navigate to history
  await page.click('a:has-text("History")');
  
  // Verify scan appears in history
  expect(await page.textContent('.history-item')).toContain('The Grandfather');
});
```

---

## Deployment & CI/CD

### Build Configuration

**Vite Config:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
  },
});
```

### Environment Variables

**File:** `.env`
```bash
VITE_APP_VERSION=2.0.0
VITE_API_ENDPOINT=https://api.horadric-ai.com  # For future AI integration
VITE_ANALYTICS_ID=G-XXXXXXXXXX                 # Google Analytics
```

**Usage:**
```typescript
const API_URL = import.meta.env.VITE_API_ENDPOINT;
```

### Deployment Checklist

- [ ] Run `pnpm build` to generate production bundle
- [ ] Verify bundle size: `du -sh dist/`
- [ ] Test production build locally: `pnpm preview`
- [ ] Check Lighthouse scores (Performance, Accessibility, SEO)
- [ ] Verify all images load correctly
- [ ] Test on mobile devices
- [ ] Verify localStorage works in private/incognito mode
- [ ] Check console for errors
- [ ] Deploy to CDN (Vercel, Netlify, Cloudflare Pages)

---

## API Integration Guide

### Future: Real AI Integration

When ready to replace mock API with real AI service:

#### Option 1: Google Gemini Vision API

**Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

**Request:**
```typescript
const analyzeGear = async (
  imageFile: File,
  context: {
    class: string;
    level?: string;
    mechanics: string;
    focus: string;
  }
): Promise<ScanResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('context', JSON.stringify(context));
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    title: data.itemName,
    rarity: data.rarity,
    grade: data.grade,
    verdict: data.verdict,
    analysis: data.analysis,
  };
};
```

**Prompt Template:**
```typescript
const buildPrompt = (context: any) => `
You are an expert Diablo IV gear analyst. Analyze this item screenshot.

CONTEXT:
- Player Class: ${context.class}
- Character Level: ${context.level || 'Not specified'}
- Build Mechanics: ${context.mechanics}
- Build Focus: ${context.focus}

EXTRACT:
1. Item name
2. Rarity tier
3. All stats and their rolls

EVALUATE:
- Stat relevance for ${context.class} ${context.mechanics} builds
- Roll quality (% of max)
- Build synergy for ${context.focus} focus
${context.level ? `- Value for ${context.level} player progression` : ''}

OUTPUT:
- Grade: S/A/B/C/D
- Verdict: KEEP or SALVAGE
- Analysis: Detailed explanation with:
  • Key stats breakdown
  • Build synergy analysis
  ${context.level ? `• Level-appropriate advice for ${context.level}` : '• Endgame recommendation'}
`;
```

#### Option 2: OpenAI GPT-4 Vision

**Endpoint:** `https://api.openai.com/v1/chat/completions`

**Request:**
```typescript
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4-vision-preview',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: buildPrompt(context),
          },
          {
            type: 'image_url',
            image_url: {
              url: await fileToBase64(imageFile),
            },
          },
        ],
      },
    ],
    max_tokens: 1000,
  }),
});
```

#### Cost Estimates

| Provider | Cost per Analysis | Notes |
|----------|------------------|-------|
| Google Gemini Flash | $0.001-0.002 | Fastest, cheapest |
| OpenAI GPT-4 Vision | $0.01-0.03 | Most accurate |
| Azure Computer Vision + GPT-4 | $0.005-0.01 | Enterprise option |

**Recommendation:** Start with Gemini Flash for cost-effectiveness, upgrade to GPT-4 Vision for premium tier.

---

## Appendices

### A. TypeScript Interfaces Reference

```typescript
// Core Types
type ProgressionTier = 
  | 'early-leveling' 
  | 'late-leveling' 
  | 'fresh-60' 
  | 'early-paragon' 
  | 'mid-paragon' 
  | 'endgame';

type Grade = 'S' | 'A' | 'B' | 'C' | 'D';
type Verdict = 'keep' | 'salvage';
type Rarity = 'common' | 'magic' | 'rare' | 'legendary' | 'unique' | 'mythic';

interface ScanResult {
  title: string;
  rarity: Rarity;
  grade: Grade;
  verdict: Verdict;
  analysis: string;
  image?: string;
  sanctified?: boolean;
}

interface HistoryItem extends ScanResult {
  timestamp: number;
  class: string;
  level?: string;
  mechanics: string;
  focus: string;
}

interface ScanContext {
  class: string;
  level?: string;
  mechanics: string;
  focus: string;
}
```

### B. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + U` | Focus upload input |
| `Ctrl/Cmd + Enter` | Analyze (when image uploaded) |
| `Ctrl/Cmd + N` | New scan |
| `Ctrl/Cmd + H` | View history |
| `Ctrl/Cmd + ,` | Open settings |
| `Ctrl/Cmd + ?` | Open help |
| `Esc` | Close modal/return to scanner |

**Implementation:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
    // ... other shortcuts
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

### C. Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| React 18 | 90+ | 88+ | 14+ | 90+ |
| FileReader API | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Backdrop Filter | 76+ | 103+ | 9+ | 79+ |

**Polyfills Required:** None (all features have >95% global support)

---

**Document Version:** 1.0  
**Last Updated:** March 6, 2026  
**Maintained By:** Engineering Team
