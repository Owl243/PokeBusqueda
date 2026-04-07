export const getPokemons = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=500");
    const data = await res.json();

    const detailed = await Promise.all(
        data.results.map(async (pokemon, index) => {
            const res = await fetch(pokemon.url);
            const pokeData = await res.json();

            return {
                name: pokemon.name,
                id: index + 1,
                type: pokeData.types[0].type.name,
            };
        })
    );

    return detailed;
};