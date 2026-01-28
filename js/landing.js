// ====================================
// STATVERDICT LANDING PAGE LOGIC
// Version: 2.1.1 - CSP Compliant & Optimized
// ====================================

const StatsLoader = {
    NAMESPACE: 'statverdict',
    TIMEOUT: 3000, // 3 second timeout for API calls
    MAX_RETRIES: 2,
    
    /**
     * Initialize stats loading with proper error handling
     */
    async init() {
        // Check if local/dev environment
        const isLocal = this.isLocalEnvironment();
        
        if (isLocal) {
            // Silently use fallback on local
            this.displayFallback();
            return;
        }
        
        // Load stats with timeout protection
        await this.loadStatsWithTimeout();
    },
    
    /**
     * Check if running locally
     */
    isLocalEnvironment() {
        const hostname = window.location.hostname;
        return hostname === '127.0.0.1' || 
               hostname === 'localhost' || 
               hostname === '' || 
               hostname.startsWith('192.168') ||
               hostname.startsWith('10.0');
    },
    
    /**
     * Load stats with timeout wrapper
     */
    async loadStatsWithTimeout() {
        // Show loading state immediately
        this.showLoadingState();
        
        try {
            // Race between stats loading and timeout
            await Promise.race([
                Promise.all([
                    this.loadScanCount(),
                    this.loadUserCount()
                ]),
                this.timeoutPromise(this.TIMEOUT)
            ]);
        } catch (error) {
            // Silently fallback on timeout/error
            this.displayFallback();
        }
    },
    
    /**
     * Create timeout promise
     */
    timeoutPromise(ms) {
        return new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), ms)
        );
    },
    
    /**
     * Show loading skeleton
     */
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
    
    /**
     * Display fallback stats (no API calls)
     */
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
    
    /**
     * Load scan count with retry logic
     */
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
                    cache: 'no-store' // Safari cache fix
                }
            );
            
            clearTimeout(timeoutId);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (data?.count) {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Items Analyzed`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            // Retry logic
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(500);
                return this.loadScanCount(retryCount + 1);
            }
            
            // Final fallback (silent)
            el.innerHTML = `<strong>10K+</strong> Items Analyzed`;
            el.classList.add('sv-stat-loaded');
        }
    },
    
    /**
     * Load user count with retry logic
     */
    async loadUserCount(retryCount = 0) {
        const el = document.getElementById('stat-users');
        if (!el) return;
        
        try {
            const counted = localStorage.getItem('sv_user_counted');
            
            // Decide URL based on whether user has been counted
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
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            
            if (data?.count) {
                // Mark as counted only if increment succeeded
                if (!counted) {
                    localStorage.setItem('sv_user_counted', 'true');
                }
                
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Community Members`;
                el.classList.add('sv-stat-loaded');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            // Retry logic
            if (retryCount < this.MAX_RETRIES) {
                await this.delay(500);
                return this.loadUserCount(retryCount + 1);
            }
            
            // Final fallback (silent)
            el.innerHTML = `<strong>500+</strong> Community Members`;
            el.classList.add('sv-stat-loaded');
        }
    },
    
    /**
     * Format large numbers
     */
    formatNumber(num) {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
        return num.toString();
    },
    
    /**
     * Simple delay helper
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ====================================
// BETA SIGNUP HANDLER
// ====================================

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
        
        // Validate email
        if (!emailInput.validity.valid) {
            this.showMessage(errorMsg, '⚠️ Please enter a valid email address');
            return;
        }
        
        // Update button state
        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;
        
        try {
            // Use fetch with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            await fetch(form.action, { 
                method: 'POST', 
                body: new FormData(form), 
                mode: 'no-cors',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            // Success
            this.showMessage(successMsg, '✅ You\'re on the list! Check your inbox/spam folder to confirm.');
            emailInput.value = '';
            
            // Track signup
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
        
        // Hide other message
        const allMessages = document.querySelectorAll('.sv-beta-msg');
        allMessages.forEach(msg => {
            if (msg !== element) msg.style.display = 'none';
        });
        
        // Auto-hide success message after 5 seconds
        if (element.classList.contains('sv-beta-success')) {
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
};

// ====================================
// MOBILE MENU & MODAL HANDLERS
// ====================================

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
            
            // Update ARIA
            menuBtn.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close on escape key
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
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        const closeModal = () => {
            privacyModal.classList.remove('open');
            document.body.style.overflow = ''; // Restore scroll
        };

        privacyClose.addEventListener('click', closeModal);

        // Close on backdrop click
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) closeModal();
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
                closeModal();
            }
        });
    }
};

// ====================================
// INITIALIZATION
// ====================================

// Use DOMContentLoaded for better Safari compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanding);
} else {
    // DOM already loaded
    initializeLanding();
}

function initializeLanding() {
    // Initialize all components
    StatsLoader.init();
    BetaSignup.init();
    UIHandlers.init();
    
    // Track page view (silent if gtag not loaded)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', { 'page_title': 'Landing Page' });
    }
}

// Export for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsLoader, BetaSignup, UIHandlers };
}
