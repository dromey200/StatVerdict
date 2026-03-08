// ============================================
// CLASS DATA — Diablo IV Season 12
// "Season of Slaughter" (Patch 2.6.0)
// Builds, mechanics, seasonal synergies, and
// Runeword socket economy per class.
// Includes Warlock scaffolding (Lord of Hatred).
// ============================================

// ──────────────────────────────────────────
// BLOODIED AFFIX TAXONOMY
// Rampage = Armor affixes tied to killstreak scaling
// Feast   = Weapon affixes tied to rapid clear speed
// Hunger  = Accessory affixes tied to resource drain mechanics
// ──────────────────────────────────────────
export type BloodiedCategory = 'Rampage' | 'Feast' | 'Hunger';

// ──────────────────────────────────────────
// CORE INTERFACE
// ──────────────────────────────────────────
export interface ClassData {
  id: string;
  name: string;
  builds: string[];
  mechanics: string[];

  /**
   * Season 12 killstreak/momentum mechanics.
   * Describes how this class interacts with the
   * Slaughter Meter and Killstreak multiplier system.
   */
  seasonalSynergies?: string;

  /**
   * Maps preferred Ritual/Invocation Rune pairs to this class.
   * Format: "RitualRune + InvocationRune → Effect description"
   * Only populated for classes with strong Runeword end-game paths.
   */
  supportedRunewords?: string;

  /**
   * Per-class weighting for Bloodied item affixes.
   * Values represent relative scoring multipliers applied
   * during item evaluation when a "Bloodied" tag is detected.
   * Higher weight = affix is more valuable for this class.
   */
  bloodiedAffixWeights?: Record<BloodiedCategory, number>;
}

// ──────────────────────────────────────────
// SEASONAL BASELINE (shared across all classes)
// Injected into every class seasonalSynergies field.
// ──────────────────────────────────────────
const SEASONAL_BASELINE =
  'Slaughter Meter fills with rapid kills, granting stacking Killstreak multipliers (up to 10x). ' +
  'Bloodied items scale dynamically with active Killstreak tier. ' +
  'The Butcher may spawn in Slaughterhouse events — class skills are DISABLED during Butcher Transformation.';

