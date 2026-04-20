// Raw GitHub URL base for Riftbound TCG data
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/apitcg/riftbound-tcg-data/main/cards/en";

const cache = new Map();

/**
 * Full list of available Riftbound sets in the apitcg repository.
 */
export const fetchRiftboundSets = async () => {
    return [
        { id: "origins", name: "Origins" },
        { id: "origins-proving-grounds", name: "Origins: Proving Grounds" },
        { id: "spiritforged", name: "Spiritforged" }
    ];
};

/**
 * Fetch Riftbound cards for a specific set from the GitHub repository.
 * @param {string} setId - e.g. "origins", "spiritforged"
 */
export const fetchRiftboundCards = async (setId = "origins") => {
    if (!setId) setId = "origins";
    
    if (cache.has(setId)) {
        return cache.get(setId);
    }

    try {
        const response = await fetch(`${GITHUB_RAW_BASE}/${setId}.json`);
        if (!response.ok) throw new Error("Error fetching GitHub data");
        
        const data = await response.json();
        
        // Filter to exclude sealed products, boosters, etc.
        // Cards usually have a Champion Unit, Unit, Spell, Legend, Signature Unit/Spell type.
        const cardTypes = ["Champion Unit", "Unit", "Spell", "Legend", "Signature Unit", "Signature Spell"];
        const filteredData = data.filter(item => cardTypes.includes(item.cardType));

        const mappedCards = filteredData.map(card => ({
            id: card.id,
            name: card.name,
            set: card.set?.name || setId.toUpperCase(),
            rarity: card.rarity,
            type: card.cardType || card.type,
            img: card.images?.small || card.images?.large || "",
            color: card.element || card.color || "Neutral"
        }));

        // Deduplicate cards by ID
        const uniqueCards = Array.from(new Map(mappedCards.map(c => [c.id, c])).values());

        cache.set(setId, uniqueCards);
        return uniqueCards;
    } catch (err) {
        console.error("GitHub Fetch Error:", err);
        return [];
    }
};

/**
 * Fetch all cards from all known Riftbound sets for hydration.
 */
export const fetchAllRiftboundCards = async () => {
    const sets = await fetchRiftboundSets();
    const allResults = await Promise.all(
        sets.map(set => fetchRiftboundCards(set.id))
    );
    const flatResults = allResults.flat();
    
    // Deduplicate across all sets by ID
    return Array.from(new Map(flatResults.map(c => [c.id, c])).values());
};
