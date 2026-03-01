// ====================================
// HORADRIC AI - APP ENGINE  
// Version: 12.0.0 (Season 11 / Accurate Class-Weapon System + Any Class Support)
// ====================================

const HoradricApp = {
    state: {
        history: [],
        currentItem: null,
        mode: 'identify',
        currentClass: 'barbarian',  // NEW: Track current class
        loadout: {},  // CHANGED: Dynamic loadout object
        scanQuota: { remaining: null, limit: null },  // Track server-side rate limits
        phase: 'idle'  // UI State Machine: idle | processing | result
    },
    
    // NEW: CLASS-SPECIFIC SLOT CONFIGURATIONS
    CLASS_SLOTS: {
        any: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'mainHand', icon: '🗡️', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '🛡️', name: 'Off-Hand', category: 'weapon' }
        ],
        barbarian: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: '2hBludgeoning', icon: '🔨', name: '2H Bludgeoning', category: 'weapon' },
            { id: '2hSlashing', icon: '⚔️', name: '2H Slashing', category: 'weapon' },
            { id: 'mainHand', icon: '🗡️', name: 'Dual Wield MH', category: 'weapon' },
            { id: 'offHand', icon: '🗡️', name: 'Dual Wield OH', category: 'weapon' }
        ],
        druid: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'mainHand', icon: '🗡️', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '🔮', name: 'Off-Hand', category: 'weapon' }
        ],
        necromancer: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'mainHand', icon: '💀', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '📖', name: 'Off-Hand', category: 'weapon' }
        ],
        paladin: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'mainHand', icon: '⚔️', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '🛡️', name: 'Shield', category: 'weapon' }
        ],
        rogue: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'ranged', icon: '🏹', name: 'Ranged', category: 'weapon' },
            { id: 'mainHand', icon: '🗡️', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '🗡️', name: 'Off-Hand', category: 'weapon' }
        ],
        sorcerer: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'mainHand', icon: '🗡️', name: 'Main Hand', category: 'weapon' },
            { id: 'offHand', icon: '🔮', name: 'Off-Hand', category: 'weapon' }
        ],
        spiritborn: [
            { id: 'helm', icon: '👑', name: 'Helm', category: 'armor' },
            { id: 'chest', icon: '🛡️', name: 'Chest', category: 'armor' },
            { id: 'gloves', icon: '🧤', name: 'Gloves', category: 'armor' },
            { id: 'pants', icon: '👖', name: 'Pants', category: 'armor' },
            { id: 'boots', icon: '👢', name: 'Boots', category: 'armor' },
            { id: 'amulet', icon: '📿', name: 'Amulet', category: 'jewelry' },
            { id: 'ring1', icon: '💍', name: 'Ring 1', category: 'jewelry' },
            { id: 'ring2', icon: '💍', name: 'Ring 2', category: 'jewelry' },
            { id: 'twoHanded', icon: '🗡️', name: 'Two-Handed', category: 'weapon' }
        ]
    },
    
    // UPDATED: Slot type mappings (Season 11 accuracy update)
    SLOT_KEYWORDS: {
        helm: ['helm', 'helmet', 'crown', 'cowl', 'cap', 'hood', 'circlet', 'mask', 'veil'],
        chest: ['chest armor', 'chest', 'tunic', 'mail', 'plate', 'robe', 'vest', 'cuirass', 'body armor', 'cage'],
        gloves: ['gloves', 'gauntlets', 'handguards', 'grips', 'fists', 'claws'],
        pants: ['pants', 'legs', 'breeches', 'trousers', 'leggings', 'faulds', 'cuisses'], 
        boots: ['boots', 'shoes', 'treads', 'sabatons', 'footwear', 'walkers', 'striders', 'greaves'], 
        amulet: ['amulet', 'necklace', 'pendant', 'talisman', 'periapt', 'choker', 'charm'],
        ring: ['ring', 'band', 'loop', 'signet', 'coil'],
        
        // Weapon Slots - Rogue ranged
        ranged: ['bow', 'crossbow'],
        
        // Barbarian-specific 2H categories
        '2hBludgeoning': ['two-handed mace', '2h mace', 'maul', 'two-handed flail', '2h flail'],
        '2hSlashing': ['two-handed sword', '2h sword', 'two-handed axe', '2h axe'],
        
        // Spiritborn-specific 2H
        twoHanded: ['glaive', 'quarterstaff', 'two-hand'],

        // Generic 1H weapons
        mainHand: ['sword', 'axe', 'dagger', 'wand', 'mace', 'flail', 'scythe', 'one-handed'],
        
        // Off-hand items
        offHand: ['shield', 'focus', 'totem', 'off-hand', 'offhand'],
        
        // 2H weapons that go in mainHand for non-Arsenal classes
        '2hGeneric': ['staff', 'polearm', 'two-handed scythe', '2h scythe']
    },
    
    el: {},
    
    init() {
        // Check if CONFIG and PROMPT_TEMPLATES are loaded
        if (typeof CONFIG === 'undefined' || typeof PROMPT_TEMPLATES === 'undefined') {
            console.error('CONFIG or PROMPT_TEMPLATES not loaded. Waiting...');
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.cacheElements();
        this.loadState();
        this.initPreferences();
        // DISABLED: Loadout is a premium feature
        // this.initializeLoadout();
        this.attachEventListeners();
        this.updateGameSelector();
        this.updateClassOptions();
        
        // Set initial UI phase
        this.setPhase('idle');
        
        // Rating guide toggle
        const ratingToggle = document.getElementById('rating-guide-toggle');
        if (ratingToggle) {
            ratingToggle.addEventListener('click', () => {
                const guide = document.getElementById('rating-guide');
                if (guide) guide.style.display = guide.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        console.log('👁️ Horadric Pipeline Active (Season 11 Class-Weapon System v12.0)');
    },
    
    cacheElements() {
        this.el.gameVersion = document.getElementById('game-version');
        this.el.playerClass = document.getElementById('player-class');
        this.el.buildStyle = document.getElementById('build-style');
        this.el.imageUpload = document.getElementById('image-upload');
        this.el.imagePreview = document.getElementById('image-preview');
        this.el.uploadZone = document.getElementById('upload-zone');
        this.el.toggleAdvanced = document.getElementById('toggle-advanced');
        this.el.advancedPanel = document.getElementById('advanced-panel');
        this.el.keyMechanic = document.getElementById('key-mechanic');
        this.el.needsStr = document.getElementById('need-str');
        this.el.needsInt = document.getElementById('need-int');
        this.el.needsWill = document.getElementById('need-will');
        this.el.needsDex = document.getElementById('need-dex');
        this.el.needsRes = document.getElementById('need-res');
        this.el.resultArea = document.getElementById('result-area');
        this.el.resultsCard = document.getElementById('results-card');
        this.el.loading = document.getElementById('loading');
        this.el.imageError = document.getElementById('image-error');
        this.el.historyList = document.getElementById('history-list');
        this.el.scanCount = document.getElementById('scan-count');
        this.el.settingsPanel = document.getElementById('settings-panel');
        this.el.settingsOverlay = document.querySelector('.settings-overlay');
        this.el.priceSection = document.getElementById('price-section');
        this.el.priceContent = document.getElementById('price-content');
        this.el.analyzeBtn = document.getElementById('analyze-btn');
        this.el.compareBtn = document.getElementById('compare-btn');
        this.el.settingsTrigger = document.getElementById('settings-trigger');
        this.el.settingsClose = document.getElementById('settings-close');
        this.el.helpTrigger = document.getElementById('help-trigger');
        this.el.demoBtn = document.getElementById('demo-btn');
        this.el.clearHistory = document.getElementById('clear-history');
        this.el.closeResults = document.getElementById('close-results');
        this.el.shareBtn = document.getElementById('share-btn');
        this.el.priceCheckBtn = document.getElementById('price-check-btn');
        this.el.searchTradeBtn = document.getElementById('search-trade-btn');
        this.el.toast = document.getElementById('toast');
        this.el.loadoutGrid = document.getElementById('loadout-grid');
        this.el.buildSynergy = document.getElementById('build-synergy');
        this.el.unsupportedOverlay = document.getElementById('unsupported-overlay');
        this.el.unsupportedMessage = document.getElementById('unsupported-message');
        this.setupDragDrop();
    },

    attachEventListeners() {
        // Game is fixed to D4 — no change listener needed
        
        // Delegated listener for dynamically-created "New Scan" buttons (CSP-safe)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-reset-scan')) {
                this.resetScan();
            }
        });
        
        // UPDATED: Class change listener — also shows advanced options
        this.el.playerClass.addEventListener('change', () => {
            const selectedClass = this.el.playerClass.value.toLowerCase();
            this.state.currentClass = selectedClass;
            this.saveState();
            this.updateBuildOptions();
            
            // Show/hide advanced options based on class selection
            if (selectedClass && selectedClass !== 'any') {
                this.el.toggleAdvanced.style.display = '';
            } else {
                this.el.toggleAdvanced.style.display = 'none';
                if (this.el.advancedPanel) { this.el.advancedPanel.classList.add('h-hidden'); this.el.advancedPanel.style.display = 'none'; }
            }
        });
        this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());
        this.el.analyzeBtn.addEventListener('click', () => { this.clearDemoState(); this.state.mode = 'identify'; this.handleAnalyze(); });
        this.el.compareBtn.addEventListener('click', () => { this.clearDemoState(); this.state.mode = 'compare'; this.handleAnalyze(); });
        this.el.demoBtn.addEventListener('click', () => this.runDemo());
        this.el.settingsTrigger.addEventListener('click', () => this.openSettings());
        this.el.settingsClose.addEventListener('click', () => this.closeSettings());
        this.el.settingsOverlay.addEventListener('click', () => this.closeSettings());
        this.el.helpTrigger.addEventListener('click', () => this.restartTour());
        this.el.closeResults.addEventListener('click', () => this.closeResults());
        this.el.clearHistory.addEventListener('click', () => this.clearHistory());
        if(this.el.shareBtn) this.el.shareBtn.addEventListener('click', () => this.shareResults());
        if(this.el.priceCheckBtn) this.el.priceCheckBtn.addEventListener('click', () => this.checkPrice());
        if(this.el.searchTradeBtn) this.el.searchTradeBtn.addEventListener('click', () => this.searchTrade());
        // DISABLED: Loadout synergy listener
        // if(this.el.keyMechanic) this.el.keyMechanic.addEventListener('change', () => this.updateBuildSynergy());
        
        // DISABLED: Loadout button
        // const clearLoadoutBtn = document.getElementById('clear-loadout-btn');
        // if(clearLoadoutBtn) clearLoadoutBtn.addEventListener('click', () => this.clearAllSlots());
        
        // Hide advanced options until class is selected
        const currentClass = this.el.playerClass.value.toLowerCase();
        if (!currentClass || currentClass === 'any') {
            this.el.toggleAdvanced.style.display = 'none';
        }
        
        this.setupDragDrop();
    },

    setupDragDrop() {
        const zone = this.el.uploadZone;
        if (!zone) return;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
            zone.addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); });
        });
        zone.addEventListener('dragover', () => zone.classList.add('drag-over'));
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.el.imageUpload.files = e.dataTransfer.files;
                this.handleFileSelect({ target: this.el.imageUpload });
            }
        });
    },

    // Game is hardcoded to D4 — these are kept as safe no-ops
    updateGameSelector() {},
    handleGameChange() {},

    showUnsupportedOverlay() {},
    hideUnsupportedOverlay() {},

    updateClassOptions() {
        const classes = CONFIG.GAME_CLASSES.d4;
        
        this.el.playerClass.innerHTML = '';
        classes.forEach(cls => {
            const opt = document.createElement('option');
            opt.value = cls.id;
            opt.textContent = cls.name;
            this.el.playerClass.appendChild(opt);
        });
        this.updateBuildOptions();
    },

    updateBuildOptions() {
        const classId = this.el.playerClass.value;
        const classes = CONFIG.GAME_CLASSES.d4;
        const classDef = classes.find(c => c.id === classId);
        
        if (!classDef) return;
        
        if (this.el.buildStyle) {
            this.el.buildStyle.innerHTML = '<option value="">None</option>';
            classDef.builds.forEach(build => {
                const opt = document.createElement('option');
                opt.value = build;
                opt.textContent = build;
                this.el.buildStyle.appendChild(opt);
            });
        }
        if (this.el.keyMechanic) {
            this.el.keyMechanic.innerHTML = '<option value="">None</option>';
            if (classDef.mechanics) {
                classDef.mechanics.forEach(mech => {
                    const opt = document.createElement('option');
                    opt.value = mech;
                    opt.textContent = mech;
                    this.el.keyMechanic.appendChild(opt);
                });
            }
        }
    },

    // ============================================
    // SLOT-BASED LOADOUT SYSTEM
    // ============================================

    // NEW: Initialize loadout from localStorage
    initializeLoadout() {
        const savedLoadout = localStorage.getItem('sv_loadout');
        if (savedLoadout) {
            try {
                this.state.loadout = JSON.parse(savedLoadout);
            } catch (e) {
                console.error('Error loading loadout:', e);
                this.state.loadout = {};
            }
        } else {
            this.state.loadout = {};
        }
        
        // Set current class from dropdown or localStorage
        const savedClass = localStorage.getItem('sv_current_class');
        if (savedClass) {
            this.state.currentClass = savedClass;
        } else if (this.el.playerClass && this.el.playerClass.value) {
            this.state.currentClass = this.el.playerClass.value.toLowerCase();
        } else {
            this.state.currentClass = 'barbarian';
        }
    },
    
    // UPDATED: Save entire loadout object
    saveLoadout() {
        localStorage.setItem('sv_loadout', JSON.stringify(this.state.loadout));
        localStorage.setItem('sv_current_class', this.state.currentClass);
    },
    
    // UPDATED: Save individual slot
    saveSlot(slot, itemData) {
        this.state.loadout[slot] = itemData;
        this.saveLoadout();
    },
    
    // UPDATED: Clear individual slot
    clearSlot(slot) {
        delete this.state.loadout[slot];
        this.saveLoadout();
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
        this.showToast(`🗑️ ${this.formatSlotName(slot)} cleared.`);
    },
    
    // UPDATED: Clear all slots
    clearAllSlots() {
        if (!confirm('Are you sure you want to clear your entire loadout?')) return;
        
        this.state.loadout = {};
        this.saveLoadout();
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
        this.showToast('🗑️ All loadout slots cleared.');
    },

    saveState() {
        localStorage.setItem('horadric_state', JSON.stringify(this.state));
    },

    // UPDATED: Detect item slot with Strict Class Weapon Validation
    detectItemSlot(result) {
        // 1. Only search Title and Type (Ignore Analysis to prevent false positives)
        const searchText = `${result.title} ${result.type}`.toLowerCase();
        
        // 2. Skip weapon bans for 'any' class
        if (this.state.currentClass !== 'any') {
            // Define Strict Weapon Bans per Class (Post-Season 5+ rules)
            // IMPORTANT: These have been updated to reflect weapon restriction changes:
            //  - Sorcerer CAN use 1H Swords and 1H Maces (Season 5+)
            //  - Druid CAN use Polearms, 2H Swords, and Daggers (Season 5+)
            //  - Necromancer CAN use All Maces & Axes (Season 5+)
            const WEAPON_BANS = {
                barbarian: ['dagger', 'wand', 'staff', 'focus', 'totem', 'bow', 'crossbow', 'glaive', 'quarterstaff', 'scythe', 'shield'],
                druid: ['wand', 'bow', 'crossbow', 'glaive', 'quarterstaff', 'scythe', 'flail', 'focus', 'shield'],
                necromancer: ['bow', 'crossbow', 'glaive', 'quarterstaff', 'polearm', 'staff', 'flail', 'totem'],
                rogue: ['axe', 'mace', 'flail', 'hammer', 'maul', 'shield', 'two-handed sword', '2h sword', 'glaive', 'quarterstaff', 'staff', 'wand', 'scythe', 'focus', 'totem', 'polearm'],
                sorcerer: ['axe', 'bow', 'crossbow', 'two-handed sword', '2h sword', 'two-handed axe', '2h axe', 'two-handed mace', '2h mace', 'hammer', 'flail', 'glaive', 'quarterstaff', 'polearm', 'scythe', 'totem', 'shield'],
                spiritborn: ['sword', 'axe', 'mace', 'flail', 'dagger', 'wand', 'shield', 'bow', 'crossbow', 'hammer', 'maul', 'scythe', 'focus', 'totem', 'staff', 'polearm'],
                paladin: ['dagger', 'wand', 'bow', 'crossbow', 'staff', 'focus', 'totem', 'quarterstaff', 'glaive', 'axe', 'scythe', 'polearm']
            };

            // 3. Check for Banned Items
            const bans = WEAPON_BANS[this.state.currentClass];
            if (bans) {
                const isBanned = bans.some(ban => searchText.includes(ban));
                if (isBanned) {
                    console.log(`Item blocked by class restriction: ${this.state.currentClass} cannot use this.`);
                    return 'unknown';
                }
            }
        }

        const currentSlots = this.CLASS_SLOTS[this.state.currentClass] || this.CLASS_SLOTS.barbarian;
        
        // 4. Check for Ring (Strict "Whole Word" match)
        const isRing = this.SLOT_KEYWORDS.ring.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(searchText);
        });

        if (isRing) {
            if (currentSlots.find(s => s.id === 'ring1')) {
                return null; // Trigger ring selection modal
            }
        }
        
        // 5. Check each slot type for the current class
        for (const slot of currentSlots) {
            const keywords = this.SLOT_KEYWORDS[slot.id];
            if (keywords && keywords.some(keyword => searchText.includes(keyword))) {
                return slot.id;
            }
        }
        
        // 6. Fallback: Check standard slots
        const standardSlots = ['helm', 'chest', 'gloves', 'pants', 'boots', 'amulet'];
        for (const slotName of standardSlots) {
            const keywords = this.SLOT_KEYWORDS[slotName];
            if (keywords && keywords.some(keyword => searchText.includes(keyword))) {
                if (currentSlots.find(s => s.id === slotName)) {
                    return slotName;
                }
            }
        }
        
        // 7. Weapon Fallbacks (Main Hand / Off Hand)
        const hasMainHand = currentSlots.find(s => s.id === 'mainHand');
        const hasOffHand = currentSlots.find(s => s.id === 'offHand');
        
        // Check for 2H generic weapons (Staff, Polearm, 2H Scythe) that route to mainHand for non-Barbarian classes
        if (hasMainHand && this.SLOT_KEYWORDS['2hGeneric'] && 
            this.SLOT_KEYWORDS['2hGeneric'].some(keyword => searchText.includes(keyword))) {
            return 'mainHand';
        }
        
        // Check Offhand first (Shields, Focus, Totems)
        if (hasOffHand && this.SLOT_KEYWORDS.offHand.some(keyword => searchText.includes(keyword))) {
            return 'offHand';
        }
        
        // Check Mainhand last (Generic Weapons)
        if (hasMainHand && this.SLOT_KEYWORDS.mainHand.some(keyword => searchText.includes(keyword))) {
            return 'mainHand';
        }
        
        return 'unknown';
    },

    // UPDATED: Equip item with class-specific logic + context-aware UI
    equipItem(result) {
        const slot = this.detectItemSlot(result);
        
        if (slot === 'unknown') {
            this.showToast('⚠️ This item cannot be equipped by your current class.', 'error');
            return;
        }
        
        // Ring selection
        if (slot === null) {
            this.showRingSelectionModal(result);
            return;
        }
        
        // Check if equipping a two-handed weapon for hybrid classes
        const searchText = `${result.title} ${result.type} ${result.analysis}`.toLowerCase();
        const isTwoHandedWeapon = this.SLOT_KEYWORDS.twoHanded.some(keyword => searchText.includes(keyword)) ||
                                  slot === 'twoHanded' || 
                                  slot === '2hBludgeoning' || 
                                  slot === '2hSlashing';
        
        const hybridClasses = ['paladin', 'sorcerer', 'druid', 'necromancer'];
        const existingItem = this.state.loadout[slot];
        
        // If slot is empty, equip directly with appropriate toast
        if (!existingItem) {
            if (hybridClasses.includes(this.state.currentClass) && isTwoHandedWeapon && 
                (slot === 'mainHand' || slot === 'twoHanded')) {
                this.equipToSlot(slot, result, true);
                if (this.state.loadout.offHand) {
                    this.clearSlot('offHand');
                    this.showToast(`⚔️ ${result.title} equipped to ${this.formatSlotName(slot)}. Off-hand cleared (2H weapon).`);
                } else {
                    this.showToast(`⚔️ ${result.title} equipped to ${this.formatSlotName(slot)}!`);
                }
            } else {
                this.equipToSlot(slot, result, isTwoHandedWeapon);
                this.showToast(`⚔️ ${result.title} equipped to ${this.formatSlotName(slot)}!`);
            }
            return;
        }
        
        // Slot occupied — show replacement confirmation modal
        this.showReplaceConfirmModal(slot, result, existingItem, isTwoHandedWeapon);
    },

    // Replacement confirmation modal with synergy impact warning
    showReplaceConfirmModal(slot, newItem, existingItem, isTwoHanded) {
        const modal = document.createElement('div');
        modal.className = 'h-modal-overlay';
        modal.style.display = 'flex';
        
        const existingColor = this.getRarityColor(existingItem.rarity);
        const newColor = this.getRarityColor(newItem.rarity);
        const slotName = this.formatSlotName(slot);
        
        // Check if existing item is high-value (S or A score)
        const existingScore = String(existingItem.score || '').toUpperCase();
        const newScore = String(newItem.score || '').toUpperCase();
        const scoreOrder = ['S', 'A', 'B', 'C', 'D'];
        const existingRank = scoreOrder.indexOf(existingScore);
        const newRank = scoreOrder.indexOf(newScore);
        const isDowngrade = existingRank !== -1 && newRank !== -1 && newRank > existingRank;
        const isSanctifiedLoss = existingItem.sanctified && !newItem.sanctified;
        
        let warningHtml = '';
        if (isDowngrade || isSanctifiedLoss) {
            const warnings = [];
            if (isDowngrade) warnings.push(`Replacing a <strong style="color: #4caf50;">${existingScore}-tier</strong> item with a <strong style="color: #f44336;">${newScore}-tier</strong> item`);
            if (isSanctifiedLoss) warnings.push(`Removing a <strong style="color: gold;">🦋 Sanctified</strong> item (permanent optimization)`);
            warningHtml = `
                <div style="background: rgba(244,67,54,0.15); border: 1px solid rgba(244,67,54,0.4); border-radius: 8px; padding: 12px; margin: 12px 0;">
                    <div style="color: #f44336; font-weight: bold; margin-bottom: 6px;">⚠️ Potential Downgrade</div>
                    <div style="color: #ffcdd2; font-size: 0.85rem; line-height: 1.5;">${warnings.join('<br>')}</div>
                    <div style="color: #999; font-size: 0.8rem; margin-top: 6px;">This may negatively impact your build synergy score.</div>
                </div>
            `;
        }
        
        const existingSanctBadge = existingItem.sanctified ? ' <span style="color: gold; font-size: 0.75rem;">🦋</span>' : '';
        const newSanctBadge = newItem.sanctified ? ' <span style="color: gold; font-size: 0.75rem;">🦋</span>' : '';
        
        modal.innerHTML = `
            <div class="h-modal-content" style="max-width: 450px;">
                <h3 style="margin-top: 0; color: var(--accent-color);">⚔️ Replace ${slotName} Item?</h3>
                
                <div style="display: flex; flex-direction: column; gap: 8px; margin: 15px 0;">
                    <!-- Current item -->
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(244,67,54,0.1); border: 1px solid rgba(244,67,54,0.3); border-radius: 8px;">
                        <div style="color: #f44336; font-size: 1.2rem; flex-shrink: 0;">❌</div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 0.75rem; color: #f44336; text-transform: uppercase; font-weight: bold;">Removing</div>
                            <div style="color: ${existingColor}; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${existingItem.title}${existingSanctBadge}</div>
                            <div style="color: #999; font-size: 0.8rem;">${existingItem.type || existingItem.rarity || ''} ${existingScore ? '• Score: ' + existingScore : ''}</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; color: #666; font-size: 1.2rem;">↓</div>
                    
                    <!-- New item -->
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(76,175,80,0.1); border: 1px solid rgba(76,175,80,0.3); border-radius: 8px;">
                        <div style="color: #4caf50; font-size: 1.2rem; flex-shrink: 0;">✅</div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 0.75rem; color: #4caf50; text-transform: uppercase; font-weight: bold;">Equipping</div>
                            <div style="color: ${newColor}; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${newItem.title}${newSanctBadge}</div>
                            <div style="color: #999; font-size: 0.8rem;">${newItem.type || newItem.rarity || ''} ${newScore ? '• Score: ' + newScore : ''}</div>
                        </div>
                    </div>
                </div>
                
                ${warningHtml}
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button id="replace-confirm-btn" class="h-btn-primary" style="flex: 1;">⚔️ Replace</button>
                    <button id="replace-cancel-btn" class="h-btn-secondary" style="flex: 1;">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => modal.remove();
        
        document.getElementById('replace-confirm-btn').addEventListener('click', () => {
            const hybridClasses = ['paladin', 'sorcerer', 'druid', 'necromancer'];
            if (hybridClasses.includes(this.state.currentClass) && isTwoHanded && 
                (slot === 'mainHand' || slot === 'twoHanded')) {
                this.equipToSlot(slot, newItem, true);
                if (this.state.loadout.offHand) {
                    this.clearSlot('offHand');
                    this.showToast(`⚔️ ${newItem.title} replaced ${existingItem.title} in ${this.formatSlotName(slot)}. Off-hand cleared.`);
                } else {
                    this.showToast(`⚔️ ${newItem.title} replaced ${existingItem.title} in ${this.formatSlotName(slot)}!`);
                }
            } else {
                this.equipToSlot(slot, newItem, isTwoHanded);
                this.showToast(`⚔️ ${newItem.title} replaced ${existingItem.title} in ${this.formatSlotName(slot)}!`);
            }
            closeModal();
        });
        
        document.getElementById('replace-cancel-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    },
    
    equipToSlot(slot, result, isTwoHanded = false) {
        const itemData = {
            title: result.title,
            type: result.type,
            rarity: result.rarity,
            analysis: result.analysis,
            insight: result.insight,
            score: result.score,
            sanctified: result.sanctified || false,
            isTwoHanded: isTwoHanded,
            timestamp: Date.now()
        };
        
        this.saveSlot(slot, itemData);
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
    },

    showRingSelectionModal(result) {
        const modal = document.createElement('div');
        modal.className = 'h-modal-overlay';
        modal.style.display = 'flex';
        
        const ring1 = this.state.loadout.ring1;
        const ring2 = this.state.loadout.ring2;
        const ring1Color = ring1 ? this.getRarityColor(ring1.rarity) : '#555';
        const ring2Color = ring2 ? this.getRarityColor(ring2.rarity) : '#555';
        const newColor = this.getRarityColor(result.rarity);
        
        const ring1Label = ring1 
            ? `<span style="color: ${ring1Color}; font-weight: bold;">${ring1.title}</span><br><span style="color: #999; font-size: 0.8rem;">${ring1.score ? 'Score: ' + ring1.score : ring1.rarity || ''}</span>`
            : '<span style="color: #555;">Empty</span>';
        const ring2Label = ring2 
            ? `<span style="color: ${ring2Color}; font-weight: bold;">${ring2.title}</span><br><span style="color: #999; font-size: 0.8rem;">${ring2.score ? 'Score: ' + ring2.score : ring2.rarity || ''}</span>`
            : '<span style="color: #555;">Empty</span>';
        
        const ring1Action = ring1 ? `Replace` : `Equip to`;
        const ring2Action = ring2 ? `Replace` : `Equip to`;
        
        // Warn if replacing a higher-scored ring
        const scoreOrder = ['S', 'A', 'B', 'C', 'D'];
        const newRank = scoreOrder.indexOf(String(result.score || '').toUpperCase());
        const ring1Rank = ring1 ? scoreOrder.indexOf(String(ring1.score || '').toUpperCase()) : -1;
        const ring2Rank = ring2 ? scoreOrder.indexOf(String(ring2.score || '').toUpperCase()) : -1;
        const ring1Downgrade = ring1 && ring1Rank !== -1 && newRank !== -1 && newRank > ring1Rank;
        const ring2Downgrade = ring2 && ring2Rank !== -1 && newRank !== -1 && newRank > ring2Rank;
        
        const ring1Warn = ring1Downgrade ? '<div style="color: #f44336; font-size: 0.75rem; margin-top: 4px;">⚠️ Downgrade</div>' : '';
        const ring2Warn = ring2Downgrade ? '<div style="color: #f44336; font-size: 0.75rem; margin-top: 4px;">⚠️ Downgrade</div>' : '';
        
        modal.innerHTML = `
            <div class="h-modal-content" style="max-width: 420px;">
                <h3 style="margin-top: 0; color: var(--accent-color);">💍 Equip Ring</h3>
                <p style="margin-bottom: 5px;">Equipping: <strong style="color: ${newColor};">${result.title}</strong> ${result.score ? '<span style="color: #999;">(Score: ' + result.score + ')</span>' : ''}</p>
                <p style="margin-bottom: 15px; color: #999; font-size: 0.85rem;">Select a ring slot:</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button id="ring-slot-1" class="h-btn-primary" style="text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.75rem; opacity: 0.7; text-transform: uppercase;">${ring1Action} Ring Slot 1</div>
                            <div style="margin-top: 4px;">${ring1Label}</div>
                            ${ring1Warn}
                        </div>
                        <span style="font-size: 1.2rem;">${ring1 ? '🔄' : '➕'}</span>
                    </button>
                    <button id="ring-slot-2" class="h-btn-primary" style="text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 0.75rem; opacity: 0.7; text-transform: uppercase;">${ring2Action} Ring Slot 2</div>
                            <div style="margin-top: 4px;">${ring2Label}</div>
                            ${ring2Warn}
                        </div>
                        <span style="font-size: 1.2rem;">${ring2 ? '🔄' : '➕'}</span>
                    </button>
                    <button id="ring-cancel" class="h-btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('ring-slot-1').addEventListener('click', () => {
            this.equipToSlot('ring1', result);
            const msg = ring1 
                ? `💍 ${result.title} replaced ${ring1.title} in Ring Slot 1!` 
                : `💍 ${result.title} equipped to Ring Slot 1!`;
            this.showToast(msg);
            modal.remove();
        });
        
        document.getElementById('ring-slot-2').addEventListener('click', () => {
            this.equipToSlot('ring2', result);
            const msg = ring2 
                ? `💍 ${result.title} replaced ${ring2.title} in Ring Slot 2!` 
                : `💍 ${result.title} equipped to Ring Slot 2!`;
            this.showToast(msg);
            modal.remove();
        });
        
        document.getElementById('ring-cancel').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    },

    // UPDATED: Format slot names including new slots
    formatSlotName(slot) {
        const names = {
            helm: 'Helm',
            chest: 'Chest',
            gloves: 'Gloves',
            pants: 'Pants',
            boots: 'Boots',
            amulet: 'Amulet',
            ring1: 'Ring 1',
            ring2: 'Ring 2',
            mainHand: 'Main Hand',
            offHand: 'Off-Hand',
            ranged: 'Ranged',
            '2hBludgeoning': '2H Bludgeoning',
            '2hSlashing': '2H Slashing',
            twoHanded: 'Two-Handed'
        };
        return names[slot] || slot;
    },

    getRarityColor(rarity) {
        const rarityMap = {
            common: '#adadad',
            magic: '#6969ff',
            rare: '#ffff00',
            legendary: '#ff8000',
            unique: '#c7b377',
            mythic: '#e770ff'
        };
        const cleanRarity = String(rarity || 'common').split(' ')[0].toLowerCase();
        return rarityMap[cleanRarity] || rarityMap.common;
    },

    // UPDATED: Dynamic slot grid rendering based on current class
    renderLoadoutGrid() {
        if (!this.el.loadoutGrid) return;
        
        const currentSlots = this.CLASS_SLOTS[this.state.currentClass.toLowerCase()] || this.CLASS_SLOTS.barbarian;
        
        // Set data attribute for CSS targeting
        this.el.loadoutGrid.setAttribute('data-class', this.state.currentClass);
        
        this.el.loadoutGrid.innerHTML = currentSlots.map(slot => {
            const item = this.state.loadout[slot.id];
            const isEmpty = !item;
            const rarityColor = isEmpty ? '#555' : this.getRarityColor(item.rarity);
            
            // Check if slot should be disabled
            let isDisabled = false;
            let disabledReason = '';
            
            // Off-hand disabled when 2H weapon equipped (hybrid classes only)
            const hybridClasses = ['paladin', 'sorcerer', 'druid', 'necromancer'];
            if (slot.id === 'offHand' && hybridClasses.includes(this.state.currentClass)) {
                const mainHandItem = this.state.loadout.mainHand;
                const twoHandedItem = this.state.loadout.twoHanded;
                if (mainHandItem?.isTwoHanded || twoHandedItem) {
                    isDisabled = true;
                    disabledReason = '🔒 Locked';
                }
            }
            
            return `
                <div class="loadout-slot ${isEmpty ? 'empty' : 'filled'} ${isDisabled ? 'disabled' : ''}" 
                     data-slot="${slot.id}"
                     data-category="${slot.category}"
                     style="border-color: ${rarityColor};">
                    <div class="slot-header">
                        <span class="slot-icon">${slot.icon}</span>
                        <span class="slot-name">${slot.name}</span>
                    </div>
                    ${isEmpty ? 
                        `<div class="slot-empty-text">${isDisabled ? disabledReason : 'Empty'}</div>` :
                        `<div class="slot-item-name" style="color: ${rarityColor};">${item.title}</div>`
                    }
                </div>
            `;
        }).join('');
        
        // Attach click handlers
        document.querySelectorAll('.loadout-slot').forEach(slotEl => {
            slotEl.addEventListener('click', () => {
                const slotId = slotEl.dataset.slot;
                const item = this.state.loadout[slotId];
                if (item && !slotEl.classList.contains('disabled')) {
                    this.showSlotDetails(slotId, item);
                }
            });
        });
    },

    showSlotDetails(slot, item) {
        const modal = document.createElement('div');
        modal.className = 'h-modal-overlay';
        modal.style.display = 'flex';
        
        const rarityColor = this.getRarityColor(item.rarity);
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t;
        const analysisHtml = renderMarkdown(item.analysis || '');
        
        modal.innerHTML = `
            <div class="h-modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <button class="h-modal-close" id="slot-h-modal-close">×</button>
                <div class="result-header" style="border-color: ${rarityColor};">
                    <h2 style="color: ${rarityColor}; margin: 0;">${item.title}</h2>
                    <span style="color: #999; font-size: 0.9rem;">${item.type || item.rarity || ''}</span>
                </div>
                <div class="insight-box" style="margin-top: 15px;">
                    <strong style="color: var(--accent-color);">💡 Insight:</strong> ${item.insight || 'No insight available'}
                </div>
                <div class="analysis-text markdown-body" style="margin-top: 15px;">
                    ${analysisHtml}
                </div>
                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    <button id="unequip-btn" class="h-btn-secondary">🗑️ Unequip</button>
                    <button id="slot-h-modal-close-btn" class="h-btn-primary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => modal.remove();
        
        document.getElementById('slot-h-modal-close').addEventListener('click', closeModal);
        document.getElementById('slot-h-modal-close-btn').addEventListener('click', closeModal);
        document.getElementById('unequip-btn').addEventListener('click', () => {
            this.clearSlot(slot);
            closeModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    },

    // ============================================
    // BUILD SYNERGY ANALYSIS
    // ============================================

    updateBuildSynergy() {
        if (!this.el.buildSynergy) return;
        
        const mechanic = this.el.keyMechanic?.value;
        if (!mechanic) {
            this.el.buildSynergy.style.display = 'none';
            return;
        }
        
        // NORMALIZED: Keys now match config.js values (e.g. "Thorns Build" -> "thorns-build")
        const synergyKeywords = {
            // --- BARBARIAN ---
            'thorns-build': ['thorns', 'reflect', 'return damage', 'retaliate'],
            'overpower-stack': ['overpower', 'lucky hit', 'critical strike', 'crit'],
            'berserking-uptime': ['berserking', 'berserk', 'fury', 'rage'],
            'bleed-damage': ['bleed', 'bleeding', 'hemorrhage', 'lacerate', 'rupture'],
            'fortify-generation': ['fortify', 'fortified', 'fortification', 'damage reduction'],
            
            // --- DRUID ---
            'spirit-generation': ['spirit', 'resource', 'energize'],
            'nature-magic-damage': ['nature', 'storm', 'earth', 'lightning', 'tornado', 'hurricane'],
            'shapeshifting': ['werewolf', 'werebear', 'shapeshifting', 'transform', 'grizzly rage'],
            
            // --- NECROMANCER ---
            'minion-only': ['minion', 'summon', 'skeleton', 'golem', 'warrior', 'mage', 'priest'],
            'blood-orb-generation': ['blood orb', 'blood', 'tides of blood', 'coagulate'],
            'essence-generation': ['essence', 'resource', 'exposed flesh'],
            'corpse-consumption': ['corpse', 'flesh', 'grim harvest', 'corpse explosion'],
            
            // --- ROGUE ---
            'critical-strike': ['critical strike', 'crit', 'cutthroat', 'marksman'],
            'vulnerable-damage': ['vulnerable', 'victimise', 'exploit'],
            'lucky-hit': ['lucky hit', 'proc', 'effect chance'],
            'energy-generation': ['energy', 'resource', 'innervation'],
            'shadow-imbuement': ['shadow', 'imbuement', 'darkness', 'shroud'],
            
            // --- SORCERER ---
            'mana-generation': ['mana', 'resource', 'prodigy'],
            'cooldown-reduction': ['cooldown', 'cdr', 'rapid'],
            'barrier-generation': ['barrier', 'shield', 'protection', 'ice armor'],
            'crackling-energy': ['crackling', 'lightning', 'shock', 'stun'],
            'lucky-hit': ['lucky hit', 'proc', 'effect chance'],
            
            // --- PALADIN ---
            'block-chance': ['block', 'shield', 'deflection'],
            'holy-damage': ['holy', 'radiant', 'sacred', 'divine'],
            'auras': ['aura', 'nearby allies', 'radius'],
            'divine-wrath': ['wrath', 'smite', 'judgment'],
            'consecrated-ground': ['consecrated', 'ground effect', 'area'],

             // --- SPIRITBORN ---
            'vigor-generation': ['vigor', 'resource', 'soar'],
            'dodge-chance': ['dodge', 'evade', 'elusive'],
            'resolve-stacks': ['resolve', 'counter', 'block'],
            'spirit-bonds': ['spirit', 'bond', 'guardian']
        };
        
        // Normalize mechanic value to match keyword keys
        const mechanicKey = mechanic.toLowerCase().replace(/ /g, '-');
        
        // Fallback: Check for partial matches if exact key fails
        let keywords = synergyKeywords[mechanicKey];
        if (!keywords) {
            // Try to find a partial match (e.g. "thorns" within "thorns-build")
            const partialKey = Object.keys(synergyKeywords).find(k => k.includes(mechanicKey) || mechanicKey.includes(k));
            keywords = partialKey ? synergyKeywords[partialKey] : [];
        }
        
        if (!keywords || keywords.length === 0) {
            console.log(`No keywords found for mechanic: ${mechanicKey}`);
            this.el.buildSynergy.style.display = 'none';
            return;
        }
        
        // Count matching items
        let matchCount = 0;
        let totalItems = 0;
        
        Object.values(this.state.loadout).forEach(item => {
            if (!item) return;
            totalItems++;
            
            // Broaden search to title + type + analysis + insight
            const itemText = `${item.title} ${item.type} ${item.analysis} ${item.insight}`.toLowerCase();
            const hasMatch = keywords.some(keyword => itemText.includes(keyword));
            if (hasMatch) matchCount++;
        });
        
        if (totalItems === 0) {
            this.el.buildSynergy.style.display = 'none';
            return;
        }
        
        const percentage = Math.round((matchCount / totalItems) * 100);
        let message = '';
        let iconClass = '';
        
        // Updated text to be more concise for the loadout view
        const mechanicName = this.el.keyMechanic.options[this.el.keyMechanic.selectedIndex].text;
        
        if (percentage >= 70) {
            message = `🔥 <strong>Excellent!</strong> ${matchCount}/${totalItems} items fit your ${mechanicName} build.`;
            iconClass = 'synergy-high';
        } else if (percentage >= 40) {
            message = `⚠️ <strong>Moderate.</strong> ${matchCount}/${totalItems} items fit your ${mechanicName} build.`;
            iconClass = 'synergy-medium';
        } else {
            message = `❌ <strong>Low Synergy.</strong> ${matchCount}/${totalItems} items fit your ${mechanicName} build.`;
            iconClass = 'synergy-low';
        }
        
        this.el.buildSynergy.className = `build-synergy ${iconClass}`;
        this.el.buildSynergy.innerHTML = `
            <div class="synergy-header" style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem;">
                <span>Build Synergy</span>
                <span>${percentage}%</span>
            </div>
            <div class="synergy-bar">
                <div class="synergy-fill" style="width: ${percentage}%;"></div>
            </div>
            <div class="synergy-text" style="margin-top:5px; font-size:0.85rem;">${message}</div>
        `;
        this.el.buildSynergy.style.display = 'block';
    },
    
    // ============================================
    // CONTEXT-AWARE COMPARISON
    // ============================================

    getRelevantEquippedItems(detectedSlot) {
        if (detectedSlot === 'unknown' || detectedSlot === null) {
            // Can't determine slot, return all equipped items
            return Object.values(this.state.loadout).filter(item => item !== null);
        }
        
        if (detectedSlot === 'twoHanded') {
            // Compare against main hand
            return this.state.loadout.mainHand ? [this.state.loadout.mainHand] : [];
        }
        
        // For rings, return both ring slots
        if (detectedSlot === 'ring1' || detectedSlot === 'ring2') {
            return [this.state.loadout.ring1, this.state.loadout.ring2].filter(item => item !== null);
        }
        
        // Return the specific slot
        return this.state.loadout[detectedSlot] ? [this.state.loadout[detectedSlot]] : [];
    },

    // ============================================
    // UI STATE MACHINE: idle | processing | result
    // ============================================
    
    setPhase(phase) {
        this.state.phase = phase;
        const scanCard = document.querySelector('.scan-card');
        const resultsCard = this.el.resultsCard;
        
        // Remove all phase classes
        if (scanCard) scanCard.classList.remove('phase-idle', 'phase-processing', 'phase-result');
        
        switch(phase) {
            case 'idle':
                if (scanCard) scanCard.classList.add('phase-idle');
                this.el.analyzeBtn.disabled = false;
                this.el.compareBtn.disabled = false;
                this.el.analyzeBtn.style.opacity = '';
                this.el.compareBtn.style.opacity = '';
                this.el.analyzeBtn.style.pointerEvents = '';
                this.el.compareBtn.style.pointerEvents = '';
                break;
            case 'processing':
                if (scanCard) scanCard.classList.add('phase-processing');
                this.el.analyzeBtn.disabled = true;
                this.el.compareBtn.disabled = true;
                this.el.analyzeBtn.style.opacity = '0.5';
                this.el.compareBtn.style.opacity = '0.5';
                this.el.analyzeBtn.style.pointerEvents = 'none';
                this.el.compareBtn.style.pointerEvents = 'none';
                break;
            case 'result':
                if (scanCard) scanCard.classList.add('phase-result');
                this.el.analyzeBtn.disabled = false;
                this.el.compareBtn.disabled = false;
                this.el.analyzeBtn.style.opacity = '';
                this.el.compareBtn.style.opacity = '';
                this.el.analyzeBtn.style.pointerEvents = '';
                this.el.compareBtn.style.pointerEvents = '';
                break;
            case 'error':
                if (scanCard) scanCard.classList.add('phase-result');
                this.el.analyzeBtn.disabled = true;
                this.el.compareBtn.disabled = true;
                this.el.analyzeBtn.style.opacity = '0.5';
                this.el.compareBtn.style.opacity = '0.5';
                this.el.analyzeBtn.style.pointerEvents = 'none';
                this.el.compareBtn.style.pointerEvents = 'none';
                break;
        }
        
        // Disable demo button and journal clicks during processing and error
        const isLocked = phase === 'processing' || phase === 'error';
        if (this.el.demoBtn) {
            this.el.demoBtn.disabled = isLocked;
            this.el.demoBtn.style.opacity = isLocked ? '0.5' : '';
            this.el.demoBtn.style.pointerEvents = isLocked ? 'none' : '';
        }
        if (this.el.historyList) {
            this.el.historyList.style.pointerEvents = isLocked ? 'none' : '';
            this.el.historyList.style.opacity = isLocked ? '0.5' : '';
        }
    },

    // ============================================
    // DEMO STATE & SCAN RESET
    // ============================================
    
    clearDemoState() {
        this.state.isDemo = false;
        this.el.imageError.style.display = 'none';
        // If current result is a demo, clear it
        if (this.state.currentItem && this.state.currentItem.isDemo) {
            this.clearResults();
            this.state.currentItem = null;
        }
    },
    
    resetScan() {
        // Clear uploaded image — removeAttribute ensures external demo URLs are fully cleared
        this.el.imagePreview.removeAttribute('src');
        this.el.imagePreview.src = '';
        this.el.imagePreview.style.display = 'none';
        const label = this.el.uploadZone.querySelector('.upload-label');
        if (label) label.style.display = '';
        if (this.el.imageUpload) this.el.imageUpload.value = '';
        
        // Clear results
        this.clearResults();
        this.state.currentItem = null;
        this.state.isDemo = false;
        
        // Clear errors
        this.el.imageError.style.display = 'none';
        
        // Reset dropdowns to defaults
        this.el.playerClass.value = 'Any';
        this.el.playerClass.dispatchEvent(new Event('change'));
        if (this.el.buildStyle) this.el.buildStyle.value = '';
        if (this.el.keyMechanic) this.el.keyMechanic.value = '';
        
        // Collapse advanced panel
        if (this.el.advancedPanel) { this.el.advancedPanel.classList.add('h-hidden'); this.el.advancedPanel.style.display = 'none'; }
        
        // Reset checkboxes
        ['needsStr', 'needsInt', 'needsWill', 'needsDex', 'needsRes'].forEach(k => {
            if (this.el[k]) this.el[k].checked = false;
        });
        
        this.showLoading(false);
        this.setPhase('idle');
    },

    // ============================================
    // ENHANCED ANALYSIS PIPELINE
    // ============================================

    async handleAnalyze() {
        if (!this.el.imagePreview.src || this.el.imagePreview.src === window.location.href) return this.showError('No image loaded');

        const selectedGame = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[selectedGame];
        
        if (support && !support.enabled) {
            this.showUnsupportedOverlay(selectedGame);
            return;
        }

        const loadingText = this.state.mode === 'compare' 
            ? "Comparing items... (this takes a moment)" 
            : "Analyzing...";
        this.showLoading(true, loadingText);
        this.clearResults();
        this.setPhase('processing');
        
        // Timeout: compare mode makes 2 API calls, so allow more time
        const timeoutMs = this.state.mode === 'compare' ? 30000 : 20000;
        const analysisTimeout = setTimeout(() => {
            this.showLoading(false);
            this.showError('Request timed out — please try again.');
            this.setPhase('idle');
        }, timeoutMs);

        try {
            const imageBase64 = this.el.imagePreview.src.split(',')[1];
            const mimeType = this.el.imagePreview.src.split(';')[0].split(':')[1];
            
            const pClass = this.el.playerClass.value;
            const build = this.el.buildStyle.value;
            const advancedSettings = {
                mechanic: this.el.keyMechanic ? this.el.keyMechanic.value : '',
                needs: {
                    str: this.el.needsStr?.checked,
                    int: this.el.needsInt?.checked,
                    will: this.el.needsWill?.checked,
                    dex: this.el.needsDex?.checked,
                    res: this.el.needsRes?.checked
                }
            };

            // CONTEXT-AWARE COMPARISON LOGIC
            let equippedContext = null;
            if (this.state.mode === 'compare') {
                // First, do a quick pre-scan to detect the item type
                const preScanPrompt = this.generatePreScanPrompt(selectedGame);
                const preScanResult = await this.callGemini(preScanPrompt, imageBase64, mimeType);
                
                if (preScanResult && preScanResult.detected_slot) {
                    const relevantItems = this.getRelevantEquippedItems(preScanResult.detected_slot);
                    if (relevantItems.length > 0) {
                        equippedContext = relevantItems;
                    }
                }
            }

            // Generate prompt with context-aware memory
            const promptGen = this.state.mode === 'compare' 
                ? PROMPT_TEMPLATES.compareOptimized 
                : PROMPT_TEMPLATES.analyzeOptimized;
            
            const prompt = promptGen(selectedGame, pClass, build, advancedSettings, equippedContext);
            const result = await this.callGemini(prompt, imageBase64, mimeType);
            
            console.log('Analysis result:', result);
            
            if (!result) {
                throw new Error("Analysis failed. Please try again.");
            }
            
            if (result.status === 'unsupported_game') {
                this.showUnsupportedOverlay(result.detected_game);
                this.showLoading(false);
                return;
            }
            
            if (result.status === 'rejected') {
                this.handleRejection(result);
                this.showLoading(false);
                return;
            }
            
            this.renderSuccess(result);
            this.saveToHistory(result);
            
            // Increment global scan counter (fire-and-forget)
            try { fetch('/api/counter?name=scans&action=up', { cache: 'no-store' }); } catch(e) {}

        } catch (error) {
            console.error('Analysis error:', error);
            
            // ANALYTICS HOOK: Track error
            if (typeof Analytics !== 'undefined' && Analytics.trackError) {
                Analytics.trackError('analysis_failed', error.message);
            }
            
            const msg = error.name === 'AbortError' 
                ? 'Request took too long — the AI may be busy. Please try again.'
                : `Error: ${error.message}`;
            this.showError(msg);
            this.setPhase('idle');
        } finally {
            clearTimeout(analysisTimeout);
            this.showLoading(false);
        }
    },

    generatePreScanPrompt(game) {
        return `You are a ${game.toUpperCase()} item classifier. Analyze this image and respond with ONLY a JSON object containing:
{
    "detected_slot": "helm|chest|gloves|pants|boots|amulet|ring|mainHand|offHand|twoHanded|unknown"
}

Detect the item type from the tooltip. For weapons:
- If it says "Two-Handed" or is a Staff/Bow/Crossbow/Polearm → "twoHanded"
- If it's a one-handed Sword/Axe/Mace/Dagger/Wand → "mainHand"
- If it's a Shield/Focus/Totem/Quiver → "offHand"
- If it's a Ring → "ring"

Return ONLY the JSON object, no additional text.`;
    },

    handleRejection(result) {
        const confidence = result.confidence || 'high';
        
        // ANALYTICS HOOK: Track rejected scan
        if (typeof Analytics !== 'undefined' && Analytics.trackError) {
            Analytics.trackError('scan_rejected', `${result.reject_reason}: ${result.message}`);
        }
        
        if (result.reject_reason === 'multiple_items') {
            this.renderRejection(
                "Multiple Items Detected",
                result.message || "It looks like your screenshot contains more than one item. Please crop or upload a screenshot showing a single item tooltip, then try again.",
                confidence
            );
        } else if (result.reject_reason === 'single_item') {
            this.renderRejection(
                "Single Item Detected",
                result.message || "Comparison mode requires two items side-by-side. Use the in-game comparison overlay, or switch to Analyze for a single item.",
                confidence
            );
        } else if (result.reject_reason === 'not_game') {
            this.renderRejection(
                "Not a Game Item", 
                result.message || "This appears to be a real-world photo or non-game object. Please upload a clear screenshot of a Diablo item tooltip.",
                confidence
            );
        } else if (result.reject_reason?.startsWith('wrong_game')) {
            const detected = result.reject_reason.replace('wrong_game_', '');
            this.renderWrongGame(detected, result.message);
        } else if (result.reject_reason === 'unclear') {
            this.renderRejection(
                "Unclear Image",
                result.message || "Unable to clearly identify this image. Please upload a clearer screenshot of the item tooltip.",
                confidence
            );
        } else {
            this.renderRejection("Analysis Failed", result.message || "Could not analyze this image.", confidence);
        }
    },

    // Compress image to fit within Vercel's 4.5MB body limit
    // Base64 adds ~33% overhead, so we target ~3MB raw image max
    async compressImage(base64Data, mimeType, maxSizeKB = 2500) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                // Scale down large images
                const MAX_DIM = 2048;
                if (width > MAX_DIM || height > MAX_DIM) {
                    const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Try progressively lower quality until under size limit
                let quality = 0.85;
                let result;
                do {
                    result = canvas.toDataURL('image/jpeg', quality);
                    quality -= 0.1;
                } while (result.length * 0.75 > maxSizeKB * 1024 && quality > 0.3);

                const compressed = result.split(',')[1];
                console.log(`Image compressed: ${Math.round(base64Data.length * 0.75 / 1024)}KB → ${Math.round(compressed.length * 0.75 / 1024)}KB`);
                resolve({ base64: compressed, mimeType: 'image/jpeg' });
            };
            img.src = `data:${mimeType};base64,${base64Data}`;
        });
    },

    async callGemini(prompt, imageBase64, mimeType) {
        try {
            // Compress if image is too large for Vercel's body limit (~4.5MB)
            let sendBase64 = imageBase64;
            let sendMime = mimeType;
            const estimatedPayloadKB = (imageBase64.length * 1.4) / 1024; // base64 + JSON overhead
            if (estimatedPayloadKB > 3500) {
                console.log(`Image payload ~${Math.round(estimatedPayloadKB)}KB, compressing...`);
                const compressed = await this.compressImage(imageBase64, mimeType);
                sendBase64 = compressed.base64;
                sendMime = compressed.mimeType;
            }

            const controller = new AbortController();
            const fetchTimeout = setTimeout(() => controller.abort(), 25000);
            
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    prompt,
                    imageBase64: sendBase64,
                    mimeType: sendMime
                })
            });
            
            clearTimeout(fetchTimeout);

            // Handle rate limiting
            if (response.status === 429) {
                let errMsg = 'Daily scan limit reached. Please try again tomorrow.';
                try { const errData = await response.json(); errMsg = errData.error || errMsg; } catch(e) {}
                this.state.scanQuota.remaining = 0;
                this.updateQuotaDisplay();
                throw new Error(errMsg);
            }

            // Handle server busy (Gemini 429 proxied as 503)
            if (response.status === 503) {
                throw new Error('AI service is temporarily busy. Please try again in a moment.');
            }

            // Handle payload too large
            if (response.status === 413) {
                throw new Error('Image is too large. Please use a smaller screenshot.');
            }

            if (!response.ok) {
                let errMsg = `API Error: ${response.status}`;
                try { const err = await response.json(); errMsg = err.error || errMsg; console.error('API proxy error:', err); } catch(e) {}
                throw new Error(errMsg);
            }
            
            const data = await response.json();

            // Update quota tracking from response
            if (data._rateLimit) {
                this.state.scanQuota.remaining = data._rateLimit.remaining;
                this.state.scanQuota.limit = data._rateLimit.limit;
                this.updateQuotaDisplay();
            }
            
            if (!data.candidates || !data.candidates[0]) {
                throw new Error('No response from AI');
            }
            
            const textContent = data.candidates[0].content.parts[0].text;
            return this.safeJSONParse(textContent);
            
        } catch (error) {
            console.error('Gemini call error:', error);
            throw error;
        }
    },

    updateQuotaDisplay() {
        const el = document.getElementById('scan-quota');
        if (el && this.state.scanQuota.remaining !== null) {
            el.textContent = `${this.state.scanQuota.remaining}/${this.state.scanQuota.limit} scans remaining today`;
            el.style.display = 'block';
            if (this.state.scanQuota.remaining <= 5) {
                el.classList.add('quota-low');
            } else {
                el.classList.remove('quota-low');
            }
        }
    },

    safeJSONParse(str) {
        try {
            let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
            const start = clean.indexOf('{');
            const end = clean.lastIndexOf('}');
            if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
            const parsed = JSON.parse(clean);
            console.log('Parsed JSON:', parsed);
            return parsed;
        } catch (e) {
            console.warn('JSON parse failed, attempting truncation repair...', e.message);
            // Attempt to repair truncated JSON from Gemini
            try {
                let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
                const start = clean.indexOf('{');
                if (start === -1) { console.error('No JSON object found'); return null; }
                clean = clean.substring(start);
                
                // Close any open strings
                const quoteCount = (clean.match(/(?<!\\)"/g) || []).length;
                if (quoteCount % 2 !== 0) clean += '"';
                
                // Close open braces/brackets
                let depth = 0, arrDepth = 0;
                for (let i = 0; i < clean.length; i++) {
                    const ch = clean[i];
                    if (ch === '"') { 
                        // Skip string contents
                        i++;
                        while (i < clean.length && clean[i] !== '"') {
                            if (clean[i] === '\\') i++; // skip escaped chars
                            i++;
                        }
                        continue;
                    }
                    if (ch === '{') depth++;
                    if (ch === '}') depth--;
                    if (ch === '[') arrDepth++;
                    if (ch === ']') arrDepth--;
                }
                
                // Remove trailing comma before closing
                clean = clean.replace(/,\s*$/, '');
                
                while (arrDepth > 0) { clean += ']'; arrDepth--; }
                while (depth > 0) { clean += '}'; depth--; }
                
                const repaired = JSON.parse(clean);
                console.log('Repaired truncated JSON:', repaired);
                return repaired;
            } catch (e2) {
                console.error('JSON repair also failed:', e2.message, 'Input:', str.substring(0, 500) + '...');
                return null;
            }
        }
    },

    renderUnsupportedGame(game, customMessage) {
        const support = CONFIG.GAME_SUPPORT[game];
        const gameName = support ? support.label : game.toUpperCase();
        const message = customMessage || `${gameName} analysis is coming soon! Currently only Diablo IV is supported.`;
        
        this.el.resultsCard.style.display = 'block';
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #ffa500;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🚧</div>
                <h3 style="margin-bottom: 15px; color: #ffa500;">Coming Soon</h3>
                <p style="font-size: 1.1rem; color: #fff; line-height: 1.6;">${message}</p>
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,165,0,0.1); border-radius: 8px;">
                    <strong>Currently Supported:</strong><br>
                    ✅ Diablo IV (Full Analysis)
                </div>
            </div>
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderRejection(title, reason, confidence = 'high') {
        this.el.resultsCard.style.display = 'block';
        this.setPhase('error');
        
        // Hide result action buttons (Discord, Check Price, Search Trade) on rejection
        const resultActions = this.el.resultsCard.querySelector('.result-actions');
        if (resultActions) resultActions.style.display = 'none';
        
        const confidenceText = confidence === 'low' || confidence === 'medium' 
            ? `<div style="margin-top: 15px; font-size: 0.85rem; color: #ffa500;">⚠️ Low confidence detection - image may be unclear</div>`
            : '';
        
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ff6b6b;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🚫</div>
                <h3 style="margin-bottom: 10px; color: var(--color-error);">${title}</h3>
                <p style="font-size: 1.1rem; color: #fff; line-height: 1.5;">${reason}</p>
                ${confidenceText}
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button class="btn-reset-scan">🔄 New Scan</button>
            </div>
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderWrongGame(detected, customMessage) {
        const target = 'Diablo IV';
        const map = { 'd4': 'Diablo IV', 'd2r': 'Diablo II: Resurrected', 'd3': 'Diablo III', 'di': 'Diablo Immortal' };
        const detectedName = map[detected] || detected.toUpperCase();
        const message = customMessage || `This looks like a ${detectedName} item, but you selected ${target}.`;

        this.el.resultsCard.style.display = 'block';
        this.setPhase('error');
        
        // Hide result action buttons on rejection
        const resultActions = this.el.resultsCard.querySelector('.result-actions');
        if (resultActions) resultActions.style.display = 'none';
        
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--color-warning);">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <h3 style="margin-bottom: 10px;">Wrong Game Selected</h3>
                <p style="font-size: 1.1rem; color: #fff;">${message}</p>
                <div style="margin-top:15px; font-size: 0.9rem; color: #ccc;">
                    Please change the "Game Version" selector at the top to match your screenshot.
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button class="btn-reset-scan">🔄 New Scan</button>
            </div>
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderSuccess(result) {
        this.state.currentItem = result;
        this.setPhase('result');
        
        // Restore result action buttons (hidden during rejections)
        const resultActions = this.el.resultsCard.querySelector('.result-actions');
        if (resultActions) resultActions.style.display = '';
        
        // ANALYTICS HOOK: Track successful scan
        if (typeof Analytics !== 'undefined' && Analytics.trackScan) {
            Analytics.trackScan(result, this.state.currentClass);
        }

        this.el.resultsCard.style.display = 'block';
        
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t; 
        const analysisHtml = renderMarkdown(result.analysis || '');

        // ============================================
        // COMPARISON MODE: Dual-item equip selection
        // ============================================
        if (result.mode === 'comparison' && result.item1 && result.item2 && result.item1.title && result.item2.title) {
            this.renderComparisonResult(result, analysisHtml);
            return;
        }

        // ============================================
        // STANDARD SINGLE-ITEM MODE
        // ============================================
        const rarity = String(result.rarity || 'common').split(' ')[0].toLowerCase();
        const verdict = String(result.verdict || 'UNKNOWN').toUpperCase();
        
        const confidenceBadge = (result.confidence === 'medium' || result.confidence === 'low')
            ? `<span style="font-size: 0.8rem; color: #ffa500; margin-left: 10px;">⚠️ ${result.confidence} confidence</span>`
            : '';

        let verdictColor = 'neutral';
        if (['KEEP', 'EQUIP', 'SELL', 'UPGRADE', 'EQUIP NEW', 'SANCTIFY'].includes(verdict)) verdictColor = 'keep';
        if (['SALVAGE', 'DISCARD', 'CHARSI', 'KEEP EQUIPPED'].includes(verdict)) verdictColor = 'salvage';

        const sanctifiedBadge = result.sanctified 
            ? `<span style="display: inline-block; padding: 4px 8px; background: rgba(255,215,0,0.2); color: gold; border-radius: 4px; font-size: 0.85rem; margin-left: 10px;">🦋 Sanctified</span>`
            : '';

        const rarityColor = this.getRarityColor ? this.getRarityColor(result.rarity) : '#ccc';

        // Build the Greater Affix display
        const gaDisplay = result.greater_affix_count 
            ? `<div style="color: gold; font-size: 0.85rem; margin-top: 6px;">✨ ${result.greater_affix_count} Greater Affix${result.greater_affix_count > 1 ? 'es' : ''}</div>` 
            : '';

        // Determine verdict border color
        const verdictBorderColor = verdictColor === 'keep' ? '#4caf50' : (verdictColor === 'salvage' ? '#f44336' : '#ffa500');
        const verdictGlow = verdictColor === 'keep' ? 'box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);' : 
                            (verdictColor === 'salvage' ? 'box-shadow: 0 0 15px rgba(244, 67, 54, 0.3);' : '');

        // Build verdict reinforcement text — a short reason under the verdict
        let verdictReason = '';
        if (verdict === 'KEEP' || verdict === 'EQUIP' || verdict === 'EQUIP NEW') {
            verdictReason = result.score === 'S' ? 'Top-tier item. Best-in-slot potential.' :
                            result.score === 'A' ? 'Excellent rolls. Strong endgame piece.' :
                            result.score === 'B' ? 'Solid item. Good for progression.' :
                            'Usable for your build.';
        } else if (verdict === 'SANCTIFY') {
            verdictReason = 'High-quality base worth making permanent at the Heavenly Forge.';
        } else if (verdict === 'UPGRADE') {
            verdictReason = 'Good foundation. Worth investing materials to improve.';
        } else if (verdict === 'SALVAGE' || verdict === 'DISCARD' || verdict === 'CHARSI') {
            verdictReason = result.score === 'D' ? 'Poor stats and low synergy. Salvage for materials.' :
                            result.score === 'C' ? 'Below average. Better options are available.' :
                            'Not worth keeping for your build.';
        }

        // Build stat pills — only show what we have
        const statPills = [];
        if (result.item_power) statPills.push(`<span style="color: #ccc;">⚡ IP: <strong style="color: #fff;">${result.item_power}</strong>/925</span>`);
        if (result.score) statPills.push(`<span style="color: ${verdictBorderColor};">📊 Grade: <strong>${result.score}</strong></span>`);
        const statPillsHtml = statPills.length ? `<div style="display: flex; justify-content: center; gap: 20px; font-size: 0.9rem; margin-bottom: 8px;">${statPills.join('')}</div>` : '';

        // Full analysis section — only show toggle if we have analysis content
        const analysisSection = analysisHtml && analysisHtml.trim() 
            ? `<details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.9rem; padding: 8px 0;">📋 View Full Analysis</summary>
                <div class="analysis-text markdown-body" style="margin-top: 10px;">${analysisHtml}</div>
               </details>`
            : '';

        // Demo banner
        const demoBanner = result.isDemo 
            ? `<div style="background: rgba(255, 165, 0, 0.15); border: 1px solid rgba(255, 165, 0, 0.4); border-radius: 8px; padding: 10px 15px; margin-bottom: 15px; text-align: center; color: #ffa500; font-size: 0.9rem;">
                🎭 <strong>Demo Mode</strong> — This is a simulated result. Upload a real screenshot to get your analysis!
               </div>`
            : '';

        // Parse analysis markdown into structured sections
        const analysisRaw = result.analysis || '';
        let statsSection = '', synergySection = '', verdictSection = '';
        
        // Try to extract structured sections from the analysis markdown
        const statsMatch = analysisRaw.match(/### Stats Breakdown\n([\s\S]*?)(?=###|$)/i);
        const synergyMatch = analysisRaw.match(/### (?:Synergy|Build Synergy|Class Synergy)\n?([\s\S]*?)(?=###|$)/i) 
                          || analysisRaw.match(/- Synergy: ([\s\S]*?)(?=\n-|\n###|$)/i);
        const verdictMatch = analysisRaw.match(/### Verdict\n?([\s\S]*?)$/i);
        
        if (statsMatch) statsSection = renderMarkdown(statsMatch[1].trim());
        if (synergyMatch) synergySection = renderMarkdown(synergyMatch[1].trim());
        if (verdictMatch) verdictSection = renderMarkdown(verdictMatch[1].trim());
        
        // If structured extraction failed, fall back to full analysis
        const hasStructured = statsSection || synergySection || verdictSection;

        // Structured analysis cards
        const structuredHtml = hasStructured ? `
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
                ${statsSection ? `<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px;">
                    <div style="color: var(--accent-color); font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">📊 Stats</div>
                    <div style="color: #ccc; font-size: 0.85rem; line-height: 1.6;">${statsSection}</div>
                </div>` : ''}
                ${synergySection ? `<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px;">
                    <div style="color: #00bcd4; font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">🔗 Synergy</div>
                    <div style="color: #ccc; font-size: 0.85rem; line-height: 1.6;">${synergySection}</div>
                </div>` : ''}
                ${verdictSection ? `<div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px;">
                    <div style="color: ${verdictBorderColor}; font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">⚖️ Verdict</div>
                    <div style="color: #ccc; font-size: 0.85rem; line-height: 1.6;">${verdictSection}</div>
                </div>` : ''}
            </div>` : '';
        
        // Fallback: full analysis collapsed (if no structured sections or as additional detail)
        const fallbackSection = (!hasStructured && analysisHtml && analysisHtml.trim())
            ? `<details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.9rem; padding: 8px 0;">📋 View Full Analysis</summary>
                <div class="analysis-text markdown-body" style="margin-top: 10px;">${analysisHtml}</div>
               </details>`
            : (hasStructured && analysisHtml && analysisHtml.trim()) 
            ? `<details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.9rem; padding: 8px 0;">📋 View Raw Analysis</summary>
                <div class="analysis-text markdown-body" style="margin-top: 10px;">${analysisHtml}</div>
               </details>`
            : '';

        // New Scan button
        const newScanBtn = `<div style="text-align: center; margin-top: 15px;">
            <button class="btn-reset-scan">🔄 New Scan</button>
        </div>`;

        this.el.resultArea.innerHTML = `
            ${demoBanner}
            <!-- Verdict + Score: The 3-second answer -->
            <div style="margin-bottom: 15px;">
                <div class="verdict-container ${verdictColor}">
                    <div class="verdict-label">${verdict}</div>
                    <div class="verdict-score">${result.score || '-'}</div>
                </div>
                <div class="insight-box" style="margin-top: 10px;">
                    <strong style="color: var(--accent-color);">💡 Insight:</strong> ${result.insight || ''}
                </div>
            </div>

            <!-- Item Card: Quick stats at a glance -->
            <div style="
                border: 2px solid ${verdictBorderColor}; 
                border-radius: 10px; 
                padding: 18px; 
                background: rgba(0,0,0,0.3);
                margin-bottom: 15px;
                ${verdictGlow}
            ">
                <div style="text-align: center;">
                    <div style="color: ${rarityColor}; font-weight: bold; font-size: 1.15rem; margin-bottom: 4px;">
                        ${result.title || 'Unknown Item'}${sanctifiedBadge}${confidenceBadge}
                    </div>
                    <div style="color: #999; font-size: 0.85rem; margin-bottom: 12px;">${result.type || ''} ${result.type && result.rarity ? '·' : ''} ${result.rarity || ''}</div>
                    ${statPillsHtml}
                    ${gaDisplay}
                    ${verdictReason ? `<div style="color: #aaa; font-size: 0.78rem; margin-top: 8px; line-height: 1.4;">${verdictReason}</div>` : ''}
                </div>
            </div>

            <!-- Structured Analysis: Stats / Synergy / Verdict -->
            ${structuredHtml}
            
            <!-- Full Analysis fallback -->
            ${fallbackSection}
            
            ${newScanBtn}
        `;
        
        this.el.priceSection.style.display = 'none';
        this.applyPriceVisibility();
        setTimeout(() => this.el.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    },

    // ============================================
    // COMPARISON RESULT: Dual-Item Display
    // ============================================
    renderComparisonResult(result, analysisHtml) {
        const item1 = result.item1;
        const item2 = result.item2;
        const winner = (result.winner || '').toUpperCase();
        
        // Determine which item is recommended
        const item1IsWinner = winner === 'ITEM1';
        const item2IsWinner = winner === 'ITEM2';
        const isSimilar = winner === 'SIMILAR';
        
        // Color coding
        const winnerBorder = '#4caf50';   // Green
        const loserBorder = '#f44336';    // Red  
        const similarBorder = '#ffa500';  // Orange
        
        const item1Border = item1IsWinner ? winnerBorder : (item2IsWinner ? loserBorder : similarBorder);
        const item2Border = item2IsWinner ? winnerBorder : (item1IsWinner ? loserBorder : similarBorder);
        
        const item1Badge = item1IsWinner ? '👑 RECOMMENDED' : (isSimilar ? '⚖️ SIDEGRADE' : '');
        const item2Badge = item2IsWinner ? '👑 RECOMMENDED' : (isSimilar ? '⚖️ SIDEGRADE' : '');
        
        const item1RarityColor = this.getRarityColor(item1.rarity);
        const item2RarityColor = this.getRarityColor(item2.rarity);
        
        const item1Sanctified = item1.sanctified ? '<span style="color: gold; font-size: 0.8rem;"> 🦋 Sanctified</span>' : '';
        const item2Sanctified = item2.sanctified ? '<span style="color: gold; font-size: 0.8rem;"> 🦋 Sanctified</span>' : '';

        // Glow effect for winner
        const item1Glow = item1IsWinner ? 'box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);' : '';
        const item2Glow = item2IsWinner ? 'box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);' : '';

        // Named verdict label: "Harlequin Crest Wins" instead of "ITEM1 WINS"
        const item1Name = item1.title || 'Item 1';
        const item2Name = item2.title || 'Item 2';
        let verdictLabel = result.verdict || 'COMPARE';
        if (item1IsWinner) verdictLabel = `${item1Name} Wins`;
        if (item2IsWinner) verdictLabel = `${item2Name} Wins`;
        if (isSimilar) verdictLabel = 'Sidegrade';

        // Comparison summary section
        const summaryHtml = result.insight ? `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px; margin-bottom: 15px;">
                <div style="color: var(--accent-color); font-weight: 600; font-size: 0.85rem; margin-bottom: 8px;">📊 Comparison Summary: ${item1Name} vs ${item2Name}</div>
                <div style="color: #ccc; font-size: 0.85rem; line-height: 1.6;">${result.insight}</div>
                ${result.score_diff ? `<div style="color: #fff; font-size: 0.9rem; font-weight: 600; margin-top: 8px;">${result.score_diff}</div>` : ''}
            </div>` : '';

        // New Scan button
        const newScanBtn = `<div style="text-align: center; margin-top: 15px;">
            <button class="btn-reset-scan">🔄 New Scan</button>
        </div>`;

        this.el.resultArea.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="verdict-container ${isSimilar ? 'neutral' : (item1IsWinner || item2IsWinner ? 'keep' : 'neutral')}">
                    <div class="verdict-label" style="font-size: ${verdictLabel.length > 20 ? '0.9rem' : '1.1rem'};">${verdictLabel}</div>
                    <div class="verdict-score">${result.score_diff || '-'}</div>
                </div>
            </div>

            <!-- Comparison Summary -->
            ${summaryHtml}

            <!-- Dual Item Cards -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">
                <!-- ITEM 1 -->
                <div id="compare-item1" class="compare-item-card" style="
                    border: 2px solid ${item1Border}; 
                    border-radius: 10px; 
                    padding: 15px; 
                    background: rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    ${item1Glow}
                ">
                    ${item1Badge ? `<div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${item1IsWinner ? winnerBorder : similarBorder}; color: #000; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; white-space: nowrap;">${item1Badge}</div>` : ''}
                    <div style="text-align: center; margin-top: ${item1Badge ? '8px' : '0'};">
                        <div style="color: ${item1RarityColor}; font-weight: bold; font-size: 1rem; margin-bottom: 6px;">${item1Name}</div>
                        <div style="color: #999; font-size: 0.8rem; margin-bottom: 8px;">${item1.type || ''}${item1Sanctified}</div>
                        <div style="display: flex; justify-content: center; gap: 15px; font-size: 0.85rem; margin-bottom: 8px;">
                            <span style="color: #ccc;">⚡ ${item1.item_power || '?'}</span>
                            <span style="color: ${item1IsWinner ? '#4caf50' : '#ccc'};">📊 ${item1.score || '?'}</span>
                        </div>
                        ${item1.greater_affix_count ? `<div style="color: gold; font-size: 0.8rem;">✨ ${item1.greater_affix_count} Greater Affix${item1.greater_affix_count > 1 ? 'es' : ''}</div>` : ''}
                        <div style="color: #aaa; font-size: 0.78rem; margin-top: 6px; line-height: 1.4;">${item1.insight || ''}</div>
                    </div>
                </div>

                <!-- ITEM 2 -->
                <div id="compare-item2" class="compare-item-card" style="
                    border: 2px solid ${item2Border}; 
                    border-radius: 10px; 
                    padding: 15px; 
                    background: rgba(0,0,0,0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    ${item2Glow}
                ">
                    ${item2Badge ? `<div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${item2IsWinner ? winnerBorder : similarBorder}; color: #000; padding: 2px 10px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; white-space: nowrap;">${item2Badge}</div>` : ''}
                    <div style="text-align: center; margin-top: ${item2Badge ? '8px' : '0'};">
                        <div style="color: ${item2RarityColor}; font-weight: bold; font-size: 1rem; margin-bottom: 6px;">${item2Name}</div>
                        <div style="color: #999; font-size: 0.8rem; margin-bottom: 8px;">${item2.type || ''}${item2Sanctified}</div>
                        <div style="display: flex; justify-content: center; gap: 15px; font-size: 0.85rem; margin-bottom: 8px;">
                            <span style="color: #ccc;">⚡ ${item2.item_power || '?'}</span>
                            <span style="color: ${item2IsWinner ? '#4caf50' : '#ccc'};">📊 ${item2.score || '?'}</span>
                        </div>
                        ${item2.greater_affix_count ? `<div style="color: gold; font-size: 0.8rem;">✨ ${item2.greater_affix_count} Greater Affix${item2.greater_affix_count > 1 ? 'es' : ''}</div>` : ''}
                        <div style="color: #aaa; font-size: 0.78rem; margin-top: 6px; line-height: 1.4;">${item2.insight || ''}</div>
                    </div>
                </div>
            </div>

            <!-- Full Analysis -->
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.9rem; padding: 8px 0;">📋 View Full Analysis</summary>
                <div class="analysis-text markdown-body" style="margin-top: 10px;">${analysisHtml}</div>
            </details>
            
            ${newScanBtn}
        `;

        // Hover effects
        const addHoverEffect = (el) => {
            if (!el) return;
            el.addEventListener('mouseenter', () => { el.style.transform = 'translateY(-2px)'; el.style.filter = 'brightness(1.1)'; });
            el.addEventListener('mouseleave', () => { el.style.transform = 'translateY(0)'; el.style.filter = 'brightness(1)'; });
        };
        addHoverEffect(document.getElementById('compare-item1'));
        addHoverEffect(document.getElementById('compare-item2'));

        this.el.priceSection.style.display = 'none';
        this.applyPriceVisibility();
        setTimeout(() => this.el.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    },

    // UTILITIES
    toggleAdvanced() {
        if (this.el.advancedPanel) {
            const isHidden = this.el.advancedPanel.classList.contains('h-hidden');
            if (isHidden) {
                this.el.advancedPanel.classList.remove('h-hidden');
                this.el.advancedPanel.style.display = '';
            } else {
                this.el.advancedPanel.classList.add('h-hidden');
                this.el.advancedPanel.style.display = 'none';
            }
        }
    },

    handleFileSelect(e) {
        const file = e.target.files[0];
        if(!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            this.el.imagePreview.src = ev.target.result;
            this.el.imagePreview.style.display = 'block';
            const label = this.el.uploadZone.querySelector('.upload-label');
            if(label) label.style.display = 'none';
        };
        reader.readAsDataURL(file);
        this.el.imageError.style.display = 'none';
    },
    showLoading(show, text) {
        this.el.loading.style.display = show ? 'flex' : 'none';
        this.el.analyzeBtn.disabled = show;
        this.el.compareBtn.disabled = show;
        if (text) this.el.loading.querySelector('.loading-text').textContent = text;
    },
    showError(msg, openSettings = false) {
        this.el.imageError.textContent = msg;
        this.el.imageError.style.display = 'block';
        setTimeout(() => this.el.imageError.style.display = 'none', 5000);
        if(openSettings) this.openSettings();
    },
    clearResults() {
        this.el.resultArea.innerHTML = '';
        this.el.resultsCard.style.display = 'none';
        this.el.priceSection.style.display = 'none';
    },
    closeResults() { this.el.resultsCard.style.display = 'none'; },
    loadState() {
        // Game is always D4 — no need to restore from localStorage
        try { const h = localStorage.getItem('horadric_history'); if(h) { this.state.history = JSON.parse(h); this.renderHistory(); } } catch(e){}
    },
    openSettings() { this.el.settingsPanel.classList.add('open'); },
    closeSettings() { this.el.settingsPanel.classList.remove('open'); },
    
    // ============================================
    // SETTINGS PREFERENCES
    // ============================================
    initPreferences() {
        this.el.prefAutoSave = document.getElementById('auto-save-scans');
        this.el.prefShowPrices = document.getElementById('show-prices');
        
        // Load saved preferences (default: both enabled)
        const saved = JSON.parse(localStorage.getItem('sv_preferences') || '{}');
        this.prefs = {
            autoSave: saved.autoSave !== false,
            showPrices: saved.showPrices !== false
        };
        
        // Apply to checkboxes
        if (this.el.prefAutoSave) this.el.prefAutoSave.checked = this.prefs.autoSave;
        if (this.el.prefShowPrices) this.el.prefShowPrices.checked = this.prefs.showPrices;
        
        // Listen for changes
        if (this.el.prefAutoSave) this.el.prefAutoSave.addEventListener('change', () => {
            this.prefs.autoSave = this.el.prefAutoSave.checked;
            this.savePreferences();
        });
        if (this.el.prefShowPrices) this.el.prefShowPrices.addEventListener('change', () => {
            this.prefs.showPrices = this.el.prefShowPrices.checked;
            this.savePreferences();
            this.applyPriceVisibility();
        });
        
        // Apply initial visibility
        this.applyPriceVisibility();
    },
    savePreferences() {
        localStorage.setItem('sv_preferences', JSON.stringify(this.prefs));
    },
    applyPriceVisibility() {
        const show = this.prefs.showPrices;
        // Hide/show market value section
        if (this.el.priceSection) this.el.priceSection.style.display = show ? '' : 'none';
        // Hide/show price-related action buttons
        if (this.el.priceCheckBtn) this.el.priceCheckBtn.style.display = show ? '' : 'none';
        if (this.el.searchTradeBtn) this.el.searchTradeBtn.style.display = show ? '' : 'none';
    },
    saveToHistory(result) {
        // Respect auto-save preference
        if (this.prefs && !this.prefs.autoSave) return;
        
        const item = { 
            id: Date.now(), 
            title: result.title, 
            rarity: result.rarity, 
            verdict: result.verdict, 
            insight: result.insight, 
            score: result.score || null,
            item_power: result.item_power || null,
            greater_affix_count: result.greater_affix_count || 0,
            type: result.type || null,
            confidence: result.confidence || null,
            analysis: result.analysis || null,
            sanctified: result.sanctified || false,
            game: this.el.gameVersion.value, 
            date: new Date().toLocaleDateString(),
            // Preserve comparison data
            mode: result.mode || null,
            item1: result.item1 || null,
            item2: result.item2 || null,
            winner: result.winner || null,
            score_diff: result.score_diff || null
        };
        this.state.history.unshift(item); 
        if(this.state.history.length > 20) this.state.history.pop();
        localStorage.setItem('horadric_history', JSON.stringify(this.state.history)); 
        this.renderHistory();
    },
    renderHistory() {
        if (!this.state.history.length) { 
            this.el.historyList.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><div class="empty-text">No scans yet</div></div>'; 
            this.el.scanCount.textContent = '0'; 
            return; 
        }
        this.el.scanCount.textContent = this.state.history.length; 
        this.el.historyList.innerHTML = '';
        
        this.state.history.forEach(item => {
            const div = document.createElement('div');
            const r = String(item.rarity || 'common').split(' ')[0].toLowerCase();
            const sanctBadge = item.sanctified ? ' 🦋' : '';
            const scoreBadge = item.score ? ` · ${item.score}` : '';
            
            div.className = `recent-item rarity-${r}`;
            div.innerHTML = `
                <div class="recent-name">${item.title || 'Unknown'}${sanctBadge}</div>
                <div class="recent-header">
                    <span>${item.type || r}${item.item_power ? ` · IP ${item.item_power}` : ''}</span>
                    <span>${item.verdict || '?'}${scoreBadge}</span>
                </div>
            `;
            
            // FIX: Add click listener to re-open the result
            div.addEventListener('click', () => {
                this.renderSuccess(item);
                // Optional: Scroll to top of results on mobile
                this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
            });
            
            this.el.historyList.appendChild(div);
        });
    },
    clearHistory() { if(confirm('Clear all scan history?')) { this.state.history = []; localStorage.removeItem('horadric_history'); this.renderHistory(); } },
    checkPrice() {
        if(!this.state.currentItem) return;
        if(this.prefs && !this.prefs.showPrices) return;
        this.el.priceSection.style.display = 'block';
        this.el.priceContent.innerHTML = 'Checking database...';
        setTimeout(() => {
            const isMythic = String(this.state.currentItem.rarity).toLowerCase().includes('mythic');
            const isSanctified = this.state.currentItem.sanctified;
            const tradeQuery = this.state.currentItem.trade_query || this.state.currentItem.title || '';
            
            let priceHtml = '';
            if (isSanctified) {
                priceHtml = '<span style="color: #ffa500;">Untradable (Sanctified)</span>';
            } else if (isMythic) {
                priceHtml = '<span style="color: #e770ff;">Priceless (Mythic)</span>';
            } else {
                const tradeUrl = `https://diablo.trade/listings/items?exactItem=${encodeURIComponent(tradeQuery)}`;
                priceHtml = `<a href="${tradeUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline;">Check on Diablo.Trade →</a>`;
            }
            this.el.priceContent.innerHTML = `<div style="display: flex; align-items: center; gap: 8px; white-space: nowrap;">💰 Market: ${priceHtml}</div>`;
        }, 500);
    },
    searchTrade() { window.open('https://diablo.trade', '_blank'); },
    shareResults() { 
        const i = this.state.currentItem; 
        if (!i) return;
        
        let text = '';
        
        if (i.mode === 'comparison' && i.item1 && i.item2) {
            // Comparison mode — build a rich Discord-friendly summary
            const item1Name = i.item1.title || 'Item 1';
            const item2Name = i.item2.title || 'Item 2';
            const w = (i.winner || '').toUpperCase();
            const winnerName = w === 'ITEM1' ? item1Name : w === 'ITEM2' ? item2Name : 'Sidegrade';
            
            text = `⚔️ **Horadric AI — Item Comparison**\n`;
            text += `\n`;
            text += `🔹 ${item1Name}`;
            if (i.item1.score) text += ` (${i.item1.score})`;
            text += `\n`;
            text += `🔸 ${item2Name}`;
            if (i.item2.score) text += ` (${i.item2.score})`;
            text += `\n\n`;
            text += `🏆 **Winner: ${winnerName}**`;
            if (i.score_diff) text += ` (+${i.score_diff})`;
            text += `\n`;
            if (i.insight) text += `\n💡 ${i.insight}\n`;
            text += `\n🔗 statverdict.com`;
        } else {
            // Single item mode
            const grade = i.score ? ` [${i.score}]` : '';
            const rarity = i.rarity ? ` (${i.rarity})` : '';
            text = `🔥 **Horadric AI — Item Analysis**\n`;
            text += `\n`;
            text += `📦 **${i.title}**${rarity}${grade}\n`;
            text += `⚖️ Verdict: **${i.verdict}**\n`;
            if (i.insight) text += `\n💡 ${i.insight}\n`;
            text += `\n🔗 statverdict.com`;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard — paste in Discord!');
        }).catch(() => {
            this.showToast('Copy failed — try again');
        });
    },
    restartTour() {
        if (typeof TourGuide !== 'undefined' && TourGuide.restart) {
            TourGuide.restart();
        }
    },
    showToast(message, type = 'success') {
        if (!this.el.toast) return;
        
        this.el.toast.textContent = message;
        this.el.toast.className = `toast toast-${type} toast-show`;
        
        setTimeout(() => {
            this.el.toast.classList.remove('toast-show');
        }, 3000);
    },
    runDemo() {
        if (this.state.phase === 'processing') return;
        this.el.imagePreview.src = 'https://statverdict.com/assets/images/harlequin%20crest.jpg';
        this.el.imagePreview.style.display = 'block';
        const label = this.el.uploadZone.querySelector('.upload-label');
        if(label) label.style.display = 'none';
        const res = { title: "Harlequin Crest", rarity: "Mythic", type: "Helm", verdict: "KEEP", score: "S", item_power: 925, greater_affix_count: 4, insight: "Best-in-slot Mythic helm. Massive +4 to all Skills with unmatched defensive stats. Every class wants this.", analysis: "### Stats Breakdown\n- Item Power: 925/925\n- Key Stats: +4 All Skills, +20% Damage Reduction, +Maximum Life\n- Greater Affixes: 4 (all gold)\n- Sanctified: No\n\n### Verdict\nThis is the most sought-after helm in the game. Keep it permanently.", game: "d4", status: "success", confidence: "high", sanctified: false, isDemo: true };
        this.renderSuccess(res);
    }
};

document.addEventListener('DOMContentLoaded', () => HoradricApp.init());
