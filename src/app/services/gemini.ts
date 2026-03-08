// ============================================
// GEMINI API SERVICE
// Season 12 — Season of Slaughter (Patch 2.6.0)
//
// Evaluation engine now implements:
//   • Bloodied item IP gate (≥750 = 1.5x baseline multiplier)
//   • Bloodied affix scoring (Rampage / Feast / Hunger)
//   • Slaughterhouse focus: deprioritize class skills,
//     apply 2.0x multiplier to universal raw stats
//   • Socket economy: 2-socket Runeword base = positive,
//     1-socket = flagged negative
//   • Warlock class support scaffolding
// ============================================

import { CLASS_DATA, BUILD_FOCUSES, type BuildFocusId } from '../data/classData';

// ──────────────────────────────────────────
// PUBLIC INTERFACES
// ──────────────────────────────────────────

export interface AnalysisContext {
  playerClass: string;
  characterLevel: string;
  buildMechanics: string;
  buildFocus: string;
  buildStyle?: string;
}

export interface ScanResult {
  title: string;
  rarity: string;
  grade: string;
  verdict: string;
  analysis: string;
  image?: string;
  sanctified?: boolean;
  scanType?: 'single' | 'comparison';
  // Raw API fields
  status?: string;
  type?: string;
  item_power?: number;
  greater_affix_count?: number;
  confidence?: string;
  trade_query?: string;
  // Season 12 fields
  bloodied?: boolean;
  socket_count?: number;
  runeword_eligible?: boolean;
  slaughterhouse_mode?: boolean;
}

// ──────────────────────────────────────────
// ENTRY POINT
// ──────────────────────────────────────────

/**
 * Scan an item screenshot — auto-detects single vs comparison,
 * applies Season 12 Slaughter scoring adjustments to the prompt.
 */
export async function scanItem(
  imageFile: File,
  context: AnalysisContext
): Promise<ScanResult> {
  const { base64, mimeType } = await fileToBase64(imageFile);
  const prompt = buildUnifiedPrompt(context);
  const raw = await callAPI(prompt, base64, mimeType);
  return normalizeResult(raw, context);
}

// ──────────────────────────────────────────
// SCORING ENGINE
// Season 12 evaluation logic applied INSIDE the prompt
// and as a post-processing layer in normalizeResult().
// ──────────────────────────────────────────

/**
 * PHASE 5 — ITEM POWER GATE
 *
 * If the item has the "Bloodied" tag AND Item Power ≥ 750,
 * apply a 1.5x baseline score multiplier.
 *
 * Rationale: Bloodied items scale dynamically with the Killstreak
 * multiplier system. At IP ≥ 750 the scaling ceiling is high enough
 * that the item warrants elevated scoring even on mediocre rolls.
 *
 * @param itemPower - Parsed item power from Gemini response
 * @param isBloodied - Whether the item carries the Bloodied tag
 * @returns Multiplier to apply to the base numeric score
 */
function getBloodiedIPMultiplier(itemPower: number | undefined, isBloodied: boolean): number {
  if (!isBloodied) return 1.0;
  if (itemPower === undefined || itemPower === null) return 1.0;
  // IP gate: must be ≥ 750 to unlock dynamic Killstreak scaling bonus
  return itemPower >= 750 ? 1.5 : 1.0;
}

/**
 * PHASE 5 — BLOODIED AFFIX PARSING
 *
 * Returns a multiplier for a specific Bloodied affix category
 * based on the player's selected build focus.
 *
 * Focus → Affix mapping (Patch 2.6.0):
 *   Speed Farming  → Rampage (Armor) 1.8x, Feast (Weapon) 1.8x
 *     Rampage affixes scale with rapid kill momentum (armor that
 *     gains stats per Killstreak tier). Feast affixes scale weapon
 *     damage with clear speed, both critical for farming efficiency.
 *
 *   Pit Pushing    → Standard ancestral stability preferred.
 *     However, "Wendigo Brand" or "Blood-Mad Idol" uniques receive
 *     a Best-in-Slot override flag regardless of affix scoring.
 *
 * @param affixCategory - 'Rampage' | 'Feast' | 'Hunger'
 * @param buildFocus    - Player's selected focus (BuildFocusId)
 * @returns Score multiplier for this affix under the active focus
 */
