// ============================================
// CLASS DATA — Diablo IV Season 11
// Builds, mechanics, and focus options per class
// ============================================

export interface ClassData {
  id: string;
  name: string;
  builds: string[];
  mechanics: string[];
}

export const CLASS_DATA: ClassData[] = [
  {
    id: 'any',
    name: 'Any Class',
    builds: [],
    mechanics: [],
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
      'Earthquake',
    ],
    mechanics: [
      'Thorns Build',
      'Overpower Stack',
      'Berserking Uptime',
      'Bleed Damage',
      'Fortify Generation',
      'Fury Generation',
    ],
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
      'Hurricane',
    ],
    mechanics: [
      'Overpower Stack',
      'Spirit Generation',
      'Fortify Generation',
      'Nature Magic Damage',
      'Shapeshifting',
      'Companion Damage',
    ],
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
      'Blight',
    ],
    mechanics: [
      'Minion Only',
      'Blood Orb Generation',
      'Overpower Stack',
      'Essence Generation',
      'Corpse Consumption',
      'Shadow Damage',
    ],
  },
  {
    id: 'paladin',
    name: 'Paladin',
    builds: [
      'Juggernaut (Shield Tank)',
      'Zealot (Melee DPS)',
      'Judicator (Holy Conjuration)',
      'Disciple (Angelic Form)',
    ],
    mechanics: [
      'Block Chance',
      'Holy Damage',
      'Fortify Generation',
      'Auras',
      'Divine Wrath',
      'Consecrated Ground',
      'Faith Generation',
    ],
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
      'Flurry',
    ],
    mechanics: [
      'Critical Strike',
      'Vulnerable Damage',
      'Lucky Hit',
      'Energy Generation',
      'Shadow Imbuement',
      'Combo Points',
    ],
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
      'Blizzard',
    ],
    mechanics: [
      'Critical Strike',
      'Lucky Hit',
      'Mana Generation',
      'Cooldown Reduction',
      'Barrier Generation',
      'Crackling Energy',
    ],
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
      'The Seeker',
    ],
    mechanics: [
      'Vigor Generation',
      'Critical Strike',
      'Dodge Chance',
      'Barrier Generation',
      'Resolve Stacks',
    ],
  },
];

// Common build focus options (same for all classes)
export const BUILD_FOCUSES = [
  { id: 'balanced', name: 'Balanced' },
  { id: 'damage', name: 'Max Damage' },
  { id: 'survivability', name: 'Survivability' },
  { id: 'speed', name: 'Speed Farming' },
  { id: 'pit', name: 'Pit Pushing' },
  { id: 'pvp', name: 'PvP' },
];
