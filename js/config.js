// ====================================
// HORADRIC AI - CONFIGURATION
// Version: 9.1.0 (Class Roster Update)
// ====================================

const CONFIG = {
    // System Limits
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    JSON_DELIMITER: '---METADATA---',

    // STRICT VISUAL DEFINITIONS FOR STAGE 1 (THE SENTRY)
    GAME_SIGNATURES: {
        'd4': {
            name: 'Diablo IV',
            keywords: ['Item Power', 'Ancestral', 'Sacred', 'Aspect', 'Lucky Hit', 'Vulnerable Damage']
        },
        'd2r': {
            name: 'Diablo II: Resurrected',
            keywords: ['Defense', 'Durability', 'Required Level', 'Fingerprint', 'Ethereal', 'Quantity']
        },
        'd3': {
            name: 'Diablo III',
            keywords: ['Primary', 'Secondary', 'Augmented', 'Ancient', 'Primal', 'Properties']
        },
        'di': {
            name: 'Diablo Immortal',
            keywords: ['Combat Rating', 'Score', 'Resonance', 'Marketable']
        }
    },

    // CLASS DATABASE (For Dynamic Dropdowns)
    CLASS_DEFINITIONS: {
        // --- DIABLO 4 ---
        'd4': {
            'Barbarian': {
                builds: ['Whirlwind', 'HOTA', 'Upheaval', 'Thorns', 'Double Swing', 'Charge', 'Bash'],
                mechanics: ['Overpower', 'Berserking', 'Bleed', 'Fortify', 'Fury Cost']
            },
            'Druid': {
                builds: ['Werewolf Tornado', 'Pulverize', 'Stormclaw', 'Companions', 'Lightning Storm'],
                mechanics: ['Spirit Boons', 'Fortify', 'Overpower', 'Nature Magic', 'Shapeshifting']
            },
            'Necromancer': {
                builds: ['Bone Spear', 'Minion Summoner', 'Blood Surge', 'Infinimist', 'Sever', 'Bone Spirit'],
                mechanics: ['Minion Health', 'Overpower', 'Essence Regen', 'Corpse Consumption', 'Lucky Hit']
            },
            'Paladin': { // Expansion Class (Spring 2026 Early Access)
                 builds: ['Shield Bash', 'Holy Fire', 'Blessed Hammer', 'Vengeance', 'Fist of the Heavens'],
                 mechanics: ['Block Chance', 'Holy Damage', 'Fortify', 'Thorns', 'Auras']
            },
            'Rogue': {
                builds: ['Twisting Blades', 'Penetrating Shot', 'Rapid Fire', 'Barrage', 'Heartseeker'],
                mechanics: ['Lucky Hit', 'Critical Strike', 'Energy Regen', 'Vulnerable', 'Combo Points']
            },
            'Sorcerer': {
                builds: ['Ice Shards', 'Firewall', 'Ball Lightning', 'Meteor', 'Arc Lash', 'Frozen Orb'],
                mechanics: ['Mana Regen', 'Cooldown Reduction', 'Barrier Gen', 'Lucky Hit', 'Crackling Energy']
            },
            'Spiritborn': {
                builds: ['Jaguar Rush', 'Eagle Evade', 'Centipede Poison', 'Gorilla Tank'],
                mechanics: ['Vigor Gen', 'Dodge Chance', 'Barrier', 'Thorns', 'Resolve Stacks']
            }
        },

        // --- DIABLO 2 RESURRECTED ---
        'd2r': {
            'Paladin': { builds: ['Hammerdin', 'Smiter', 'Zealer', 'Auradin', 'FOH'], mechanics: ['FCR', 'Crushing Blow', 'Resistances', 'Block Chance'] },
            'Sorceress': { builds: ['Blizzard', 'Lightning', 'Fireball', 'Enchant'], mechanics: ['FCR', 'Minus Enemy Res', 'MF'] },
            'Barbarian': { builds: ['Whirlwind', 'Frenzy', 'Singer', 'Throw Barb'], mechanics: ['Attack Rating', 'Leech', 'Gold Find'] },
            'Necromancer': { builds: ['Summoner', 'Poison Nova', 'Bone'], mechanics: ['FCR', 'Skill Levels', 'Resistances'] },
            'Amazon': { builds: ['Javazon', 'Bowazon'], mechanics: ['IAS', 'Pierce', 'Run/Walk'] },
            'Druid': { builds: ['Windy', 'Fury', 'Fire'], mechanics: ['FCR', 'FHR', 'Crushing Blow'] },
            'Assassin': { builds: ['Trapsin', 'Mosaic', 'Kick'], mechanics: ['IAS', 'FCR', 'Skills'] }
        },

        // --- DIABLO 3 ---
        'd3': {
            'Barbarian': { builds: ['Wastes WW', 'Frenzy', 'Leapquake'], mechanics: ['Cooldown', 'Area Damage'] },
            'Crusader': { builds: ['Aegis', 'Bombardment'], mechanics: ['Cooldown', 'Thorns'] },
            'Demon Hunter': { builds: ['GoD HA', 'Marauder', 'Multishot'], mechanics: ['Discipline', 'Attack Speed'] },
            'Monk': { builds: ['Inna', 'PoJ'], mechanics: ['Spirit', 'Area Damage'] },
            'Necromancer': { builds: ['Masquerade', 'LoD Scythe'], mechanics: ['Essence', 'Area Damage'] },
            'Witch Doctor': { builds: ['Mundunugu', 'Jade'], mechanics: ['Mana', 'Area Damage'] },
            'Wizard': { builds: ['Tal Rasha', 'Firebird'], mechanics: ['APoC', 'Crit'] }
        },

        // --- DIABLO IMMORTAL ---
        'di': {
            'Barbarian': { builds: ['Whirlwind', 'Frenzy', 'Lacerate'], mechanics: ['Combat Rating', 'Resonance', 'Crit'] },
            'Blood Knight': { builds: ['Sanguine Knot', 'Whirling Strike', 'Shadows Edge'], mechanics: ['Combat Rating', 'Life Drain'] },
            'Crusader': { builds: ['Draw and Quarter', 'Banner', 'Spinning Shield'], mechanics: ['Combat Rating', 'Block Chance'] },
            'Demon Hunter': { builds: ['Vengeance', 'Rain of Vengeance', 'Crossbow Shot'], mechanics: ['Combat Rating', 'Attack Speed'] },
            'Monk': { builds: ['Seven-Sided Strike', 'Mystic Allies', 'Exploding Palm'], mechanics: ['Combat Rating', 'Cooldown'] },
            'Necromancer': { builds: ['Command Skeletons', 'Corpse Explosion', 'Bone Spear'], mechanics: ['Combat Rating', 'Summon Damage'] },
            'Tempest': { builds: ['Flowing Strike', 'Squall', 'Zephyr'], mechanics: ['Combat Rating', 'Evasion', 'Wind Potency'] },
            'Wizard': { builds: ['Arcane Wind', 'Meteor', 'Disintegrate'], mechanics: ['Combat Rating', 'Control Potency'] }
        }
    }
};

