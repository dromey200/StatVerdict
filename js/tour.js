// ====================================
// HORADRIC AI - TOUR SYSTEM (Fixed & Robust)
// ====================================

const TourGuide = {
    currentStep: 0,
    isActive: false,
    
    steps: [
        {
            title: "Welcome to Horadric AI! 🎮",
            description: "Let's get you started. This tool uses AI to analyze your Diablo IV loot and tell you if it's worth keeping.",
            target: null,
            position: "center"
        },
        {
            title: "1. Select Your Class ⚔️",
            description: "Choose your character class. The AI uses this to determine if an item's stats are actually good for YOUR build.",
            target: "#player-class",
            position: "bottom"
        },
        {
            title: "2. Upload Your Item 📸",
            description: "Drag & drop a screenshot here, or click to browse. We support PNG, JPEG, and WebP.",
            target: "#upload-zone",
            position: "bottom"
        },
        {
            title: "3. Analyze or Compare ⚡",
            description: "Hit 'Analyze' for a single item verdict, or 'Compare' to see how two items stack up side-by-side.",
            target: ".h-card-actions",
            position: "top"
        },
        {
            title: "Try Demo Mode! 🎭",
            description: "Want to see how it works first? Click 'Try Demo' to run a simulation with a Mythic Harlequin Crest.",
            target: "#demo-btn",
            position: "top"
        },
        {
            title: "Your Scan Journal 📜",
            description: "Every scan is saved here. Click any past result to re-open it. Results persist between sessions.",
            target: ".recent-card",
            position: "left"
        },
        {
            title: "Ready to Hunt! 🚀",
            description: "You're all set. No API key needed — just upload and scan. Good luck finding those triple-greater-affix items, Nephalem!",
            target: null,
            position: "center"
        }
    ],
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.createOverlay();
        this.attachEventListeners();
        setTimeout(() => this.checkFirstVisit(), 500);
    },
    
    checkFirstVisit() {
        const hasSeenTour = localStorage.getItem('horadric_tour_completed');
        if (!hasSeenTour) {
            this.start();
        }
    },
    
    createOverlay() {
        if (document.getElementById('tour-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tour-overlay';
        overlay.className = 'tour-overlay h-hidden';
        
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
            if (!this.isActive) return;
            if (e.target.id === 'tour-skip') this.skip();
            if (e.target.id === 'tour-next') this.next();
        }, { passive: true });
        
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            if (e.key === 'Escape') this.skip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') this.next();
            if (e.key === 'ArrowLeft' && this.currentStep > 0) this.showStep(this.currentStep - 1);
        });
        
        const handleUpdate = () => {
            if (this.isActive && this.steps[this.currentStep]) {
                requestAnimationFrame(() => {
                    this.updatePositions(this.steps[this.currentStep]);
                });
            }
        };

        window.addEventListener('resize', handleUpdate, { passive: true });
        window.addEventListener('scroll', handleUpdate, { passive: true });
    },
    
    start() {
        this.createOverlay();
        this.currentStep = 0;
        this.isActive = true;
        
        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.classList.remove('h-hidden');
            void overlay.offsetWidth; 
        }
        
        this.showStep(0);
    },
    
    // Check if a target element is visible and has a real bounding box
    getVisibleTarget(selector) {
        if (!selector) return null;
        const el = document.querySelector(selector);
        if (!el) return null;
        
        // Reject hidden inputs, display:none, visibility:hidden
        if (el.type === 'hidden') return null;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return null;
        
        // Reject zero-size elements (collapsed or offscreen)
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return null;
        
        return el;
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
        
        const target = this.getVisibleTarget(step.target);
        
        if (target) {
            this.scrollToTarget(target, () => this.updatePositions(step));
        } else {
            // No visible target — centered overlay, scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => this.updatePositions({ ...step, target: null }), 400);
        }
    },
    
    scrollToTarget(target, callback) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        setTimeout(callback, 400);
    },
    
    updatePositions(step) {
        const spotlight = document.querySelector('.tour-spotlight');
        const tooltip = document.querySelector('.tour-tooltip');
        
        if (!spotlight || !tooltip) return;

        // Reset tooltip styles for clean calculation
        tooltip.style.top = '';
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';
        tooltip.style.transform = '';
        tooltip.style.width = '';
        tooltip.style.position = 'fixed';
        
        const target = step.target ? this.getVisibleTarget(step.target) : null;

        // --- Spotlight ---
        if (target) {
            const rect = target.getBoundingClientRect();
            const pad = 8;
            spotlight.style.display = 'block';
            spotlight.style.top = `${rect.top - pad}px`;
            spotlight.style.left = `${rect.left - pad}px`;
            spotlight.style.width = `${rect.width + pad * 2}px`;
            spotlight.style.height = `${rect.height + pad * 2}px`;
        } else {
            spotlight.style.display = 'none';
        }

        // --- Tooltip ---
        if (!target) {
            // Center on screen
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }
        
        const rect = target.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const margin = 15;
        
        // Mobile: always pin tooltip to bottom of viewport
        if (vw <= 768) {
            tooltip.style.left = '4%';
            tooltip.style.width = '92%';
            tooltip.style.bottom = '16px';
            tooltip.style.top = 'auto';
            return;
        }
        
        // Desktop: position relative to target
        const tw = tooltip.offsetWidth || 320;
        const th = tooltip.offsetHeight || 150;
        
        let top, left;
        
        switch (step.position) {
            case 'top':
                top = rect.top - th - margin;
                left = rect.left + (rect.width / 2) - (tw / 2);
                break;
            case 'left':
                top = rect.top + (rect.height / 2) - (th / 2);
                left = rect.left - tw - margin;
                break;
            case 'right':
                top = rect.top + (rect.height / 2) - (th / 2);
                left = rect.right + margin;
                break;
            case 'bottom':
            default:
                top = rect.bottom + margin;
                left = rect.left + (rect.width / 2) - (tw / 2);
                break;
        }
        
        // Boundary clamping — keep tooltip fully on screen
        if (top < margin) top = margin;
        if (top + th > vh - margin) top = vh - th - margin;
        if (left < margin) left = margin;
        if (left + tw > vw - margin) left = vw - tw - margin;
        
        // If tooltip would overlap the spotlight, flip to opposite side
        const spotTop = rect.top - 8;
        const spotBottom = rect.bottom + 8;
        if (top < spotBottom && top + th > spotTop) {
            if (rect.bottom + margin + th < vh) {
                top = rect.bottom + margin;
            } else {
                top = rect.top - th - margin;
            }
        }
        
        tooltip.style.top = `${Math.max(margin, top)}px`;
        tooltip.style.left = `${Math.max(margin, left)}px`;
    },
    
    next() { this.showStep(this.currentStep + 1); },
    
    skip() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('h-hidden');
        localStorage.setItem('horadric_tour_completed', 'true');
    },
    
    complete() { this.skip(); },
    
    restart() {
        localStorage.removeItem('horadric_tour_completed');
        this.start();
    }
};

// Initialize
TourGuide.init();
