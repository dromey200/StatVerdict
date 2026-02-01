// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 10.0.0 (Slot-Based Loadout System)
// ====================================

const CONFIG = {
    // System Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    
    // Game Support Status
    GAME_SUPPORT: {
        'd4': { enabled: true, label: 'Diablo IV', status: 'active' },
        'd3': { enabled: false, label: 'Diablo III', status: 'coming_soon' },
        'd2r': { enabled: false, label: 'Diablo II: Resurrected', status: 'coming_soon' },
        'di': { enabled: false, label: 'Diablo Immortal', status: 'coming_soon' }
    },
    
    // Response Parsing
    JSON_DELIMITER: '---METADATA---',
    
    // ENHANCED VISUAL SIGNATURES FOR DETECTION
    GAME_SIGNATURES: {
        'd4': {
            name: 'Diablo IV',
            ui_style: 'Parchment/leather texture background with ornate borders',
            key_indicators: [
                'Text: "Item Power" followed by a number (700-925)',
                'Quality format: "25 (✱ +25)" or similar',
                'Rarity words: "Ancestral", "Sacred", "Sanctified"',
                'Stat bullets: Diamond symbols (◆) before stats',
                'Color scheme: Orange/brown parchment for Legendary, Purple for Mythic/Unique',
                'Text: "Account Bound" at bottom',
                'Text: "Requires Level" near bottom',
                'Modern, crisp font rendering'
            ],
            comparison_format: 'Side-by-side tooltips with "EQUIPPED" label on one side'
        },
        'd3': {
            name: 'Diablo III',
            ui_style: 'Solid black background with colored borders',
            key_indicators: [
                'Section headers: "Primary" and "Secondary"',
                'Text: "Ancient" or "Primal Ancient"',
                'Large damage number at top (e.g., "4,136.6 Damage Per Second")',
                'Stats without diamond bullets',
                'Set item green text',
                'Socket gems shown as colored icons'
            ]
        },
        'd2r': {
            name: 'Diablo II: Resurrected',
            ui_style: 'Stone/gray grid inventory background',
            key_indicators: [
                'Text: "Defense:" with value',
                'Text: "Required Level:" with value',
                'Pixelated/classic font style',
                'Grid-based inventory visible',
                'Stats in blue/gold text on dark background',
                'Text: "Durability:" for armor',
                'Socketed items show "(X Socket)"'
            ]
        },
        'di': {
            name: 'Diablo Immortal',
            ui_style: 'Mobile-optimized UI with rounded corners',
            key_indicators: [
                'Text: "Combat Rating"',
                'Text: "Resonance"',
                'Mobile UI elements (larger touch targets)',
                'Simplified stat layout',
                'Star-based upgrade system'
            ]
        }
    },

    // NEW FORMAT: GAME_CLASSES (Required by app.js)
    // Array of class objects with id, name, builds, and mechanics
    GAME_CLASSES: {
        'd4': [
            {
                id: 'barbarian',
                name: 'Barbarian',
                builds: [
                    'Whirlwind',
                    'Hammer of the Ancients',
                    'Upheaval',
                    'Thorns',
                    'Double Swing',
                    'Bash',
                    'Dust Devils'
                ],
                mechanics: [
                    'Thorns Build',
                    'Overpower Stack',
                    'Berserking Uptime',
                    'Bleed Damage',
                    'Fortify Generation'
                ]
            },
            {
                id: 'druid',
                name: 'Druid',
                builds: [
                    'Werewolf Tornado',
                    'Pulverize',
                    'Stormclaw',
                    'Landslide',
                    'Lightning Storm',
                    'Werebear'
                ],
                mechanics: [
                    'Overpower Stack',
                    'Spirit Generation',
                    'Fortify Generation',
                    'Nature Magic Damage',
                    'Shapeshifting'
                ]
            },
            {
                id: 'necromancer',
                name: 'Necromancer',
                builds: [
                    'Bone Spear',
                    'Minion Army',
                    'Blood Surge',
                    'Infinimist',
                    'Bone Spirit',
                    'Sever'
                ],
                mechanics: [
                    'Minion Only',
                    'Blood Orb Generation',
                    'Overpower Stack',
                    'Essence Generation',
                    'Corpse Consumption'
                ]
            },
            {
                id: 'paladin',
                name: 'Paladin',
                builds: [
                    'Juggernaut (Shield)',
                    'Zealot (Melee DPS)',
                    'Judicator (Holy Conjuration)',
                    'Disciple (Angelic Form)'
                ],
                mechanics: [
                    'Block Chance',
                    'Holy Damage',
                    'Fortify Generation',
                    'Auras',
                    'Divine Wrath',
                    'Consecrated Ground'
                ]
            },
            {
                id: 'rogue',
                name: 'Rogue',
                builds: [
                    'Twisting Blades',
                    'Penetrating Shot',
                    'Rapid Fire',
                    'Barrage',
                    'Heartseeker',
                    'Victimize'
                ],
                mechanics: [
                    'Critical Strike',
                    'Vulnerable Damage',
                    'Lucky Hit',
                    'Energy Generation',
                    'Shadow Imbuement'
                ]
            },
            {
                id: 'sorcerer',
                name: 'Sorcerer',
                builds: [
                    'Ice Shards',
                    'Firewall',
                    'Ball Lightning',
                    'Meteor',
                    'Frozen Orb',
                    'Arc Lash',
                    'Chain Lightning'
                ],
                mechanics: [
                    'Critical Strike',
                    'Lucky Hit',
                    'Mana Generation',
                    'Cooldown Reduction',
                    'Barrier Generation'
                ]
            },
            {
                id: 'spiritborn',
                name: 'Spiritborn',
                builds: [
                    'Jaguar Rush',
                    'Eagle Evade',
                    'Centipede Poison',
                    'Gorilla Tank',
                    'Quill Volley',
                    'The Seeker'
                ],
                mechanics: [
                    'Vigor Generation',
                    'Critical Strike',
                    'Dodge Chance',
                    'Barrier Generation',
                    'Resolve Stacks'
                ]
            }
        ],
        'd3': [], // Coming soon
        'd2r': [], // Coming soon
        'di': []  // Coming soon
    },

    // LEGACY FORMAT: Kept for backward compatibility
    CLASS_DEFINITIONS: {
        'd4': {
            'Barbarian': {
                builds: ['Whirlwind', 'HOTA', 'Upheaval', 'Thorns', 'Double Swing', 'Bash', 'Dust Devils'],
                mechanics: ['Overpower', 'Berserking', 'Bleed', 'Fortify', 'Fury Generation', 'Shouts'],
                key_stats: ['Strength', 'Critical Strike Damage', 'Vulnerable Damage', 'Overpower Damage']
            },
            'Druid': {
                builds: ['Werewolf Tornado', 'Pulverize', 'Stormclaw', 'Landslide', 'Lightning Storm', 'Werebear'],
                mechanics: ['Spirit Boons', 'Fortify', 'Overpower', 'Nature Magic', 'Shapeshifting', 'Earth Skills'],
                key_stats: ['Willpower', 'Critical Strike Damage', 'Overpower Damage', 'Nature Magic Damage']
            },
            'Necromancer': {
                builds: ['Bone Spear', 'Minion Army', 'Blood Surge', 'Infinimist', 'Bone Spirit', 'Sever'],
                mechanics: ['Minion Health', 'Overpower', 'Essence Regen', 'Corpse Consumption', 'Lucky Hit', 'Blood Orbs'],
                key_stats: ['Intelligence', 'Minion Damage', 'Critical Strike Damage', 'Lucky Hit Chance']
            },
            'Rogue': {
                builds: ['Twisting Blades', 'Penetrating Shot', 'Rapid Fire', 'Barrage', 'Heartseeker', 'Victimize'],
                mechanics: ['Lucky Hit', 'Critical Strike', 'Energy Regen', 'Vulnerable', 'Combo Points', 'Shadow Imbuement'],
                key_stats: ['Dexterity', 'Critical Strike Damage', 'Vulnerable Damage', 'Lucky Hit Chance']
            },
            'Sorcerer': {
                builds: ['Ice Shards', 'Firewall', 'Ball Lightning', 'Meteor', 'Frozen Orb', 'Arc Lash', 'Chain Lightning'],
                mechanics: ['Mana Regen', 'Cooldown Reduction', 'Barrier Generation', 'Lucky Hit', 'Crackling Energy', 'Elemental Mastery'],
                key_stats: ['Intelligence', 'Critical Strike Damage', 'Cooldown Reduction', 'Lucky Hit Chance']
            },
            'Spiritborn': {
                builds: ['Jaguar Rush', 'Eagle Evade', 'Centipede Poison', 'Gorilla Tank', 'Quill Volley'],
                mechanics: ['Vigor Generation', 'Dodge Chance', 'Barrier', 'Thorns', 'Resolve Stacks', 'Spirit Bonds'],
                key_stats: ['Dexterity', 'Critical Strike Damage', 'Maximum Life', 'Dodge Chance']
            }
        }
    }
};

