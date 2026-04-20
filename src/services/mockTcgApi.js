export const fetchOnePieceCards = async () => {
    try {
        // Llamada a la API oficial de One Piece (optcgapi.com)
        // Se utiliza la convención de endpoints típica /api/cards o similar.
        const response = await fetch("https://api.optcgapi.com/api/cards?limit=40");
        // Nota: Muchos navegadores requieren habilitar CORS de lado del servidor para esta API en particular.
        let data;
        try {
            const json = await response.json();
            data = json.data || json; 
        } catch {
            return []; // Falla silenciosa si no devuelve json
        }
        
        return data.map(c => ({
            id: c.card_id || c.id || Math.random().toString(),
            name: c.name || c.card_name || 'Desconocido',
            type: c.type || c.card_type || 'Carta',
            img: c.image_url || c.img || c.image || 'https://via.placeholder.com/240x330.png?text=Sin+Foto',
            color: Array.isArray(c.color) ? c.color[0] : (c.color || 'Normal')
        }));
    } catch (err) {
        console.error("Error de conexion OP API:", err);
        return [];
    }
};

export const fetchRiftBoundCards = async () => {
    try {
        // Llamada a la API de Rift Bound (riftcodex.com) solicitada
        // Utilizando convención típica que ofrece endpoints de cartas
        const response = await fetch("https://riftcodex.com/api/cards"); 
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
            img: c.image_uris?.normal || c.image_url || c.image_uri || c.image || 'https://via.placeholder.com/240x330.png?text=Sin+Foto',
            color: c.colors?.[0] || c.color || c.element || 'Normal'
        }));
    } catch (err) {
        console.error("Error de conexion Rift API:", err);
        return [];
    }
};
