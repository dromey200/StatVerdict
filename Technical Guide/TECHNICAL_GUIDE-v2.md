# Horadric AI — v3.0.0 Technical Guide

**Version:** 3.0.0  
**Last Updated:** March 7, 2026  
**Audience:** Developers, Engineers, Technical Stakeholders

---

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Browser (ES2022+) |
| Framework | React 18.3 |
| Language | TypeScript 5.6 (strict mode) |
| Styling | Tailwind CSS 4.0 |
| Routing | React Router 7 (Data mode, SPA) |
| Build Tool | Vite 6 |
| Icons | Lucide React |
| State | React hooks (no external state library) |
| API Backend | Vercel Serverless Functions |
| AI Service | Google Gemini 2.5 Flash |
| Hosting | Vercel |

### Project Structure

```
StatVerdict/
├── diablo-4-scanner.html       # React app entry point
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Build config (multi-page)
├── vercel.json                 # Deployment config
├── api/
│   └── analyze.js              # Gemini API proxy (serverless)
├── src/
│   ├── main.tsx                # React entry point
│   ├── vite-env.d.ts           # Vite type declarations
│   ├── styles/
│   │   └── index.css           # Tailwind + custom theme
│   └── app/
│       ├── App.tsx             # Root component
│       ├── routes.ts           # React Router config
│       ├── data/
│       │   └── classData.ts    # Class-specific builds/mechanics
│       ├── services/
│       │   └── gemini.ts       # Gemini API service + prompts
│       └── components/
│           ├── Layout.tsx       # App shell
│           ├── ScannerPage.tsx  # Scanner interface
│           ├── ResultsDisplay.tsx # Analysis results
│           ├── TutorialPage.tsx # Tutorial
│           ├── RatingGuide.tsx  # Grade system
│           ├── HistoryPage.tsx  # Scan history
│           ├── SettingsPanel.tsx # Settings
│           ├── HelpGuide.tsx    # Tour
│           └── NotFound.tsx     # 404
├── public/assets/              # Images
├── index.html                  # Landing page (unchanged)
├── js/                         # Landing page JS (unchanged)
└── css/                        # Landing page CSS (unchanged)
```

---

## Component Architecture

### Component Tree

```
App.tsx
  └─ RouterProvider
      └─ Layout.tsx
          ├─ Header (sticky, desktop + mobile nav)
          ├─ Outlet (route content)
          │   ├─ ScannerPage.tsx
          │   │   └─ ResultsDisplay.tsx
          │   ├─ TutorialPage.tsx
          │   │   └─ ResultsDisplay.tsx (demo)
          │   ├─ RatingGuide.tsx
          │   ├─ HistoryPage.tsx
          │   └─ NotFound.tsx
          ├─ SettingsPanel.tsx (slide-over modal)
          ├─ HelpGuide.tsx (tour overlay)
          └─ Footer
```

### State Flow

```
User Actions              Component State              Persistent Storage
───────────               ───────────────              ──────────────────

Upload Image     ──>     selectedImage
                         selectedFile

Select Class     ──>     playerClass         ──>      classData.ts lookup
                         (resets buildStyle,            (dynamic dropdowns)
                          buildMechanics)

Enter Level      ──>     characterLevel

Choose Build     ──>     buildStyle
Choose Mechanic  ──>     buildMechanics
Choose Focus     ──>     buildFocus

Click Analyze    ──>     loading = true
                         ↓
                         scanItem() → /api/analyze → Gemini
                         ↓
                    ┌─── success ──>  result = {...}     ──> localStorage
                    │                loading = false          'horadric_history'
                    │                                         (if auto-save on)
                    └─── error ──>   error = "message"
                                     loading = false

Toggle Auto-Save ──>     autoSave            ──>      localStorage
                                                       'horadric_auto_save'
```

### Page States (ScannerPage)

The scanner has three mutually exclusive render states:

1. **Scanner Form** — `!result && !error` — Upload zone, class selector, settings, analyze button
2. **Error State** — `error && !result && !loading` — Full-screen error card with message and "New Scan" button
3. **Results View** — `result` — ResultsDisplay component with "New Scan" button

Transitions:
- Scanner → (loading) → Results (on success)
- Scanner → (loading) → Error (on failure)
- Error → Scanner (via "New Scan" — clears image, error, file)
- Results → Scanner (via "New Scan" — clears everything)

---

## Data Layer

### classData.ts

Contains all class-specific data used by the Scanner's advanced settings:

```typescript
interface ClassData {
  id: string;        // 'barbarian', 'paladin', etc.
  name: string;      // Display name
  builds: string[];  // Class-specific build styles
  mechanics: string[]; // Class-specific key mechanics
}
```

Eight classes: Any, Barbarian, Druid, Necromancer, Paladin, Rogue, Sorcerer, Spiritborn.

Build Focus options are universal (shared across all classes): Balanced, Max Damage, Survivability, Speed Farming, Pit Pushing, PvP.

When the user changes class, `buildStyle` and `buildMechanics` reset to empty via a `useEffect` dependency on `playerClass`.

### localStorage Keys

