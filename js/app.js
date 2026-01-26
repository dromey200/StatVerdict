// ====================================
// Dashboard App - Pricing Integrated
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null, // Stores the full object of the currently viewed item
        mode: 'identify',
        analysisController: null
    },
    
    el: {},
    
    init() {
        this.cacheElements();
        this.loadState();
        this.attachEventListeners();
        this.setupDragDrop();
        this.updateGameClasses();
        
        console.log('🎮 Horadric Dashboard initialized');
        
        // Safety check for Analytics
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackPageView === 'function') {
            Analytics.trackPageView();
        }
    },
    
    cacheElements() {
        // Header elements
        this.el.gameVersion = document.getElementById('game-version');
        this.el.settingsTrigger = document.getElementById('settings-trigger');
        this.el.helpTrigger = document.getElementById('help-trigger');
        
        // Scan card elements
        this.el.imageUpload = document.getElementById('image-upload');
        this.el.uploadZone = document.getElementById('upload-zone');
        this.el.imagePreview = document.getElementById('image-preview');
        this.el.playerClass = document.getElementById('player-class');
        this.el.modeIdentify = document.getElementById('mode-identify');
        this.el.modeCompare = document.getElementById('mode-compare');
        this.el.toggleAdvanced = document.getElementById('toggle-advanced');
        this.el.advancedPanel = document.getElementById('advanced-panel');
        this.el.buildStyle = document.getElementById('build-style');
        this.el.keyMechanic = document.getElementById('key-mechanic');
        this.el.analyzeBtn = document.getElementById('analyze-btn');
        this.el.demoBtn = document.getElementById('demo-btn');
        this.el.loading = document.getElementById('loading');
        this.el.imageError = document.getElementById('image-error');
        this.el.imageSuccess = document.getElementById('image-success');
        this.el.progressContainer = document.getElementById('progress-container');
        this.el.progressBar = document.getElementById('progress-bar');
        
        // Recent scans elements
        this.el.historyList = document.getElementById('history-list');
        this.el.clearHistory = document.getElementById('clear-history');
        this.el.scanCount = document.getElementById('scan-count');
        
        // Results card elements
        this.el.resultsCard = document.getElementById('results-card');
        this.el.closeResults = document.getElementById('close-results');
        this.el.resultArea = document.getElementById('result-area');
        this.el.priceSection = document.getElementById('price-section');
        this.el.priceContent = document.getElementById('price-content');
        this.el.shareBtn = document.getElementById('share-btn');
        this.el.priceCheckBtn = document.getElementById('price-check-btn');
        this.el.searchTradeBtn = document.getElementById('search-trade-btn');
        this.el.refreshPriceBtn = document.getElementById('refresh-price-btn'); // New Cache
        
        // Settings panel elements
        this.el.settingsPanel = document.getElementById('settings-panel');
        this.el.settingsClose = document.getElementById('settings-close');
        this.el.settingsOverlay = document.querySelector('.settings-overlay');
        this.el.apiKey = document.getElementById('api-key');
        this.el.apiKeyError = document.getElementById('api-key-error');
        this.el.apiKeySuccess = document.getElementById('api-key-success');
        
        // Modal elements
        this.el.helpModal = document.getElementById('help-modal');
        this.el.modalContent = document.getElementById('modal-content-dynamic');
        this.el.modalCloseBtn = document.getElementById('modal-close-btn');
    },
    
    loadState() {
        try {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                this.state.apiKey = atob(savedKey);
                this.el.apiKey.value = this.state.apiKey;
            }
        } catch (e) {
            console.warn('Failed to load API key:', e);
            localStorage.removeItem('gemini_api_key');
        }
        
        try {
            const savedHistory = localStorage.getItem('horadric_history');
            if (savedHistory) {
                this.state.history = JSON.parse(savedHistory);
                this.renderHistory();
            }
        } catch (e) {
            console.warn('Failed to load history:', e);
        }
        
        const savedGame = localStorage.getItem('selected_game');
        if (savedGame) {
            this.el.gameVersion.value = savedGame;
        }
    },
    
    attachEventListeners() {
        this.el.gameVersion.addEventListener('change', () => this.updateGameClasses());
        this.el.settingsTrigger.addEventListener('click', () => this.openSettings());
        this.el.helpTrigger.addEventListener('click', () => this.openHelp());
        
        this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.el.modeIdentify.addEventListener('click', () => this.setMode('identify'));
        this.el.modeCompare.addEventListener('click', () => this.setMode('compare'));
        this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());
        this.el.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        this.el.demoBtn.addEventListener('click', () => this.runDemo());
        
        this.el.clearHistory.addEventListener('click', () => this.clearHistory());
        
        if (this.el.closeResults) this.el.closeResults.addEventListener('click', () => this.closeResults());
        if (this.el.shareBtn) this.el.shareBtn.addEventListener('click', () => this.shareResults());
        if (this.el.priceCheckBtn) this.el.priceCheckBtn.addEventListener('click', () => this.checkPrice());
        if (this.el.searchTradeBtn) this.el.searchTradeBtn.addEventListener('click', () => this.searchTrade());
        if (this.el.refreshPriceBtn) this.el.refreshPriceBtn.addEventListener('click', () => this.checkPrice());
        
        this.el.settingsClose.addEventListener('click', () => this.closeSettings());
        this.el.settingsOverlay.addEventListener('click', () => this.closeSettings());
        this.el.apiKey.addEventListener('blur', () => this.saveApiKey());
        
        this.el.modalCloseBtn.addEventListener('click', () => this.closeModal());
        this.el.helpModal.addEventListener('click', (e) => {
            if (e.target === this.el.helpModal) this.closeModal();
        });
    },
    
    setupDragDrop() {
        const zone = this.el.uploadZone;
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.add('drag-over'));
        });
        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.remove('drag-over'));
        });
        zone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.el.imageUpload.files = e.dataTransfer.files;
                this.handleFileSelect({ target: this.el.imageUpload });
            }
        });
    },
    
    updateGameClasses() {
        const game = this.el.gameVersion.value;
        const defaultClasses = {
            'd4': ['Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Rogue', 'Sorcerer', 'Spiritborn'],
            'd2r': ['Amazon', 'Assassin', 'Barbarian', 'Druid', 'Necromancer', 'Paladin', 'Sorceress'],
            'd3': ['Barbarian', 'Crusader', 'Demon Hunter', 'Monk', 'Necromancer', 'Witch Doctor', 'Wizard'],
            'di': ['Barbarian', 'Crusader', 'Demon Hunter', 'Monk', 'Necromancer', 'Wizard']
        };
        const classes = (typeof CONFIG !== 'undefined' && CONFIG.GAME_CLASSES) ? CONFIG.GAME_CLASSES[game] : defaultClasses[game] || [];
        
        this.el.playerClass.innerHTML = '<option value="Any">Any Class</option>';
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls;
            option.textContent = cls;
            this.el.playerClass.appendChild(option);
        });
        
        const defaultBuildStyles = [
            { value: 'damage', label: 'Damage Dealer' },
            { value: 'tank', label: 'Tank/Survivability' },
            { value: 'support', label: 'Support/Utility' }
        ];
        const buildStyles = (typeof CONFIG !== 'undefined' && CONFIG.BUILD_STYLES) ? CONFIG.BUILD_STYLES : defaultBuildStyles;
        
        this.el.buildStyle.innerHTML = '<option value="">Any Build</option>';
        buildStyles.forEach(style => {
            const option = document.createElement('option');
            option.value = style.value;
            option.textContent = style.label;
            this.el.buildStyle.appendChild(option);
        });
        localStorage.setItem('selected_game', game);
    },
    
    setMode(mode) {
        this.state.mode = mode;
        if (mode === 'identify') {
            this.el.modeIdentify.classList.add('active');
            this.el.modeCompare.classList.remove('active');
            this.el.modeIdentify.setAttribute('aria-pressed', 'true');
            this.el.modeCompare.setAttribute('aria-pressed', 'false');
        } else {
            this.el.modeCompare.classList.add('active');
            this.el.modeIdentify.classList.remove('active');
            this.el.modeCompare.setAttribute('aria-pressed', 'true');
            this.el.modeIdentify.setAttribute('aria-pressed', 'false');
        }
    },
    
    toggleAdvanced() {
        const isExpanded = this.el.toggleAdvanced.getAttribute('aria-expanded') === 'true';
        this.el.toggleAdvanced.setAttribute('aria-expanded', !isExpanded);
        this.el.advancedPanel.classList.toggle('hidden');
    },
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file (PNG, JPEG, WebP)');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image too large (max 10MB)');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.el.imagePreview.src = e.target.result;
            this.el.imagePreview.style.display = 'block';
            this.el.uploadZone.querySelector('.upload-label').style.display = 'none';
        };
        reader.readAsDataURL(file);
        this.showSuccess('Image loaded successfully');
    },
    
    async handleAnalyze() {
        if (!this.state.apiKey) {
            this.showError('Please enter your Gemini API key in Settings');
            this.openSettings();
            return;
        }
        
        if (!this.el.imageUpload.files[0] && !this.el.imagePreview.src) {
            this.showError('Please upload an image first');
            return;
        }
        
        this.showLoading(true);
        this.el.priceSection.style.display = 'none'; // Reset price section on new analyze
        
        try {
            const imageBase64 = this.el.imagePreview.src.split(',')[1];
            const mimeType = this.el.imagePreview.src.split(';')[0].split(':')[1];
            
            const playerClass = this.el.playerClass.value;
            const buildStyle = this.el.buildStyle.value;
            
            const promptText = `
                You are an expert Diablo 4 loot analyzer. 
                Role: Analyze this screenshot of a game item.
                Context: Player is playing class "${playerClass}" with build style "${buildStyle || 'General'}".
                Task:
                1. Identify the item name, rarity, and key stats.
                2. Provide a verdict: KEEP, SALVAGE, or SELL.
                3. Provide a short "insight" summary (1 sentence).
                4. Provide a detailed analysis explaining the verdict.
                
                IMPORTANT: Return ONLY raw JSON. No markdown formatting.
                Expected JSON Format:
                {
                    "title": "Item Name",
                    "rarity": "Legendary/Unique/Mythic/Rare",
                    "verdict": "KEEP/SELL/SALVAGE",
                    "insight": "Short summary here.",
                    "text": "Detailed analysis paragraph..."
                }
            `;
            
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.state.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: promptText },
                            { inline_data: { mime_type: mimeType, data: imageBase64 } }
                        ]
                    }]
                })
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || 'API request failed');
            }
            
            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;
            const result = this.parseAIResponse(aiText);
            
            this.displayResults(result);
            this.saveToHistory(result);
            
        } catch (error) {
            console.error('Analysis Error:', error);
            this.showError('Analysis failed: ' + error.message);
        } finally {
            this.showLoading(false);
        }
    },
    
    parseAIResponse(text) {
        try {
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        } catch (e) {
            console.warn('JSON Parse failed, falling back to raw text', e);
            return {
                title: 'Analysis Result',
                rarity: 'unknown',
                verdict: 'UNKNOWN',
                insight: 'Could not parse structured data.',
                text: text
            };
        }
    },
    
    displayResults(result) {
        // STORE THE CURRENT ITEM SO CHECK PRICE KNOWS WHAT TO CHECK
        this.state.currentItem = result;

        const rarity = result.rarity || 'legendary';
        const rarityClass = rarity.toLowerCase().includes('unique') ? 'unique' : 
                            rarity.toLowerCase().includes('mythic') ? 'mythic' : 'legendary';
                            
        const verdict = result.verdict || 'UNKNOWN';
        const verdictClass = verdict.toLowerCase();
        
        const resultHTML = `
            <h3 style="color: var(--color-${rarityClass}, #ffa500); margin-bottom: 16px; font-size: 1.3rem;">
                ${this.escapeHTML(result.title || 'Unknown Item')}
            </h3>
            <div style="margin-bottom: 16px;">
                <span class="recent-verdict ${verdictClass}">
                    ${verdict}
                </span>
            </div>
            <div style="line-height: 1.6; color: #ccc; white-space: pre-wrap;">
                ${this.escapeHTML(result.text || result.insight || 'No analysis available.')}
            </div>
        `;
        
        this.el.resultArea.innerHTML = resultHTML;
        this.el.resultsCard.style.display = 'block';
        
        setTimeout(() => {
            this.el.resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
        
        console.log('✅ Results displayed:', result.title);
    },
    
    // ==========================================
    // UPDATED PRICE CHECK LOGIC
    // ==========================================
    checkPrice() {
        // 1. Validate we have an item to check
        if (!this.state.currentItem || !this.state.currentItem.title) {
            this.showError('No item analyzed yet.');
            return;
        }

        const item = this.state.currentItem;
        
        // 2. Show the price section
        this.el.priceSection.style.display = 'block';
        this.el.priceContent.innerHTML = '<div class="loading-spinner small"></div> Checking database...';

        // 3. Simulate network delay for effect
        setTimeout(() => {
            // 4. Use PricingService if available
            if (typeof PricingService !== 'undefined') {
                const priceData = PricingService.getPriceEstimate(item.title, item.rarity);
                
                this.el.priceContent.innerHTML = `
                    <div style="margin-bottom: 8px;">
                        <strong style="color: #fff;">Estimated Value:</strong> 
                        <span style="color: var(--accent-color); font-weight: bold;">${priceData.estimatedPrice}</span>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <strong>Trade Status:</strong> ${priceData.tradeValue}
                    </div>
                    <div style="font-size: 0.9em; color: #aaa; font-style: italic;">
                        "${priceData.notes}"
                    </div>
                    <div style="margin-top: 12px; font-size: 0.8em; color: #666;">
                        * Prices are estimates. Always check Diablo.trade for live data.
                    </div>
                `;
            } else {
                this.el.priceContent.innerHTML = 'Pricing service unavailable. Please reload.';
            }
        }, 600);
    },
    
    closeResults() {
        this.el.resultsCard.style.display = 'none';
        this.el.priceSection.style.display = 'none'; // Reset price section
    },
    
    showLoading(show) {
        if (show) {
            this.el.loading.style.display = 'flex';
            this.el.analyzeBtn.disabled = true;
        } else {
            this.el.loading.style.display = 'none';
            this.el.analyzeBtn.disabled = false;
        }
    },
    
    showError(message) {
        this.el.imageError.textContent = message;
        this.el.imageError.style.display = 'block';
        setTimeout(() => {
            this.el.imageError.style.display = 'none';
        }, 5000);
    },
    
    showSuccess(message) {
        this.el.imageSuccess.textContent = message;
        this.el.imageSuccess.style.display = 'block';
        setTimeout(() => {
            this.el.imageSuccess.style.display = 'none';
        }, 3000);
    },
    
    renderHistory() {
        if (this.state.history.length === 0) {
            this.el.historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📭</div>
                    <div class="empty-text">No scans yet</div>
                </div>
            `;
            this.el.scanCount.textContent = '0';
            return;
        }
        
        this.el.scanCount.textContent = this.state.history.length;
        this.el.historyList.innerHTML = '';
        
        this.state.history.slice(0, 10).forEach(item => {
            const div = document.createElement('div');
            div.className = `recent-item rarity-${(item.rarity || 'common').toLowerCase().split(' ')[0]}`;
            
            const verdictBadge = item.verdict 
                ? `<span class="recent-verdict ${item.verdict.toLowerCase()}">${item.verdict}</span>`
                : '';
            
            div.innerHTML = `
                <div class="recent-header">
                    <span>${this.escapeHTML(item.date || '')}</span>
                    <span>${this.escapeHTML(item.playerClass || 'Any')}</span>
                </div>
                <div class="recent-name">
                    ${this.escapeHTML(item.title)}${verdictBadge}
                </div>
                <div class="recent-insight">
                    ${this.escapeHTML(item.insight || 'View details')}
                </div>
            `;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'recent-delete';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(item.id);
            };
            div.appendChild(deleteBtn);
            div.onclick = () => this.displayResults(item);
            this.el.historyList.appendChild(div);
        });
    },
    
    saveToHistory(result) {
        const historyItem = {
            id: Date.now(),
            ...result,
            playerClass: this.el.playerClass.value,
            date: new Date().toLocaleDateString()
        };
        
        this.state.history.unshift(historyItem);
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        try {
            localStorage.setItem('horadric_history', JSON.stringify(this.state.history));
            this.renderHistory();
        } catch (e) {
            console.warn('Failed to save history:', e);
        }
    },
    
    deleteHistoryItem(id) {
        this.state.history = this.state.history.filter(item => item.id !== id);
        try {
            localStorage.setItem('horadric_history', JSON.stringify(this.state.history));
            this.renderHistory();
        } catch (e) {
            console.warn('Failed to update history:', e);
        }
    },
    
    clearHistory() {
        if (confirm('Clear all scan history?')) {
            this.state.history = [];
            localStorage.removeItem('horadric_history');
            this.renderHistory();
        }
    },
    
    runDemo() {
        console.log('🎮 Running demo mode...');
        const demoItem = {
            title: 'Harlequin Crest',
            rarity: 'mythic',
            verdict: 'KEEP',
            insight: 'Most versatile item in the game for all builds.',
            text: 'This is a god-tier mythic unique helm. The Harlequin Crest provides unmatched utility across all builds with its combination of cooldown reduction, damage reduction, and skill ranks.',
            date: new Date().toLocaleDateString(),
            playerClass: this.el.playerClass.value || 'Any',
            mode: 'identify'
        };

        this.el.imagePreview.src = 'harlequin crest.jpg';
        this.el.imagePreview.style.display = 'block';
        if (this.el.uploadZone.querySelector('.upload-label')) {
            this.el.uploadZone.querySelector('.upload-label').style.display = 'none';
        }

        this.displayResults(demoItem);
        this.saveToHistory(demoItem);
        this.showSuccess('✅ Demo mode activated');
        
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackDemoModeActivated === 'function') {
            Analytics.trackDemoModeActivated();
        }
    },
    
    openSettings() {
        this.el.settingsPanel.classList.add('open');
    },
    
    closeSettings() {
        this.el.settingsPanel.classList.remove('open');
    },
    
    saveApiKey() {
        const key = this.el.apiKey.value.trim();
        if (!key) return;
        
        if (!key.startsWith('AIza')) {
            this.el.apiKeyError.textContent = 'Invalid API key format (should start with AIza...)';
            this.el.apiKeyError.style.display = 'block';
            setTimeout(() => this.el.apiKeyError.style.display = 'none', 5000);
            return;
        }
        
        this.state.apiKey = key;
        try {
            localStorage.setItem('gemini_api_key', btoa(key));
            this.el.apiKeySuccess.textContent = '✓ API key saved';
            this.el.apiKeySuccess.style.display = 'block';
            setTimeout(() => this.el.apiKeySuccess.style.display = 'none', 3000);
            
            if (typeof Analytics !== 'undefined' && typeof Analytics.trackApiKeyEntered === 'function') {
                Analytics.trackApiKeyEntered();
            }
        } catch (e) {
            this.el.apiKeyError.textContent = 'Failed to save API key';
            this.el.apiKeyError.style.display = 'block';
        }
    },
    
    openHelp() {
        const helpContent = `
            <h3 style="color:var(--accent-color); margin-bottom:15px;">
                Getting Your Gemini API Key
            </h3>
            <ol style="margin-left:20px; line-height:1.6; color:#ccc;">
                <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: var(--accent-color);">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Select "Create key in new project"</li>
                <li>Copy the key starting with <code>AIza...</code></li>
                <li>Paste it into Settings → API Key field</li>
            </ol>
        `;
        
        this.el.modalContent.innerHTML = `
            ${helpContent}
            <div style="margin-top:15px; font-size:0.85rem; color:#888;">
                Note: Your key is stored securely in your browser's local storage.
            </div>
            <div style="margin-top:20px; padding-top:15px; border-top:1px solid #444;">
                <button id="restart-tour-btn" class="btn-secondary" style="width:100%;">
                    🎓 Restart Learning Guide
                </button>
            </div>
        `;
        
        this.el.helpModal.classList.add('open');
        
        const restartBtn = document.getElementById('restart-tour-btn');
        if (restartBtn && typeof TourGuide !== 'undefined') {
            restartBtn.addEventListener('click', () => {
                TourGuide.restart();
                this.closeModal();
            });
        }
    },
    
    closeModal() {
        this.el.helpModal.classList.remove('open');
    },
    
    shareResults() {
        const text = this.el.resultArea.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Copied to clipboard!');
        });
    },
    
    searchTrade() {
        window.open('https://diablo.trade', '_blank');
    },
    
    escapeHTML(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HoradricApp.init());
} else {
    HoradricApp.init();
}
