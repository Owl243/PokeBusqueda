export const getPokemons = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const data = await res.json();

    return data.results.map((pokemon) => {
        const urlParts = pokemon.url.split("/").filter(Boolean);
        const id = Number(urlParts[urlParts.length - 1]);

        return {
            name: pokemon.name,
            id: id,
            type: "normal"
        };
    });
};