import { JustTCG } from 'justtcg-js';

// Caching mechanism to save API requests (limit is 1000/month)
const cache = new Map();

const API_KEY = import.meta.env.VITE_JUSTTCG_API_KEY;

let client = null;
try {
    if (API_KEY) {
        client = new JustTCG({ apiKey: API_KEY });
    }
} catch (err) {
    console.error("JustTCG Client Initialization Error:", err);
}

/**
 * Fetch One Piece cards with caching and optimized parameters.
 * @param {Object} options - Search options (set, orderBy, etc.)
 */
export const fetchOnePieceJustTcg = async (options = {}) => {
    if (!client) {
        console.error("JustTCG Client not initialized. Check VITE_JUSTTCG_API_KEY.");
        return [];
    }

    const { set, orderBy = 'price', order = 'desc', limit = 20 } = options;
    const cacheKey = `op-${set || 'all'}-${orderBy}-${order}-${limit}`;

    if (cache.has(cacheKey)) {
        console.log("Serving JustTCG One Piece cards from cache...");
        return cache.get(cacheKey);
    }

    try {
        console.log(`Fetching One Piece cards from JustTCG (Set: ${set || 'All'})...`);
        const response = await client.v1.cards.get({
            game: 'one-piece-card-game',
            set: set,
            orderBy: orderBy,
            order: order,
            limit: limit,
            condition: ['NM', 'LP'] // Focus on good condition for collector pricing
        });

        if (response.error) {
            console.error("JustTCG API Error:", response.error);
            return [];
        }

        const mappedCards = (response.data || []).map(card => {
            // Get the first available price from variants
            const marketPrice = card.variants?.[0]?.price || 0;
            
            // Construct image URL using TCGPlayer ID if available
            const imageUrl = card.tcgplayerId 
                ? `https://product-images.tcgplayer.com/fit-in/437x437/${card.tcgplayerId}.jpg`
                : 'https://via.placeholder.com/240x330.png?text=Sin+Foto';

            return {
                id: card.id,
                name: card.name,
                set: card.set_name || card.set, 
                number: card.number,
                rarity: card.rarity,
                img: imageUrl,
                price: marketPrice,
                currency: 'USD',
                type: 'Card',
                color: card.game === 'one-piece-card-game' ? 'Red' : 'Neutral' // Defaulting color for now
            };
        });

        cache.set(cacheKey, mappedCards);

        // Log remaining usage for developer visibility
        console.log(`JustTCG Usage: ${response.usage.apiDailyRequestsRemaining} requests remaining today.`);

        return mappedCards;
    } catch (err) {
        console.error("JustTCG Fetch Error:", err);
        return [];
    }
};

/**
 * Get available One Piece sets from JustTCG to allow set-based filtering.
 */
export const fetchOnePieceSets = async () => {
    const cacheKey = 'op-sets';
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    try {
        const response = await client.v1.sets.list({ game: 'one-piece-card-game' });
        if (response.error) return [];

        const sets = response.data || [];
        cache.set(cacheKey, sets);
        return sets;
    } catch (err) {
        console.error("JustTCG Sets Fetch Error:", err);
        return [];
    }
};