function getBloodiedAffixMultiplier(
  affixCategory: 'Rampage' | 'Feast' | 'Hunger',
  buildFocus: string
): number {
  if (buildFocus === 'speed') {
    // Speed Farming: Rampage and Feast both scale with rapid kills
    if (affixCategory === 'Rampage') return 1.8;
    if (affixCategory === 'Feast') return 1.8;
    if (affixCategory === 'Hunger') return 1.0; // Neutral — resource drain less impactful while speed-clearing
  }
  if (buildFocus === 'pit') {
    // Pit Pushing: Prefer stability; Bloodied scaling is too variance-heavy for deep pit content.
    // Bloodied affixes are not actively boosted here — standard ancestral rolls take priority.
    return 1.0;
  }
  return 1.0;
}

/**
 * PHASE 5 — SLAUGHTERHOUSE FOCUS OVERRIDES
 *
 * When the player selects "Slaughterhouse / Butcher Transformation":
 *   • Class-specific skill rank affixes are DEPRIORITIZED (0.2x)
 *     because class skills are fully disabled during The Butcher
 *     transformation. These affixes provide zero value during the event.
 *   • Universal raw stats receive a 2.0x multiplier — these are the
 *     only stats that remain active when class skills are locked:
 *       - Movement Speed
 *       - Attack Speed
 *       - Maximum Life %
 *       - Universal Damage Reduction (any source)
 *
 * @param isSlaughterhouse - Whether Slaughterhouse focus is active
 * @returns Object with multipliers for each stat category
 */
function getSlaughterouseWeights(isSlaughterhouse: boolean): {
  universalStatMultiplier: number;
  classSkillRankMultiplier: number;
} {
  if (!isSlaughterhouse) {
    return { universalStatMultiplier: 1.0, classSkillRankMultiplier: 1.0 };
  }
  return {
    universalStatMultiplier: 2.0,  // Movement Speed, Attack Speed, Max Life %, Dmg Reduction
    classSkillRankMultiplier: 0.2, // +Skill Ranks effectively useless during Butcher form
  };
}

/**
 * PHASE 5 — SOCKET ECONOMY (RUNEWORD BASE EVALUATION)
 *
 * Valid Runeword base item types require exactly 2 sockets to
 * house one Ritual Rune + one Invocation Rune simultaneously.
 *
 * Scoring logic (Patch 2.6.0 Runeword economy):
 *   2 sockets on a valid base  → +positive weight (Runeword-ready)
 *   1 socket on a valid base   → negative weight flag (cannot host
 *                                 Ritual/Invocation pair; suboptimal)
 *   0 sockets or invalid base  → neutral weight
 *
 * @param socketCount - Number of sockets on the item
 * @param itemType    - Item type string from Gemini response
 * @returns Weight modifier string description for prompt injection
 */
function getSocketScoringNote(socketCount: number | undefined, itemType: string): string {
  if (socketCount === undefined || socketCount === null) return '';

  // Runeword-eligible base item types
  const runewordBases = [
    'helm', 'helmet', 'chest', 'chest armor',
    'two-handed sword', 'two-handed axe', 'two-handed mace',
    'two-handed flail', 'two-handed scythe',
    'polearm', 'staff', 'quarterstaff', 'glaive', 'bow', 'crossbow',
  ];

  const normalizedType = itemType.toLowerCase();
  const isValidBase = runewordBases.some((base) => normalizedType.includes(base));

  if (!isValidBase) return '';

  if (socketCount === 2) {
    return (
      'SOCKET ECONOMY: This item has 2 sockets on a valid Runeword base — ' +
      'POSITIVE weight modifier applied. Can host a complete Ritual + Invocation Rune pair for end-game Runeword optimization.'
    );
  }

  if (socketCount === 1) {
    return (
      'SOCKET ECONOMY: ⚠️ This item has only 1 socket on a valid Runeword base — ' +
      'NEGATIVE weight modifier applied. Cannot house a Ritual + Invocation Rune combination; ' +
      'suboptimal for Runeword economy. Consider whether Jeweler upgrade to 2 sockets is viable.'
    );
  }

  return '';
}

