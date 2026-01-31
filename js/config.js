// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 9.2.0 (Season 11: Divine Intervention & Expansion Ready)
// ====================================

const CONFIG = {
    // System Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    
    // Response Parsing
    JSON_DELIMITER: '---METADATA---',
    
    // VISUAL SIGNATURES (Used by Sentry to identify/reject)
    GAME_SIGNATURES: {
        'd4': {
            name: 'Diablo IV',
            // Added 'Sanctified' and 'Account Bound' to anchors
            visual_cues: 'Dark/Gritty UI, "Item Power", "Sanctified" label, "Ancestral" text.',
            anchors: ['Item Power', 'Ancestral', 'Sacred', 'Sanctified', 'Aspect', 'Lucky Hit', 'Vulnerable Damage', 'Account Bound']
        },
        'd2r': { name: 'Diablo II', anchors: ['Defense', 'Durability', 'Required Level', 'Fingerprint'] },
        'd3': { name: 'Diablo III', anchors: ['Primary', 'Secondary', 'Augmented', 'Ancient'] },
        'di': { name: 'Diablo Immortal', anchors: ['Combat Rating', 'Score', 'Resonance'] }
    },

    // D4 CLASS DATABASE (Updated with Lord of Hatred Archetypes)
    CLASS_DEFINITIONS: {
        'd4': {
            'Barbarian': {
                builds: ['Whirlwind', 'HOTA', 'Upheaval', 'Thorns', 'Double Swing', 'Bash Cleave'],
                mechanics: ['Overpower', 'Berserking', 'Bleed', 'Fortify', 'Fury Cost']
            },
            'Druid': {
                builds: ['Werewolf Tornado', 'Pulverize', 'Stormclaw', 'Landslide', 'Lightning Storm'],
                mechanics: ['Spirit Boons', 'Fortify', 'Overpower', 'Nature Magic', 'Shapeshifting']
            },
            'Necromancer': {
                builds: ['Bone Spear', 'Minion Summoner', 'Blood Surge', 'Infinimist', 'Bone Spirit'],
                mechanics: ['Minion Health', 'Overpower', 'Essence Regen', 'Corpse Consumption', 'Lucky Hit']
            },
            'Paladin': { // UPDATED: Expansion Archetypes (Oaths)
                 builds: ['Juggernaut (Shield)', 'Zealot (Melee DPS)', 'Judicator (Holy Conjuration)', 'Disciple (Angelic Form)'],
                 mechanics: ['Block Chance', 'Holy Damage', 'Fortify', 'Auras', 'Zakarum Faith']
            },
            'Rogue': {
                builds: ['Twisting Blades', 'Penetrating Shot', 'Rapid Fire', 'Barrage', 'Heartseeker'],
                mechanics: ['Lucky Hit', 'Critical Strike', 'Energy Regen', 'Vulnerable', 'Combo Points']
            },
            'Sorcerer': {
                builds: ['Ice Shards', 'Firewall', 'Ball Lightning', 'Meteor', 'Frozen Orb', 'Arc Lash'],
                mechanics: ['Mana Regen', 'Cooldown Reduction', 'Barrier Gen', 'Lucky Hit', 'Crackling Energy']
            },
            'Spiritborn': {
                builds: ['Jaguar Rush', 'Eagle Evade', 'Centipede Poison', 'Gorilla Tank'],
                mechanics: ['Vigor Gen', 'Dodge Chance', 'Barrier', 'Thorns', 'Resolve Stacks']
            }
        }
    }
};

const PROMPT_TEMPLATES = {
    /**
     * STAGE 1: THE SENTRY (Classification)
     * Strictly separates D4 Loot vs. Real World vs. Other Games
     */
    detect: () => `
    ROLE: Computer Vision Classifier.
    TASK: Classify the input image into one of the following categories strictly based on visual evidence.
    
    CATEGORIES:
    1. "d4" -> Diablo 4 Loot Tooltip (Must contain: "Item Power" OR "Ancestral" OR "Sanctified").
    2. "other_game" -> Diablo 2/3/Immortal (Pixelated fonts, "Combat Rating", "Primary/Secondary").
    3. "not_loot" -> Real world photos, cans, screens taken with phones, non-Diablo games.

    CRITICAL RULES:
    - If you see a beverage can (e.g. Bubly), IMMEDIATELY return "not_loot".
    - If you see a physical jacket or clothing item, return "not_loot".
    - If you cannot read specific RPG stats (Str, Int, Dmg), return "not_loot".

    OUTPUT FORMAT (JSON ONLY):
    {"category": "d4" | "other_game" | "not_loot", "reason": "short explanation"}
    `,

    /**
     * STAGE 2: THE APPRAISER
     * Updated with Season 11 (Sanctification) Awareness
     */
    analyze: (playerClass, buildStyle, advancedSettings) => {
        let contextLayer = `Game: Diablo IV (Season 11 / Lord of Hatred Era)\nClass: ${playerClass}\nBuild: ${buildStyle || 'General'}`;
        
        if (advancedSettings?.mechanic) contextLayer += `\nFocus Mechanic: ${advancedSettings.mechanic}`;
        if (advancedSettings?.needs) {
             const needed = Object.keys(advancedSettings.needs).filter(k => advancedSettings.needs[k]);
             if (needed.length) contextLayer += `\nUser Needs: ${needed.join(', ').toUpperCase()}`;
        }

        return `
        ROLE: Expert Diablo IV Theorycrafter.
        TASK: Analyze this item.
        
        SEASONAL CONTEXT (Season of Divine Intervention):
        - Items can be "**Sanctified**" at the Heavenly Forge.
        - **Sanctified** items have a special icon and extra stats/powers (e.g., Bonus Aspect, Greater Affix upgrade).
        - **IMPORTANT:** Once Sanctified, an item is **Account Bound** and cannot be traded.
        
        CONTEXT:
        ${contextLayer}

        OUTPUT FORMAT (JSON Only):
        {
            "title": "Item Name",
            "type": "Item Type",
            "rarity": "Rarity",
            "score": "S/A/B/C/D Tier",
            "verdict": "KEEP or SALVAGE",
            "insight": "1 sentence summary. If Sanctified, mention the specific bonus gained.",
            "analysis": "Markdown analysis. NOTE: If item is Sanctified, Trade Value MUST be 'Untradable'.",
            "trade_query": "Clean Name"
        }
        `;
    },

    compare: (playerClass, buildStyle) => {
        return `
        ROLE: Expert Diablo IV Theorycrafter.
        TASK: Compare NEW item vs EQUIPPED item.
        CONTEXT: Class: ${playerClass}, Build: ${buildStyle}
        
        NOTE: Check for "Sanctified" status. Sanctified items often have higher stats or extra aspects that outweigh standard items.

        OUTPUT FORMAT (JSON Only):
        {
            "title": "Comparison",
            "winner": "NEW or EQUIPPED",
            "score_diff": "+/- % approx",
            "verdict": "EQUIP or DISCARD",
            "insight": "Why it wins/loses.",
            "analysis": "Markdown comparison table."
        }
        `;
    }
};

if (typeof module !== 'undefined') module.exports = { CONFIG, PROMPT_TEMPLATES };