const PROMPT_TEMPLATES = {
    /**
     * D4-OPTIMIZED SINGLE-CALL ANALYSIS
     * Enhanced with SLOT-BASED LOADOUT CONTEXT
     */
    analyzeOptimized: (selectedGame, playerClass, buildStyle, advancedSettings, equippedContext) => {
        // Only D4 is supported right now
        if (selectedGame !== 'd4') {
            return PROMPT_TEMPLATES.unsupportedGame(selectedGame);
        }

        let contextLayer = `Expected Game: DIABLO IV (Season 7 / Vessel of Hatred)\nClass: ${playerClass || 'Any'}\nBuild: ${buildStyle || 'General'}`;
        
        if (advancedSettings?.mechanic) contextLayer += `\nFocus Mechanic: ${advancedSettings.mechanic}`;
        if (advancedSettings?.needs) {
             const needed = Object.keys(advancedSettings.needs).filter(k => advancedSettings.needs[k]);
             if (needed.length) contextLayer += `\nUser Needs: ${needed.join(', ').toUpperCase()}`;
        }

        // SLOT-BASED LOADOUT CONTEXT (replaces old single-item memory)
        let loadoutContext = '';
        if (equippedContext && Array.isArray(equippedContext) && equippedContext.length > 0) {
            loadoutContext = '\n\n⚔️ EQUIPPED LOADOUT CONTEXT:\nUser has these items equipped:\n';
            equippedContext.forEach((item, index) => {
                if (item) {
                    loadoutContext += `\n${index + 1}. ${item.title} (${item.type || item.rarity})\n   - Score: ${item.score || 'N/A'}\n   - Key Stats: ${item.insight || 'N/A'}`;
                }
            });
            loadoutContext += '\n\n💡 COMPARISON NOTE: Compare this NEW item against the equipped item(s) in the SAME SLOT. Mention if this is an upgrade, downgrade, or sidegrade.';
        }

        return `
        ROLE: Expert Diablo IV Item Analyst (Season 7 / Vessel of Hatred)
        TASK: Validate this is a D4 item screenshot, then analyze it.
        
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
        
        🔄 COMPARISON SCREENSHOTS (STILL VALID D4):
        • If you see TWO item tooltips side-by-side → This IS valid D4
        • One side usually labeled "EQUIPPED" 
        • Focus analysis on the RIGHT/NEW item (unless told otherwise)
        • Both tooltips should have D4 markers
        
        ❌ REJECT IF YOU SEE:
        • Real-world objects (clothing, cans, furniture, phones)
        • Diablo III markers: "Primary/Secondary" sections, black backgrounds
        • Diablo II markers: Pixelated fonts, "Defense:" stat, grid inventory
        • Diablo Immortal markers: "Combat Rating", mobile UI
        • Non-game images or unclear screenshots
        
        ═══════════════════════════════════════════════════════════
        STEP 2: ANALYSIS (Only if D4 confirmed)
        ═══════════════════════════════════════════════════════════
        
        Context: ${contextLayer}${loadoutContext}
        
        SEASON 7 KEY FEATURES:
        • Sanctified Items: Can be forged at the Heavenly Forge
        • Sanctified items have butterfly icon (🦋) and enhanced properties
        • Once Sanctified → ACCOUNT BOUND (cannot trade)
        • Item Power range: 700-925 (higher = better)
        • Greater Affixes: More powerful than normal affixes
        • Masterworking: Items can be upgraded 12 times
        
        EVALUATION CRITERIA:
        1. Item Power (700-925 scale)
        2. Rarity (Legendary < Unique < Mythic)
        3. Sanctified status (major value add)
        4. Greater Affix count (gold text = greater)
        5. Stat synergy with ${playerClass} ${buildStyle} build
        6. Roll quality (are stats near max ranges?)
        
        OUTPUT FORMAT (JSON Only):
        
        IF NOT D4 / REJECTED:
        {
            "status": "rejected",
            "reject_reason": "not_game" | "wrong_game_d3" | "wrong_game_d2r" | "wrong_game_di" | "unclear",
            "confidence": "high" | "medium" | "low",
            "message": "Brief helpful explanation"
        }
        
        IF VALID D4 ITEM:
        {
            "status": "success",
            "game": "d4",
            "confidence": "high" | "medium",
            "title": "Item Name",
            "type": "Item Type (Helm, Chest Armor, Boots, Two-Handed Sword, Ring, etc.)",
            "rarity": "Legendary | Unique | Mythic",
            "sanctified": true | false,
            "item_power": 800,
            "score": "S | A | B | C | D",
            "verdict": "KEEP | SALVAGE | UPGRADE | EQUIP",
            "insight": "1-2 sentence analysis. If comparing against equipped item, mention if this is better/worse.",
            "analysis": "### Stats Breakdown\\n- Item Power: XXX/925\\n- Key Stats: List main stats\\n- Synergy: How it fits the build\\n- Trade Value: Untradable (if Sanctified) or market estimate\\n\\n### Verdict\\nWhy keep or salvage. If comparing, explain the difference.",
            "trade_query": "Clean item name for trade searches"
        }
        
        CRITICAL: Always include accurate "type" field (Helm, Chest Armor, Gloves, Pants, Boots, Amulet, Ring, Sword, Two-Handed Axe, Shield, etc.) for slot detection.
        `;
    },

    /**
     * D4 COMPARISON MODE (Side-by-side items) + SLOT-BASED CONTEXT
     */
    compareOptimized: (selectedGame, playerClass, buildStyle, advancedSettings, equippedContext) => {
        if (selectedGame !== 'd4') {
            return PROMPT_TEMPLATES.unsupportedGame(selectedGame);
        }

        // SLOT-BASED LOADOUT CONTEXT
        let loadoutContext = '';
        if (equippedContext && Array.isArray(equippedContext) && equippedContext.length > 0) {
            loadoutContext = '\n\n⚔️ EQUIPPED ITEMS FOR COMPARISON:\n';
            equippedContext.forEach((item, index) => {
                if (item) {
                    loadoutContext += `\n${index + 1}. ${item.title} (${item.type || item.rarity})\n   - Item Power: ${item.item_power || 'Unknown'}\n   - Score: ${item.score || 'N/A'}\n   - Analysis: ${item.insight || 'N/A'}`;
                }
            });
            loadoutContext += '\n\n💡 Compare the NEW item in this screenshot against these equipped items. Focus on the same slot type.';
        }

        return `
        ROLE: Expert Diablo IV Item Comparison Analyst
        TASK: Compare two D4 items OR compare a new item against equipped gear
        
        VALIDATION:
        • May show TWO item tooltips side-by-side
        • Or ONE new item (compare against equipped items provided below)
        • All should have D4 markers (Item Power, Ancestral, etc.)
        
        COMPARISON FOR: ${playerClass} - ${buildStyle || 'General Build'}${loadoutContext}
        
        EVALUATE:
        1. Item Power difference
        2. Stat quality (which has better rolls?)
        3. Greater Affix advantage
        4. Sanctified status (huge advantage)
        5. Build synergy
        6. Same slot comparison (e.g., new Helm vs equipped Helm)
        
        OUTPUT FORMAT (JSON Only):
        
        IF NOT VALID:
        {
            "status": "rejected",
            "reject_reason": "not_comparison" | "wrong_game_d3",
            "message": "This doesn't appear to be a D4 comparison screenshot"
        }
        
        IF VALID COMPARISON:
        {
            "status": "success",
            "game": "d4",
            "title": "Item Name (NEW ITEM)",
            "type": "Item Type for slot detection",
            "rarity": "Legendary | Unique | Mythic",
            "sanctified": true | false,
            "item_power": 850,
            "winner": "NEW" | "EQUIPPED" | "SIMILAR",
            "score_diff": "+15% better" | "-5% worse" | "Marginal difference",
            "verdict": "EQUIP NEW" | "KEEP EQUIPPED" | "SIDEGRADE",
            "insight": "Why one item wins. Consider Item Power, stats, and build synergy.",
            "analysis": "### New Item\\n- Stats summary\\n\\n### Equipped Item\\n- Stats summary\\n\\n### Comparison\\n| Stat | New | Equipped | Winner |\\n|------|-----|----------|--------|\\n| Power | XXX | YYY | New |\\n\\n### Recommendation\\nFinal verdict with detailed reasoning. Explain upgrade percentage if applicable."
        }
        
        CRITICAL: Always include accurate "type" field for slot detection.
        `;
    },

    /**
     * UNSUPPORTED GAME TEMPLATE
     * Clear messaging for D3/D2R/D:I until they're implemented
     */
    unsupportedGame: (game) => {
        const gameNames = {
            'd3': 'Diablo III',
            'd2r': 'Diablo II: Resurrected',
            'di': 'Diablo Immortal'
        };
        const gameName = gameNames[game] || game.toUpperCase();

        return `
        You are analyzing a game screenshot.
        
        The user selected: ${gameName}
        
        However, this analyzer currently only supports Diablo IV.
        
        TASK: Determine if this image is actually from ${gameName} or another game.
        
        OUTPUT FORMAT (JSON Only):
        {
            "status": "unsupported_game",
            "detected_game": "${game}",
            "message": "${gameName} analysis is coming soon! Currently only Diablo IV is supported. Please select 'Diablo IV' from the game selector, or wait for ${gameName} support to be added."
        }
        `;
    }
};

// Make available globally for browser
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
}

// Also support module exports for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, PROMPT_TEMPLATES };
}