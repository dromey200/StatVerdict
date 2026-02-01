// ====================================
// HORADRIC AI - TOUR SYSTEM (Fixed & Robust)
// ====================================

const TourGuide = {
    currentStep: 0,
    isActive: false,
    
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
            description: "Click here to specify your Build Style (e.g., Thorns, Minions). This enables the 'Build Synergy' calculator!",
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
        // --- NEW STEP ADDED BELOW ---
        {
            title: "Your Loadout 🛡️",
            description: "When you find a good item, click 'Equip'. The AI will use your loadout to make smarter comparisons for future drops.",
            target: ".loadout-section", // Targets the new section in the bottom right
            position: "left"
        },
        // ----------------------------
        {
            title: "Ready to Hunt! 🚀",
            description: "You're all set. Good luck finding those triple-greater-affix items, Nephalem!",
            target: null,
            position: "center"
        }
    ],
    
    init() {
        // Ensure DOM is ready before creating overlay
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        this.createOverlay();
        this.attachEventListeners();
        // Small delay to ensure CSS is applied before checking start
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
        overlay.className = 'tour-overlay hidden'; // Start hidden
        
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
        // Use document level delegation for robustness
        document.addEventListener('click', (e) => {
            if (!this.isActive) return;
            if (e.target.id === 'tour-skip') this.skip();
            if (e.target.id === 'tour-next') this.next();
        }, { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            if (e.key === 'Escape') this.skip();
            if (e.key === 'ArrowRight' || e.key === 'Enter') this.next();
            if (e.key === 'ArrowLeft' && this.currentStep > 0) this.showStep(this.currentStep - 1);
        });
        
        // Handle window resize/scroll with requestAnimationFrame
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
        // Double check overlay exists
        this.createOverlay();
        
        this.currentStep = 0;
        this.isActive = true;
        
        const overlay = document.getElementById('tour-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            // Force browser repaint
            void overlay.offsetWidth; 
        }
        
        this.showStep(0);
    },
    
    showStep(stepIndex) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        const step = this.steps[stepIndex];
        this.currentStep = stepIndex;
        
        // Update text content
        const titleEl = document.querySelector('.tour-title');
        const descEl = document.querySelector('.tour-description');
        const counterEl = document.querySelector('.tour-step-counter');
        const nextBtn = document.getElementById('tour-next');

        if (titleEl) titleEl.textContent = step.title;
        if (descEl) descEl.textContent = step.description;
        if (counterEl) counterEl.textContent = `${stepIndex + 1} / ${this.steps.length}`;
        if (nextBtn) nextBtn.textContent = stepIndex === this.steps.length - 1 ? 'Finish' : 'Next';
        
        // Handle positioning logic
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                this.scrollToTarget(target, () => this.updatePositions(step));
            } else {
                // If target missing, fallback to center
                this.updatePositions({ ...step, target: null });
            }
        } else {
            this.updatePositions(step);
        }
    },
    
    scrollToTarget(target, callback) {
        // Native smooth scroll
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        // Wait for scroll to likely finish
        setTimeout(callback, 500);
    },
    
    updatePositions(step) {
        const spotlight = document.querySelector('.tour-spotlight');
        const tooltip = document.querySelector('.tour-tooltip');
        
        if (!spotlight || !tooltip) return;

        // 1. Position Spotlight
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                const rect = target.getBoundingClientRect();
                spotlight.style.display = 'block';
                spotlight.style.top = `${rect.top - 5}px`;
                spotlight.style.left = `${rect.left - 5}px`;
                spotlight.style.width = `${rect.width + 10}px`;
                spotlight.style.height = `${rect.height + 10}px`;
            }
        } else {
            spotlight.style.display = 'none';
        }

        // 2. Position Tooltip
        tooltip.style.position = 'fixed';
        
        if (!step.target) {
            // Center
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            tooltip.style.bottom = 'auto';
            tooltip.style.right = 'auto';
        } else {
            const target = document.querySelector(step.target);
            if (!target) return;
            const rect = target.getBoundingClientRect();
            
            // Reset transform
            tooltip.style.transform = 'none';
            
            // Default: Below target
            let topPos = rect.bottom + 15;
            let leftPos = rect.left;
            
            // Mobile adjustments
            if (window.innerWidth <= 768) {
                tooltip.style.left = '5%';
                tooltip.style.width = '90%';
                if (rect.top > window.innerHeight / 2) {
                    tooltip.style.top = 'auto';
                    tooltip.style.bottom = '20px';
                } else {
                    tooltip.style.top = 'auto';
                    tooltip.style.bottom = '20px'; // Fallback to bottom on mobile often safer
                }
            } else {
                // Desktop
                if (step.position === 'top') {
                    topPos = rect.top - tooltip.offsetHeight - 15;
                } else if (step.position === 'right') {
                    leftPos = rect.right + 15;
                    topPos = rect.top;
                }
                
                tooltip.style.top = `${topPos}px`;
                tooltip.style.left = `${leftPos}px`;
                
                // Simple boundary check
                const toolRect = tooltip.getBoundingClientRect();
                if (toolRect.bottom > window.innerHeight) {
                    tooltip.style.top = `${rect.top - toolRect.height - 15}px`;
                }
                if (toolRect.right > window.innerWidth) {
                    tooltip.style.left = `${window.innerWidth - toolRect.width - 20}px`;
                }
            }
        }
    },
    
    next() { this.showStep(this.currentStep + 1); },
    
    skip() {
        this.isActive = false;
        const overlay = document.getElementById('tour-overlay');
        if (overlay) overlay.classList.add('hidden');
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