// ====================================
// STATVERDICT LANDING PAGE LOGIC
// Version: 3.0.1 - Fixed CORS Issues with CounterAPI
// ====================================

const StatsLoader = {
    NAMESPACE: 'statverdict',
    TIMEOUT: 2000,
    MAX_RETRIES: 1,
    
    async init() {
        const isLocal = this.isLocalEnvironment();
        
        if (isLocal) {
            this.displayFallback();
            return;
        }
        
        await this.loadStatsWithTimeout();
    },
    
    isLocalEnvironment() {
        const hostname = window.location.hostname;
        return hostname === '127.0.0.1' || 
               hostname === 'localhost' || 
               hostname === '' || 
               hostname.startsWith('192.168') ||
               hostname.startsWith('10.0');
    },
    
    async loadStatsWithTimeout() {
        this.showLoadingState();
        
        try {
            await Promise.race([
                Promise.all([
                    this.loadScanCount(),
                    this.loadUserCount()
                ]),
                this.timeoutPromise(this.TIMEOUT)
            ]);
        } catch (error) {
            this.displayFallback();
        }
    },
    
    timeoutPromise(ms) {
        return new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), ms)
        );
    },
    
    showLoadingState() {
        const scanEl = document.getElementById('stat-scans');
        const userEl = document.getElementById('stat-users');
        
        if (scanEl && !scanEl.classList.contains('sv-stat-loaded')) {
            scanEl.innerHTML = '<span class="sv-stat-loading"></span> Items Analyzed';
        }
        if (userEl && !userEl.classList.contains('sv-stat-loaded')) {
            userEl.innerHTML = '<span class="sv-stat-loading"></span> Community Members';
        }
    },
    
    displayFallback() {
        const scanEl = document.getElementById('stat-scans');
        const userEl = document.getElementById('stat-users');
        
        if (scanEl) { 
            scanEl.innerHTML = `<strong>10K+</strong> Items Analyzed`; 
            scanEl.classList.add('sv-stat-loaded'); 
        }
        if (userEl) { 
            userEl.innerHTML = `<strong>500+</strong> Community Members`; 
            userEl.classList.add('sv-stat-loaded'); 
        }
    },
    
    async loadScanCount(retryCount = 0) {
        const el = document.getElementById('stat-scans');
        if (!el) return;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            // FIXED: Proper CounterAPI URL format
            const res = await fetch(
                `https://api.counterapi.dev/v1/${this.NAMESPACE}/scans/`,
                { 
                    signal: controller.signal,
                    cache: 'no-store',
                    mode: 'cors'
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (data?.count !== undefined) {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Items Analyzed`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data');
            }
        } catch (error) {
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(300);
                return this.loadScanCount(retryCount + 1);
            }
            
            el.innerHTML = `<strong>10K+</strong> Items Analyzed`;
            el.classList.add('sv-stat-loaded');
        }
    },
    
    async loadUserCount(retryCount = 0) {
        const el = document.getElementById('stat-users');
        if (!el) return;
        
        try {
            const counted = localStorage.getItem('sv_user_counted');
            
            // FIXED: Proper CounterAPI URL format with trailing slash
            const url = counted 
                ? `https://api.counterapi.dev/v1/${this.NAMESPACE}/users/` 
                : `https://api.counterapi.dev/v1/${this.NAMESPACE}/users/up/`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            const res = await fetch(url, { 
                signal: controller.signal,
                cache: 'no-store',
                mode: 'cors'
            });
            
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (data?.count !== undefined) {
                if (!counted) {
                    localStorage.setItem('sv_user_counted', 'true');
                }
                
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Community Members`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data');
            }
        } catch (error) {
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(300);
                return this.loadUserCount(retryCount + 1);
            }
            
            el.innerHTML = `<strong>500+</strong> Community Members`;
            el.classList.add('sv-stat-loaded');
        }
    },
    
    formatNumber(num) {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
        return num.toString();
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

const BetaSignup = {
    init() {
        const betaForm = document.getElementById('beta-signup-form');
        if (!betaForm) return;
        
        betaForm.addEventListener('submit', (e) => this.handleSubmit(e));
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('beta-submit-btn');
        const successMsg = document.getElementById('beta-signup-success');
        const errorMsg = document.getElementById('beta-signup-error');
        const emailInput = document.getElementById('beta-email-input');
        
        if (!emailInput.validity.valid) {
            this.showMessage(errorMsg, '⚠️ Please enter a valid email address');
            return;
        }
        
        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            await fetch(form.action, { 
                method: 'POST', 
                body: new FormData(form), 
                mode: 'no-cors',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            this.showMessage(successMsg, '✅ You\'re on the list! Check your inbox/spam folder to confirm.');
            emailInput.value = '';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'beta_signup', { 'event_category': 'engagement' });
            }
        } catch (error) {
            this.showMessage(errorMsg, '⚠️ Something went wrong. Please try again.');
        } finally {
            submitBtn.textContent = 'Join Beta';
            submitBtn.disabled = false;
        }
    },
    
    showMessage(element, message) {
        element.textContent = message;
        element.style.display = 'block';
        
        const allMessages = document.querySelectorAll('.sv-beta-msg');
        allMessages.forEach(msg => {
            if (msg !== element) msg.style.display = 'none';
        });
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 8000);
    }
};

const UIHandlers = {
    init() {
        this.setupMobileMenu();
        this.setupPrivacyModal();
    },
    
    setupMobileMenu() {
        const menuBtn = document.getElementById('sv-mobile-menu-btn');
        const mobileNav = document.getElementById('sv-mobile-nav');
        
        if (!menuBtn || !mobileNav) return;
        
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.contains('active');
            
            if (isOpen) {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            } else {
                menuBtn.classList.add('active');
                mobileNav.classList.add('active');
            }
        });
        
        // Close nav when links are tapped
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    },
    
    setupPrivacyModal() {
        const privacyTrigger = document.getElementById('privacy-trigger');
        const privacyModal = document.getElementById('privacy-modal');
        const closeBtn = document.getElementById('privacy-close-btn');
        
        if (!privacyTrigger || !privacyModal || !closeBtn) return;
        
        const openModal = () => privacyModal.classList.add('open');
        const closeModal = () => privacyModal.classList.remove('open');
        
        privacyTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
        
        closeBtn.addEventListener('click', closeModal);
        
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
                closeModal();
            }
        });
    }
};

const VotingSystem = {
    NAMESPACE: 'statverdict',
    USER_VOTE_KEY: 'sv_user_vote',
    CACHE_KEY: 'sv_vote_data_cache',
    CACHE_DURATION: 1000 * 60 * 10, // 10 Minutes
    
    games: {
        'poe2': 'Path of Exile 2',
        'lastepoch': 'Last Epoch',
        'd3': 'Diablo III',
        'd2r': 'D2: Resurrected',
        'di': 'Diablo Immortal',
        'grim-dawn': 'Grim Dawn',
        'torchlight': 'Torchlight Infinite'
    },
    
    async init() {
        const voteBtns = document.querySelectorAll('.sv-vote-btn');
        if (voteBtns.length === 0) return;

        const userVote = localStorage.getItem(this.USER_VOTE_KEY);

        if (userVote) {
            await this.loadAndShowResults();
        } else {
            voteBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const game = btn.getAttribute('data-game');
                    this.vote(game);
                });
            });
        }
    },
    
    async vote(game) {
        if (localStorage.getItem(this.USER_VOTE_KEY)) return;
        
        // 1. OPTIMISTIC UPDATE: Mark as voted immediately in LocalStorage
        localStorage.setItem(this.USER_VOTE_KEY, game);
        localStorage.removeItem(this.CACHE_KEY); // Clear cache
        
        // 2. IMMEDIATE UI FEEDBACK: Switch to results view instantly
        // We pass 'true' to indicate this is a fresh vote to simulate the +1 locally
        await this.loadAndShowResults(true, game);
        
        // 3. SEND VOTE IN BACKGROUND (Silent)
        // If this fails due to AdBlock, the user won't know (and won't care).
        try {
            await fetch(`https://api.counterapi.dev/v1/${this.NAMESPACE}/vote_${game}/up/`, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-store'
            });
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'vote', { 'event_category': 'engagement', 'event_label': game });
            }
        } catch (error) {
            // Silently fail. The user already saw the "Success" screen.
            console.warn('Vote background sync failed (likely AdBlock):', error);
        }
    },
    
    async loadAndShowResults(isFreshVote = false, votedGame = null) {
        const votingResults = document.getElementById('voting-results');
        const votingOptions = document.getElementById('voting-options');
        const resultsChart = document.getElementById('results-chart');
        
        if (!votingResults || !resultsChart) return;
        
        // Switch UI immediately
        if (votingOptions) votingOptions.style.display = 'none';
        votingResults.style.display = 'block';
        
        if (resultsChart.innerHTML === '') {
            resultsChart.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">Updating results...</div>';
        }

        try {
            // Fetch real votes
            let votes = await this.getVotesSafe();
            
            // If the user JUST voted, but the API failed (AdBlock) or hasn't updated yet,
            // we manually add +1 to their game in the local display data.
            // This ensures they always see their vote count!
            if (isFreshVote && votedGame) {
                votes[votedGame] = (votes[votedGame] || 0) + 1;
            }

            const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
            this.displayResults(votes, totalVotes);
            
        } catch (error) {
            console.error('Error loading votes:', error);
            resultsChart.innerHTML = '<div style="text-align:center; padding:20px; color:#888;">Unable to load results.</div>';
        }
    },
    
    async getVotesSafe() {
        // 1. Check Cache
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < this.CACHE_DURATION) {
                return data;
            }
        }

        // 2. Fetch Data (Sequential to prevent Rate Limits)
        const votes = {};
        const gameKeys = Object.keys(this.games);
        
        // We use a "Promise.all" here for speed, but catch individual errors so one failure doesn't break all
        await Promise.all(gameKeys.map(async (key) => {
            try {
                const res = await fetch(`https://api.counterapi.dev/v1/${this.NAMESPACE}/vote_${key}/`, { mode: 'cors' });
                if (res.ok) {
                    const data = await res.json();
                    votes[key] = data.count || 0;
                } else {
                    votes[key] = 0;
                }
            } catch (e) {
                votes[key] = 0;
            }
        }));
        
        // 3. Save Cache
        localStorage.setItem(this.CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: votes
        }));
        
        return votes;
    },
    
    displayResults(votes, totalVotes) {
        const resultsChart = document.getElementById('results-chart');
        const resultsNote = document.querySelector('.sv-results-note');
        
        resultsChart.innerHTML = '';
        const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        
        sorted.forEach(([gameKey, count]) => {
            const gameName = this.games[gameKey] || gameKey;
            const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            
            const barDiv = document.createElement('div');
            barDiv.className = 'sv-result-bar';
            
            const userVote = localStorage.getItem(this.USER_VOTE_KEY);
            const isUserVote = userVote === gameKey;
            const highlightClass = isUserVote ? ' user-voted' : '';
            
            barDiv.innerHTML = `
                <div class="sv-result-name${highlightClass}">
                    ${isUserVote ? '👉 ' : ''}${gameName}
                </div>
                <div class="sv-result-bar-container">
                    <div class="sv-result-bar-fill${highlightClass}" style="width: ${percentage}%"></div>
                </div>
                <div class="sv-result-votes">
                    <strong>${percentage}%</strong> <span style="opacity:0.7">(${count})</span>
                </div>
            `;
            resultsChart.appendChild(barDiv);
        });

        if (resultsNote) {
            resultsNote.style.display = 'block';
            resultsNote.textContent = 'Thank you for voting! 🎉';
        }
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanding);
} else {
    initializeLanding();
}

function initializeLanding() {
    StatsLoader.init();
    BetaSignup.init();
    UIHandlers.init();
    VotingSystem.init();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', { 'page_title': 'Landing Page' });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsLoader, BetaSignup, UIHandlers, VotingSystem };
}