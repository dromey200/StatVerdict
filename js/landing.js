// ====================================
// STATVERDICT LANDING PAGE LOGIC
// Version: 3.1.0 - CORS Fixed with Proper CounterAPI Implementation
// ====================================

const StatsLoader = {
    NAMESPACE: 'statverdict',
    TIMEOUT: 3000,
    MAX_RETRIES: 2,
    
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
            console.warn('Stats loading timed out, using fallback');
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
            
            // FIXED: Proper CounterAPI URL - NO trailing slash
            const res = await fetch(
                `https://api.counterapi.dev/v1/${this.NAMESPACE}/scans`,
                { 
                    signal: controller.signal,
                    cache: 'no-store'
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!res.ok) {
                console.warn(`Scans API returned ${res.status}`);
                throw new Error(`HTTP ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data && typeof data.count === 'number') {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Items Analyzed`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.warn('Error loading scan count:', error.message);
            
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(500);
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
            
            // FIXED: Proper CounterAPI URL - NO trailing slash
            const url = counted 
                ? `https://api.counterapi.dev/v1/${this.NAMESPACE}/users` 
                : `https://api.counterapi.dev/v1/${this.NAMESPACE}/users/up`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            const res = await fetch(url, { 
                signal: controller.signal,
                cache: 'no-store'
            });
            
            clearTimeout(timeoutId);
            
            if (!res.ok) {
                console.warn(`Users API returned ${res.status}`);
                throw new Error(`HTTP ${res.status}`);
            }
            
            const data = await res.json();
            
            if (data && typeof data.count === 'number') {
                if (!counted) {
                    localStorage.setItem('sv_user_counted', 'true');
                }
                
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Community Members`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data structure');
            }
        } catch (error) {
            console.warn('Error loading user count:', error.message);
            
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(500);
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
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (!menuBtn || !mobileNav) return;
        
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.contains('active');
            
            if (isOpen) {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('open');
            } else {
                menuBtn.classList.add('active');
                mobileNav.classList.add('open');
            }
        });
        
        const navLinks = mobileNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    },
    
    setupPrivacyModal() {
        const privacyLink = document.getElementById('privacy-link');
        const privacyModal = document.getElementById('privacy-modal');
        const closeBtn = document.getElementById('privacy-close');
        
        if (!privacyLink || !privacyModal || !closeBtn) return;
        
        const openModal = () => privacyModal.classList.add('open');
        const closeModal = () => privacyModal.classList.remove('open');
        
        privacyLink.addEventListener('click', (e) => {
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
    TIMEOUT: 5000,
    MAX_RETRIES: 2,
    
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
                btn.addEventListener('click', () => {
                    const game = btn.getAttribute('data-game');
                    this.vote(game);
                });
            });
        }
    },
    
    async vote(game) {
        if (localStorage.getItem(this.USER_VOTE_KEY)) {
            return;
        }
        
        const votingOptions = document.getElementById('voting-options');
        
        if (votingOptions) votingOptions.style.opacity = '0.5';
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
            
            // FIXED: Proper CounterAPI URL - NO trailing slash
            const response = await fetch(
                `https://api.counterapi.dev/v1/${this.NAMESPACE}/vote_${game}/up`,
                {
                    method: 'GET',
                    signal: controller.signal,
                    cache: 'no-store'
                }
            );
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Vote successful:', data);
                
                localStorage.setItem(this.USER_VOTE_KEY, game);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'vote', { 
                        'event_category': 'engagement',
                        'event_label': game
                    });
                }
                
                await this.loadAndShowResults();
            } else {
                console.error('Vote failed with status:', response.status);
                throw new Error('Vote failed');
            }
        } catch (error) {
            console.error('Vote error:', error);
            
            if (votingOptions) votingOptions.style.opacity = '1';
            
            alert('Failed to submit vote. The service may be temporarily unavailable. Please try again later.');
        }
    },
    
    async loadAndShowResults(showOnlyIfVotesExist = false) {
        try {
            const votes = await this.fetchAllVotes();
            const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
            
            if (showOnlyIfVotesExist && totalVotes === 0) {
                return;
            }
            
            this.displayResults(votes, totalVotes);
        } catch (error) {
            console.error('Error loading votes:', error);
        }
    },
    
    async fetchAllVotes() {
        const votes = {};
        const gameKeys = Object.keys(this.games);
        
        const promises = gameKeys.map(async (gameKey) => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
                
                // FIXED: Proper CounterAPI URL - NO trailing slash  
                const response = await fetch(
                    `https://api.counterapi.dev/v1/${this.NAMESPACE}/vote_${gameKey}`,
                    {
                        signal: controller.signal,
                        cache: 'no-store'
                    }
                );
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const data = await response.json();
                    votes[gameKey] = data.count || 0;
                } else {
                    console.warn(`Failed to fetch votes for ${gameKey}: ${response.status}`);
                    votes[gameKey] = 0;
                }
            } catch (error) {
                console.warn(`Error fetching votes for ${gameKey}:`, error.message);
                votes[gameKey] = 0;
            }
        });
        
        await Promise.all(promises);
        
        return votes;
    },
    
    displayResults(votes, totalVotes) {
        const votingOptions = document.getElementById('voting-options');
        const votingResults = document.getElementById('voting-results');
        const resultsChart = document.getElementById('results-chart');
        const resultsNote = votingResults?.querySelector('.sv-results-note');
        
        if (!votingOptions || !votingResults || !resultsChart) return;
        
        votingOptions.style.display = 'none';
        
        const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        
        resultsChart.innerHTML = '';
        
        if (totalVotes === 0) {
            resultsChart.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #888;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🗳️</div>
                    <p style="font-size: 1.1rem; margin-bottom: 10px;">No votes yet</p>
                    <p style="font-size: 0.9rem; color: #666;">Be the first to vote for the next game!</p>
                </div>
            `;
            
            if (resultsNote) resultsNote.style.display = 'none';
        } else {
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
                        ${isUserVote ? '👉 ' : ''}${gameName}${isUserVote ? ' (Your Vote)' : ''}
                    </div>
                    <div class="sv-result-bar-container">
                        <div class="sv-result-bar-fill${highlightClass}" style="width: ${percentage}%">
                            ${percentage > 8 ? `<span class="sv-result-percentage">${percentage}%</span>` : ''}
                        </div>
                    </div>
                    <div class="sv-result-votes">${count} vote${count !== 1 ? 's' : ''}</div>
                `;
                
                resultsChart.appendChild(barDiv);
            });
            
            if (resultsNote) {
                const userVote = localStorage.getItem(this.USER_VOTE_KEY);
                if (userVote) {
                    resultsNote.textContent = 'Thank you for voting! 🎉';
                    resultsNote.style.display = 'block';
                } else {
                    resultsNote.style.display = 'none';
                }
            }
        }
        
        votingResults.style.display = 'block';
        
        setTimeout(() => {
            votingResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
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
