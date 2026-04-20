// Raw GitHub URL base for One Piece TCG data
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/apitcg/one-piece-tcg-data/main/cards/en";

const cache = new Map();

/**
 * Full list of available One Piece sets in the apitcg repository.
 */
export const fetchOnePieceSets = async () => {
    return [
        { id: "op01", name: "Romance Dawn [OP-01]" },
        { id: "op02", name: "Paramount War [OP-02]" },
        { id: "op03", name: "Pillars of Strength [OP-03]" },
        { id: "op04", name: "Kingdoms of Intrigue [OP-04]" },
        { id: "op05", name: "Awakening of the New Era [OP-05]" },
        { id: "op06", name: "Wings of the Captain [OP-06]" },
        { id: "op07", name: "500 Years into the Future [OP-07]" },
        { id: "op08", name: "Two Legends [OP-08]" },
        { id: "op09", name: "The New Genesis [OP-09]" },
        { id: "op10", name: "Royal Blood [OP-10]" },
        { id: "op11", name: "Universal Warriors [OP-11]" },
        { id: "op12", name: "The Pirate King [OP-12]" },
        { id: "eb01", name: "Memorial Collection [EB-01]" },
        { id: "eb02", name: "Extra Booster [EB-02]" },
        { id: "st13", name: "Ultimate Deck 3 Brothers' Bond [ST-13]" },
        { id: "st14", name: "Starter Deck 3D2Y [ST-14]" },
        { id: "st15", name: "Starter Deck Edward.Newgate [ST-15]" },
        { id: "st16", name: "Starter Deck Uta [ST-16]" },
        { id: "st17", name: "Starter Deck Donquixote Doflamingo [ST-17]" },
        { id: "st18", name: "Starter Deck Monkey.D.Luffy [ST-18]" },
        { id: "st19", name: "Starter Deck Eustass.Kid [ST-19]" },
        { id: "st20", name: "Starter Deck Charlotte Linlin [ST-20]" },
        { id: "st21", name: "Starter Deck Crocodile [ST-21]" },
        { id: "general", name: "General / Other" },
        { id: "promotions", name: "Promotional Cards" },
        { id: "prb01", name: "Premium Booster [PRB-01]" }
    ];
};

/**
 * Fetch One Piece cards for a specific set from the GitHub repository.
 * @param {string} setId - e.g. "op01", "eb01"
 */
export const fetchOnePieceCards = async (setId = "op01") => {
    if (!setId) setId = "op01";
    
    if (cache.has(setId)) {
        return cache.get(setId);
    }

    try {
        const response = await fetch(`${GITHUB_RAW_BASE}/${setId}.json`);
        if (!response.ok) throw new Error("Error fetching GitHub data");
        
        const data = await response.json();
        
        const mappedCards = data.map(card => ({
            id: card.id,
            name: card.name,
            set: card.set?.name || setId.toUpperCase(),
            rarity: card.rarity,
            type: card.type,
            img: card.images?.small || card.images?.large || "",
            color: Array.isArray(card.color) ? card.color[0] : (card.color || "Neutral")
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
 * Fetch all cards from all known sets for global search.
 */
export const fetchAllOnePieceCards = async () => {
    const sets = await fetchOnePieceSets();
    const allResults = await Promise.all(
        sets.map(set => fetchOnePieceCards(set.id))
    );
    const flatResults = allResults.flat();
    
    // Deduplicate across all sets by ID
    return Array.from(new Map(flatResults.map(c => [c.id, c])).values());
};
