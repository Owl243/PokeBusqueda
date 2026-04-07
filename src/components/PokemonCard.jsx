import { useEffect } from "react";

function PokemonCard({ poke, isSelected, toggleSelect, gridSize, fetchType, typesMap, typeColors }) {
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
    const colClass = gridSize === 9 ? "col-4" : "col-3";


    const formatName = (name) => {
        return name
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const displayName = formatName(poke.name);
    useEffect(() => {
        fetchType(poke.id);
    }, [poke.id, fetchType]);

    return (
        <div className={colClass}>
            <div
                className="banner-card h-100 d-flex flex-column align-items-center justify-content-center"
                style={{
                    backgroundColor: typeColors[typesMap[poke.id]] || "#ccc",
                    border: isSelected ? "3px solid white" : "none"
                }}
                onClick={() => toggleSelect(poke)}
                title={poke.name}
            >
                <span style={{ position: "absolute", top: "5px", left: "8px", fontSize: "0.75rem" }}>
                    #{poke.id}
                </span>

                <img
                    src={image}
                    style={{
                        width: "85px",
                        height: "85px",
                        objectFit: "contain",
                        imageRendering: "pixelated"
                    }}
                    alt={displayName}
                />

                <div className="text-capitalize text-truncate w-100 mt-1">
                    {displayName}
                </div>
            </div>
        </div>
    );
}

export default PokemonCard;