// ====================================
// HORADRIC AI - GUIDED TOUR SYSTEM
// Version: 2.4.0 (Safari Performance Optimized)
// ====================================

const TourGuide = {
    currentStep: 0,
    isActive: false,
    resizeTimer: null,
    scrollTimer: null,
    
    steps: [
        {
            title: "Welcome to Horadric AI! 🎮",
            description: "Let's get you started. This tool uses AI to analyze your loot and tell you if it's worth keeping.",
            target: null,
            position: "center"
        },
        {
            title: "1. Select Your Game 🎲",
            description: "First, choose which Diablo game you are playing. This adjusts the valid classes and item logic.",
            target: "#game-version",
            position: "bottom"
        },
        {
            title: "2. Get Your AI Key 🔑",
            description: "You'll need a free Google Gemini API key. Click the '?' button to see the guide, or the Gear icon to paste your key.",
            target: "#help-trigger",
            position: "bottom"
        },
        {
            title: "3. Select Your Class ⚔️",
            description: "Choose your character class. The AI uses this to determine if an item's stats are actually good for YOU.",
            target: "#player-class",
            position: "bottom"
        },
        {
            title: "4. Advanced Options ⚙️",
            description: "Click here to specify your Build Style (e.g., Thorns, Minions) and specific stat requirements.",
            target: "#toggle-advanced", 
            position: "bottom"
        },
        {
            title: "5. Upload Your Item 📸",
            description: "Drag & drop a screenshot here, or click to browse. We support PNG, JPEG, and WebP.",
            target: "#upload-zone",
            position: "right"
        },
        {
            title: "Try Demo Mode! 🎭",
            description: "No API key yet? No problem. Click here to run a simulation and see how the analysis looks.",
            target: "#demo-btn",
            position: "top"
        },
        {
            title: "Ready to Hunt! 🚀",
            description: "You're all set. Good luck finding those triple-greater-affix items, Nephalem!",
            target: null,
            position: "center"
        }
    ],
    
    /**
     * Initialize tour system
     */
    init() {
        this.createOverlay();
        this.attachEventListeners();
        this.checkFirstVisit();
    },
    
    /**
     * Check if user has seen tour before
     */
    checkFirstVisit() {
        const hasSeenTour = localStorage.getItem('horadric_tour_completed');
        if (!hasSeenTour) {
            // Delay start to ensure DOM is fully rendered
            setTimeout(() => this.start(), 1500);
        }
    },
    
    /**
     * Create overlay elements
     */
    createOverlay() {
        if (document.getElementById('tour-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.className = 'tour-overlay hidden';
        overlay.innerHTML = `
            <div class="tour-backdrop"></div>
            <div class="tour-spotlight"></div>
            <div class="tour-tooltip">
                <div class="tour-content">
                    <h3 class="tour-title"></h3>
                    <p class="tour-description"></p>
                </div>
                <div class="tour-controls">
                    <button id="tour-skip" class="tour-btn tour-skip">Skip</button>
                    <div class="tour-progress">
                        <span class="tour-step-counter"></span>
                    </div>
                    <button id="tour-next" class="tour-btn tour-next">Next</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },
    
    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tour-skip') this.skip();
            if (e.target.id === 'tour-next') this.next();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'Escape') this.skip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') this.next();
            if (e.key === 'ArrowLeft' && this.currentStep > 0) this.showStep(this.currentStep - 1);
        });
        
        // Resize with debounce (Safari optimization)
        window.addEventListener('resize', () => {
            if (!this.isActive) return;
            
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.currentStep < this.steps.length) {
                    this.positionTooltip(this.steps[this.currentStep]);
                }
            }, 150); // Slightly longer debounce for Safari
        });
        
        // Scroll handling with debounce (Safari optimization)
        window.addEventListener('scroll', () => {
            if (!this.isActive || !this.steps[this.currentStep]?.target) return;
            
            clearTimeout(this.scrollTimer);
            this.scrollTimer = setTimeout(() => {
                this.updateSpotlightPosition(this.steps[this.currentStep]);
            }, 50);
        }, { passive: true });
    },
    
    /**
     * Start the tour
     */
    start() {
        this.currentStep = 0;
        this.isActive = true;
        
        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            
            // Slight delay for Safari rendering
            requestAnimationFrame(() => {
                this.showStep(0);
            });
            
            // Track analytics
            this.trackEvent('tour_started');
        }
    },
    
    /**
     * Show specific step
     */
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update UI elements
        const titleEl = document.querySelector('.tour-title');
        const descEl = document.querySelector('.tour-description');
        const counterEl = document.querySelector('.tour-step-counter');
        const nextBtn = document.getElementById('tour-next');

        if (titleEl) titleEl.textContent = step.title;
        if (descEl) descEl.textContent = step.description;
        if (counterEl) counterEl.textContent = `${stepIndex + 1} / ${this.steps.length}`;
        if (nextBtn) nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';
        
        // Position with RAF for Safari
        requestAnimationFrame(() => {
            this.positionTooltip(step);
        });
        
        // Track step view
        this.trackEvent('tour_step_view', { step: stepIndex + 1 });
    },
    
    /**
     * Update spotlight position (for scroll)
     */
    updateSpotlightPosition(step) {
        const spotlight = document.querySelector('.tour-spotlight');
        const target = document.querySelector(step.target);
        
        if (!target || !spotlight) return;
        
        const rect = target.getBoundingClientRect();
        
        // Use transform for better Safari performance
        spotlight.style.display = 'block';
        spotlight.style.top = `${rect.top - 4}px`;
        spotlight.style.left = `${rect.left - 4}px`;
        spotlight.style.width = `${rect.width + 8}px`;
        spotlight.style.height = `${rect.height + 8}px`;
    },
    
    /**
     * Position tooltip relative to target
     */
    positionTooltip(step) {
        const tooltip = document.querySelector('.tour-tooltip');
        const spotlight = document.querySelector('.tour-spotlight');
        
        if (!tooltip || !spotlight) return;

        const isMobile = window.innerWidth <= 768;
        
        // 1. Center modal (no target)
        if (!step.target) {
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.style.bottom = 'auto';
            spotlight.style.display = 'none';
            return;
        }
        
        const target = document.querySelector(step.target);
        
        if (!target) {
            console.warn('Tour target missing:', step.target);
            // Fallback to center
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            spotlight.style.display = 'none';
            return;
        }
        
        // 2. Scroll to target smoothly (Safari-compatible)
        this.scrollToTarget(target, () => {
            // 3. Calculate positions after scroll completes
            const rect = target.getBoundingClientRect();
            
            // Update spotlight
            this.updateSpotlightPosition(step);
            
            tooltip.style.position = 'fixed';
            
            // 4. Mobile positioning
            if (isMobile) {
                this.positionTooltipMobile(tooltip, rect);
                return;
            }
            
            // 5. Desktop positioning
            this.positionTooltipDesktop(tooltip, rect, step.position);
        });
    },
    
    /**
     * Scroll to target with callback (Safari-compatible)
     */
    scrollToTarget(target, callback) {
        // Safari-compatible smooth scroll
        const targetRect = target.getBoundingClientRect();
        const isInView = targetRect.top >= 0 && targetRect.bottom <= window.innerHeight;
        
        if (isInView) {
            // Already in view, execute callback immediately
            callback();
            return;
        }
        
        // Calculate scroll position
        const targetY = window.scrollY + targetRect.top - (window.innerHeight / 2) + (targetRect.height / 2);
        
        // Use smooth scroll
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
        
        // Wait for scroll to finish (Safari needs more time)
        setTimeout(callback, 400);
    },
    
    /**
     * Position tooltip on mobile
     */
    positionTooltipMobile(tooltip, rect) {
        tooltip.style.transform = 'none';
        tooltip.style.width = '90%';
        tooltip.style.left = '5%';
        tooltip.style.right = '5%';

        const screenHeight = window.innerHeight;
        const targetCenterY = rect.top + (rect.height / 2);
        
        // Top or bottom based on target position
        if (targetCenterY > screenHeight / 2) {
            tooltip.style.top = '20px';
            tooltip.style.bottom = 'auto';
        } else {
            tooltip.style.bottom = '20px';
            tooltip.style.top = 'auto';
        }
    },
    
    /**
     * Position tooltip on desktop
     */
    positionTooltipDesktop(tooltip, rect, position) {
        tooltip.style.width = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';
        
        // Position based on preference
        if (position === 'bottom') {
            tooltip.style.top = `${rect.bottom + 20}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
            tooltip.style.transform = 'translateX(-50%)';
        } else if (position === 'top') {
            tooltip.style.top = `${rect.top - 20}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
        } else if (position === 'right') {
            tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
            tooltip.style.left = `${rect.right + 20}px`;
            tooltip.style.transform = 'translateY(-50%)';
        } else {
            // Default bottom
            tooltip.style.top = `${rect.bottom + 20}px`;
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.transform = 'none';
        }
        
        // Boundary detection (keep on screen)
        requestAnimationFrame(() => {
            this.adjustTooltipBounds(tooltip, rect);
        });
    },
    
    /**
     * Adjust tooltip to stay within viewport
     */
    adjustTooltipBounds(tooltip, targetRect) {
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Flip to top if falling off bottom
        if (tooltipRect.bottom > window.innerHeight - 20) {
            tooltip.style.top = `${targetRect.top - tooltipRect.height - 15}px`;
            tooltip.style.transform = 'translateX(-50%)';
        }
        
        // Shift left/right if falling off edge
        if (tooltipRect.right > window.innerWidth - 20) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '20px';
            tooltip.style.transform = 'none';
        }
        if (tooltipRect.left < 20) {
            tooltip.style.left = '20px';
            tooltip.style.transform = 'none';
        }
    },
    
    /**
     * Go to next step
     */
    next() { 
        this.showStep(this.currentStep + 1); 
    },
    
    /**
     * Skip tour
     */
    skip() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('hidden');
        
        localStorage.setItem('horadric_tour_completed', 'true');
        this.trackEvent('tour_skipped', { step: this.currentStep + 1 });
    },
    
    /**
     * Complete tour
     */
    complete() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('hidden');
        
        localStorage.setItem('horadric_tour_completed', 'true');
        this.trackEvent('tour_completed');
    },
    
    /**
     * Restart tour
     */
    restart() {
        localStorage.removeItem('horadric_tour_completed');
        this.start();
        
        // Close help modal if open
        const helpModal = document.getElementById('help-modal');
        if (helpModal) helpModal.classList.remove('open');
        
        this.trackEvent('tour_restarted');
    },
    
    /**
     * Track analytics event
     */
    trackEvent(eventName, params = {}) {
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackMilestone === 'function') {
            Analytics.trackMilestone(eventName, { 
                timestamp: new Date().toISOString(),
                ...params 
            });
        } else if (typeof gtag !== 'undefined') {
            gtag('event', eventName, params);
        }
    }
};

// ====================================
// INITIALIZATION
// ====================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TourGuide.init());
} else {
    // DOM already loaded
    TourGuide.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourGuide;
}
