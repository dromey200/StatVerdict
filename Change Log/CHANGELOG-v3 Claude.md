# Horadric AI — v3.0.0 Changelog

**Project:** StatVerdict — Diablo IV Gear Analysis (Horadric AI)  
**Version:** 3.0.0  
**Date:** March 6–7, 2026  
**Type:** Major rebuild — full React/TypeScript migration from vanilla JS

---

## Summary

Horadric AI was completely rebuilt from a vanilla HTML/CSS/JavaScript application into a modern React 18 + TypeScript + Tailwind CSS 4 single-page application. The redesign was driven by a Figma Make prototype and delivers a scanner-first experience, contextual AI analysis with character progression tiers, dynamic class-specific build options, and a unified auto-detection system that handles both single-item analysis and side-by-side comparisons in a single prompt.

---

## Architecture Migration

| Area | Before (v2.x) | After (v3.0) |
|------|---------------|--------------|
| Framework | None (vanilla JS) | React 18.3 + TypeScript 5.6 |
| Styling | Custom CSS files | Tailwind CSS 4 with CSS custom properties |
| Routing | Single HTML file | React Router 7 with SPA routing |
| Build tool | Vite 5 (static serving) | Vite 6 with React + Tailwind plugins |
| Entry point | horadric.html | diablo-4-scanner.html React SPA |
| API integration | Client-side with user-provided API key | Server-side Vercel function with env variable |
| State management | Global HoradricApp.state object | React hooks |
| Icons | Emoji-based | Lucide React icon library |
| Analysis modes | Separate Analyze/Compare buttons | Unified auto-detect (single button) |
| Class data | Static dropdowns | Dynamic class-specific builds and mechanics |

---

## Changes

### 1. Project Scaffolding
New React/TS/Tailwind project structure with Vite 6, TypeScript strict mode, path aliases, multi-page build config, and FOUC prevention.

### 2. Layout Shell
Sticky header with dual navigation, gavel back-link to statverdict.com, "Stat Verdict" branding, mobile bottom nav, flex footer push-to-bottom, keyboard shortcuts.

### 3. Scanner Page
Image upload with drag-and-drop, 8 classes including Paladin, character level input (supports "45", "Paragon 120", "P150"), class-specific advanced settings, three mutually exclusive UI states (scanner/error/results).

### 4. Dynamic Class Data
Class-specific builds and mechanics for all 8 classes. Selections auto-reset when switching classes.

### 5. Results Display
Two-column layout, rarity-colored headers, grade badges with icons (S=Crown, A=Sparkles, B=Star, C=AlertTriangle, D=Trash2), verdict banners, structured Key Stats and Build Synergy sections, fixed newline rendering.

### 6. Tutorial Page
5-step guide, interactive Harlequin Crest demo analysis, best practices section. Opt-in rather than mandatory.

### 7. Rating Guide
All 5 grade tiers with icon badges, dual-context boxes (Endgame vs Leveling), item rarities grid, special modifiers (Sanctified, Greater Affixes, Masterworked), pro tips.

### 8. History Page
Search, rarity/grade filters, detail modal with full analysis, delete individual/clear all, grade badges with icons, empty states.

### 9. Settings Panel
Functional auto-save toggle (custom switch, persists to localStorage), AI engine info, about section with report/enhancement links.

### 10. Help Guide
5-step interactive tour with spotlight highlighting, responsive positioning, arrow pointers.

### 11. Gemini API Integration
Vercel serverless proxy with server-side API key, unified auto-detect prompt (single item or comparison), Season 11 context, JSON truncation repair, 15MB body limit.

### 12. Error Handling
Full-screen error state replaces scanner form, user-friendly messages (413/429/500/502-504), forced "New Scan" reset, auto image compression for files over 10MB.

### 13. Vercel Configuration
Build command, output directory, SPA rewrites, legacy redirects, CSP updates, API cache headers.

### 14. Grade Icon Consistency
getGradeIcon() with identical mapping in ResultsDisplay and HistoryPage, matching Rating Guide.

---

## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM rendering |
| react-router-dom | ^7.1.0 | Client-side routing |
| lucide-react | ^0.468.0 | Icon library |
| typescript | ~5.6.2 | Type checking |
| vite | ^6.0.0 | Build tool |
| tailwindcss | ^4.0.0 | Utility CSS |
| @tailwindcss/vite | ^4.0.0 | Tailwind Vite plugin |
| @vitejs/plugin-react | ^4.3.4 | Vite React support |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + U | Focus upload input |
| Ctrl/Cmd + Enter | Analyze item |
| Ctrl/Cmd + N | Navigate to Scanner |
| Ctrl/Cmd + H | Navigate to History |
| Ctrl/Cmd + , | Open Settings |
| Ctrl/Cmd + ? | Open Help tour |
| Esc | Close modals |

---

**Prepared by:** Development Team  
**Date:** March 7, 2026