// ──────────────────────────────────────────
// CLASS DATA ARRAY
// ──────────────────────────────────────────
export const CLASS_DATA: ClassData[] = [
  {
    id: 'any',
    name: 'Any Class',
    builds: [],
    mechanics: [],
    seasonalSynergies: SEASONAL_BASELINE,
  },

  // ── BARBARIAN ──────────────────────────
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
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Barbarian Berserking synergizes with Killstreak multipliers — extended Berserk windows amplify Slaughter Meter gain.',
    // Stationary / core-heavy builds (HotA, Pulverize equivalent):
    // Lith provides Cast Speed → faster HotA casts per Killstreak window
    // Tam provides Cooldown Reduction → tighter Wrath of the Berserker cycling
    supportedRunewords:
      'Lith (Ritual) + Tam (Invocation) → Cast/Attack Speed + CDR for HotA and Earthquake stationary builds.',
    bloodiedAffixWeights: {
      Rampage: 1.6, // Armor kill-momentum affixes highly valued for survivability in melee
      Feast: 1.4,   // Weapon DPS affixes boost Fury dump skills
      Hunger: 0.9,  // Resource drain affixes less impactful; Barbarian self-generates Fury
    },
  },

  // ── DRUID ──────────────────────────────
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
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Druid Shapeshifting transitions reset Slaughter Meter momentum windows — plan form-swaps around Killstreak expiry.',
    // Pulverize is stationary/core-heavy:
    // Lith + Tam mirrors HotA Barbarian logic for grounded melee builds
    supportedRunewords:
      'Lith (Ritual) + Tam (Invocation) → Cast Speed + CDR for Pulverize and Werebear stationary builds.',
    bloodiedAffixWeights: {
      Rampage: 1.5,
      Feast: 1.2,
      Hunger: 1.1, // Spirit drain mechanics make Hunger slightly relevant
    },
  },

  // ── NECROMANCER ────────────────────────
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
    // Season 12 class-specific append:
    // Minion deaths during Butcher events now seed Corpse economy passively
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Necromancer Minion deaths during Slaughterhouse events generate bonus Corpses, fueling Corpse Explosion chains. ' +
      'Blood Orb pickup during active Killstreaks grants stacking Overpower bonus.',
    // Necromancer has no strong Runeword path in 2.6.0 meta; omitted intentionally
    bloodiedAffixWeights: {
      Rampage: 1.1,
      Feast: 1.3,
      Hunger: 1.7, // Essence drain mechanics heavily rewarded; Hunger affixes directly extend Essence pools
    },
  },

  // ── PALADIN ────────────────────────────
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
    // Season 12 class-specific append:
    // Consecrated Ground interacts with Slaughter Meter — enemies killed on holy ground
    // contribute double kills to the Killstreak counter
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Paladin Consecrated Ground amplifies Slaughter Meter fill rate — enemies killed within Consecrated zones count as double kills for Killstreak progression. ' +
      'Angelic Form (Disciple) grants immunity to Butcher stagger during Transformation events.',
    // Paladin has no Runeword priority in 2.6.0 meta; holy auras fill the utility role
    bloodiedAffixWeights: {
      Rampage: 1.8, // Block/armor affixes compound with Juggernaut passive mitigation
      Feast: 1.2,
      Hunger: 0.8, // Faith generates passively; Hunger drain affixes provide minimal value
    },
  },

  // ── ROGUE ──────────────────────────────
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
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Rogue high-mobility builds are natural Slaughter Meter accelerators — chaining packs with Dash resets maintains Killstreak without downtime.',
    // High-mobility class: Bac + Moni Ritual Runes
    // Bac provides movement/attack reset on kill
    // Moni provides Lucky Hit proc amplification
    supportedRunewords:
      'Bac (Ritual) + Moni (Invocation) → On-kill movement reset + Lucky Hit amplification for Twisting Blades and Rapid Fire mobile builds.',
    bloodiedAffixWeights: {
      Rampage: 1.1,
      Feast: 1.9, // Weapon attack speed affixes critical for maintaining energy and Combo Point cycling
      Hunger: 1.4, // Energy drain affixes manageable; Lucky Hit procs partially offset cost
    },
  },

  // ── SORCERER ───────────────────────────
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
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Sorcerer AOE spells (Blizzard, Firewall, Meteor) generate rapid multi-kill ticks that efficiently fill the Slaughter Meter; chain packs for sustained Killstreak.',
    // Sorcerer has no strong Runeword priority in 2.6.0 meta
    bloodiedAffixWeights: {
      Rampage: 1.0,
      Feast: 1.3,
      Hunger: 1.6, // Mana pool management critical; Hunger affixes that restore Mana on kill are valuable
    },
  },

  // ── SPIRITBORN ─────────────────────────
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
      'Vanguard (High-Mobility)',
    ],
    mechanics: [
      'Vigor Generation',
      'Critical Strike',
      'Dodge Chance',
      'Barrier Generation',
      'Resolve Stacks',
    ],
    // Season 12 class-specific append:
    // Spiritborn Spirit Hall passives interact with Killstreak tiers —
    // each active Spirit Guardian grants a separate Slaughter Meter bonus
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Spiritborn Spirit Hall passives grant per-Guardian Slaughter Meter bonuses — activating all four Spirit Guardians simultaneously provides a 4x passive fill-rate multiplier during Killstreak windows.',
    // Vanguard Spiritborn = high-mobility: Bac + Moni
    // Gorilla Tank = stationary/core-heavy: Lith + Tam
    supportedRunewords:
      'Vanguard builds: Bac (Ritual) + Moni (Invocation) → On-kill mobility + Lucky Hit for Jaguar Rush and Eagle Evade. ' +
      'Gorilla Tank builds: Lith (Ritual) + Tam (Invocation) → Cast Speed + CDR for sustained Resolve Stack uptime.',
    bloodiedAffixWeights: {
      Rampage: 1.4,
      Feast: 1.5,
      Hunger: 1.3, // Vigor drain offset by passive Spirit Guardian generation
    },
  },

  // ── WARLOCK ────────────────────────────
  // Lord of Hatred Expansion — data scaffolding
  // NOTE: Warlock is not yet live. These entries represent
  // pre-release design targets based on expansion previews.
  // Weights and runewords should be validated at launch.
  // ──────────────────────────────────────
  {
    id: 'warlock',
    name: 'Warlock',
    builds: [
      'Pact of Ruin (Chaos DoT)',
      'Torment Weaver (Debuff Stacking)',
      'Soul Shatter (Burst Execute)',
      'Infernal Pact (Summon/Minion Hybrid)',
      'Dread Sigil (Curse-Based)',
    ],
    mechanics: [
      'Pact Resource Generation',
      'Curse Application',
      'Soul Fragment Consumption',
      'Chaos Damage',
      'Demonic Empowerment',
      'Ritual Sacrifice (Self-Damage for Power)',
      'Fear/Taunt Debuffs',
    ],
    // Warlock is inherently a Slaughter Meter accelerator via curse spread chains
    seasonalSynergies:
      SEASONAL_BASELINE +
      ' Warlock Curse chains propagate on kill, causing each death to curse nearby enemies and accelerate Slaughter Meter fill. ' +
      'Pact Resource is fueled by rapid kills — Killstreak tiers above 5x grant bonus Pact generation per second. ' +
      'Soul Shatter execute threshold lowers during active Butcher events.',
    // Warlock anticipated Runeword paths (subject to change at launch)
    supportedRunewords:
      'Bac (Ritual) + Moni (Invocation) → Curse-on-kill mobility chain for Pact of Ruin builds. ' +
      'Lith (Ritual) + Tam (Invocation) → CDR for Dread Sigil and Torment Weaver channel-heavy builds.',
    bloodiedAffixWeights: {
      Rampage: 1.2,
      Feast: 1.6,  // Chaos weapon affixes scale directly with Pact dump skills
      Hunger: 2.0, // Ritual Sacrifice self-damage mechanic makes Hunger (resource drain) affixes uniquely powerful
    },
  },
];