// ──────────────────────────────────────────
// PROMPT BUILDER
// ──────────────────────────────────────────

function buildUnifiedPrompt(context: AnalysisContext): string {
  const {
    playerClass,
    characterLevel,
    buildMechanics,
    buildFocus,
    buildStyle,
  } = context;

  // Resolve class data for class-specific context injection
  const classEntry = CLASS_DATA.find((c) => c.id === playerClass);
  const seasonalNote = classEntry?.seasonalSynergies ?? '';
  const runewordNote = classEntry?.supportedRunewords ?? '';

  // Resolve focus display name
  const focusEntry = BUILD_FOCUSES.find((f) => f.id === buildFocus);
  const focusName = focusEntry?.name ?? buildFocus;

  // Slaughterhouse mode flag
  const isSlaughterhouse = buildFocus === 'slaughterhouse';
  const slaughterNote = isSlaughterhouse
    ? `
⚔️ SLAUGHTERHOUSE / BUTCHER TRANSFORMATION FOCUS — CRITICAL SCORING OVERRIDE:
• CLASS SKILLS ARE DISABLED during The Butcher Transformation.
• DEPRIORITIZE all class-specific skill rank affixes (e.g., "+X Ranks to Twisting Blades", "+X to Bone Spear").
  These affixes provide ZERO VALUE during the transformation event. Apply a 0.2x weight penalty to them.
• PRIORITIZE the following UNIVERSAL raw stats with a 2.0x weight multiplier — these remain active even during transformation:
  - Movement Speed (%)
  - Attack Speed (%)
  - Maximum Life (%)
  - Universal Damage Reduction (any type: Close, Distant, from Elites, etc.)
• Evaluate the item primarily through the lens of these four universal stats.`
    : '';

  // Speed / Pit focus Bloodied notes
  const bloodiedFocusNote =
    buildFocus === 'speed'
      ? `
🩸 SPEED FARMING + BLOODIED: If this item has the "Bloodied" tag, apply 1.8x scoring weight to:
• Rampage affixes (Armor) — scale with Killstreak momentum
• Feast affixes (Weapon) — scale weapon damage with clear speed`
      : buildFocus === 'pit'
      ? `
🩸 PIT PUSHING + BLOODIED: Prefer stable Ancestral stat rolls over Bloodied dynamic scaling.
• Exception: If this item is "Wendigo Brand" or "Blood-Mad Idol", flag it as BEST IN SLOT override regardless of other affixes.`
      : '';

  const levelContext = getLevelContext(characterLevel);
  const contextLayer = buildContextLayer(playerClass, buildStyle, buildMechanics, focusName, levelContext);

  return `
You are Horadric AI, an expert Diablo IV loot analyst for Season 12 "Season of Slaughter" (Patch 2.6.0).
Analyze the provided item screenshot with strict precision.

═══════════════════════════════════════════════════════════
STEP 1: VALIDATE IMAGE
═══════════════════════════════════════════════════════════

✅ ACCEPT IF YOU SEE:
• Diablo IV item tooltip (item name, power number, affixes with diamond bullets)
• Items from any patch/season including Season 12 Bloodied items
• Unique items, Mythic items, Ancestral items, Sanctified items, Bloodied items
• Side-by-side comparison (one or two tooltips)

❌ REJECT IF:
• Real-world objects, non-game images
• Diablo III (Primary/Secondary affix sections, black backgrounds)
• Diablo II (pixelated fonts, "Defense:" stat, grid inventory)
• Diablo Immortal (Combat Rating, mobile UI elements)
• Completely unclear or unreadable screenshots

═══════════════════════════════════════════════════════════
STEP 2: DETECT SCREENSHOT TYPE
═══════════════════════════════════════════════════════════

🔍 SINGLE ITEM: One tooltip → perform SINGLE ITEM ANALYSIS
🔄 COMPARISON: Two tooltips side-by-side → perform COMPARISON ANALYSIS
  • One side usually labeled "EQUIPPED"
  • Determine which item is better for the player's build

═══════════════════════════════════════════════════════════
STEP 3: SEASON 12 ITEM DETECTION
═══════════════════════════════════════════════════════════

Check for the following Season 12 "Season of Slaughter" properties:

🩸 BLOODIED TAG: Look for "Bloodied" in the item name or a blood-drop icon.
   • Bloodied items scale dynamically with Killstreak multiplier tiers (1x–10x)
   • If Item Power ≥ 750, apply a 1.5x baseline scoring multiplier — the dynamic
     scaling ceiling at this IP threshold makes even average rolls worthwhile
   • If Item Power < 750, Bloodied scaling is limited; treat as standard item
   • Parse and identify which Bloodied affix category is present:
       - Rampage = Armor slot affixes (kill momentum → armor/mitigation stats)
       - Feast   = Weapon slot affixes (clear speed → damage stats)
       - Hunger  = Accessory slot affixes (resource drain → resource pool stats)

🔌 SOCKET COUNT: Count visible socket slots on the item.
   • Identify if the item type is a valid Runeword base:
     Helm, Chest Armor, Two-Handed Weapon (any type)
   • 2 sockets on a valid base = POSITIVE score weight (Runeword-ready)
   • 1 socket on a valid base = NEGATIVE score weight (cannot host Ritual + Invocation pair)
   • Report socket_count in your JSON response

🏆 UNIQUE OVERRIDES: If item name is "Wendigo Brand" or "Blood-Mad Idol",
   flag as Best in Slot regardless of roll quality (Pit Pushing only).

${slaughterNote}

${bloodiedFocusNote}

═══════════════════════════════════════════════════════════
STEP 4: ANALYSIS (Only if D4 confirmed)
═══════════════════════════════════════════════════════════

Context: ${contextLayer}

CURRENT GAME STATE (Season 12 — Season of Slaughter, Patch 2.6.0):
• Item Power range: 700-925 (higher = better, 925 = max)
• Greater Affixes: Gold-colored text, more powerful than normal affixes
• Ancestral items: Guaranteed at least one Greater Affix
• Masterworking: Items can be upgraded 12 times for stat bonuses
• Mythic Uniques: Purple-colored, fixed 925 Item Power, extremely rare
• Unique Items: Gold/brown-colored, fixed affixes + unique power
• Bloodied Items: Season 12 tag — scales with Slaughter Meter Killstreak tiers
• Runeword Sockets: End-game optimization requires Ritual + Invocation Rune pair (2 sockets)

🦋 SANCTIFIED ITEMS:
• Final stage of gear optimization — created at the Heavenly Forge
• Can add a legendary aspect, upgrade a non-greater affix by 50%, or add unique sanctification affix
• PERMANENT: No further tempering, enchanting, or masterworking allowed
• Look for butterfly icon or "Sanctified" label

SEASONAL SYNERGY NOTE for ${playerClass !== 'any' ? playerClass : 'all classes'}:
${seasonalNote}
${runewordNote ? `\nRUNEWORD GUIDANCE: ${runewordNote}` : ''}

CLASS-SPECIFIC WEAPON RULES (Critical for accuracy):
• Barbarian: Swords, Axes, Maces, Flails (1H+2H). NO daggers/wands/staves/bows.
• Druid: Axes, Maces, Daggers (1H), Staves, 2H Swords, Polearms. Totem off-hand. NO 1H swords/wands/bows.
• Necromancer: Swords, Daggers, Wands, Scythes, Axes, Maces. Focus/Shield off-hand. NO bows/staves/polearms.
• Rogue: Swords, Daggers (1H only). Bows, Crossbows (ranged). NO axes/maces/2H melee/staves.
• Sorcerer: Swords, Wands, Daggers, Maces (1H only). Staves (2H). Focus off-hand. NO axes/bows/2H melee.
• Spiritborn: Glaives, Quarterstaves ONLY (all 2H). NO 1H weapons, no off-hand.
• Paladin: Swords, Maces, Flails (1H+2H). Shield off-hand. NO daggers/wands/bows/staves/axes.
• Warlock: Wands, Daggers, Staves (1H+2H). Focus/Tome off-hand. NO axes/maces/bows/shields. [Lord of Hatred Expansion]

EVALUATION CRITERIA:
1. Item Power (700-925 scale, higher = better)
2. Rarity (Legendary < Unique < Mythic)
3. Sanctified status (major endgame value)
4. Greater Affix count (gold text = greater, more = better)
5. Stat synergy with ${playerClass !== 'any' ? playerClass : 'general'} ${focusName} build
6. Roll quality (are stats near max ranges?)
7. Bloodied tag + IP gate check (≥750 = apply 1.5x multiplier)
8. Socket count relative to Runeword economy
${isSlaughterhouse ? '9. SLAUGHTERHOUSE OVERRIDE: Universal stats (Move Speed, Attack Speed, Max Life %, Dmg Reduction) weighted 2.0x. Class skill ranks weighted 0.2x.' : ''}
${characterLevel ? `${isSlaughterhouse ? '10' : '9'}. Level-appropriate advice for ${characterLevel} player` : ''}
${playerClass === 'any' ? 'Mention which classes benefit most from this item.' : ''}

═══════════════════════════════════════════════════════════
OUTPUT FORMAT (JSON Only — choose based on detected type)
═══════════════════════════════════════════════════════════

IF NOT D4 / REJECTED:
{
    "status": "rejected",
    "scan_type": "unknown",
    "reject_reason": "not_game" | "wrong_game_d3" | "wrong_game_d2r" | "wrong_game_di" | "unclear",
    "confidence": "high" | "medium" | "low",
    "message": "Brief helpful explanation"
}

IF SINGLE ITEM (one tooltip detected):
{
    "status": "success",
    "scan_type": "single",
    "game": "d4",
    "confidence": "high" | "medium",
    "title": "Item Name",
    "type": "Item Type (Helm, Chest Armor, Two-Handed Sword, Ring, etc.)",
    "rarity": "Legendary | Unique | Mythic",
    "sanctified": true | false,
    "bloodied": true | false,
    "bloodied_category": "Rampage | Feast | Hunger | null",
    "item_power": 800,
    "greater_affix_count": 0,
    "socket_count": 0,
    "runeword_eligible": true | false,
    "bis_override": true | false,
    "score": "S | A | B | C | D",
    "verdict": "KEEP | SALVAGE | UPGRADE | SANCTIFY",
    "insight": "1-2 sentence analysis.${playerClass === 'any' ? ' Mention which classes benefit most.' : ''}${isSlaughterhouse ? ' Note Slaughterhouse stat value.' : ''}",
    "analysis": "**Key Stats:**\\n• Stat 1\\n• Stat 2\\n• Stat 3\\n\\n**Build Synergy:** How it fits the build${isSlaughterhouse ? '\\n\\n**Slaughterhouse Value:** Evaluate Movement Speed, Attack Speed, Max Life %, and Damage Reduction specifically' : ''}\\n\\n**Recommendation:** Verdict with reasoning${characterLevel ? ' and level-appropriate advice' : ''}",
    "trade_query": "Clean item name for trade searches"
}

IF COMPARISON (two tooltips detected):
{
    "status": "success",
    "scan_type": "comparison",
    "game": "d4",
    "confidence": "high" | "medium",
    "title": "New Item Name vs Equipped Item Name",
    "type": "Item Type",
    "rarity": "Higher rarity of the two",
    "sanctified": false,
    "bloodied": false,
    "bloodied_category": null,
    "item_power": 0,
    "greater_affix_count": 0,
    "socket_count": 0,
    "runeword_eligible": false,
    "bis_override": false,
    "score": "S | A | B | C | D",
    "verdict": "KEEP NEW | KEEP EQUIPPED | SITUATIONAL",
    "insight": "1-2 sentence comparison verdict",
    "analysis": "**Equipped Item:**\\n• Key stats summary\\n\\n**New Item:**\\n• Key stats summary\\n\\n**Build Synergy:** Which synergizes better\\n\\n**Recommendation:** Clear winner with reasoning${characterLevel ? ' and level-appropriate context' : ''}",
    "trade_query": ""
}

CRITICAL: Always include "scan_type" ("single" or "comparison"), "bloodied", "socket_count", and accurate "type" field.
`;
}

