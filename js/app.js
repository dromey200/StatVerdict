// ====================================
// HORADRIC AI - APP ENGINE
// Version: 9.0.0 (The Iron Gate)
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
        this.cacheElements();
        this.loadState();
        this.attachEventListeners();
        this.updateClassOptions();
        console.log('👁️ Horadric Pipeline Active');
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
        this.el.modeIdentify = document.getElementById('mode-identify');
        this.el.modeCompare = document.getElementById('mode-compare');
        this.el.settingsTrigger = document.getElementById('settings-trigger');
        this.el.settingsClose = document.getElementById('settings-close');
        this.el.demoBtn = document.getElementById('demo-btn');
        this.el.clearHistory = document.getElementById('clear-history');
        this.el.closeResults = document.getElementById('close-results');
        this.el.shareBtn = document.getElementById('share-btn');
        this.el.priceCheckBtn = document.getElementById('price-check-btn');
        this.el.searchTradeBtn = document.getElementById('search-trade-btn');
        this.setupDragDrop();
    },

    attachEventListeners() {
        this.el.gameVersion.addEventListener('change', () => this.updateClassOptions());
        this.el.playerClass.addEventListener('change', () => this.updateBuildOptions());
        this.el.imageUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.el.modeIdentify.addEventListener('click', () => this.setMode('identify'));
        this.el.modeCompare.addEventListener('click', () => this.setMode('compare'));
        this.el.toggleAdvanced.addEventListener('click', () => this.toggleAdvanced());
        this.el.analyzeBtn.addEventListener('click', () => this.handleAnalyze());
        this.el.demoBtn.addEventListener('click', () => this.runDemo());
        this.el.settingsTrigger.addEventListener('click', () => this.openSettings());
        this.el.settingsClose.addEventListener('click', () => this.closeSettings());
        this.el.settingsOverlay.addEventListener('click', () => this.closeSettings());
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

    updateClassOptions() {
        const game = this.el.gameVersion.value;
        localStorage.setItem('selected_game', game);
        const classData = CONFIG.CLASS_DEFINITIONS[game] || CONFIG.CLASS_DEFINITIONS['d4'];
        if (!classData) return;
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
        const gameDefs = CONFIG.CLASS_DEFINITIONS[game] || CONFIG.CLASS_DEFINITIONS['d4'];
        const classDef = gameDefs[cls] || gameDefs['Any'] || { builds: [], mechanics: [] };
        
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
    // THE PIPELINE: DETECT -> ANALYZE
    // ============================================

    async handleAnalyze() {
        if (!this.state.apiKey) return this.showError('API Key Missing', true);
        if (!this.el.imagePreview.src) return this.showError('No image loaded');

        this.showLoading(true, "Scanning Reality...");
        this.clearResults();

        try {
            const imageBase64 = this.el.imagePreview.src.split(',')[1];
            const mimeType = this.el.imagePreview.src.split(';')[0].split(':')[1];
            
            // --- STAGE 1: THE SENTRY (CLASSIFICATION) ---
            const detectPrompt = PROMPT_TEMPLATES.detect();
            const detectResult = await this.callGemini(detectPrompt, imageBase64, mimeType);
            
            if (!detectResult || !detectResult.game) throw new Error("Could not identify image.");
            
            const detectedGame = detectResult.game.toLowerCase();
            const selectedGame = this.el.gameVersion.value.toLowerCase();

            // SENTRY GATEKEEPER LOGIC
            
            // 1. Check for Real World Objects / Non-Loot
            if (detectedGame === 'not_loot') {
                this.renderRejection("Not a Game Item", "This appears to be a real-world photo or non-game object. Please upload a clear screenshot of a Diablo item tooltip.");
                this.showLoading(false);
                return;
            }

            // 2. Check for Game Mismatch
            if (detectedGame !== 'unknown' && detectedGame !== selectedGame) {
                this.renderWrongGame(detectedGame);
                this.showLoading(false);
                return; 
            }

            // --- STAGE 2: THE APPRAISER (ANALYSIS) ---
            this.showLoading(true, "Consulting Archives..."); 
            
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

            const promptGen = this.state.mode === 'compare' ? PROMPT_TEMPLATES.compare : PROMPT_TEMPLATES.analyze;
            const analyzePrompt = promptGen(selectedGame, pClass, build, advancedSettings);
            
            const analysisResult = await this.callGemini(analyzePrompt, imageBase64, mimeType);
            
            if (!analysisResult) throw new Error("Analysis failed.");
            
            this.renderSuccess(analysisResult);
            this.saveToHistory(analysisResult);

        } catch (error) {
            console.error(error);
            this.showError(`Error: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    },

    async callGemini(prompt, imageBase64, mimeType) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.state.apiKey}`, {
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
                    temperature: 0.0 // Zero creativity for strict logic
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Gemini API Error');
        }
        
        const data = await response.json();
        return this.safeJSONParse(data.candidates[0].content.parts[0].text);
    },

    safeJSONParse(str) {
        try {
            let clean = str.replace(/```json/g, '').replace(/```/g, '').trim();
            const start = clean.indexOf('{');
            const end = clean.lastIndexOf('}');
            if (start !== -1 && end !== -1) clean = clean.substring(start, end + 1);
            return JSON.parse(clean);
        } catch (e) {
            return null; 
        }
    },

    renderRejection(title, reason) {
        this.el.resultsCard.style.display = 'block';
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ff6b6b;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🚫</div>
                <h3 style="margin-bottom: 10px; color: var(--color-error);">${title}</h3>
                <p style="font-size: 1.1rem; color: #fff;">${reason}</p>
            </div>
        `;
        this.el.resultsCard.scrollIntoView({ behavior: 'smooth' });
    },

    renderWrongGame(detected) {
        const target = this.el.gameVersion.options[this.el.gameVersion.selectedIndex].text;
        const map = { 'd4': 'Diablo IV', 'd2r': 'Diablo II', 'd3': 'Diablo III', 'di': 'Diablo Immortal' };
        const detectedName = map[detected] || detected.toUpperCase();

        this.el.resultsCard.style.display = 'block';
        this.el.resultArea.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--color-warning);">
                <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
                <h3 style="margin-bottom: 10px;">Wrong Game Selected</h3>
                <p>This looks like a <strong>${detectedName}</strong> item.</p>
                <p>But you selected: <strong>${target}</strong></p>
                <div style="margin-top:15px; font-size: 0.9rem; color: #ccc;">
                    Please change the "Game Version" selector at the top.
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
        
        const renderMarkdown = (typeof marked !== 'undefined' && marked.parse) ? marked.parse : (t) => t; 
        const analysisHtml = renderMarkdown(result.analysis || '');

        let verdictColor = 'neutral';
        if (['KEEP', 'EQUIP', 'SELL', 'UPGRADE'].includes(verdict)) verdictColor = 'keep';
        if (['SALVAGE', 'DISCARD', 'CHARSI'].includes(verdict)) verdictColor = 'salvage';

        this.el.resultArea.innerHTML = `
            <div class="result-header rarity-${rarity}">
                <h2 class="item-title">${result.title || 'Unknown Item'}</h2>
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
    setMode(mode) {
        this.state.mode = mode;
        if (mode === 'identify') {
            this.el.modeIdentify.classList.add('active'); this.el.modeIdentify.setAttribute('aria-pressed', 'true');
            this.el.modeCompare.classList.remove('active'); this.el.modeCompare.setAttribute('aria-pressed', 'false');
        } else {
            this.el.modeCompare.classList.add('active'); this.el.modeCompare.setAttribute('aria-pressed', 'true');
            this.el.modeIdentify.classList.remove('active'); this.el.modeIdentify.setAttribute('aria-pressed', 'false');
        }
    },
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
        const item = { id: Date.now(), title: result.title, rarity: result.rarity, verdict: result.verdict, insight: result.insight, game: this.el.gameVersion.value, date: new Date().toLocaleDateString() };
        this.state.history.unshift(item); if(this.state.history.length > 20) this.state.history.pop();
        localStorage.setItem('horadric_history', JSON.stringify(this.state.history)); this.renderHistory();
    },
    renderHistory() {
        if (!this.state.history.length) { this.el.historyList.innerHTML = '<div class="empty-state">No scans yet</div>'; this.el.scanCount.textContent = '0'; return; }
        this.el.scanCount.textContent = this.state.history.length; this.el.historyList.innerHTML = '';
        this.state.history.forEach(item => {
            const div = document.createElement('div');
            const g = String(item.game || 'd4').toUpperCase();
            const r = String(item.rarity || 'common').split(' ')[0].toLowerCase();
            div.className = `recent-item rarity-${r}`;
            div.innerHTML = `<div class="recent-header"><span>${g}</span><span>${item.verdict || '?'}</span></div><div class="recent-name">${item.title || 'Unknown'}</div>`;
            this.el.historyList.appendChild(div);
        });
    },
    clearHistory() { if(confirm('Clear history?')) { this.state.history = []; localStorage.removeItem('horadric_history'); this.renderHistory(); } },
    checkPrice() {
        if(!this.state.currentItem) return;
        this.el.priceSection.style.display = 'block';
        this.el.priceContent.innerHTML = 'Checking database...';
        setTimeout(() => {
            const isMythic = String(this.state.currentItem.rarity).toLowerCase().includes('mythic');
            this.el.priceContent.innerHTML = `<div>Value: ${isMythic ? 'Priceless' : 'Check Trade Site'}</div>`;
        }, 500);
    },
    searchTrade() { window.open('https://diablo.trade', '_blank'); },
    shareResults() { const i = this.state.currentItem; if(i) navigator.clipboard.writeText(`${i.title} - ${i.verdict}`); },
    runDemo() {
        this.el.imagePreview.src = 'https://d4.maxroll.gg/wp-content/uploads/2023/06/Harlequin-Crest-1.jpg';
        this.el.imagePreview.style.display = 'block';
        const res = { title: "Harlequin Crest", rarity: "mythic", verdict: "KEEP", score: "S-Tier", insight: "God Tier Helm", game: "d4" };
        this.renderSuccess(res); this.saveToHistory(res);
    }
};

document.addEventListener('DOMContentLoaded', () => HoradricApp.init());