// ──────────────────────────────────────────
// BUILD FOCUSES
// Universal options shared across all classes.
// "Slaughterhouse / Butcher Transformation" is a Season 12 addition.
// ──────────────────────────────────────────
export const BUILD_FOCUSES = [
  { id: 'balanced',     name: 'Balanced' },
  { id: 'damage',       name: 'Max Damage' },
  { id: 'survivability', name: 'Survivability' },
  { id: 'speed',        name: 'Speed Farming' },
  { id: 'pit',          name: 'Pit Pushing' },
  { id: 'pvp',          name: 'PvP' },
  {
    id: 'slaughterhouse',
    name: 'Slaughterhouse / Butcher Transformation',
    // LOGIC HOOK (consumed by gemini.ts):
    // When this focus is active:
    //   - DEPRIORITIZE all class-specific skill ranks (e.g., +Ranks to Twisting Blades)
    //     because class skills are DISABLED during The Butcher transformation.
    //   - Apply 2.0x weight multiplier to the following UNIVERSAL raw stats:
    //       • Movement Speed
    //       • Attack Speed
    //       • Maximum Life %
    //       • Universal Damage Reduction (any source)
    //   - These four stats remain active and scale even when class skills are locked out.
  },
] as const;

// Derive the union type from the const array for type-safe focus ID usage
export type BuildFocusId = (typeof BUILD_FOCUSES)[number]['id'];