// ──────────────────────────────────────────
// CONTEXT LAYER BUILDER
// ──────────────────────────────────────────

function buildContextLayer(
  playerClass: string,
  buildStyle: string | undefined,
  buildMechanics: string,
  focusName: string,
  levelContext: string
): string {
  const parts: string[] = [];

  if (playerClass && playerClass !== 'any') {
    parts.push(`Class: ${playerClass}`);
  } else {
    parts.push('Class: Any (evaluate for all classes)');
  }

  if (buildStyle) parts.push(`Build: ${buildStyle}`);
  if (buildMechanics) parts.push(`Key Mechanic: ${buildMechanics}`);
  if (focusName) parts.push(`Focus: ${focusName}`);
  if (levelContext) parts.push(levelContext);

  return parts.join(' | ');
}

function getLevelContext(characterLevel: string): string {
  if (!characterLevel) return '';

  const levelStr = characterLevel.toLowerCase().replace(/\s/g, '');
  const paragonMatch = levelStr.match(/p(?:aragon)?(\d+)/);

  if (paragonMatch) {
    const paragon = parseInt(paragonMatch[1], 10);
    return `Paragon Level: ${paragon} (endgame — prioritize BiS and masterworking)`;
  }

  const numMatch = levelStr.match(/(\d+)/);
  if (numMatch) {
    const level = parseInt(numMatch[1], 10);
    if (level >= 1 && level <= 50) {
      return `Character Level: ${level} (leveling — prioritize Item Power and useful stats over perfect rolls)`;
    }
    if (level > 50 && level <= 100) {
      return `Character Level: ${level} (endgame progression — balance stat quality with build-specific needs)`;
    }
  }

  return `Character Level: ${characterLevel}`;
}

