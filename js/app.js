// ====================================
// HORADRIC AI - APP ENGINE
// Version: 9.3.0 (Path 1A: D4 Excellence + Multi-Game Foundation)
// ====================================

const HoradricApp = {
    state: {
        apiKey: '',
        history: [],
        currentItem: null,
        mode: 'identify'
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
        this.attachEventListeners();
        this.updateGameSelector();
        this.updateClassOptions();
        console.log('👁️ Horadric Pipeline Active (D4 Excellence Mode)');
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
        // Add visual indicators for supported vs coming soon games
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
            // Show coming soon message
            this.showError(`${support.label} analysis is coming soon! Currently only Diablo IV is supported.`, false);
            // Don't prevent selection, but warn them
        }
        
        this.updateClassOptions();
        localStorage.setItem('selected_game', game);
    },

    updateClassOptions() {
        const game = this.el.gameVersion.value;
        const classData = CONFIG.CLASS_DEFINITIONS[game];
        
        if (!classData) {
            // Game not implemented yet
            this.el.playerClass.innerHTML = '<option value="">Not Available Yet</option>';
            this.el.playerClass.disabled = true;
            return;
        }
        
        this.el.playerClass.disabled = false;
        const classes = Object.keys(classData);
        const prev = this.el.playerClass.value;
        this.el.playerClass.innerHTML = '<option value="">Select Class...</option>';
        
        classes.forEach(cls => {
            if(cls !== 'Any') {
                const opt = document.createElement('option');
                opt.value = cls;
                opt.textContent = cls;
                if (cls === prev) opt.selected = true;
                this.el.playerClass.appendChild(opt);
            }
        });
        this.updateBuildOptions();
    },

    updateBuildOptions() {
        const game = this.el.gameVersion.value;
        const cls = this.el.playerClass.value;
        if (!cls) {
            this.el.buildStyle.innerHTML = '<option value="">Any / General</option>';
            if(this.el.keyMechanic) this.el.keyMechanic.innerHTML = '<option value="">None</option>';
            return;
        }
        const gameDefs = CONFIG.CLASS_DEFINITIONS[game];
        if (!gameDefs) return;
        
        const classDef = gameDefs[cls] || { builds: [], mechanics: [] };
        
        this.el.buildStyle.innerHTML = '<option value="">Any / General</option>';
        if (classDef.builds) {
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
    // ENHANCED ANALYSIS PIPELINE
    // ============================================

    async handleAnalyze() {
        if (!this.state.apiKey) return this.showError('API Key Missing', true);
        if (!this.el.imagePreview.src) return this.showError('No image loaded');

        const selectedGame = this.el.gameVersion.value;
        const support = CONFIG.GAME_SUPPORT[selectedGame];
        
        // Check if game is supported
        if (support && !support.enabled) {
            this.renderUnsupportedGame(selectedGame);
            return;
        }

        this.showLoading(true, "Analyzing...");
        this.clearResults();

        try {
            const imageBase64 = this.el.imagePreview.src.split(',')[1];
            const mimeType = this.el.imagePreview.src.split(';')[0].split(':')[1];
            
            // Gather settings
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

            // SINGLE API CALL - Enhanced detection + analysis
            const promptGen = this.state.mode === 'compare' 
                ? PROMPT_TEMPLATES.compareOptimized 
                : PROMPT_TEMPLATES.analyzeOptimized;
            
            const prompt = promptGen(selectedGame, pClass, build, advancedSettings);
            const result = await this.callGemini(prompt, imageBase64, mimeType);
            
            console.log('Analysis result:', result);
            
            if (!result) {
                throw new Error("Analysis failed. Please try again.");
            }
            
            // Handle unsupported game response
            if (result.status === 'unsupported_game') {
                this.renderUnsupportedGame(result.detected_game, result.message);
                this.showLoading(false);
                return;
            }
            
            // Handle rejection cases
            if (result.status === 'rejected') {
                this.handleRejection(result);
                this.showLoading(false);
                return;
            }
            
            // Success - render results
            this.renderSuccess(result);
            this.saveToHistory(result);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(`Error: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
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
                <div style="margin-top: 15px; font-size: 0.9rem; color: #aaa;">
                    Want ${gameName} support sooner? Let us know via the feedback form!
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
        
        // Show confidence indicator if medium/low
        const confidenceBadge = (result.confidence === 'medium' || result.confidence === 'low')
            ? `<span style="font-size: 0.8rem; color: #ffa500; margin-left: 10px;">⚠️ ${result.confidence} confidence</span>`
            : '';
        
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t; 
        const analysisHtml = renderMarkdown(result.analysis || '');

        let verdictColor = 'neutral';
        if (['KEEP', 'EQUIP', 'SELL', 'UPGRADE', 'EQUIP NEW'].includes(verdict)) verdictColor = 'keep';
        if (['SALVAGE', 'DISCARD', 'CHARSI', 'KEEP EQUIPPED'].includes(verdict)) verdictColor = 'salvage';

        // Add Sanctified badge if applicable
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
        `;
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