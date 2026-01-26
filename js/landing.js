// ====================================
// STATVERDICT LANDING PAGE LOGIC
// ====================================

const StatsLoader = {
    NAMESPACE: 'statverdict', 
    
    async init() {
        const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
        if (isLocal) {
            this.displayFallback();
            return;
        }
        await Promise.all([
            this.loadScanCount(),
            this.loadUserCount()
        ]);
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
    
    async loadScanCount() {
        const el = document.getElementById('stat-scans');
        if (!el) return;
        
        try {
            const res = await fetch(`https://api.counterapi.dev/v1/${this.NAMESPACE}/scans`);
            const data = await res.json();
            if (data?.count) {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Items Analyzed`;
            }
        } catch (e) { 
            this.displayFallback(); 
        }
        el.classList.add('sv-stat-loaded');
    },
    
    async loadUserCount() {
        const el = document.getElementById('stat-users');
        if (!el) return;
        
        try {
            const counted = localStorage.getItem('sv_user_counted');
            const url = counted 
                ? `https://api.counterapi.dev/v1/${this.NAMESPACE}/users` 
                : `https://api.counterapi.dev/v1/${this.NAMESPACE}/users/up`;
            
            if (!counted) localStorage.setItem('sv_user_counted', 'true');
            
            const res = await fetch(url);
            const data = await res.json();
            if (data?.count) {
                el.innerHTML = `<strong>${this.formatNumber(data.count)}</strong> Community Members`;
            }
        } catch (e) { 
            this.displayFallback(); 
        }
        el.classList.add('sv-stat-loaded');
    },
    
    formatNumber(num) {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
        return num.toString();
    }
};

// Initialize stats loader
StatsLoader.init();

// BETA SIGNUP HANDLER
const betaForm = document.getElementById('beta-signup-form');
if (betaForm) {
    betaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = document.getElementById('beta-submit-btn');
        const successMsg = document.getElementById('beta-signup-success');
        const errorMsg = document.getElementById('beta-signup-error');
        
        submitBtn.textContent = 'Joining...';
        submitBtn.disabled = true;
        
        fetch(form.action, { 
            method: 'POST', 
            body: new FormData(form), 
            mode: 'no-cors' 
        })
        .then(() => {
            successMsg.style.display = 'block';
            errorMsg.style.display = 'none';
            document.getElementById('beta-email-input').value = '';
            submitBtn.textContent = 'Join Beta';
            submitBtn.disabled = false;
        })
        .catch(() => {
            errorMsg.style.display = 'block';
            successMsg.style.display = 'none';
            submitBtn.textContent = 'Join Beta';
            submitBtn.disabled = false;
        });
    });
}

// MOBILE MENU & PRIVACY MODAL HANDLER
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const menuBtn = document.getElementById('sv-mobile-menu-btn');
    const mobileNav = document.getElementById('sv-mobile-nav');
    const mobileLinks = document.querySelectorAll('.sv-mobile-link');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Privacy Modal
    const privacyTrigger = document.getElementById('privacy-trigger');
    const privacyModal = document.getElementById('privacy-modal');
    const privacyClose = document.getElementById('privacy-close-btn');

    if (privacyTrigger && privacyModal && privacyClose) {
        privacyTrigger.addEventListener('click', () => {
            privacyModal.classList.add('open');
        });

        privacyClose.addEventListener('click', () => {
            privacyModal.classList.remove('open');
        });

        // Close on click outside
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                privacyModal.classList.remove('open');
            }
        });
        
        // Close on Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
                privacyModal.classList.remove('open');
            }
        });
    }
});