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
    // v2: Compact format to avoid QR code overflow
    // TCG Mapping: p=Pokemon, o=OnePiece, r=RiftBound
    const groups = { p: [], o: [], r: [] };
    
    cards.forEach(c => {
        const type = c.tcg === 'Pokemon' ? 'p' : c.tcg === 'OnePiece' ? 'o' : 'r';
        groups[type].push(c.id);
    });

    const parts = [];
    if (groups.p.length) parts.push(`p:${groups.p.join(',')}`);
    if (groups.o.length) parts.push(`o:${groups.o.join(',')}`);
    if (groups.r.length) parts.push(`r:${groups.r.join(',')}`);

    const compactStr = `v2!${parts.join(';')}`;
    const encoded = btoa(encodeURIComponent(compactStr));
    
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/inventory?share=${encoded}`;
};

export const decodeShareLink = (str) => {
    try {
        const decoded = decodeURIComponent(atob(str));
        
        // Handle v2 format
        if (decoded.startsWith('v2!')) {
            const dataStr = decoded.substring(3);
            const sections = dataStr.split(';');
            const cards = [];
            
            sections.forEach(section => {
                const [tcgKey, idsStr] = section.split(':');
                const tcgMap = { p: 'Pokemon', o: 'OnePiece', r: 'RiftBound' };
                const tcgName = tcgMap[tcgKey];
                const ids = idsStr.split(',');
                
                ids.forEach(id => {
                    // Start as skeletal objects, will be hydrated in the UI
                    cards.push({ id, tcg: tcgName, hydrated: false });
                });
            });
            return cards;
        }

        // Fallback for v1 (Legacy)
        const data = JSON.parse(decoded);
        return data.map(c => ({ 
            id: c.i || c.id, 
            name: c.n || c.name, 
            img: c.m || c.img, 
            tcg: c.t || c.tcg,
            hydrated: true 
        }));
    } catch (e) {
        console.error("Decode Share Link Error:", e);
        return null;
    }
};
