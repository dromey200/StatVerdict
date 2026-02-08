// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 11.0.0 (Season 11 / Class-Weapon Accuracy Update)
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
                id: 'any',
                name: 'Any Class',
                builds: [],
                mechanics: []
            },
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
                    'Dust Devils',
                    'Earthquake'
                ],
                mechanics: [
                    'Thorns Build',
                    'Overpower Stack',
                    'Berserking Uptime',
                    'Bleed Damage',
                    'Fortify Generation',
                    'Fury Generation'
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
                    'Werebear',
                    'Hurricane'
                ],
                mechanics: [
                    'Overpower Stack',
                    'Spirit Generation',
                    'Fortify Generation',
                    'Nature Magic Damage',
                    'Shapeshifting',
                    'Companion Damage'
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
                    'Sever',
                    'Blight'
                ],
                mechanics: [
                    'Minion Only',
                    'Blood Orb Generation',
                    'Overpower Stack',
                    'Essence Generation',
                    'Corpse Consumption',
                    'Shadow Damage'
                ]
            },
            {
                id: 'paladin',
                name: 'Paladin',
                builds: [
                    'Juggernaut (Shield Tank)',
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
                    'Consecrated Ground',
                    'Faith Generation'
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
                    'Victimize',
                    'Flurry'
                ],
                mechanics: [
                    'Critical Strike',
                    'Vulnerable Damage',
                    'Lucky Hit',
                    'Energy Generation',
                    'Shadow Imbuement',
                    'Combo Points'
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
                    'Chain Lightning',
                    'Blizzard'
                ],
                mechanics: [
                    'Critical Strike',
                    'Lucky Hit',
                    'Mana Generation',
                    'Cooldown Reduction',
                    'Barrier Generation',
                    'Crackling Energy'
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

    // LEGACY FORMAT: Kept for backward compatibility (updated Season 11)
    CLASS_DEFINITIONS: {
        'd4': {
            'Barbarian': {
                builds: ['Whirlwind', 'HOTA', 'Upheaval', 'Thorns', 'Double Swing', 'Bash', 'Dust Devils', 'Earthquake'],
                mechanics: ['Overpower', 'Berserking', 'Bleed', 'Fortify', 'Fury Generation', 'Shouts'],
                key_stats: ['Strength', 'Critical Strike Damage', 'Vulnerable Damage', 'Overpower Damage']
            },
            'Druid': {
                builds: ['Werewolf Tornado', 'Pulverize', 'Stormclaw', 'Landslide', 'Lightning Storm', 'Werebear', 'Hurricane'],
                mechanics: ['Spirit Boons', 'Fortify', 'Overpower', 'Nature Magic', 'Shapeshifting', 'Earth Skills', 'Companions'],
                key_stats: ['Willpower', 'Critical Strike Damage', 'Overpower Damage', 'Nature Magic Damage']
            },
            'Necromancer': {
                builds: ['Bone Spear', 'Minion Army', 'Blood Surge', 'Infinimist', 'Bone Spirit', 'Sever', 'Blight'],
                mechanics: ['Minion Health', 'Overpower', 'Essence Regen', 'Corpse Consumption', 'Lucky Hit', 'Blood Orbs', 'Shadow Damage'],
                key_stats: ['Intelligence', 'Minion Damage', 'Critical Strike Damage', 'Lucky Hit Chance']
            },
            'Paladin': {
                builds: ['Juggernaut', 'Zealot', 'Judicator', 'Disciple'],
                mechanics: ['Block Chance', 'Holy Damage', 'Auras', 'Divine Wrath', 'Consecrated Ground', 'Faith Generation', 'Fortify'],
                key_stats: ['Strength', 'Holy Damage', 'Block Chance', 'Maximum Life']
            },
            'Rogue': {
                builds: ['Twisting Blades', 'Penetrating Shot', 'Rapid Fire', 'Barrage', 'Heartseeker', 'Victimize', 'Flurry'],
                mechanics: ['Lucky Hit', 'Critical Strike', 'Energy Regen', 'Vulnerable', 'Combo Points', 'Shadow Imbuement'],
                key_stats: ['Dexterity', 'Critical Strike Damage', 'Vulnerable Damage', 'Lucky Hit Chance']
            },
            'Sorcerer': {
                builds: ['Ice Shards', 'Firewall', 'Ball Lightning', 'Meteor', 'Frozen Orb', 'Arc Lash', 'Chain Lightning', 'Blizzard'],
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

        let contextLayer = `Expected Game: DIABLO IV (Season 11 / Lord of Hatred Era)\nClass: ${playerClass || 'Any'}\nBuild: ${buildStyle || 'General'}`;
        
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
        ROLE: Expert Diablo IV Item Analyst (Season 11 / Lord of Hatred Era)
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
        IMPORTANT: 'Paladin' and 'Spiritborn' are VALID classes in Diablo 4. Do not reject them.
        
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
        • RISK: Process can occasionally "brick" an item with poor results
        • ACCOUNT BOUND after sanctification (cannot be traded)
        • Look for butterfly icon (🦋) or "Sanctified" label on the item
        • Best practice: Fully temper, enchant, and masterwork BEFORE sanctifying
        
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
        3. Sanctified status (major endgame value — 3+ Greater Affixes, permanent optimization)
        4. Greater Affix count (gold text = greater, more is better)
        5. Stat synergy with ${playerClass !== 'any' ? playerClass : 'general'} ${buildStyle || ''} build
        6. Roll quality (are stats near max ranges?)
        7. Useful for endgame (Pit pushing, Helltide farming, Infernal Hordes)
        ${playerClass === 'any' ? '8. Since no class was specified, mention which classes benefit most from this item.' : ''}
        
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
            "type": "Item Type (Helm, Chest Armor, Boots, Two-Handed Sword, Ring, Shield, Glaive, etc.)",
            "rarity": "Legendary | Unique | Mythic",
            "sanctified": true | false,
            "item_power": 800,
            "greater_affix_count": 0,
            "score": "S | A | B | C | D",
            "verdict": "KEEP | SALVAGE | UPGRADE | EQUIP | SANCTIFY",
            "insight": "1-2 sentence analysis. If sanctified, note its permanence and value. If comparing against equipped item, mention if this is better/worse.${playerClass === 'any' ? ' Mention which classes benefit most.' : ''}",
            "analysis": "### Stats Breakdown\\n- Item Power: XXX/925\\n- Key Stats: List main stats with values\\n- Greater Affixes: Count and list them\\n- Sanctified: Yes/No (if yes, note it cannot be further modified)\\n- Synergy: How it fits the ${playerClass !== 'any' ? playerClass + ' ' + (buildStyle || '') : 'general'} build\\n\\n### Verdict\\nWhy keep or salvage. If not sanctified and high quality, recommend sanctifying at Heavenly Forge after full masterworking.",
            "trade_query": "Clean item name for trade searches (note: Sanctified items are untradable)"
        }
        
        CRITICAL: Always include accurate "type" field (Helm, Chest Armor, Gloves, Pants, Boots, Amulet, Ring, One-Handed Sword, Two-Handed Axe, Shield, Glaive, Staff, etc.) for slot detection.
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
        ROLE: Expert Diablo IV Item Comparison Analyst (Season 11)
        TASK: Compare two D4 items OR compare a new item against equipped gear
        
        VALIDATION:
        • May show TWO item tooltips side-by-side
        • Or ONE new item (compare against equipped items provided below)
        • All should have D4 markers (Item Power, Ancestral, etc.)
        IMPORTANT: 'Paladin' and 'Spiritborn' are VALID classes in Diablo 4. Do not reject them.

        CLASS-SPECIFIC WEAPON RULES:
        • Barbarian: Swords, Axes, Maces, Flails (1H+2H). NO daggers/wands/staves/bows.
        • Druid: Axes, Maces, Daggers (1H), Staves, 2H Swords, Polearms. Totem off-hand. NO 1H swords/wands/bows.
        • Necromancer: Swords, Daggers, Wands, Scythes, Axes, Maces. Focus/Shield off-hand. NO bows/staves/polearms.
        • Rogue: Swords, Daggers (1H only). Bows, Crossbows (ranged). NO axes/maces/2H melee.
        • Sorcerer: Swords, Wands, Daggers, Maces (1H only). Staves (2H). Focus off-hand. NO axes/bows/2H melee.
        • Spiritborn: Glaives and Quarterstaves ONLY (2H). NO 1H weapons.
        • Paladin: Swords, Maces, Flails (1H+2H). Shield off-hand. NO daggers/wands/bows/axes.

        If this weapon cannot be equipped by the selected class, flag it clearly.
        
        COMPARISON FOR: ${playerClass} - ${buildStyle || 'General Build'}${loadoutContext}
        
        EVALUATE:
        1. Item Power difference (higher = better, max 925)
        2. Stat quality (which has better rolls relative to max?)
        3. Greater Affix count advantage (gold text affixes)
        4. Sanctified status (sanctified items have 3+ Greater Affixes, permanent optimization, untradable)
        5. Build synergy for ${playerClass} ${buildStyle || 'General'} build
        6. Practical upgrade percentage estimate
        7. Same slot comparison (e.g., new Helm vs equipped Helm)
        
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
            "mode": "comparison",
            "item1": {
                "title": "Left/First Item Name",
                "type": "Item Type for slot detection",
                "rarity": "Legendary | Unique | Mythic",
                "sanctified": true | false,
                "item_power": 850,
                "greater_affix_count": 0,
                "score": "S | A | B | C | D",
                "insight": "Brief 1-sentence summary of this item's strengths"
            },
            "item2": {
                "title": "Right/Second Item Name",
                "type": "Item Type for slot detection",
                "rarity": "Legendary | Unique | Mythic",
                "sanctified": true | false,
                "item_power": 860,
                "greater_affix_count": 1,
                "score": "S | A | B | C | D",
                "insight": "Brief 1-sentence summary of this item's strengths"
            },
            "title": "Item 2 Name (for backward compat / history)",
            "type": "Item Type for slot detection",
            "rarity": "Best item's rarity",
            "sanctified": false,
            "item_power": 860,
            "winner": "ITEM1" | "ITEM2" | "SIMILAR",
            "score_diff": "+15% better" | "-5% worse" | "Marginal difference",
            "verdict": "EQUIP ITEM1" | "EQUIP ITEM2" | "SIDEGRADE",
            "insight": "Why one item wins. Consider Item Power, stat rolls, Greater Affixes, sanctified status, and build synergy.",
            "analysis": "### Item 1: [Name] (Score: X)\\nIP: XXX | GA: X | Sanctified: Y/N\\nKey stats: list top 3-4 stats briefly\\n\\n### Item 2: [Name] (Score: X)\\nIP: XXX | GA: X | Sanctified: Y/N\\nKey stats: list top 3-4 stats briefly\\n\\n### Winner: [Item 1/2/Tie]\\n2-3 sentence verdict."
        }
        
        CRITICAL: Always include accurate "type" field for slot detection. Keep the "analysis" field CONCISE — do NOT list every stat on the item. Summarize the 3-4 most impactful differences. Detailed per-item info belongs in each item's "insight" field. The total JSON response must complete within token limits.
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