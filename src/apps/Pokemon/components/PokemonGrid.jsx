import { memo } from "react";
import PokemonCard from "./PokemonCard";



const PokemonGrid = memo(({ pokemons, selected, toggleSelect, typeColors, gridSize, fetchType, typesMap, onOpenTcg, activeTab }) => {
    return (
        <div className="row g-2 p-1">
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
                        onOpenTcg={onOpenTcg}
                        activeTab={activeTab}
                    />
                );
            })}
        </div>
    );
});

export default PokemonGrid;