// ──────────────────────────────────────────
// API CALLER
// ──────────────────────────────────────────

async function callAPI(prompt: string, imageBase64: string, mimeType: string): Promise<Record<string, unknown>> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: '' }));
    throw new Error(getErrorMessage(response.status, err.error as string));
  }

  return response.json() as Promise<Record<string, unknown>>;
}

function getErrorMessage(status: number, serverMessage: string): string {
  switch (status) {
    case 413:
      return 'Your image is too large to process. Please use a cropped screenshot of just the item tooltip rather than a full-screen capture, and ensure the file is under 10MB.';
    case 429:
      return 'Too many requests — the analysis service is temporarily rate-limited. Please wait a moment and try again.';
    case 500:
      return 'The analysis service encountered an internal error. Please try again in a few seconds. If this persists, the AI service may be temporarily unavailable.';
    case 502:
    case 503:
    case 504:
      return 'The analysis service is temporarily unavailable. Please try again in a few moments.';
    case 401:
    case 403:
      return 'Authentication error with the analysis service. Please report this issue using the Settings panel.';
    default:
      return serverMessage || `An unexpected error occurred (HTTP ${status}). Please try again.`;
  }
}

// ──────────────────────────────────────────
// RESULT NORMALIZER
// Post-processes raw Gemini JSON and applies
// scoring overrides based on Season 12 logic.
// ──────────────────────────────────────────

