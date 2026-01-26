// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 2.5.0 (Paladin + Demo Fix)
// ====================================

const CONFIG = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    COMPRESSION_QUALITY: 0.8,
    MAX_DIMENSION: 1024,
    MAX_HISTORY: 10,
    JSON_DELIMITER: '---METADATA---',

    GAME_SETTINGS: {
        'd4': {
            name: 'Diablo IV',
            // Added Paladin
            classes: ['Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Rogue', 'Sorcerer', 'Spiritborn'],
            rarities: ['common', 'magic', 'rare', 'legendary', 'unique', 'mythic']
        },
        'd2r': {
            name: 'Diablo II: Resurrected',
            classes: ['Amazon', 'Assassin', 'Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Sorceress'],
            rarities: ['normal', 'magic', 'rare', 'set', 'unique', 'runeword', 'crafted']
        },
        'd3': {
            name: 'Diablo III',
            classes: ['Barbarian', 'Crusader', 'Demon Hunter', 'Monk', 'Necromancer', 'Witch Doctor', 'Wizard'],
            rarities: ['common', 'magic', 'rare', 'legendary', 'set', 'ancient', 'primal']
        },
        'di': {
            name: 'Diablo Immortal',
            classes: ['Barbarian', 'Blood Knight', 'Crusader', 'Demon Hunter', 'Monk', 'Necromancer', 'Tempest', 'Wizard'],
            rarities: ['common', 'magic', 'rare', 'legendary', 'set']
        }
    },

    BUILD_STYLES: [
        { value: 'damage', label: '🗡️ Damage Dealer' },
        { value: 'tanky', label: '🛡️ Tanky/Defensive' },
        { value: 'speed', label: '⚡ Speed/Mobility' },
        { value: 'dots', label: '🔥 Damage Over Time' },
        { value: 'crit', label: '💥 Critical Strike' },
        { value: 'minions', label: '👥 Minions/Pets' },
        { value: 'cooldown', label: '⏱️ Cooldown Reduction' },
        { value: 'lucky-hit', label: '🎯 Lucky Hit' },
        { value: 'crowd-control', label: '❄️ Crowd Control' },
        { value: 'resource', label: '💧 Resource Generation' }
    ]
};

const PROVIDERS = {
    gemini: {
        name: 'Google Gemini',
        keyPattern: /^AIza[a-zA-Z0-9_-]{35}$/,
        keyPlaceholder: 'AIzaSy... (Paste Key Here)',
        getKeyUrl: 'https://aistudio.google.com/app/apikey',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
        
        // Detailed Help Restored
        help: {
            title: 'How to Get Your Free Gemini API Key',
            steps: [
                'Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a> (Log in with your Google account).',
                'Click the blue <strong>"Create API Key"</strong> button.',
                'Select <strong>"Create key in new project"</strong>.',
                'Copy the key that starts with <code>AIza...</code>',
                'Paste it into the box above. It is saved locally on your device.'
            ]
        },

        // Demo Data Populated
        demoItem: {
            name: 'Harlequin Crest (Shako)',
            rarity: 'mythic',
            imageUrl: 'harlequin crest.jpg', 
            analysis: `**Harlequin Crest** (Mythic Unique Helm) 🎭

**(Mythic)**

**Score:**
S-Tier (God Roll) 🏆

**Verdict:**
KEEP! This is the most versatile item in the game.

**Key Stats:**
• +20% Damage Reduction • +4 to All Skills • Cooldown Reduction • Resource Gen

**Why It's Valuable:**
The "Shako" provides massive survivability and a huge damage boost via the +4 Skills. It fits into literally every build in the game.

**Trade Value:**
Account Bound (Cannot Trade) - But priceless for your build.

${CONFIG.JSON_DELIMITER}
{"rarity":"mythic","trade_query":"Harlequin Crest"}`
        }
    }
};

const PROMPT_TEMPLATES = {
    base: (game, playerClass, buildStyle, advancedSettings) => {
        const gameConfig = CONFIG.GAME_SETTINGS[game] || CONFIG.GAME_SETTINGS['d4'];
        
        let specialContext = "";
        if (advancedSettings?.needs) {
            const needs = [];
            if (advancedSettings.needs.str) needs.push("Strength");
            if (advancedSettings.needs.int) needs.push("Intelligence");
            if (advancedSettings.needs.will) needs.push("Willpower");
            if (advancedSettings.needs.dex) needs.push("Dexterity");
            if (advancedSettings.needs.res) needs.push("All Resist");
            if (needs.length > 0) specialContext += `\nURGENT PRIORITY: Player is missing stats for Paragon requirements. Boost rating heavily if item has: ${needs.join(', ')}. `;
        }
        if (advancedSettings?.mechanic) {
            const m = advancedSettings.mechanic;
            if (m === 'thorns') specialContext += "\nMECHANIC: Thorns Build. Critical Strike is USELESS. Thorns & Life are S-Tier.";
            if (m === 'low-life') specialContext += "\nMECHANIC: Low Life Build. Max Life is LOW VALUE. Dmg Reduc while Injured is S-Tier.";
            if (m === 'overpower') specialContext += "\nMECHANIC: Overpower Build. Willpower/Life are required.";
            if (m === 'minion-only') specialContext += "\nMECHANIC: Minion Build. Player dmg stats are low value.";
        }

        return `Role: Expert ${gameConfig.name} Item Analyst
Context: Player class is ${playerClass}. Build style: ${buildStyle || 'General'}.${specialContext}
Task: Analyze the item in this screenshot.

CRITICAL FORMAT REQUIREMENTS:
Use EXACTLY this structure with NO extra blank lines:

**[Item Name]** ([Item Type])

**(Rarity Level)**

**Score:**
[Rating S/A/B/C/D] [Emoji]

**Verdict:**
[KEEP or SALVAGE]! [One sentence why]

**Key Stats:**
• [Stat 1] • [Stat 2] • [Stat 3]

**Why It's Valuable:**
[2-3 sentences explaining value, synergies, and build fit]

**Trade Value:**
[Brief trade assessment]

End with: ${CONFIG.JSON_DELIMITER}
{"rarity":"[rarity]","trade_query":"[item name]"}`;
    },

    compare: (game, playerClass, buildStyle, advancedSettings) => {
        const gameConfig = CONFIG.GAME_SETTINGS[game] || CONFIG.GAME_SETTINGS['d4'];
        return `Role: Expert ${gameConfig.name} Theorycrafter
Context: Player class is ${playerClass}. Build: ${buildStyle}.${advancedSettings?.mechanic ? ` Mechanic: ${advancedSettings.mechanic}` : ''}
Task: Compare Equipped vs New item.

CRITICAL FORMAT REQUIREMENTS:
Use EXACTLY this structure:

**Comparison Result** ⚖️

**Winner:**
[NEW ITEM or EQUIPPED ITEM]

**Score Diff:**
[e.g., +15% Upgrade]

**Why:**
[2 sentences explaining why]

**Trade-offs:**
• Gaining: [Gain]
• Losing: [Loss]

**Recommendation:**
[Equip Immediately / Keep / Salvage]

End with: ${CONFIG.JSON_DELIMITER}
{"rarity":"compare","trade_query":"compare"}`;
    }
};
