// ====================================
// HORADRIC AI - GUIDED TOUR SYSTEM
// Version: 2.3.0 (Fixed Alignment)
// ====================================

const TourGuide = {
    currentStep: 0,
    isActive: false,
    resizeTimer: null,
    
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
    
    init() {
        this.createOverlay();
        this.attachEventListeners();
        this.checkFirstVisit();
    },
    
    checkFirstVisit() {
        const hasSeenTour = localStorage.getItem('horadric_tour_completed');
        if (!hasSeenTour) {
            setTimeout(() => this.start(), 1000);
        }
    },
    
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
    
    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'tour-skip') this.skip();
            if (e.target.id === 'tour-next') this.next();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) this.skip();
        });
        
        // Handle resize with debounce to prevent flickering
        window.addEventListener('resize', () => {
            if (!this.isActive) return;
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                if (this.currentStep < this.steps.length) {
                    this.positionTooltip(this.steps[this.currentStep]);
                }
            }, 100);
        });
        
        // Handle scroll to update spotlight position in real-time
        window.addEventListener('scroll', () => {
            if (this.isActive && this.steps[this.currentStep].target) {
                // We use requestAnimationFrame for performance during scroll
                requestAnimationFrame(() => {
                    this.updateSpotlightPosition(this.steps[this.currentStep]);
                });
            }
        }, { passive: true });
    },
    
    start() {
        this.currentStep = 0;
        this.isActive = true;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.showStep(0);
            
            if (typeof Analytics !== 'undefined' && typeof Analytics.trackMilestone === 'function') {
                Analytics.trackMilestone('tour_started', { timestamp: new Date().toISOString() });
            }
        }
    },
    
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        const titleEl = document.querySelector('.tour-title');
        const descEl = document.querySelector('.tour-description');
        const counterEl = document.querySelector('.tour-step-counter');
        const nextBtn = document.getElementById('tour-next');

        if (titleEl) titleEl.textContent = step.title;
        if (descEl) descEl.textContent = step.description;
        if (counterEl) counterEl.textContent = `${stepIndex + 1} / ${this.steps.length}`;
        if (nextBtn) nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';
        
        this.positionTooltip(step);
        
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackUserJourneyStep === 'function') {
            Analytics.trackUserJourneyStep(step.title, stepIndex + 1, this.steps.length);
        }
    },
    
    updateSpotlightPosition(step) {
        const spotlight = document.querySelector('.tour-spotlight');
        const target = document.querySelector(step.target);
        
        if (!target || !spotlight) return;
        
        const rect = target.getBoundingClientRect();
        
        spotlight.style.display = 'block';
        spotlight.style.top = `${rect.top - 4}px`; // Tightened padding
        spotlight.style.left = `${rect.left - 4}px`;
        spotlight.style.width = `${rect.width + 8}px`;
        spotlight.style.height = `${rect.height + 8}px`;
    },
    
    positionTooltip(step) {
        const tooltip = document.querySelector('.tour-tooltip');
        const spotlight = document.querySelector('.tour-spotlight');
        
        if (!tooltip || !spotlight) return;

        // Mobile Breakpoint
        const isMobile = window.innerWidth <= 768;
        
        // 1. Handle Center Modal (No Target)
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
            // Fallback: Center tooltip if target missing
            tooltip.style.position = 'fixed';
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            spotlight.style.display = 'none';
            return;
        }
        
        // 2. Scroll to Target (INSTANT/AUTO to prevent coordinate drift)
        // 'center' ensures the element is safely in the middle of the screen
        target.scrollIntoView({ behavior: 'auto', block: 'center' });
        
        // 3. Calculate Coordinates (immediately after scroll)
        const rect = target.getBoundingClientRect();
        
        // Update Spotlight immediately
        this.updateSpotlightPosition(step);
        
        tooltip.style.position = 'fixed';
        
        // 4. Smart Mobile Positioning
        if (isMobile) {
            tooltip.style.transform = 'none';
            tooltip.style.width = '90%';
            tooltip.style.left = '5%';
            tooltip.style.right = '5%';

            const screenHeight = window.innerHeight;
            const targetCenterY = rect.top + (rect.height / 2);
            
            // Logic: If target is in bottom half, put tooltip at TOP. 
            // If target is in top half, put tooltip at BOTTOM.
            if (targetCenterY > screenHeight / 2) {
                tooltip.style.top = '20px';
                tooltip.style.bottom = 'auto';
            } else {
                tooltip.style.bottom = '20px';
                tooltip.style.top = 'auto';
            }
            return;
        }
        
        // 5. Desktop Positioning
        tooltip.style.width = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';
        
        if (step.position === 'bottom') {
            tooltip.style.top = `${rect.bottom + 20}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
            tooltip.style.transform = 'translateX(-50%)';
        } else if (step.position === 'top') {
            tooltip.style.top = `${rect.top - 20}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
            tooltip.style.transform = 'translate(-50%, -100%)';
        } else if (step.position === 'right') {
            tooltip.style.top = `${rect.top + (rect.height / 2)}px`;
            tooltip.style.left = `${rect.right + 20}px`;
            tooltip.style.transform = 'translateY(-50%)';
        } else {
            // Default
            tooltip.style.top = `${rect.bottom + 20}px`;
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.transform = 'none';
        }
        
        // Boundary Detection (Keep tooltip on screen)
        // We use a small timeout to let the DOM settle if layout shifted
        setTimeout(() => {
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Flip to top if falling off bottom
            if (tooltipRect.bottom > window.innerHeight) {
                tooltip.style.top = `${rect.top - tooltipRect.height - 15}px`;
                if (step.position === 'bottom') tooltip.style.transform = 'translateX(-50%)';
            }
            
            // Shift left/right if falling off edge
            if (tooltipRect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '20px';
                tooltip.style.transform = 'none';
            }
            if (tooltipRect.left < 0) {
                tooltip.style.left = '20px';
                tooltip.style.transform = 'none';
            }
        }, 10);
    },
    
    next() { this.showStep(this.currentStep + 1); },
    
    skip() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('hidden');
        localStorage.setItem('horadric_tour_completed', 'true');
        
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackMilestone === 'function') {
            Analytics.trackMilestone('tour_skipped', { step: this.currentStep + 1, total_steps: this.steps.length });
        }
    },
    
    complete() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('hidden');
        localStorage.setItem('horadric_tour_completed', 'true');
        
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackMilestone === 'function') {
            Analytics.trackMilestone('tour_completed', { timestamp: new Date().toISOString() });
        }
    },
    
    restart() {
        localStorage.removeItem('horadric_tour_completed');
        this.start();
        const helpModal = document.getElementById('help-modal');
        if (helpModal) helpModal.classList.remove('open');
        
        if (typeof Analytics !== 'undefined' && typeof Analytics.trackMilestone === 'function') {
            Analytics.trackMilestone('tour_restarted', { timestamp: new Date().toISOString() });
        }
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TourGuide.init());
} else {
    TourGuide.init();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TourGuide;
}