const PROMPT_TEMPLATES = {
    /**
     * STAGE 1: THE IRON GATE (Classification)
     * Strictly separates Loot vs. Real World vs. Wrong Game
     */
    detect: () => `
    ROLE: Computer Vision Classifier.
    TASK: Classify the input image into one of the following categories strictly based on visual evidence.
    
    CATEGORIES:
    1. "d4"  -> Diablo 4 Loot Tooltip (Must contain: "Item Power" or "Ancestral")
    2. "d2r" -> Diablo 2 Loot Tooltip (Must contain: "Defense" in pixelated font, grid inventory)
    3. "d3"  -> Diablo 3 Loot Tooltip (Must contain: "Primary/Secondary" stats headers)
    4. "di"  -> Diablo Immortal Loot (Must contain: "Combat Rating" or "Score" with mobile UI)
    5. "not_loot" -> Real world photos (Cans, Bottles, Clothes, People, Screens taken with phones), or non-Diablo games.

    CRITICAL RULES:
    - If the image looks like a real physical object (like a soda can, jacket, or monitor frame), return "not_loot".
    - Do NOT hallucinate. If you see a can of water, do NOT call it a Shield.
    - If you cannot clearly read text stats, return "not_loot".

    OUTPUT FORMAT (JSON ONLY):
    {"game": "d4" | "d2r" | "d3" | "di" | "not_loot", "confidence": "high"}
    `,

    /**
     * STAGE 2: THE APPRAISER
     * Only runs if Stage 1 passes.
     */
    analyze: (gameKey, playerClass, buildStyle, advancedSettings) => {
        const game = CONFIG.GAME_SIGNATURES[gameKey];
        
        let contextLayer = `Game: ${game.name}\nClass: ${playerClass}\nBuild: ${buildStyle || 'General'}`;
        if (advancedSettings?.mechanic) contextLayer += `\nFocus Mechanic: ${advancedSettings.mechanic}`;
        if (advancedSettings?.needs) {
             const needed = Object.keys(advancedSettings.needs).filter(k => advancedSettings.needs[k]);
             if (needed.length) contextLayer += `\nUser Needs: ${needed.join(', ').toUpperCase()}`;
        }

        return `
        ROLE: Expert ${game.name} Theorycrafter.
        TASK: Analyze this item.
        CONTEXT:
        ${contextLayer}

        OUTPUT FORMAT (JSON Only):
        {
            "title": "Item Name",
            "type": "Item Type",
            "rarity": "Rarity",
            "score": "S/A/B/C/D Tier",
            "verdict": "KEEP or SALVAGE",
            "insight": "1 sentence summary.",
            "analysis": "Markdown analysis explaining the score.",
            "trade_query": "Clean Name"
        }
        `;
    },

    compare: (gameKey, playerClass, buildStyle) => {
        const game = CONFIG.GAME_SIGNATURES[gameKey];
        return `
        ROLE: Expert ${game.name} Theorycrafter.
        TASK: Compare NEW item vs EQUIPPED item.
        CONTEXT: Class: ${playerClass}, Build: ${buildStyle}

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