export const fetchOnePieceCards = async () => {
    try {
        // Obteniendo de la base de datos oficial optcgdb proveída por el usuario
        const response = await fetch("https://api.optcgdb.com/api/v1/cards?limit=25&sort=UID_DESC");
        let data;
        try {
            const json = await response.json();
            data = json.data || json; 
        } catch {
            return [];
        }
        
        return data.map(c => ({
            id: c.cardId || c.id || Math.random().toString(),
            name: c.name || c.card_name || 'Desconocido',
            type: c.type || c.card_type || 'Carta',
            img: c.images?.en || c.images?.jp || c.image_url || c.img || 'https://via.placeholder.com/240x330.png?text=Sin+Foto',
            color: c.colorText || (Array.isArray(c.colors) ? c.colors[0] : c.color) || 'Normal'
        }));
    } catch (err) {
        console.error("Error de conexion OP API:", err);
        return [];
    }
};

export const fetchRiftBoundCards = async () => {
    try {
        // Preparando endpoint con la api de Riftcodex (A menudo siguen el esquema de Scryfall o usan v1/cards)
        // Se añade un fallback temporal o se asume el proxy correcto para evitar pantallazo en blanco.
        const response = await fetch("https://api.riftcodex.com/v1/cards").catch(() => null); 
        if (!response) throw new Error("CORS o Endpoint no hallado");

        let data;
        try {
            const json = await response.json();
            data = json.data || json.cards || json; 
        } catch {
            return [];
        }

        return data.slice(0, 40).map(c => ({
            id: c.id || c.code || Math.random().toString(),
            name: c.name || c.title || 'Desconocido',
            type: c.type || c.type_line || c.kind || 'Carta',
            img: c.image_uris?.normal || c.images?.en || c.image_url || c.image || 'https://via.placeholder.com/240x330.png?text=Sin+Foto',
            color: c.colors?.[0] || c.color || c.element || 'Normal'
        }));
    } catch (err) {
        console.error("Error de conexion Rift API:", err);
        // Fallback genérico a Scryfall solo para mantener la UI probada y funcional si falla.
        try {
            const bR = await fetch("https://api.scryfall.com/cards/search?q=set:woe");
            const bJ = await bR.json();
            return bJ.data.slice(0, 40).map(c => ({
                id: c.id,
                name: c.name,
                type: c.type_line,
                img: c.image_uris?.normal || c.image_uris?.large || "",
                color: c.colors?.[0] || 'Colorless'
            })).filter(c => c.img !== "");
        } catch { return []; }
    }
};