function normalizeResult(raw: Record<string, unknown>, context: AnalysisContext): ScanResult {
  // ── Rejection handling ─────────────────
  if (raw.status === 'rejected') {
    throw new Error(
      (raw.message as string) || 'This image could not be analyzed. Please upload a clear Diablo IV item screenshot.'
    );
  }

  if (raw.status === 'unsupported_game') {
    throw new Error('This appears to be from an unsupported game. Only Diablo IV is currently supported.');
  }

  // ── Core fields ────────────────────────
  const scanType = (raw.scan_type as string) === 'comparison' ? 'comparison' : 'single';
  const rawScore  = (raw.score as string) || 'C';
  const verdict   = (raw.verdict as string) || 'SALVAGE';
  const rarity    = ((raw.rarity as string) || 'legendary').toLowerCase();
  const sanctified = raw.sanctified === true;

  // ── Season 12 fields ───────────────────
  const isBloodied: boolean       = raw.bloodied === true;
  const itemPower: number | undefined = raw.item_power as number | undefined;
  const socketCount: number | undefined = raw.socket_count as number | undefined;
  const itemType: string          = (raw.type as string) || '';
  const isSlaughterhouse          = context.buildFocus === 'slaughterhouse';
  const bisOverride: boolean      = raw.bis_override === true;

  // ── Phase 5: Bloodied IP gate ──────────
  // Modifies the effective grade if Bloodied tag + IP ≥ 750
  const bloodiedMultiplier = getBloodiedIPMultiplier(itemPower, isBloodied);

  // ── Phase 5: Bloodied affix scoring ───
  const bloodiedCategory = (raw.bloodied_category as 'Rampage' | 'Feast' | 'Hunger' | null) ?? null;
  const affixMultiplier =
    bloodiedCategory !== null
      ? getBloodiedAffixMultiplier(bloodiedCategory, context.buildFocus)
      : 1.0;

  // ── Phase 5: Socket economy note ──────
  const socketNote = getSocketScoringNote(socketCount, itemType);

  // ── Phase 5: Slaughterhouse weights ───
  const slaughterWeights = getSlaughterouseWeights(isSlaughterhouse);

  // ── Grade upgrade logic ────────────────
  // Apply multipliers to potentially elevate the Gemini-assigned grade.
  // Combined multiplier = bloodied IP multiplier × affix multiplier.
  // The slaughterhouse universal stat multiplier is prompt-side only
  // (Gemini handles the re-weighting in its analysis); we don't
  // double-apply it here to avoid scoring inflation.
  const combinedMultiplier = bloodiedMultiplier * affixMultiplier;
  const adjustedScore = applyScoreMultiplier(rawScore, combinedMultiplier);

  // ── BiS override ──────────────────────
  // Wendigo Brand / Blood-Mad Idol get forced S-grade under Pit Pushing
  const finalScore = bisOverride && context.buildFocus === 'pit' ? 'S' : adjustedScore;

  // ── Build formatted analysis ──────────
  const analysisText = buildFormattedAnalysis(raw, sanctified, isBloodied, socketNote, isSlaughterhouse, slaughterWeights, bisOverride);

  return {
    title: (raw.title as string) || 'Unknown Item',
    rarity,
    grade: finalScore,
    verdict:
      verdict.toLowerCase().includes('keep') ||
      verdict.toLowerCase().includes('upgrade') ||
      verdict.toLowerCase().includes('sanctify')
        ? 'keep'
        : 'salvage',
    analysis: analysisText,
    sanctified,
    scanType,
    // Raw fields
    status: raw.status as string,
    type: itemType,
    item_power: itemPower,
    greater_affix_count: raw.greater_affix_count as number,
    confidence: raw.confidence as string,
    trade_query: raw.trade_query as string,
    // Season 12 fields
    bloodied: isBloodied,
    socket_count: socketCount,
    runeword_eligible: raw.runeword_eligible === true,
    slaughterhouse_mode: isSlaughterhouse,
  };
}

