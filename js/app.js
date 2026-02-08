// ====================================
// HORADRIC AI - APP ENGINE  
// Version: 12.0.0 (Season 11 / Accurate Class-Weapon System + Any Class Support)
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null,
        mode: 'identify',
        currentClass: 'barbarian',  // NEW: Track current class
        loadout: {}  // CHANGED: Dynamic loadout object
    },
    
    // NEW: CLASS-SPECIFIC SLOT CONFIGURATIONS
    CLASS_SLOTS: {
        any: [
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
            { id: 'helm', icon: '🎩', name: 'Helm', category: 'armor' },
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
        this.initializeLoadout();  // CHANGED: Use new function name
        this.attachEventListeners();
        this.updateGameSelector();
        this.updateClassOptions();
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
        
        // Check if loaded game is unsupported and show coming soon overlay
        const game = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[game];
        if (support && !support.enabled) {
            this.showUnsupportedOverlay(game);
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
        this.el.apiKey = document.getElementById('api-key');
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
        this.el.gameVersion.addEventListener('change', () => this.handleGameChange());
        // UPDATED: Class change listener with dynamic slot rendering
        this.el.playerClass.addEventListener('change', () => {
            const selectedClass = this.el.playerClass.value.toLowerCase();
            this.state.currentClass = selectedClass;
            this.saveState();
            this.updateBuildOptions();
            this.renderLoadoutGrid();
            this.updateBuildSynergy();
        });
        this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());
        this.el.analyzeBtn.addEventListener('click', () => { this.state.mode = 'identify'; this.handleAnalyze(); });
        this.el.compareBtn.addEventListener('click', () => { this.state.mode = 'compare'; this.handleAnalyze(); });
        this.el.demoBtn.addEventListener('click', () => this.runDemo());
        this.el.settingsTrigger.addEventListener('click', () => this.openSettings());
        this.el.settingsClose.addEventListener('click', () => this.closeSettings());
        this.el.settingsOverlay.addEventListener('click', () => this.closeSettings());
        this.el.helpTrigger.addEventListener('click', () => this.restartTour());
        this.el.apiKey.addEventListener('blur', () => this.saveApiKey());
        this.el.closeResults.addEventListener('click', () => this.closeResults());
        this.el.clearHistory.addEventListener('click', () => this.clearHistory());
        if(this.el.shareBtn) this.el.shareBtn.addEventListener('click', () => this.shareResults());
        if(this.el.priceCheckBtn) this.el.priceCheckBtn.addEventListener('click', () => this.checkPrice());
        if(this.el.searchTradeBtn) this.el.searchTradeBtn.addEventListener('click', () => this.searchTrade());
        if(this.el.keyMechanic) this.el.keyMechanic.addEventListener('change', () => this.updateBuildSynergy());
        
        // Loadout button
        const clearLoadoutBtn = document.getElementById('clear-loadout-btn');
        if(clearLoadoutBtn) clearLoadoutBtn.addEventListener('click', () => this.clearAllSlots());
        
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

    updateGameSelector() {
        const options = this.el.gameVersion.querySelectorAll('option');
        options.forEach(opt => {
            const game = opt.value;
            const support = CONFIG.GAME_SUPPORT[game];
            if (support && !support.enabled) {
                opt.textContent = `${support.label} (Coming Soon)`;
                opt.style.color = '#888';
            }
        });
    },

    handleGameChange() {
        const game = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[game];
        
        if (support && !support.enabled) {
            // Show coming soon overlay INSIDE the scan card
            this.showUnsupportedOverlay(game);
        } else {
            // Hide overlay and re-enable everything
            this.hideUnsupportedOverlay();
        }
        
        this.updateClassOptions();
        localStorage.setItem('selected_game', game);
    },

    showUnsupportedOverlay(game) {
        const support = CONFIG.GAME_SUPPORT[game];
        const gameName = support ? support.label : game.toUpperCase();
        
        // Set overlay message
        if (this.el.unsupportedMessage) {
            this.el.unsupportedMessage.textContent = `${gameName} analysis is coming soon! Currently only Diablo IV is supported.`;
        }
        
        // Show overlay over the scan card content
        if (this.el.unsupportedOverlay) {
            this.el.unsupportedOverlay.style.display = 'block';
        }
        
        // Disable all action buttons EXCEPT demo
        this.el.analyzeBtn.disabled = true;
        this.el.compareBtn.disabled = true;
        this.el.analyzeBtn.style.opacity = '0.4';
        this.el.compareBtn.style.opacity = '0.4';
        
        // Disable upload, class, and advanced controls
        if (this.el.imageUpload) this.el.imageUpload.disabled = true;
        if (this.el.playerClass) this.el.playerClass.disabled = true;
        if (this.el.buildStyle) this.el.buildStyle.disabled = true;
        if (this.el.keyMechanic) this.el.keyMechanic.disabled = true;
        if (this.el.toggleAdvanced) this.el.toggleAdvanced.disabled = true;
        
        // Hide the results card if it was open
        this.clearResults();
    },

    hideUnsupportedOverlay() {
        // Hide overlay
        if (this.el.unsupportedOverlay) {
            this.el.unsupportedOverlay.style.display = 'none';
        }
        
        // Re-enable all buttons
        this.el.analyzeBtn.disabled = false;
        this.el.compareBtn.disabled = false;
        this.el.analyzeBtn.style.opacity = '1';
        this.el.compareBtn.style.opacity = '1';
        
        // Re-enable controls
        if (this.el.imageUpload) this.el.imageUpload.disabled = false;
        if (this.el.playerClass) this.el.playerClass.disabled = false;
        if (this.el.buildStyle) this.el.buildStyle.disabled = false;
        if (this.el.keyMechanic) this.el.keyMechanic.disabled = false;
        if (this.el.toggleAdvanced) this.el.toggleAdvanced.disabled = false;
        
        this.clearResults();
    },

    updateClassOptions() {
        const game = this.el.gameVersion.value;
        const classes = CONFIG.GAME_CLASSES[game] || CONFIG.GAME_CLASSES.d4;
        
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
        const game = this.el.gameVersion.value;
        const classId = this.el.playerClass.value;
        const classes = CONFIG.GAME_CLASSES[game] || CONFIG.GAME_CLASSES.d4;
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

    // UPDATED: Equip item with class-specific logic
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
        
        // For classes with hybrid weapon logic (Paladin, Sorcerer, Druid, Necromancer)
        const hybridClasses = ['paladin', 'sorcerer', 'druid', 'necromancer'];
        if (hybridClasses.includes(this.state.currentClass) && 
            isTwoHandedWeapon && 
            (slot === 'mainHand' || slot === 'twoHanded')) {
            this.equipToSlot(slot, result, true);
            if (this.state.loadout.offHand) {
                this.clearSlot('offHand');
                this.showToast('⚔️ Two-handed weapon equipped. Off-hand cleared.');
            } else {
                this.showToast('⚔️ Two-handed weapon equipped.');
            }
            return;
        }
        
        // Normal slot equip
        this.equipToSlot(slot, result, isTwoHandedWeapon);
        this.showToast(`⚔️ ${result.title} equipped to ${this.formatSlotName(slot)}!`);
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
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h3 style="margin-top: 0; color: var(--accent-color);">💍 Equip Ring</h3>
                <p style="margin-bottom: 20px;">Which ring slot would you like to equip this to?</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button id="ring-slot-1" class="btn-primary">Ring Slot 1</button>
                    <button id="ring-slot-2" class="btn-primary">Ring Slot 2</button>
                    <button id="ring-cancel" class="btn-secondary">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('ring-slot-1').addEventListener('click', () => {
            this.equipToSlot('ring1', result);
            this.showToast(`💍 ${result.title} equipped to Ring Slot 1!`);
            modal.remove();
        });
        
        document.getElementById('ring-slot-2').addEventListener('click', () => {
            this.equipToSlot('ring2', result);
            this.showToast(`💍 ${result.title} equipped to Ring Slot 2!`);
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
        modal.className = 'modal-overlay';
        modal.style.display = 'flex';
        
        const rarityColor = this.getRarityColor(item.rarity);
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t;
        const analysisHtml = renderMarkdown(item.analysis || '');
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <button class="modal-close" id="slot-modal-close">×</button>
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
                    <button id="unequip-btn" class="btn-secondary">🗑️ Unequip</button>
                    <button id="slot-modal-close-btn" class="btn-primary">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => modal.remove();
        
        document.getElementById('slot-modal-close').addEventListener('click', closeModal);
        document.getElementById('slot-modal-close-btn').addEventListener('click', closeModal);
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
    // ENHANCED ANALYSIS PIPELINE
    // ============================================

    async handleAnalyze() {
        if (!this.state.apiKey) return this.showError('API Key Missing', true);
        if (!this.el.imagePreview.src) return this.showError('No image loaded');

        const selectedGame = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[selectedGame];
        
        if (support && !support.enabled) {
            this.showUnsupportedOverlay(selectedGame);
            return;
        }

        this.showLoading(true, "Analyzing...");
        this.clearResults();

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

        } catch (error) {
            console.error('Analysis error:', error);
            
            // ANALYTICS HOOK: Track error
            if (typeof Analytics !== 'undefined' && Analytics.trackError) {
                Analytics.trackError('analysis_failed', error.message);
            }
            
            this.showError(`Error: ${error.message}`);
        } finally {
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
        
        if (result.reject_reason === 'not_game') {
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

    async callGemini(prompt, imageBase64, mimeType) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.state.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            { inline_data: { mime_type: mimeType, data: imageBase64 } }
                        ]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json",
                        temperature: 0.0,
                        max_output_tokens: 8192
                    }
                })
            });

            if (!response.ok) {
                const err = await response.json();
                console.error('Gemini API error:', err);
                throw new Error(err.error?.message || `API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
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
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderWrongGame(detected, customMessage) {
        const target = this.el.gameVersion.options[this.el.gameVersion.selectedIndex].text;
        const map = { 'd4': 'Diablo IV', 'd2r': 'Diablo II: Resurrected', 'd3': 'Diablo III', 'di': 'Diablo Immortal' };
        const detectedName = map[detected] || detected.toUpperCase();
        const message = customMessage || `This looks like a ${detectedName} item, but you selected ${target}.`;

        this.el.resultsCard.style.display = 'block';
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--color-warning);">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <h3 style="margin-bottom: 10px;">Wrong Game Selected</h3>
                <p style="font-size: 1.1rem; color: #fff;">${message}</p>
                <div style="margin-top:15px; font-size: 0.9rem; color: #ccc;">
                    Please change the "Game Version" selector at the top to match your screenshot.
                </div>
            </div>
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderSuccess(result) {
        this.state.currentItem = result;
        
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

        this.el.resultArea.innerHTML = `
            <div class="result-header rarity-${rarity}">
                <h2 class="item-title">${result.title || 'Unknown Item'}${sanctifiedBadge}${confidenceBadge}</h2>
                <span class="item-type">${result.type || result.rarity || ''}</span>
            </div>
            <div class="verdict-container ${verdictColor}">
                <div class="verdict-label">${verdict}</div>
                <div class="verdict-score">${result.score || result.score_diff || '-'}</div>
            </div>
            <div class="insight-box">
                <strong style="color: var(--accent-color);">💡 Insight:</strong> ${result.insight || ''}
            </div>
            <div class="analysis-text markdown-body">${analysisHtml}</div>
            <div class="result-actions">
                <button id="equip-item-btn" class="btn-equip">⚔️ Equip This Item</button>
            </div>
        `;
        
        const equipBtn = document.getElementById('equip-item-btn');
        if (equipBtn) {
            equipBtn.addEventListener('click', () => this.equipItem(result));
        }
        
        this.el.priceSection.style.display = 'none';
        setTimeout(() => this.el.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    },

    // ============================================
    // COMPARISON RESULT: Dual-Item Equip Selection
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
        
        const item1Rarity = String(item1.rarity || 'common').split(' ')[0].toLowerCase();
        const item2Rarity = String(item2.rarity || 'common').split(' ')[0].toLowerCase();
        const item1RarityColor = this.getRarityColor(item1.rarity);
        const item2RarityColor = this.getRarityColor(item2.rarity);
        
        const item1Sanctified = item1.sanctified ? '<span style="color: gold; font-size: 0.8rem;"> 🦋 Sanctified</span>' : '';
        const item2Sanctified = item2.sanctified ? '<span style="color: gold; font-size: 0.8rem;"> 🦋 Sanctified</span>' : '';

        // Glow effect for winner
        const item1Glow = item1IsWinner ? 'box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);' : '';
        const item2Glow = item2IsWinner ? 'box-shadow: 0 0 15px rgba(76, 175, 80, 0.4);' : '';

        this.el.resultArea.innerHTML = `
            <div style="margin-bottom: 15px;">
                <div class="verdict-container ${isSimilar ? 'neutral' : (item1IsWinner || item2IsWinner ? 'keep' : 'neutral')}">
                    <div class="verdict-label">${result.verdict || 'COMPARE'}</div>
                    <div class="verdict-score">${result.score_diff || '-'}</div>
                </div>
                <div class="insight-box" style="margin-top: 10px;">
                    <strong style="color: var(--accent-color);">💡 Insight:</strong> ${result.insight || ''}
                </div>
            </div>

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
                        <div style="color: ${item1RarityColor}; font-weight: bold; font-size: 1rem; margin-bottom: 6px;">${item1.title || 'Item 1'}</div>
                        <div style="color: #999; font-size: 0.8rem; margin-bottom: 8px;">${item1.type || ''}${item1Sanctified}</div>
                        <div style="display: flex; justify-content: center; gap: 15px; font-size: 0.85rem; margin-bottom: 8px;">
                            <span style="color: #ccc;">⚡ ${item1.item_power || '?'}</span>
                            <span style="color: ${item1IsWinner ? '#4caf50' : '#ccc'};">📊 ${item1.score || '?'}</span>
                        </div>
                        ${item1.greater_affix_count ? `<div style="color: gold; font-size: 0.8rem;">✨ ${item1.greater_affix_count} Greater Affix${item1.greater_affix_count > 1 ? 'es' : ''}</div>` : ''}
                        <div style="color: #aaa; font-size: 0.78rem; margin-top: 6px; line-height: 1.4;">${item1.insight || ''}</div>
                    </div>
                    <button id="equip-item1-btn" class="btn-equip" style="
                        width: 100%; 
                        margin-top: 12px; 
                        padding: 10px;
                        border: 1px solid ${item1Border};
                        background: rgba(${item1IsWinner ? '76,175,80' : item2IsWinner ? '244,67,54' : '255,165,0'},0.15);
                        font-size: 0.85rem;
                    ">⚔️ Equip Item 1</button>
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
                        <div style="color: ${item2RarityColor}; font-weight: bold; font-size: 1rem; margin-bottom: 6px;">${item2.title || 'Item 2'}</div>
                        <div style="color: #999; font-size: 0.8rem; margin-bottom: 8px;">${item2.type || ''}${item2Sanctified}</div>
                        <div style="display: flex; justify-content: center; gap: 15px; font-size: 0.85rem; margin-bottom: 8px;">
                            <span style="color: #ccc;">⚡ ${item2.item_power || '?'}</span>
                            <span style="color: ${item2IsWinner ? '#4caf50' : '#ccc'};">📊 ${item2.score || '?'}</span>
                        </div>
                        ${item2.greater_affix_count ? `<div style="color: gold; font-size: 0.8rem;">✨ ${item2.greater_affix_count} Greater Affix${item2.greater_affix_count > 1 ? 'es' : ''}</div>` : ''}
                        <div style="color: #aaa; font-size: 0.78rem; margin-top: 6px; line-height: 1.4;">${item2.insight || ''}</div>
                    </div>
                    <button id="equip-item2-btn" class="btn-equip" style="
                        width: 100%; 
                        margin-top: 12px; 
                        padding: 10px;
                        border: 1px solid ${item2Border};
                        background: rgba(${item2IsWinner ? '76,175,80' : item1IsWinner ? '244,67,54' : '255,165,0'},0.15);
                        font-size: 0.85rem;
                    ">⚔️ Equip Item 2</button>
                </div>
            </div>

            <!-- Full Analysis -->
            <details style="margin-top: 10px;">
                <summary style="cursor: pointer; color: var(--accent-color); font-size: 0.9rem; padding: 8px 0;">📋 View Full Analysis</summary>
                <div class="analysis-text markdown-body" style="margin-top: 10px;">${analysisHtml}</div>
            </details>
        `;

        // Hover effects
        const addHoverEffect = (el) => {
            if (!el) return;
            el.addEventListener('mouseenter', () => { el.style.transform = 'translateY(-2px)'; el.style.filter = 'brightness(1.1)'; });
            el.addEventListener('mouseleave', () => { el.style.transform = 'translateY(0)'; el.style.filter = 'brightness(1)'; });
        };
        addHoverEffect(document.getElementById('compare-item1'));
        addHoverEffect(document.getElementById('compare-item2'));

        // Equip button listeners — build full result-like objects for equipItem()
        const equip1Btn = document.getElementById('equip-item1-btn');
        const equip2Btn = document.getElementById('equip-item2-btn');
        
        if (equip1Btn) {
            equip1Btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.equipItem({
                    title: item1.title,
                    type: item1.type,
                    rarity: item1.rarity,
                    sanctified: item1.sanctified,
                    item_power: item1.item_power,
                    score: item1.score,
                    insight: item1.insight,
                    analysis: result.analysis
                });
            });
        }
        
        if (equip2Btn) {
            equip2Btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.equipItem({
                    title: item2.title,
                    type: item2.type,
                    rarity: item2.rarity,
                    sanctified: item2.sanctified,
                    item_power: item2.item_power,
                    score: item2.score,
                    insight: item2.insight,
                    analysis: result.analysis
                });
            });
        }

        this.el.priceSection.style.display = 'none';
        setTimeout(() => this.el.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    },

    // UTILITIES
    toggleAdvanced() {
        if (this.el.advancedPanel) {
            this.el.advancedPanel.classList.toggle('hidden');
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
        try { const k = localStorage.getItem('gemini_api_key'); if(k) { this.state.apiKey = atob(k); this.el.apiKey.value = this.state.apiKey; } } catch(e){}
        const g = localStorage.getItem('selected_game'); if(g) this.el.gameVersion.value = g;
        try { const h = localStorage.getItem('horadric_history'); if(h) { this.state.history = JSON.parse(h); this.renderHistory(); } } catch(e){}
    },
    saveApiKey() {
        const k = this.el.apiKey.value.trim(); if(!k) return;
        this.state.apiKey = k; localStorage.setItem('gemini_api_key', btoa(k));
    },
    openSettings() { this.el.settingsPanel.classList.add('open'); },
    closeSettings() { this.el.settingsPanel.classList.remove('open'); },
    saveToHistory(result) {
        const item = { 
            id: Date.now(), 
            title: result.title, 
            rarity: result.rarity, 
            verdict: result.verdict, 
            insight: result.insight, 
            game: this.el.gameVersion.value, 
            date: new Date().toLocaleDateString(),
            sanctified: result.sanctified || false
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
            const g = String(item.game || 'd4').toUpperCase();
            const r = String(item.rarity || 'common').split(' ')[0].toLowerCase();
            const sanctBadge = item.sanctified ? ' 🦋' : '';
            
            div.className = `recent-item rarity-${r}`;
            div.innerHTML = `
                <div class="recent-header">
                    <span>${g}${sanctBadge}</span>
                    <span>${item.verdict || '?'}</span>
                </div>
                <div class="recent-name">${item.title || 'Unknown'}</div>
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
        this.el.priceSection.style.display = 'block';
        this.el.priceContent.innerHTML = 'Checking database...';
        setTimeout(() => {
            const isMythic = String(this.state.currentItem.rarity).toLowerCase().includes('mythic');
            const isSanctified = this.state.currentItem.sanctified;
            let priceText = 'Check Trade Site';
            if (isMythic) priceText = 'Priceless (Mythic)';
            if (isSanctified) priceText = 'Untradable (Sanctified)';
            this.el.priceContent.innerHTML = `<div>Value: ${priceText}</div>`;
        }, 500);
    },
    searchTrade() { window.open('https://diablo.trade', '_blank'); },
    shareResults() { const i = this.state.currentItem; if(i) navigator.clipboard.writeText(`${i.title} - ${i.verdict}`); },
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
        this.el.imagePreview.src = 'https://statverdict.com/assets/images/harlequin%20crest.jpg';
        this.el.imagePreview.style.display = 'block';
        const label = this.el.uploadZone.querySelector('.upload-label');
        if(label) label.style.display = 'none';
        const res = { title: "Harlequin Crest", rarity: "mythic", verdict: "KEEP", score: "S-Tier", insight: "Best-in-slot Mythic helm", game: "d4", status: "success", sanctified: false };
        this.renderSuccess(res); this.saveToHistory(res);
    }
};

document.addEventListener('DOMContentLoaded', () => HoradricApp.init());