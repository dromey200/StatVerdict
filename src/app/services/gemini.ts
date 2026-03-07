// ============================================
// GEMINI API SERVICE
// Unified auto-detect: single prompt handles both
// single-item analysis and side-by-side comparisons
// ============================================

export interface AnalysisContext {
  playerClass: string;
  characterLevel: string;
  buildMechanics: string;
  buildFocus: string;
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
}

/**
 * Scan an item screenshot — auto-detects whether it's a single item
 * or a side-by-side comparison and responds accordingly.
 */
export async function scanItem(
  imageFile: File,
  context: AnalysisContext
): Promise<ScanResult> {
  const { base64, mimeType } = await fileToBase64(imageFile);
  const prompt = buildUnifiedPrompt(context);

  const result = await callAPI(prompt, base64, mimeType);
  return normalizeResult(result);
}

// ============================================
// API CALLER
// ============================================

async function callAPI(prompt: string, imageBase64: string, mimeType: string) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64, mimeType }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: '' }));
    throw new Error(getErrorMessage(response.status, err.error));
  }

  return response.json();
}

/**
 * User-friendly error messages for common HTTP errors
 */
function getErrorMessage(status: number, serverMessage: string): string {
  switch (status) {
    case 413:
      return 'Your image is too large to process. Please resize or compress your screenshot to under 4MB and try again. Tip: Use a cropped screenshot of just the item tooltip instead of a full-screen capture.';
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

// ============================================
// FILE HELPERS
// ============================================

const MAX_IMAGE_SIZE = 3.5 * 1024 * 1024; // 3.5MB target (leaves room for JSON wrapper)

async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  // If the file is small enough, use it directly
  if (file.size <= MAX_IMAGE_SIZE) {
    return readFileAsBase64(file);
  }

  // Compress the image using canvas
  const compressed = await compressImage(file);
  return readFileAsBase64(compressed);
}

function readFileAsBase64(file: File | Blob): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      const mimeType = dataUrl.split(';')[0].split(':')[1];
      resolve({ base64, mimeType });
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress an image using canvas to stay under the size limit
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');

      // Scale down if very large
      let { width, height } = img;
      const maxDimension = 2048;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to create canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Try progressively lower quality until under limit
      const tryQuality = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            if (blob.size <= MAX_IMAGE_SIZE || quality <= 0.3) {
              resolve(blob);
            } else {
              tryQuality(quality - 0.1);
            }
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

// ============================================
// RESULT NORMALIZER
// ============================================

function normalizeResult(raw: Record<string, unknown>): ScanResult {
  // Handle rejection
  if (raw.status === 'rejected') {
    throw new Error(
      (raw.message as string) || 'This image could not be analyzed. Please upload a clear Diablo IV item screenshot.'
    );
  }

  if (raw.status === 'unsupported_game') {
    throw new Error('This appears to be from an unsupported game. Only Diablo IV is currently supported.');
  }

  const scanType = (raw.scan_type as string) === 'comparison' ? 'comparison' : 'single';
  const score = (raw.score as string) || 'C';
  const verdict = (raw.verdict as string) || 'SALVAGE';
  const rarity = ((raw.rarity as string) || 'legendary').toLowerCase();
  const sanctified = raw.sanctified === true;

  const analysisText = buildFormattedAnalysis(raw, sanctified);

  return {
    title: (raw.title as string) || 'Unknown Item',
    rarity,
    grade: score,
    verdict:
      verdict.toLowerCase().includes('keep') ||
      verdict.toLowerCase().includes('upgrade') ||
      verdict.toLowerCase().includes('sanctify')
        ? 'keep'
        : 'salvage',
    analysis: analysisText,
    sanctified,
    scanType,
    status: raw.status as string,
    type: raw.type as string,
    item_power: raw.item_power as number,
    greater_affix_count: raw.greater_affix_count as number,
    confidence: raw.confidence as string,
    trade_query: raw.trade_query as string,
  };
}

function buildFormattedAnalysis(raw: Record<string, unknown>, sanctified: boolean): string {
  const insight = (raw.insight as string) || '';
  const analysis = (raw.analysis as string) || '';
  const itemPower = raw.item_power as number;
  const greaterAffixes = raw.greater_affix_count as number;
  const verdict = (raw.verdict as string) || '';

  let formatted = insight;

  if (analysis) {
    formatted += '\n\n' + analysis;
  }

  // Add key metadata if not already present
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

  if (metaParts.length > 0 && !analysis) {
    formatted += '\n\n**Key Stats:**\n' + metaParts.map((p) => `• ${p}`).join('\n');
  }

  if (verdict && !formatted.includes('**Recommendation')) {
    formatted += `\n\n**Recommendation:** ${verdict}`;
  }

  return formatted;
}

// ============================================
// UNIFIED PROMPT (Auto-detect single vs comparison)
// ============================================

function getLevelContext(characterLevel: string): string {
  if (!characterLevel) return '';

  const levelStr = characterLevel.toLowerCase().replace(/\s/g, '');
  const paragonMatch = levelStr.match(/p(?:aragon)?(\d+)/);
  const levelMatch = levelStr.match(/^(\d+)$/);

  if (paragonMatch) {
    const p = parseInt(paragonMatch[1]);
    if (p < 50) return `\nCharacter Level: Paragon ${p} (Early Paragon — resource-conscious recommendations)`;
    if (p < 150) return `\nCharacter Level: Paragon ${p} (Mid Paragon — Pit pushing and build optimization)`;
    return `\nCharacter Level: Paragon ${p} (Endgame — min-max for high-tier content)`;
  }

  if (levelMatch) {
    const l = parseInt(levelMatch[1]);
    if (l < 30) return `\nCharacter Level: ${l} (Early Leveling — prioritize items that accelerate campaign)`;
    if (l < 60) return `\nCharacter Level: ${l} (Late Leveling — identify items viable into endgame)`;
    return `\nCharacter Level: ${l} (Fresh 60 — transition advice for Torment tiers)`;
  }

  return '';
}

function buildUnifiedPrompt(context: AnalysisContext): string {
  const { playerClass, characterLevel, buildMechanics, buildFocus } = context;

  let contextLayer = `Expected Game: DIABLO IV (Season 11 / Lord of Hatred Era)\nClass: ${playerClass !== 'any' ? playerClass : 'Any'}\nBuild: ${buildFocus || 'General'}`;

  if (buildMechanics && buildMechanics !== 'general') {
    contextLayer += `\nFocus Mechanic: ${buildMechanics}`;
  }

  contextLayer += getLevelContext(characterLevel);

  return `
ROLE: Expert Diablo IV Item Analyst (Season 11 / Lord of Hatred Era)
TASK: Analyze this screenshot. AUTO-DETECT whether it shows a SINGLE item tooltip or TWO items side-by-side for comparison.

═══════════════════════════════════════════════════════════
STEP 1: VISUAL VALIDATION - IS THIS DIABLO IV?
═══════════════════════════════════════════════════════════

✅ DIABLO IV VISUAL MARKERS (Must see MOST of these):
• Parchment/leather textured background (orange/brown for Legendary, purple for Mythic)
• Text: "Item Power" followed by number (typically 700-925)
• Quality format: "25 (✱ +25)" or similar with star symbols
• Rarity indicators: "Ancestral", "Sacred", or "Sanctified"
• Diamond bullets (◆) before stat lines
• Text: "Account Bound" near bottom
• Text: "Requires Level XX" at bottom
• Modern, clean font rendering
• Ornate decorative borders around tooltip
IMPORTANT: 'Paladin' and 'Spiritborn' are VALID classes in Diablo 4. Do not reject them.

❌ REJECT IF YOU SEE:
• Real-world objects (clothing, cans, furniture, phones)
• Diablo III markers: "Primary/Secondary" sections, black backgrounds
• Diablo II markers: Pixelated fonts, "Defense:" stat, grid inventory
• Diablo Immortal markers: "Combat Rating", mobile UI
• Non-game images or unclear screenshots

═══════════════════════════════════════════════════════════
STEP 2: DETECT SCREENSHOT TYPE
═══════════════════════════════════════════════════════════

🔍 SINGLE ITEM: One tooltip visible → Perform SINGLE ITEM ANALYSIS
🔄 COMPARISON: Two tooltips side-by-side → Perform COMPARISON ANALYSIS
  • One side usually labeled "EQUIPPED"
  • Focus comparison on which item is BETTER for the player's build

═══════════════════════════════════════════════════════════
STEP 3: ANALYSIS (Only if D4 confirmed)
═══════════════════════════════════════════════════════════

Context: ${contextLayer}

CURRENT GAME STATE (Season 11 - Season of Divine Intervention):
• Item Power range: 700-925 (higher = better, 925 = max)
• Greater Affixes: Gold-colored text, more powerful than normal affixes
• Ancestral items: Guaranteed at least one Greater Affix
• Masterworking: Items can be upgraded 12 times for stat bonuses
• Mythic Uniques: Purple-colored, fixed 925 Item Power, extremely rare
• Unique Items: Gold/brown-colored, fixed affixes + unique power

🦋 SANCTIFIED ITEMS (Season 11 - Heavenly Forge):
• Sanctified items are the FINAL stage of gear optimization
• Created at the Heavenly Forge using Heavenly Sigils (from Torment bosses)
• Sanctification can: add a new legendary aspect, upgrade a non-greater affix by 50%, add a unique sanctification affix, or apply 5-25% boost to base stats
• Sanctified items can feature 3+ Greater Affixes (massive endgame power)
• PERMANENT: Once sanctified, NO further tempering, enchanting, or masterworking is allowed
• Look for butterfly icon (🦋) or "Sanctified" label on the item

CLASS-SPECIFIC WEAPON RULES (Critical for accuracy):
• Barbarian: Swords, Axes, Maces, Flails (1H+2H). NO daggers/wands/staves/bows.
• Druid: Axes, Maces, Daggers (1H), Staves, 2H Swords, Polearms. Totem off-hand. NO 1H swords/wands/bows.
• Necromancer: Swords, Daggers, Wands, Scythes, Axes, Maces. Focus/Shield off-hand. NO bows/staves/polearms.
• Rogue: Swords, Daggers (1H only). Bows, Crossbows (ranged). NO axes/maces/2H melee/staves.
• Sorcerer: Swords, Wands, Daggers, Maces (1H only). Staves (2H). Focus off-hand. NO axes/bows/2H melee.
• Spiritborn: Glaives, Quarterstaves ONLY (all 2H). NO 1H weapons, no off-hand.
• Paladin: Swords, Maces, Flails (1H+2H). Shield off-hand. NO daggers/wands/bows/staves/axes.

If the item is a weapon, note which classes CAN equip it in your analysis.

EVALUATION CRITERIA:
1. Item Power (700-925 scale, higher is better)
2. Rarity (Legendary < Unique < Mythic)
3. Sanctified status (major endgame value)
4. Greater Affix count (gold text = greater, more is better)
5. Stat synergy with ${playerClass !== 'any' ? playerClass : 'general'} ${buildFocus || ''} build
6. Roll quality (are stats near max ranges?)
7. Useful for endgame (Pit pushing, Helltide farming, Infernal Hordes)
${characterLevel ? `8. Level-appropriate advice for ${characterLevel} player` : ''}
${playerClass === 'any' ? '9. Since no class was specified, mention which classes benefit most from this item.' : ''}

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
    "item_power": 800,
    "greater_affix_count": 0,
    "score": "S | A | B | C | D",
    "verdict": "KEEP | SALVAGE | UPGRADE | SANCTIFY",
    "insight": "1-2 sentence analysis.${playerClass === 'any' ? ' Mention which classes benefit most.' : ''}",
    "analysis": "**Key Stats:**\\n• Stat 1\\n• Stat 2\\n• Stat 3\\n\\n**Build Synergy:** How it fits the build\\n\\n**Recommendation:** Verdict with reasoning${characterLevel ? ' and level-appropriate advice' : ''}",
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
    "item_power": 0,
    "greater_affix_count": 0,
    "score": "S | A | B | C | D",
    "verdict": "KEEP NEW | KEEP EQUIPPED | SITUATIONAL",
    "insight": "1-2 sentence comparison verdict",
    "analysis": "**Equipped Item:**\\n• Key stats summary\\n\\n**New Item:**\\n• Key stats summary\\n\\n**Build Synergy:** Which synergizes better with the build\\n\\n**Recommendation:** Clear winner with reasoning${characterLevel ? ' and level-appropriate context' : ''}",
    "trade_query": ""
}

CRITICAL: Always include "scan_type" ("single" or "comparison") and accurate "type" field.
`;
}
