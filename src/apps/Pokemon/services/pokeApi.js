import { megaPokemon } from "../data/megas";
import { megaZA } from "../data/megasZA";

export const getPokemons = async () => {
    // 1300 para incluir las formas regionales, gigamax y especiales
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
    const data = await res.json();

    const base = data.results.map((pokemon) => {
        const urlParts = pokemon.url.split("/").filter(Boolean);
        const id = Number(urlParts[urlParts.length - 1]);

        return {
            name: pokemon.name,
            id,
        };
    });

    return [...base, ...megaPokemon, ...megaZA];
};