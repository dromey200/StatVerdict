// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 9.3.0 (Path 1A: D4 Excellence + Multi-Game Foundation)
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

    // D4 CLASS DATABASE (Complete - Season 7 / Vessel of Hatred)
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
            'Paladin': {
                builds: ['Juggernaut (Shield)', 'Zealot (Melee DPS)', 'Judicator (Holy Conjuration)', 'Disciple (Angelic Form)'],
                mechanics: ['Block Chance', 'Holy Damage', 'Fortify', 'Auras', 'Divine Wrath', 'Consecrated Ground'],
                key_stats: ['Strength', 'Block Chance', 'Holy Damage', 'Critical Strike Damage']
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
        // D3, D2R, D:I sections reserved for future expansion
    }
};

const PROMPT_TEMPLATES = {
    /**
     * D4-OPTIMIZED SINGLE-CALL ANALYSIS
     * Enhanced with detailed visual recognition and comparison screenshot support + MEMORY CONTEXT
     */
    analyzeOptimized: (selectedGame, playerClass, buildStyle, advancedSettings, equippedItem) => {
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

        // MEMORY CONTEXT INJECTION
        let memoryContext = '';
        if (equippedItem) {
            memoryContext = `\n\n🧠 EQUIPPED ITEM MEMORY:\nThe user currently has this item equipped:\n- Item: ${equippedItem.title}\n- Type: ${equippedItem.type}\n- Rarity: ${equippedItem.rarity}\n- Score: ${equippedItem.score}\n- Key Analysis: ${equippedItem.insight}\n\n💡 IMPORTANT: Compare the NEW item in the screenshot against this EQUIPPED item. In your verdict and insight, explicitly mention if the new item is an UPGRADE, DOWNGRADE, or SIDEGRADE compared to what they have equipped. Consider Item Power, stats, and build synergy.`;
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
        
        Context: ${contextLayer}${memoryContext}
        
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
            "type": "Item Type (Boots, Helm, Weapon, etc.)",
            "rarity": "Legendary | Unique | Mythic",
            "sanctified": true | false,
            "item_power": 800,
            "score": "S | A | B | C | D",
            "verdict": "KEEP | SALVAGE | UPGRADE",
            "insight": "1-2 sentence analysis. Mention Sanctified status if present.",
            "analysis": "### Stats Breakdown\\n- Item Power: XXX/925\\n- Key Stats: List main stats\\n- Synergy: How it fits the build\\n- Trade Value: Untradable (if Sanctified) or market estimate\\n\\n### Verdict\\nWhy keep or salvage.",
            "trade_query": "Clean item name for trade searches"
        }
        
        CRITICAL: If you're uncertain whether this is D4, set confidence to "medium" or "low" and explain why.
        `;
    },

    /**
     * D4 COMPARISON MODE (Side-by-side items) + MEMORY CONTEXT
     */
    compareOptimized: (selectedGame, playerClass, buildStyle, advancedSettings, equippedItem) => {
        if (selectedGame !== 'd4') {
            return PROMPT_TEMPLATES.unsupportedGame(selectedGame);
        }

        // MEMORY CONTEXT INJECTION
        let memoryContext = '';
        if (equippedItem) {
            memoryContext = `\n\n🧠 EQUIPPED ITEM MEMORY:\nUser also has this item in memory:\n- ${equippedItem.title} (${equippedItem.rarity}, Score: ${equippedItem.score})\n\nNote: This comparison screenshot shows two items side-by-side. Additionally reference the memory item if relevant.`;
        }

        return `
        ROLE: Expert Diablo IV Item Comparison Analyst
        TASK: Compare two D4 items side-by-side (typically EQUIPPED vs NEW)
        
        VALIDATION:
        • This should show TWO item tooltips
        • Both should have D4 markers (Item Power, Ancestral, etc.)
        • One is usually labeled "EQUIPPED"
        
        COMPARISON FOR: ${playerClass} - ${buildStyle || 'General Build'}${memoryContext}
        
        EVALUATE:
        1. Item Power difference
        2. Stat quality (which has better rolls?)
        3. Greater Affix advantage
        4. Sanctified status (huge advantage)
        5. Build synergy
        
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
            "title": "Item Comparison: [LEFT] vs [RIGHT]",
            "winner": "NEW" | "EQUIPPED" | "SIMILAR",
            "score_diff": "+15% DPS" | "-5% survivability" | "Marginal",
            "verdict": "EQUIP NEW" | "KEEP EQUIPPED" | "SIDEGRADE",
            "insight": "Why one item wins. Mention Sanctified if relevant.",
            "analysis": "### Left Item\\n- Stats summary\\n\\n### Right Item\\n- Stats summary\\n\\n### Comparison\\n| Stat | Left | Right | Winner |\\n|------|------|-------|--------|\\n| Power | XXX | YYY | Right |\\n\\n### Recommendation\\nFinal verdict with reasoning."
        }
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