// ====================================
// HORADRIC AI - i18n UI UPDATER
// ====================================

/**
 * Handles dynamic UI translation updates
 * Updates all elements with data-i18n attributes when language changes
 */

const i18nUI = {
    /**
     * Translate all elements with data-i18n attributes
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                const translation = i18n.get(key);
                
                // For input elements, update placeholder
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                }
                // For select/option elements, don't translate the actual options
                else if (element.tagName === 'SELECT' || element.tagName === 'OPTION') {
                    // Only translate if it's the label, not the select itself
                    if (element.parentElement.tagName !== 'SELECT') {
                        element.textContent = translation;
                    }
                }
                // For all other elements, update textContent or innerHTML
                else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update page title and meta description
        this.updatePageMeta();
        
        console.log('✨ UI translated to:', i18n.getCurrentLanguage());
    },
    
    /**
     * Update page title and meta description based on current language
     */
    updatePageMeta() {
        const appTitle = i18n.get('app_title', 'Horadric AI');
        const appSubtitle = i18n.get('app_subtitle', 'Diablo 4 Loot Analyzer');
        const appDesc = i18n.get('app_description', 'AI-powered Diablo 4 loot analyzer');
        
        document.title = `${appTitle} - ${appSubtitle}`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', appDesc);
        }
    },
    
    /**
     * Setup language switcher event listener
     */
    setupLanguageSwitcher() {
        const languageSelect = document.getElementById('language-select');
        
        // FIX: Return silently if selector isn't present (prevents console warning)
        if (!languageSelect) {
            return;
        }
        
        // Set current language in select
        languageSelect.value = i18n.getCurrentLanguage();
        
        // Add change event listener
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            i18n.setLanguage(selectedLanguage);
            i18nUI.translatePage();
        });
    },
    
    /**
     * Initialize i18n UI system
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    },
    
    /**
     * Setup method called when DOM is ready
     */
    setup() {
        // Initial translation of the page
        this.translatePage();
        
        // Setup language switcher
        this.setupLanguageSwitcher();
        
        // Listen for language change events
        window.addEventListener('languageChanged', () => {
            this.translatePage();
        });
    }
};

// Initialize when script loads
i18nUI.init();