// ====================================
// HORADRIC AI - APP ENGINE
// Version: 10.0.0 (Slot-Based Loadout System)
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null,
        mode: 'identify',
        loadout: {
            helm: null,
            chest: null,
            gloves: null,
            pants: null,
            boots: null,
            amulet: null,
            ring1: null,
            ring2: null,
            mainHand: null,
            offHand: null
        }
    },
    
    // Slot type mappings for item detection
    SLOT_KEYWORDS: {
        helm: ['helm', 'helmet', 'crown', 'cowl', 'cap', 'hood', 'circlet', 'mask'],
        chest: ['chest', 'armor', 'tunic', 'mail', 'plate', 'robe', 'vest', 'cuirass', 'body armor'],
        gloves: ['gloves', 'gauntlets', 'handguards', 'grips', 'hands'],
        pants: ['pants', 'legs', 'greaves', 'breeches', 'trousers', 'leggings'],
        boots: ['boots', 'shoes', 'treads', 'sabatons', 'footwear', 'greaves'],
        amulet: ['amulet', 'necklace', 'pendant', 'talisman', 'periapt'],
        ring: ['ring', 'band', 'loop'],
        mainHand: ['sword', 'axe', 'mace', 'dagger', 'wand', 'staff', 'bow', 'crossbow', 'scythe', 'polearm', 'spear', 'two-hand', '2h', 'two hand'],
        offHand: ['shield', 'focus', 'totem', 'quiver', 'off-hand', 'offhand']
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
        this.loadLoadout();
        this.attachEventListeners();
        this.updateGameSelector();
        this.updateClassOptions();
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
        
        // Check if loaded game is unsupported and show coming soon message
        const game = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[game];
        if (support && !support.enabled) {
            this.renderUnsupportedGame(game);
            this.el.analyzeBtn.disabled = true;
            this.el.compareBtn.disabled = true;
        }
        
        console.log('👁️ Horadric Pipeline Active (Slot-Based Loadout System)');
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
        this.setupDragDrop();
    },

    attachEventListeners() {
        this.el.gameVersion.addEventListener('change', () => this.handleGameChange());
        this.el.playerClass.addEventListener('change', () => this.updateBuildOptions());
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
            // Show coming soon UI immediately
            this.renderUnsupportedGame(game);
            this.el.analyzeBtn.disabled = true;
            this.el.compareBtn.disabled = true;
        } else {
            // Re-enable buttons for supported games
            this.el.analyzeBtn.disabled = false;
            this.el.compareBtn.disabled = false;
            this.clearResults();
        }
        
        this.updateClassOptions();
        localStorage.setItem('selected_game', game);
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

    loadLoadout() {
        try {
            const slots = ['helm', 'chest', 'gloves', 'pants', 'boots', 'amulet', 'ring1', 'ring2', 'mainHand', 'offHand'];
            slots.forEach(slot => {
                const stored = localStorage.getItem(`sv_slot_${slot}`);
                if (stored) {
                    this.state.loadout[slot] = JSON.parse(stored);
                }
            });
        } catch (e) {
            console.error('Error loading loadout:', e);
        }
    },

    saveSlot(slot, itemData) {
        try {
            localStorage.setItem(`sv_slot_${slot}`, JSON.stringify(itemData));
            this.state.loadout[slot] = itemData;
        } catch (e) {
            console.error('Error saving slot:', e);
        }
    },

    clearSlot(slot) {
        try {
            localStorage.removeItem(`sv_slot_${slot}`);
            this.state.loadout[slot] = null;
            this.renderLoadoutGrid();
            this.updateBuildSynergy();
            this.showToast(`🗑️ ${this.formatSlotName(slot)} cleared.`);
        } catch (e) {
            console.error('Error clearing slot:', e);
        }
    },

    clearAllSlots() {
        if (!confirm('Clear your entire loadout? This cannot be undone.')) return;
        
        const slots = ['helm', 'chest', 'gloves', 'pants', 'boots', 'amulet', 'ring1', 'ring2', 'mainHand', 'offHand'];
        slots.forEach(slot => {
            localStorage.removeItem(`sv_slot_${slot}`);
            this.state.loadout[slot] = null;
        });
        this.renderLoadoutGrid();
        this.updateBuildSynergy();
        this.showToast('🗑️ All items cleared from loadout.');
    },

    detectItemSlot(result) {
        const searchText = `${result.title} ${result.type} ${result.analysis}`.toLowerCase();
        
        // Check for two-handed weapons first
        const twoHandedKeywords = ['two-hand', '2h', 'two hand', 'staff', 'bow', 'crossbow', 'polearm'];
        const isTwoHanded = twoHandedKeywords.some(keyword => searchText.includes(keyword));
        
        // Check each slot type
        for (const [slot, keywords] of Object.entries(this.SLOT_KEYWORDS)) {
            if (slot === 'mainHand' || slot === 'offHand') continue; // Handle weapons separately
            
            for (const keyword of keywords) {
                if (searchText.includes(keyword)) {
                    return slot === 'ring' ? null : slot; // Ring needs user selection
                }
            }
        }
        
        // Weapon detection
        const isWeapon = this.SLOT_KEYWORDS.mainHand.some(keyword => searchText.includes(keyword));
        const isOffHand = this.SLOT_KEYWORDS.offHand.some(keyword => searchText.includes(keyword));
        
        if (isOffHand) return 'offHand';
        if (isWeapon) {
            return isTwoHanded ? 'twoHanded' : 'mainHand';
        }
        
        // Check for ring
        if (this.SLOT_KEYWORDS.ring.some(keyword => searchText.includes(keyword))) {
            return null; // Trigger ring selection modal
        }
        
        return 'unknown';
    },

    equipItem(result) {
        const slot = this.detectItemSlot(result);
        
        if (slot === 'unknown') {
            this.showToast('⚠️ Could not detect item type. Please try again or contact support.', 'error');
            return;
        }
        
        // Ring selection
        if (slot === null) {
            this.showRingSelectionModal(result);
            return;
        }
        
        // Two-handed weapon logic
        if (slot === 'twoHanded') {
            this.equipToSlot('mainHand', result, true);
            if (this.state.loadout.offHand) {
                this.clearSlot('offHand');
                this.showToast('⚔️ Two-handed weapon equipped. Off-hand cleared.');
            } else {
                this.showToast('⚔️ Two-handed weapon equipped.');
            }
            return;
        }
        
        // Normal slot equip
        this.equipToSlot(slot, result);
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
            offHand: 'Off-Hand'
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

    renderLoadoutGrid() {
        if (!this.el.loadoutGrid) return;
        
        const slots = [
            { id: 'helm', icon: '🎩', name: 'Helm' },
            { id: 'chest', icon: '🛡️', name: 'Chest' },
            { id: 'gloves', icon: '🧤', name: 'Gloves' },
            { id: 'pants', icon: '👖', name: 'Pants' },
            { id: 'boots', icon: '👢', name: 'Boots' },
            { id: 'amulet', icon: '📿', name: 'Amulet' },
            { id: 'ring1', icon: '💍', name: 'Ring 1' },
            { id: 'ring2', icon: '💍', name: 'Ring 2' },
            { id: 'mainHand', icon: '⚔️', name: 'Main Hand' },
            { id: 'offHand', icon: '🛡️', name: 'Off-Hand' }
        ];
        
        this.el.loadoutGrid.innerHTML = slots.map(slot => {
            const item = this.state.loadout[slot.id];
            const isEmpty = !item;
            const rarityColor = isEmpty ? '#555' : this.getRarityColor(item.rarity);
            const isDisabled = slot.id === 'offHand' && this.state.loadout.mainHand?.isTwoHanded;
            
            return `
                <div class="loadout-slot ${isEmpty ? 'empty' : 'filled'} ${isDisabled ? 'disabled' : ''}" 
                     data-slot="${slot.id}"
                     style="border-color: ${rarityColor};">
                    <div class="slot-header">
                        <span class="slot-icon">${slot.icon}</span>
                        <span class="slot-name">${slot.name}</span>
                    </div>
                    ${isEmpty ? 
                        `<div class="slot-empty-text">${isDisabled ? 'Two-Handed' : 'Empty'}</div>` :
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
                if (item) {
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
        
        // Define synergy keywords for each mechanic (ALL CLASSES INCLUDING PALADIN)
        const synergyKeywords = {
            // Barbarian mechanics
            'thorns': ['thorns', 'reflect', 'return damage', 'retaliate'],
            'overpower': ['overpower', 'lucky hit', 'critical strike', 'crit'],
            'berserking': ['berserking', 'berserk', 'fury', 'rage'],
            'bleed': ['bleed', 'bleeding', 'hemorrhage', 'lacerate'],
            'fortify': ['fortify', 'fortified', 'fortification'],
            
            // Druid mechanics
            'spirit': ['spirit', 'spirit generation', 'spirit boons'],
            'nature': ['nature', 'nature magic', 'earth', 'storm'],
            'shapeshifting': ['werebear', 'werewolf', 'shapeshifting', 'transform'],
            
            // Necromancer mechanics
            'minion': ['minion', 'summon', 'skeleton', 'golem', 'companion', 'pet'],
            'blood-orb': ['blood orb', 'blood', 'essence', 'corpse'],
            'essence': ['essence', 'essence generation', 'essence regen'],
            
            // Paladin mechanics
            'block-chance': ['block', 'block chance', 'blocking', 'shield block', 'block rating'],
            'holy-damage': ['holy', 'holy damage', 'divine', 'sacred', 'light damage', 'radiant'],
            'fortify-generation': ['fortify', 'fortified', 'fortification', 'fortify generation'],
            'auras': ['aura', 'auras', 'aura effect', 'sanctify', 'consecrate'],
            'divine-wrath': ['divine wrath', 'wrath', 'divine', 'smite', 'judgment'],
            'consecrated-ground': ['consecrated ground', 'consecrated', 'holy ground', 'sanctified ground'],
            
            // Rogue mechanics
            'critical-strike': ['critical strike', 'crit', 'critical damage'],
            'vulnerable': ['vulnerable', 'vulnerability', 'vulnerable damage'],
            'lucky-hit': ['lucky hit', 'lucky hit chance'],
            'energy': ['energy', 'energy generation', 'energy regen'],
            'shadow': ['shadow', 'shadow imbuement', 'darkness'],
            
            // Sorcerer mechanics
            'mana': ['mana', 'mana generation', 'mana regen'],
            'cooldown': ['cooldown', 'cooldown reduction', 'cdr'],
            'barrier': ['barrier', 'barrier generation', 'shields'],
            'crackling': ['crackling', 'crackling energy', 'shock'],
            
            // Spiritborn mechanics
            'vigor': ['vigor', 'vigor generation'],
            'dodge': ['dodge', 'dodge chance', 'evade'],
            'resolve': ['resolve', 'resolve stacks'],
            'spirit-bonds': ['spirit', 'bond', 'spirit bonds'],
            
            // Legacy/alternate names
            'low-life': ['low life', 'injured', 'below', 'when hurt', 'damage taken'],
            'minion-only': ['minion', 'summon', 'skeleton', 'golem', 'companion', 'pet']
        };
        
        // Normalize mechanic value to match keyword keys
        const mechanicKey = mechanic.toLowerCase().replace(/ /g, '-');
        const keywords = synergyKeywords[mechanicKey] || [];
        
        if (keywords.length === 0) {
            this.el.buildSynergy.style.display = 'none';
            return;
        }
        
        // Count matching items
        let matchCount = 0;
        let totalItems = 0;
        
        Object.values(this.state.loadout).forEach(item => {
            if (!item) return;
            totalItems++;
            
            const itemText = `${item.title} ${item.analysis} ${item.insight}`.toLowerCase();
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
        
        if (percentage >= 70) {
            message = `✅ Excellent synergy! ${matchCount}/${totalItems} items support your ${this.el.keyMechanic.options[this.el.keyMechanic.selectedIndex].text} build.`;
            iconClass = 'synergy-high';
        } else if (percentage >= 40) {
            message = `⚠️ Moderate synergy. ${matchCount}/${totalItems} items support your ${this.el.keyMechanic.options[this.el.keyMechanic.selectedIndex].text} build.`;
            iconClass = 'synergy-medium';
        } else {
            message = `❌ Low synergy. Only ${matchCount}/${totalItems} items support your ${this.el.keyMechanic.options[this.el.keyMechanic.selectedIndex].text} build.`;
            iconClass = 'synergy-low';
        }
        
        this.el.buildSynergy.className = `build-synergy ${iconClass}`;
        this.el.buildSynergy.innerHTML = `
            <div class="synergy-bar">
                <div class="synergy-fill" style="width: ${percentage}%;"></div>
            </div>
            <div class="synergy-text">${message}</div>
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
            this.renderUnsupportedGame(selectedGame);
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
                this.renderUnsupportedGame(result.detected_game, result.message);
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
                        temperature: 0.0
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
            console.error('JSON parse error:', e, 'Input:', str);
            return null; 
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
        this.el.resultsCard.style.display = 'block';
        
        const rarity = String(result.rarity || 'common').split(' ')[0].toLowerCase();
        const verdict = String(result.verdict || 'UNKNOWN').toUpperCase();
        
        const confidenceBadge = (result.confidence === 'medium' || result.confidence === 'low')
            ? `<span style="font-size: 0.8rem; color: #ffa500; margin-left: 10px;">⚠️ ${result.confidence} confidence</span>`
            : '';
        
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t; 
        const analysisHtml = renderMarkdown(result.analysis || '');

        let verdictColor = 'neutral';
        if (['KEEP', 'EQUIP', 'SELL', 'UPGRADE', 'EQUIP NEW'].includes(verdict)) verdictColor = 'keep';
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

    // UTILITIES
    toggleAdvanced() {
        this.el.advancedPanel.classList.toggle('hidden');
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
            div.innerHTML = `<div class="recent-header"><span>${g}${sanctBadge}</span><span>${item.verdict || '?'}</span></div><div class="recent-name">${item.title || 'Unknown'}</div>`;
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