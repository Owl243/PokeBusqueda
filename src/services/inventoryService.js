export const getInventory = () => {
    try {
        return JSON.parse(localStorage.getItem('myInventory') || '[]');
    } catch {
        return [];
    }
};

export const saveToInventory = (cards, tcgName) => {
    const current = getInventory();
    const newCards = [...current];
    cards.forEach(c => {
        // Uniform format
        const id = c.id;
        const name = c.name;
        // Depending on TCG, the image property might be different. 
        // For Pokemon: c.id -> artwork url
        // For TCG Pokemon: c.images?.small
        // We'll require callers to pass a standardized object: { id, name, img, tcg }
        if (!newCards.some(ec => ec.id === c.id && ec.tcg === c.tcg)) {
            newCards.push(c);
        }
    });
    localStorage.setItem('myInventory', JSON.stringify(newCards));
};

export const removeFromInventory = (cardId, tcgName) => {
    const current = getInventory();
    const filtered = current.filter(c => !(c.id === cardId && c.tcg === tcgName));
    localStorage.setItem('myInventory', JSON.stringify(filtered));
}

export const clearInventory = () => {
    localStorage.removeItem('myInventory');
}

export const generateShareLink = (cards) => {
    // Compress data to fit in URL
    const minimalData = cards.map(c => ({ i: c.id, n: c.name, m: c.img, t: c.tcg }));
    const str = btoa(encodeURIComponent(JSON.stringify(minimalData)));
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/inventory?share=${str}`;
};

export const decodeShareLink = (str) => {
    try {
        const data = JSON.parse(decodeURIComponent(atob(str)));
        return data.map(c => ({ id: c.i, name: c.n, img: c.m, tcg: c.t }));
    } catch (e) {
        return null;
    }
};
