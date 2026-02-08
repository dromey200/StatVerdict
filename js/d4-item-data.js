// ====================================
// HORADRIC AI - DIABLO 4 ITEM & CLASS DATA
// Version: 1.0.0
// Source of truth for class-weapon restrictions,
// item type identification, and equipment rules
// ====================================

const D4_ITEM_DATA = {

    // =============================================
    // SEASON INFO
    // =============================================
    CURRENT_SEASON: {
        number: 11,
        name: 'Season of Divine Intervention',
        patch: '2.2',
        notes: 'Paladin class added via Lord of Hatred pre-purchase.'
    },

    // =============================================
    // SANCTIFICATION SYSTEM (Season 11)
    // =============================================
    SANCTIFICATION: {
        enabled: true,
        method: 'Heavenly Forge using Heavenly Sigils',
        sigil_source: 'Torment difficulty bosses and content',
        effects: [
            'Add a new legendary aspect',
            'Upgrade a non-greater affix by 50%',
            'Add a unique sanctification affix',
            'Apply a 5%-25% boost to base stats'
        ],
        rules: [
            'PERMANENT: No further tempering, enchanting, or masterworking after sanctification',
            'Can result in 3+ Greater Affixes',
            'Risk of poor outcome (bricking)',
            'ACCOUNT BOUND after sanctification (untradable)',
            'Best practice: Fully temper, enchant, and masterwork BEFORE sanctifying'
        ],
        visual_markers: ['Butterfly icon (🦋)', '"Sanctified" label on item'],
        eligible_items: ['Legendary', 'Unique'],
        verdict_impact: 'Sanctified items with good rolls are endgame best-in-slot and should almost always be KEPT'
    },

    // =============================================
    // CLASS-WEAPON RESTRICTIONS (Post Season 5+)
    // Verified against Icy Veins, Fextralife Wiki,
    // and official Blizzard patch notes.
    //
    // KEY CHANGES (Season 5+):
    //  - Sorcerer CAN use 1H Swords and 1H Maces
    //  - Druid CAN use Polearms, 2H Swords, Daggers
    //  - Necromancer CAN use All Maces & Axes
    // =============================================

    CLASS_ALLOWED_WEAPONS: {
        barbarian: {
            label: 'Barbarian',
            // Arsenal System: 4 weapon slots (2x 1H + 2x 2H)
            equipSlots: 12, // 5 armor + 3 jewelry + 4 weapons
            allowed: [
                '1h-sword', '1h-axe', '1h-mace', '1h-flail',
                '2h-sword', '2h-axe', '2h-mace', '2h-hammer', '2h-polearm'
            ],
            banned: ['dagger', 'wand', 'staff', 'scythe', 'bow', 'crossbow', 'glaive', 'quarterstaff', 'focus', 'totem'],
            offhand: [], // Barbarian CANNOT use shields or off-hands (4-weapon arsenal instead)
            notes: 'Uses Arsenal System with 4 weapons: 2H Bludgeoning, 2H Slashing, Dual Wield (MH+OH). Cannot use daggers, wands, staves, bows, or ranged weapons.'
        },
        druid: {
            label: 'Druid',
            equipSlots: 10,
            allowed: [
                '1h-axe', '1h-mace', '1h-dagger',
                '2h-axe', '2h-mace', '2h-staff', '2h-sword', '2h-polearm'
            ],
            banned: ['1h-sword', 'wand', 'bow', 'crossbow', 'scythe', 'glaive', 'quarterstaff', 'flail'],
            offhand: ['totem'],
            notes: 'Season 5+ can use Polearms, 2H Swords, and Daggers. Uses Totem as off-hand. Cannot use swords (1H), wands, bows, or scythes.'
        },
        necromancer: {
            label: 'Necromancer',
            equipSlots: 10,
            allowed: [
                '1h-sword', '1h-dagger', '1h-wand', '1h-scythe',
                '1h-axe', '1h-mace',
                '2h-scythe', '2h-sword', '2h-axe', '2h-mace'
            ],
            banned: ['bow', 'crossbow', 'glaive', 'quarterstaff', 'polearm', 'staff', 'flail'],
            offhand: ['focus', 'shield'],
            notes: 'Season 5+ can use All Maces & Axes. Only class that can use Scythes. Uses Focus or Shield as off-hand.'
        },
        rogue: {
            label: 'Rogue',
            equipSlots: 11, // 5 armor + 3 jewelry + 2 melee + 1 ranged
            allowed: [
                '1h-sword', '1h-dagger',
                'bow', 'crossbow'
            ],
            banned: ['axe', 'mace', 'flail', 'hammer', 'maul', 'staff', 'wand', 'scythe', '2h-sword', '2h-axe', 'glaive', 'quarterstaff', 'polearm'],
            offhand: [], // Rogue dual-wields or uses ranged
            notes: 'Melee: Dual-wield Swords/Daggers. Ranged: Bow/Crossbow. Cannot use axes, maces, 2H melee, staves, or wands.'
        },
        sorcerer: {
            label: 'Sorcerer',
            equipSlots: 10,
            allowed: [
                '1h-sword', '1h-wand', '1h-dagger', '1h-mace',
                '2h-staff'
            ],
            banned: ['axe', 'bow', 'crossbow', 'scythe', '2h-sword', '2h-axe', '2h-mace', 'hammer', 'flail', 'glaive', 'quarterstaff', 'polearm'],
            offhand: ['focus'],
            notes: 'Season 5+ can use 1H Swords and 1H Maces. Uses Staff (2H) or Wand+Focus. Cannot use axes, bows, 2H melee weapons.'
        },
        spiritborn: {
            label: 'Spiritborn',
            equipSlots: 9, // 5 armor + 3 jewelry + 1 two-handed
            allowed: [
                'glaive', 'quarterstaff'
            ],
            banned: ['sword', 'axe', 'mace', 'flail', 'dagger', 'wand', 'bow', 'crossbow', 'scythe', 'hammer', 'maul', 'staff', 'shield', 'focus', 'totem', 'polearm'],
            offhand: [], // Spiritborn only uses 2H Glaive or Quarterstaff
            notes: 'ONLY uses Glaives and Quarterstaves (both 2H). No 1H weapons, no off-hand. Most restricted weapon pool.'
        },
        paladin: {
            label: 'Paladin',
            equipSlots: 10,
            allowed: [
                '1h-sword', '1h-mace', '1h-flail',
                '2h-sword', '2h-mace', '2h-flail'
            ],
            banned: ['dagger', 'wand', 'bow', 'crossbow', 'staff', 'scythe', 'axe', 'glaive', 'quarterstaff', 'focus', 'totem', 'polearm'],
            offhand: ['shield'],
            notes: 'Uses Swords, Maces, and Flails (1H and 2H). Shield for off-hand. Cannot use daggers, wands, bows, staves, axes, or ranged weapons.'
        }
    },

    // =============================================
    // SHARED/UNIVERSAL EQUIPMENT
    // Items that multiple or all classes can equip
    // =============================================
    SHARED_EQUIPMENT: {
        // ALL classes share these armor + jewelry slots
        universal_armor: ['helm', 'chest', 'gloves', 'pants', 'boots'],
        universal_jewelry: ['amulet', 'ring'],

        // Weapons shared across specific class groups
        shared_weapons: {
            '1h-sword': ['barbarian', 'necromancer', 'rogue', 'sorcerer', 'paladin'],
            '1h-dagger': ['druid', 'necromancer', 'rogue', 'sorcerer'],
            '1h-mace': ['barbarian', 'druid', 'necromancer', 'sorcerer', 'paladin'],
            '1h-axe': ['barbarian', 'druid', 'necromancer'],
            '1h-wand': ['necromancer', 'sorcerer'],
            '1h-flail': ['barbarian', 'paladin'],
            '1h-scythe': ['necromancer'],
            '2h-sword': ['barbarian', 'druid', 'necromancer', 'paladin'],
            '2h-axe': ['barbarian', 'druid', 'necromancer'],
            '2h-mace': ['barbarian', 'druid', 'necromancer', 'paladin'],
            '2h-staff': ['druid', 'sorcerer'],
            '2h-polearm': ['barbarian', 'druid'],
            '2h-scythe': ['necromancer'],
            'bow': ['rogue'],
            'crossbow': ['rogue'],
            'glaive': ['spiritborn'],
            'quarterstaff': ['spiritborn'],
            '2h-flail': ['paladin'],
            'shield': ['necromancer', 'paladin'],
            'focus': ['necromancer', 'sorcerer'],
            'totem': ['druid']
        }
    },

    // =============================================
    // ITEM TYPE → SLOT MAPPING
    // Maps Gemini's detected "type" field to loadout slots
    // =============================================
    ITEM_TYPE_TO_SLOT: {
        // Armor (universal)
        'Helm': 'helm', 'Helmet': 'helm', 'Crown': 'helm', 'Cowl': 'helm',
        'Cap': 'helm', 'Hood': 'helm', 'Circlet': 'helm', 'Mask': 'helm', 'Veil': 'helm',

        'Chest Armor': 'chest', 'Chest': 'chest', 'Tunic': 'chest', 'Mail': 'chest',
        'Plate': 'chest', 'Robe': 'chest', 'Vest': 'chest', 'Cuirass': 'chest',
        'Body Armor': 'chest', 'Cage': 'chest',

        'Gloves': 'gloves', 'Gauntlets': 'gloves', 'Handguards': 'gloves',
        'Grips': 'gloves', 'Fists': 'gloves', 'Claws': 'gloves',

        'Pants': 'pants', 'Legs': 'pants', 'Breeches': 'pants', 'Trousers': 'pants',
        'Leggings': 'pants', 'Faulds': 'pants', 'Cuisses': 'pants',

        'Boots': 'boots', 'Shoes': 'boots', 'Treads': 'boots', 'Sabatons': 'boots',
        'Walkers': 'boots', 'Striders': 'boots', 'Greaves': 'boots',

        // Jewelry (universal)
        'Amulet': 'amulet', 'Necklace': 'amulet', 'Pendant': 'amulet',
        'Talisman': 'amulet', 'Periapt': 'amulet', 'Choker': 'amulet', 'Charm': 'amulet',
        'Ring': 'ring', 'Band': 'ring', 'Loop': 'ring', 'Signet': 'ring', 'Coil': 'ring',

        // 1H Weapons
        'Sword': '1h-weapon', 'One-Handed Sword': '1h-weapon',
        'Axe': '1h-weapon', 'One-Handed Axe': '1h-weapon',
        'Mace': '1h-weapon', 'One-Handed Mace': '1h-weapon',
        'Dagger': '1h-weapon',
        'Wand': '1h-weapon',
        'Flail': '1h-weapon', 'One-Handed Flail': '1h-weapon',
        'Scythe': '1h-weapon', 'One-Handed Scythe': '1h-weapon',

        // 2H Weapons
        'Two-Handed Sword': '2h-weapon', '2H Sword': '2h-weapon',
        'Two-Handed Axe': '2h-weapon', '2H Axe': '2h-weapon',
        'Two-Handed Mace': '2h-weapon', '2H Mace': '2h-weapon',
        'Two-Handed Scythe': '2h-weapon', '2H Scythe': '2h-weapon',
        'Two-Handed Flail': '2h-weapon', '2H Flail': '2h-weapon',
        'Staff': '2h-weapon',
        'Polearm': '2h-weapon',
        'Glaive': '2h-weapon',
        'Quarterstaff': '2h-weapon',
        'Maul': '2h-weapon', 'Hammer': '2h-weapon',

        // Ranged
        'Bow': 'ranged', 'Crossbow': 'ranged',

        // Off-Hand
        'Shield': 'offhand', 'Focus': 'offhand', 'Totem': 'offhand',
        'Off-Hand': 'offhand', 'Offhand': 'offhand'
    },

    // =============================================
    // WEAPON TYPE CLASSIFICATION
    // For determining which weapon "family" an item belongs to
    // Used by WEAPON_BANS validation
    // =============================================
    WEAPON_CLASSIFICATION: {
        'sword': '1h-sword',
        'one-handed sword': '1h-sword',
        'axe': '1h-axe',
        'one-handed axe': '1h-axe',
        'mace': '1h-mace',
        'one-handed mace': '1h-mace',
        'dagger': '1h-dagger',
        'wand': '1h-wand',
        'flail': '1h-flail',
        'one-handed flail': '1h-flail',
        'scythe': '1h-scythe',
        'one-handed scythe': '1h-scythe',
        'two-handed sword': '2h-sword',
        '2h sword': '2h-sword',
        'two-handed axe': '2h-axe',
        '2h axe': '2h-axe',
        'two-handed mace': '2h-mace',
        '2h mace': '2h-mace',
        'two-handed scythe': '2h-scythe',
        '2h scythe': '2h-scythe',
        'two-handed flail': '2h-flail',
        '2h flail': '2h-flail',
        'staff': '2h-staff',
        'polearm': '2h-polearm',
        'maul': '2h-mace',
        'hammer': '2h-mace',
        'glaive': 'glaive',
        'quarterstaff': 'quarterstaff',
        'bow': 'bow',
        'crossbow': 'crossbow',
        'shield': 'shield',
        'focus': 'focus',
        'totem': 'totem'
    },

    // =============================================
    // RARITY HIERARCHY
    // =============================================
    RARITY: {
        normal: { tier: 0, color: '#adadad', label: 'Normal' },
        magic: { tier: 1, color: '#6969ff', label: 'Magic' },
        rare: { tier: 2, color: '#ffff00', label: 'Rare' },
        legendary: { tier: 3, color: '#ff8000', label: 'Legendary' },
        unique: { tier: 4, color: '#c7b377', label: 'Unique' },
        mythic: { tier: 5, color: '#e770ff', label: 'Mythic' }
    },

    // =============================================
    // NOTABLE MYTHIC UNIQUES (Cross-Class or Class-Specific)
    // For identification assistance
    // =============================================
    MYTHIC_UNIQUES: [
        { name: 'Harlequin Crest', type: 'Helm', classes: ['all'], aka: 'Shako' },
        { name: 'Andariel\'s Visage', type: 'Helm', classes: ['all'] },
        { name: 'Doombringer', type: 'One-Handed Sword', classes: ['all'] },
        { name: 'The Grandfather', type: 'Two-Handed Sword', classes: ['all'] },
        { name: 'Ring of Starless Skies', type: 'Ring', classes: ['all'] },
        { name: 'Melted Heart of Selig', type: 'Amulet', classes: ['all'] },
        { name: 'Ahavarion Spear of Lycander', type: 'Staff', classes: ['druid', 'sorcerer'] },
        { name: 'Tyrael\'s Might', type: 'Chest Armor', classes: ['all'] },
        { name: 'Nesekem, The Herald', type: 'One-Handed Sword', classes: ['all'] },
        { name: 'Heir of Perdition', type: 'Two-Handed Mace', classes: ['barbarian', 'druid', 'necromancer', 'paladin'] },
        { name: 'Fractured Winterglass', type: 'Amulet', classes: ['sorcerer'] },
        { name: 'Soulbrand', type: 'Chest Armor', classes: ['all'] },
        { name: 'Earthbreaker', type: 'Two-Handed Mace', classes: ['barbarian', 'druid'] },
        { name: 'Resurrected Spirit', type: 'Glaive', classes: ['spiritborn'] },
        { name: 'Shroud of False Death', type: 'Chest Armor', classes: ['necromancer'] }
    ],

    // =============================================
    // HELPER: Check if a class can equip a weapon type
    // =============================================
    canClassEquip(className, weaponType) {
        const normalizedClass = className.toLowerCase();
        const normalizedWeapon = weaponType.toLowerCase();

        // Look up weapon classification
        const weaponFamily = this.WEAPON_CLASSIFICATION[normalizedWeapon];
        if (!weaponFamily) return true; // Unknown weapon type, allow by default

        const classData = this.CLASS_ALLOWED_WEAPONS[normalizedClass];
        if (!classData) return true; // Unknown class, allow by default

        // Check if weapon family is in allowed list
        return classData.allowed.includes(weaponFamily) ||
               classData.offhand.includes(weaponFamily);
    },

    // =============================================
    // HELPER: Get all classes that can use a weapon type
    // =============================================
    getClassesForWeapon(weaponType) {
        const normalizedWeapon = weaponType.toLowerCase();
        const weaponFamily = this.WEAPON_CLASSIFICATION[normalizedWeapon];
        if (!weaponFamily) return [];

        return Object.entries(this.CLASS_ALLOWED_WEAPONS)
            .filter(([_, data]) =>
                data.allowed.includes(weaponFamily) ||
                data.offhand.includes(weaponFamily)
            )
            .map(([className]) => className);
    },

    // =============================================
    // HELPER: Detect slot from item type string
    // =============================================
    detectSlotFromType(itemType) {
        if (!itemType) return 'unknown';
        // Try exact match first
        const exact = this.ITEM_TYPE_TO_SLOT[itemType];
        if (exact) return exact;

        // Try case-insensitive match
        const lower = itemType.toLowerCase();
        for (const [key, slot] of Object.entries(this.ITEM_TYPE_TO_SLOT)) {
            if (key.toLowerCase() === lower) return slot;
        }

        // Try partial match
        for (const [key, slot] of Object.entries(this.ITEM_TYPE_TO_SLOT)) {
            if (lower.includes(key.toLowerCase())) return slot;
        }

        return 'unknown';
    }
};

// Make available globally
if (typeof window !== 'undefined') {
    window.D4_ITEM_DATA = D4_ITEM_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { D4_ITEM_DATA };
}