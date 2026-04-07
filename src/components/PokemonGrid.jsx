import PokemonCard from "./PokemonCard";



function PokemonGrid({ pokemons, selected, toggleSelect, typeColors, gridSize, fetchType, typesMap }) {
    return (
        <div className="row g-2">
            {pokemons.map((poke, index) => {
                const isSelected = selected.some((p) => p.name === poke.name);

                return (
                    <PokemonCard
                        key={poke.name || index}
                        poke={poke}
                        isSelected={isSelected}
                        toggleSelect={toggleSelect}
                        gridSize={gridSize}
                        fetchType={fetchType}
                        typesMap={typesMap}
                        typeColors={typeColors}
                    />
                );
            })}
        </div>
    );
}

export default PokemonGrid;