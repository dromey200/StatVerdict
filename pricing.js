// ====================================
// HORADRIC AI - PRICING DATABASE
// Version: 2.1.0
// ====================================

/**
 * Static price database for common items
 * Used as fallback when live pricing is unavailable
 */

const PriceDatabase = {
    items: {
        'harlequin crest': {
            name: 'Harlequin Crest',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'very_high',
            notes: 'Mythic Uniques cannot be traded. You must craft or loot it.'
        },
        'shako': {
            name: 'Harlequin Crest (Shako)',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'very_high',
            notes: 'Mythic Uniques cannot be traded.'
        },
        'tyrael\'s might': {
            name: 'Tyrael\'s Might',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'very_high',
            notes: 'Mythic rarity items are account bound.'
        },
        'tibault\'s will': {
            name: 'Tibault\'s Will',
            rarity: 'unique',
            tradeValue: 'Moderate',
            estimatedPrice: '50M - 500M Gold',
            demand: 'high',
            notes: 'Price depends heavily on the Damage Reduction roll.'
        },
        'tempest roar': {
            name: 'Tempest Roar',
            rarity: 'unique',
            tradeValue: 'High',
            estimatedPrice: '100M - 800M Gold',
            demand: 'high',
            notes: 'Essential for Druid Wolf builds.'
        },
        'ring of starless skies': {
            name: 'Ring of Starless Skies',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'very_high',
            notes: 'Mythic Unique.'
        },
        'doombringer': {
            name: 'Doombringer',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'high',
            notes: 'Mythic Unique.'
        },
        'the grandfather': {
            name: 'The Grandfather',
            rarity: 'mythic',
            tradeValue: 'Account Bound',
            estimatedPrice: 'Cannot be Traded',
            demand: 'high',
            notes: 'Mythic Unique.'
        }
    },
    
    /**
     * Search for an item in the database
     */
    searchItem(query) {
        if (!query) return null;
        const normalizedQuery = query.toLowerCase().trim();
        
        // Direct match
        if (this.items[normalizedQuery]) {
            return this.items[normalizedQuery];
        }
        
        // Partial match
        for (const [key, item] of Object.entries(this.items)) {
            if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
                return item;
            }
        }
        
        return null;
    }
};

/**
 * Main Service to handle price checking logic
 */
const PricingService = {
    /**
     * Get pricing information for an item
     * @param {string} itemName 
     * @param {string} rarity 
     */
    getPriceEstimate(itemName, rarity = 'legendary') {
        // 1. Check Static Database first
        const dbResult = PriceDatabase.searchItem(itemName);
        if (dbResult) {
            return dbResult;
        }

        // 2. Logic for Unknown Items based on Rarity
        const cleanRarity = rarity.toLowerCase();

        if (cleanRarity.includes('mythic') || cleanRarity.includes('uber')) {
            return {
                name: itemName,
                tradeValue: 'Account Bound',
                estimatedPrice: 'Cannot be Traded',
                notes: 'Mythic/Uber items are permanently account bound.'
            };
        }

        if (cleanRarity.includes('legendary')) {
            return {
                name: itemName,
                tradeValue: 'Variable',
                estimatedPrice: 'Check Market',
                notes: 'Legendary price depends entirely on the Aspect roll and Affixes (Greater Affixes).'
            };
        }

        if (cleanRarity.includes('unique')) {
            return {
                name: itemName,
                tradeValue: 'Variable',
                estimatedPrice: '10M - 200M+',
                notes: 'Price varies based on the unique power roll.'
            };
        }

        // Default Fallback
        return {
            name: itemName,
            tradeValue: 'Unknown',
            estimatedPrice: 'Unknown',
            notes: 'Item not found in database. Check Diablo.trade for live data.'
        };
    }
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PricingService = PricingService;
    window.PriceDatabase = PriceDatabase;
}