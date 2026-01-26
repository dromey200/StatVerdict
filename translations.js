// ====================================
// HORADRIC AI - TRANSLATIONS
// Version: 2.0.2
// ====================================

/**
 * Internationalization (i18n) system
 * Supports multiple languages for the UI
 */

const translations = {
    en: {
        app_title: 'Horadric AI',
        app_subtitle: 'Diablo Loot Analyzer',
        app_description: 'AI-powered Diablo loot analyzer - Identify and evaluate your items instantly',
        skip_to_content: 'Skip to content',
        language: 'Language:',
        
        // Form labels
        api_key_label: 'Gemini API Key',
        your_class: 'Your Class',
        build_focus: 'Your Build Focus (Optional)',
        upload_screenshot: 'Upload Loot Screenshot',
        
        // Buttons
        identify_item: 'Identify Item',
        try_demo: '🎮 Try Demo Mode',
        cancel: 'Cancel Analysis',
        
        // Classes
        select_class: 'Select Class (Optional)',
        barbarian: 'Barbarian',
        druid: 'Druid',
        necromancer: 'Necromancer',
        paladin: 'Paladin',
        rogue: 'Rogue',
        sorcerer: 'Sorcerer',
        spiritborn: 'Spiritborn',
        
        // Build styles
        any_build: 'Any Build',
        damage_dealer: '🗡️ Damage Dealer',
        tanky: '🛡️ Tanky/Defensive',
        speed: '⚡ Speed/Mobility',
        dots: '🔥 Damage Over Time',
        crit: '💥 Critical Strike',
        minions: '👥 Minions/Pets',
        cooldown: '⏱️ Cooldown Reduction',
        lucky_hit: '🎯 Lucky Hit',
        crowd_control: '❄️ Crowd Control',
        resource: '💧 Resource Generation',
        
        // Messages
        loading: 'Consulting the archives...',
        error_no_image: 'Please upload an image first',
        error_no_api_key: 'Please enter your API key',
        
        // Footer
        made_with_love: 'Made with ❤️ for the Sanctuary',
        report_issue: '🐛 Report Issue',
        submit_enhancement: '💡 Submit Enhancement',
        privacy: 'Privacy'
    },
    
    es: {
        app_title: 'Horadric AI',
        app_subtitle: 'Analizador de Botín de Diablo 4 con IA',
        app_description: 'Analizador de botín de Diablo 4 con IA - Identifica y evalúa tus objetos instantáneamente',
        skip_to_content: 'Saltar al contenido',
        language: 'Idioma:',
        api_key_label: 'Clave API de Gemini',
        your_class: 'Tu Clase',
        build_focus: 'Enfoque de Build (Opcional)',
        upload_screenshot: 'Subir Captura de Pantalla',
        identify_item: 'Identificar Objeto',
        try_demo: '🎮 Probar Demo',
        cancel: 'Cancelar Análisis',
        select_class: 'Seleccionar Clase (Opcional)',
        barbarian: 'Bárbaro',
        druid: 'Druida',
        necromancer: 'Nigromante',
        paladin: 'Paladín',
        rogue: 'Pícaro',
        sorcerer: 'Hechicero',
        spiritborn: 'Nacido del Espíritu',
        loading: 'Consultando los archivos...',
        made_with_love: 'Hecho con ❤️ para el Santuario'
    },
    
    fr: {
        app_title: 'Horadric AI',
        app_subtitle: 'Analyseur de Butin Diablo 4 propulsé par IA',
        language: 'Langue:',
        your_class: 'Votre Classe',
        identify_item: 'Identifier l\'Objet',
        try_demo: '🎮 Essayer la Démo',
        loading: 'Consultation des archives...',
        made_with_love: 'Fait avec ❤️ pour le Sanctuaire'
    },
    
    de: {
        app_title: 'Horadric AI',
        app_subtitle: 'KI-gestützter Diablo 4 Beute-Analysator',
        language: 'Sprache:',
        your_class: 'Deine Klasse',
        identify_item: 'Gegenstand Identifizieren',
        try_demo: '🎮 Demo Testen',
        loading: 'Durchsuche die Archive...',
        made_with_love: 'Mit ❤️ für das Sanktuarium gemacht'
    },
    
    pt: {
        app_title: 'Horadric AI',
        app_subtitle: 'Analisador de Loot de Diablo 4 com IA',
        language: 'Idioma:',
        your_class: 'Sua Classe',
        identify_item: 'Identificar Item',
        try_demo: '🎮 Experimentar Demo',
        loading: 'Consultando os arquivos...',
        made_with_love: 'Feito com ❤️ para o Santuário'
    },
    
    ru: {
        app_title: 'Horadric AI',
        app_subtitle: 'ИИ-анализатор добычи Diablo 4',
        language: 'Язык:',
        your_class: 'Ваш Класс',
        identify_item: 'Идентифицировать Предмет',
        try_demo: '🎮 Попробовать Демо',
        loading: 'Консультируемся с архивами...',
        made_with_love: 'Сделано с ❤️ для Санктуария'
    },
    
    zh: {
        app_title: 'Horadric AI',
        app_subtitle: '暗黑破坏神4 AI战利品分析器',
        language: '语言:',
        your_class: '你的职业',
        identify_item: '识别物品',
        try_demo: '🎮 试用演示',
        loading: '正在查阅档案...',
        made_with_love: '为圣休亚瑞用❤️制作'
    },
    
    ja: {
        app_title: 'Horadric AI',
        app_subtitle: 'Diablo 4 AI戦利品アナライザー',
        language: '言語:',
        your_class: 'あなたのクラス',
        identify_item: 'アイテムを識別',
        try_demo: '🎮 デモを試す',
        loading: 'アーカイブを参照中...',
        made_with_love: 'サンクチュアリのために❤️で作られました'
    }
};

/**
 * i18n utility object
 */
const i18n = {
    currentLanguage: 'en',
    
    /**
     * Initialize with browser language or saved preference
     */
    init() {
        const saved = localStorage.getItem('horadric_language');
        if (saved && translations[saved]) {
            this.currentLanguage = saved;
        } else {
            const browserLang = navigator.language.split('-')[0];
            if (translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
    },
    
    /**
     * Get translation for a key
     */
    get(key, fallback = '') {
        const lang = translations[this.currentLanguage] || translations.en;
        return lang[key] || translations.en[key] || fallback || key;
    },
    
    /**
     * Set current language
     */
    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('horadric_language', lang);
            window.dispatchEvent(new CustomEvent('languageChanged'));
        }
    },
    
    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    },
    
    /**
     * Get all available languages
     */
    getAvailableLanguages() {
        return Object.keys(translations);
    }
};

// Initialize on load
i18n.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, i18n };
}