| Key | Type | Default | Purpose |
|-----|------|---------|---------|
| `horadric_history` | JSON array | `[]` | Scan history (max 20 items, no images) |
| `horadric_auto_save` | `"true"` or `"false"` | `"true"` | Auto-save preference |

History items include: title, rarity, grade, verdict, analysis, sanctified, timestamp, class, level, build, mechanics, focus.

Quota handling: 20 items → 10 items → clear all (progressive degradation on QuotaExceededError).

---

## API Integration

### Request Flow

```
Browser                    Vercel                     Google
───────                    ──────                     ──────

ScannerPage
  → scanItem()
    → fileToBase64()       
      (compress if >10MB)  
    → buildUnifiedPrompt()
    → fetch('/api/analyze')
                           api/analyze.js
                             reads GEMINI_API_KEY
                             → fetch(gemini API)
                                                      Gemini 2.5 Flash
                                                        analyzes image
                                                        returns JSON
                             ← parse response
                             ← safeJSONParse()
                           ← return result
    ← normalizeResult()
  ← render ResultsDisplay
```

### Unified Prompt (Auto-Detect)

A single prompt handles both single-item analysis and side-by-side comparisons:

1. **Step 1: Visual Validation** — Confirms the image is Diablo IV (checks for item power, rarity indicators, diamond bullets, etc.)
2. **Step 2: Screenshot Type Detection** — Detects whether one tooltip or two are visible
3. **Step 3: Analysis** — Performs appropriate analysis based on detected type

The response JSON includes `scan_type: "single"` or `"comparison"` so the frontend knows which format was used.

### API Route (`api/analyze.js`)

- Vercel serverless function
- Reads `GEMINI_API_KEY` from `process.env`
- Body size limit: 15MB (supports 10MB images with base64 overhead)
- JSON truncation repair for malformed Gemini responses
- Returns parsed JSON directly to client

### Image Compression

If an uploaded file exceeds 10MB:
1. Load into an `<img>` element
2. Scale down to max 2048px on longest side
3. Draw to canvas
4. Export as JPEG at progressively lower quality (80% → 70% → ... → 30%) until under 10MB

### Error Handling

User-friendly messages mapped by HTTP status:

| Status | Message |
|--------|---------|
| 413 | Image too large — crop to tooltip, ensure under 10MB |
| 429 | Rate limited — wait and retry |
| 500 | Internal error — retry in a few seconds |
| 502/503/504 | Service unavailable — retry shortly |
| 401/403 | Auth error — report via Settings |

---

## Styling System

### Tailwind CSS 4

Uses the Vite plugin (`@tailwindcss/vite`) — no PostCSS config needed. Source detection is automatic from `src/**/*.{ts,tsx}`.

### Custom Properties (index.css)

CSS custom properties define the design system:
- Brand colors: `--red-primary`, `--red-hover`, `--orange-accent`
- Grade colors: `--grade-s-from/to` through `--grade-d-from/to`
- Rarity colors: `--rarity-mythic` through `--rarity-common`

### Dark Theme

Dark by default via `class="dark"` on `<html>` and `color-scheme: dark`. No light mode toggle — the app is dark-only to match Diablo IV's aesthetic.

### FOUC Prevention

`diablo-4-scanner.html` sets `body { opacity: 0 }` inline, then adds `.loaded` class after fonts load (or 300ms fallback). The `.loaded` class transitions opacity to 1.

---

## Build & Deployment

### Build Command

```bash
vite build
```

Outputs to `dist/` with code-split chunks:
- `react-vendor` (React, ReactDOM, React Router)
- `ui-vendor` (Lucide React)
- `diablo-4-scanner` (app code)

### Vercel Configuration (vercel.json)

```json
{
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/diablo-4-scanner", "destination": "/diablo-4-scanner.html" },
    { "source": "/diablo-4-scanner/(.*)", "destination": "/diablo-4-scanner.html" }
  ],
  "redirects": [
    { "source": "/horadric.html", "destination": "/diablo-4-scanner.html", "permanent": true }
  ]
}
```

### Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Vercel dashboard | Google Gemini API key (server-side only) |

### Multi-Page Setup

Vite builds both `index.html` (landing page) and `diablo-4-scanner.html` (React app) as separate entry points. They share no code — the landing page uses vanilla JS, the scanner uses React.

---

## Grade Icon System

Consistent icon mapping across all components:

| Grade | Icon | ResultsDisplay | HistoryPage (list) | HistoryPage (modal) | RatingGuide |
|-------|------|---------------|-------------------|-------------------|-------------|
| S | Crown | Badge (large) | Badge (small) | Badge (small) | Card icon |
| A | Sparkles | Badge (large) | Badge (small) | Badge (small) | Card icon |
| B | Star | Badge (large) | Badge (small) | Badge (small) | Card icon |
| C | AlertTriangle | Badge (large) | Badge (small) | Badge (small) | Card icon |
| D | Trash2 | Badge (large) | Badge (small) | Badge (small) | Card icon |

The `getGradeIcon()` function is defined identically in both `ResultsDisplay.tsx` and `HistoryPage.tsx`.

---

**Document Version:** 1.0  
**Last Updated:** March 7, 2026