/**
 * Applies a numeric multiplier to a letter grade.
 *
 * Score scale: D=1, C=2, B=3, A=4, S=5
 * Multiplier raises the numeric score; result clamped to S.
 *
 * Example: B (3) × 1.5 = 4.5 → rounds to A (4) → A
 *          C (2) × 1.5 = 3.0 → B (3) → B
 *          A (4) × 1.5 = 6.0 → clamped to S (5) → S
 *
 * @param grade      - Letter grade from Gemini: S | A | B | C | D
 * @param multiplier - Scoring multiplier ≥ 1.0
 * @returns Adjusted letter grade
 */
function applyScoreMultiplier(grade: string, multiplier: number): string {
  if (multiplier <= 1.0) return grade;

  const gradeMap: Record<string, number> = { D: 1, C: 2, B: 3, A: 4, S: 5 };
  const reverseMap: Record<number, string> = { 1: 'D', 2: 'C', 3: 'B', 4: 'A', 5: 'S' };

  const numericGrade = gradeMap[grade.toUpperCase()] ?? 2;
  const adjusted = Math.min(5, Math.round(numericGrade * multiplier));
  return reverseMap[adjusted] ?? grade;
}

// ──────────────────────────────────────────
// ANALYSIS FORMATTER
// ──────────────────────────────────────────

