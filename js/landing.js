// ====================================
// STATVERDICT LANDING PAGE LOGIC 
// Version: 2.1.2 - Silent API Fallback
// ====================================

const StatsLoader = {
    NAMESPACE: 'statverdict',
    TIMEOUT: 2000, // Reduced to 2 seconds
    MAX_RETRIES: 1, // Reduced retries to avoid console spam
    
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
            // Silent fallback - API temporarily down
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
            
            const res = await fetch(
                `https://api.counterapi.dev/v1/${this.NAMESPACE}/scans`,
                { 
                    signal: controller.signal,
                    cache: 'no-store',
                    mode: 'cors'
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (data?.count) {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Items Analyzed`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data');
            }
        } catch (error) {
            // Silent retry
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(300);
                return this.loadScanCount(retryCount + 1);
            }
            
            // Silent fallback
            el.innerHTML = `<strong>10K+</strong> Items Analyzed`;
            el.classList.add('sv-stat-loaded');
        }
    },
    
    async loadUserCount(retryCount = 0) {
        const el = document.getElementById('stat-users');
        if (!el) return;
        
        try {
            const counted = localStorage.getItem('sv_user_counted');
            
            const url = counted 
                ? `https://api.counterapi.dev/v1/${this.NAMESPACE}/users` 
                : `https://api.counterapi.dev/v1/${this.NAMESPACE}/users/up`;
            
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
            
            if (data?.count) {
                if (!counted) {
                    localStorage.setItem('sv_user_counted', 'true');
                }
                
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Community Members`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data');
            }
        } catch (error) {
            // Silent retry
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(300);
                return this.loadUserCount(retryCount + 1);
            }
            
            // Silent fallback
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
        
        if (element.classList.contains('sv-beta-success')) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
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
        const mobileLinks = document.querySelectorAll('.sv-mobile-link');

        if (!menuBtn || !mobileNav) return;

        menuBtn.addEventListener('click', () => {
            const isActive = menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    },
    
    setupPrivacyModal() {
        const privacyTrigger = document.getElementById('privacy-trigger');
        const privacyModal = document.getElementById('privacy-modal');
        const privacyClose = document.getElementById('privacy-close-btn');

        if (!privacyTrigger || !privacyModal || !privacyClose) return;

        privacyTrigger.addEventListener('click', () => {
            privacyModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            privacyModal.classList.remove('open');
            document.body.style.overflow = '';
        };

        privacyClose.addEventListener('click', closeModal);

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanding);
} else {
    initializeLanding();
}

function initializeLanding() {
    StatsLoader.init();
    BetaSignup.init();
    UIHandlers.init();
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', { 'page_title': 'Landing Page' });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsLoader, BetaSignup, UIHandlers };
}