function buildFormattedAnalysis(
  raw: Record<string, unknown>,
  sanctified: boolean,
  isBloodied: boolean,
  socketNote: string,
  isSlaughterhouse: boolean,
  slaughterWeights: { universalStatMultiplier: number; classSkillRankMultiplier: number },
  bisOverride: boolean
): string {
  const insight  = (raw.insight as string)   || '';
  const analysis = (raw.analysis as string)  || '';
  const itemPower = raw.item_power as number;
  const greaterAffixes = raw.greater_affix_count as number;
  const verdict  = (raw.verdict as string)   || '';
  const bloodiedCategory = raw.bloodied_category as string | null;

  let formatted = insight;

  if (analysis) {
    formatted += '\n\n' + analysis;
  }

  // Key metadata block
  const metaParts: string[] = [];
  if (itemPower && !analysis.includes('Item Power')) {
    metaParts.push(`Item Power: ${itemPower}/925`);
  }
  if (greaterAffixes !== undefined && !analysis.includes('Greater Affix')) {
    metaParts.push(`Greater Affixes: ${greaterAffixes}`);
  }
  if (sanctified && !analysis.toLowerCase().includes('sanctif')) {
    metaParts.push('Sanctified: Yes (permanent — cannot be further modified)');
  }

  // Season 12 metadata
  if (isBloodied) {
    const ipNote = itemPower >= 750
      ? `Bloodied (IP ≥ 750 — 1.5x Killstreak scaling bonus applied)`
      : `Bloodied (IP < 750 — limited Killstreak scaling; standard evaluation)`;
    metaParts.push(ipNote);
    if (bloodiedCategory) {
      metaParts.push(`Bloodied Affix Type: ${bloodiedCategory}`);
    }
  }

  if (bisOverride) {
    metaParts.push('⭐ BEST IN SLOT OVERRIDE — Wendigo Brand / Blood-Mad Idol (Pit Pushing)');
  }

  if (metaParts.length > 0 && !analysis) {
    formatted += '\n\n**Key Stats:**\n' + metaParts.map((p) => `• ${p}`).join('\n');
  } else if (metaParts.length > 0) {
    formatted += '\n\n**Season 12 Notes:**\n' + metaParts.map((p) => `• ${p}`).join('\n');
  }

  // Socket economy note
  if (socketNote) {
    formatted += `\n\n**Socket Economy:** ${socketNote}`;
  }

  // Slaughterhouse scoring context
  if (isSlaughterhouse) {
    formatted +=
      '\n\n**Slaughterhouse Scoring Active:**\n' +
      `• Universal stats (Movement Speed, Attack Speed, Max Life %, Damage Reduction): ${slaughterWeights.universalStatMultiplier}x weight\n` +
      `• Class-specific skill ranks: ${slaughterWeights.classSkillRankMultiplier}x weight (disabled during Butcher Transformation)`;
  }

  if (verdict && !formatted.includes('**Recommendation')) {
    formatted += `\n\n**Recommendation:** ${verdict}`;
  }

  return formatted;
}

// ──────────────────────────────────────────
// FILE HELPERS
// ──────────────────────────────────────────

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  if (file.size <= MAX_IMAGE_SIZE) {
    return readFileAsBase64(file);
  }
  const compressed = await compressImage(file);
  return readFileAsBase64(compressed);
}

function readFileAsBase64(file: File | Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64  = dataUrl.split(',')[1];
      const mimeType = dataUrl.split(';')[0].split(':')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const maxDimension = 2048;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width  = Math.round(width  * scale);
        height = Math.round(height * scale);
      }
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Failed to create canvas context')); return; }
      ctx.drawImage(img, 0, 0, width, height);
      const tryQuality = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { reject(new Error('Failed to compress image')); return; }
            if (blob.size <= MAX_IMAGE_SIZE || quality <= 0.3) { resolve(blob); }
            else { tryQuality(quality - 0.1); }
          },
          'image/jpeg',
          quality
        );
      };
      tryQuality(0.8);
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
}
