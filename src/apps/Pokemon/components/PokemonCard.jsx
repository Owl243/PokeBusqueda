import { useEffect, useState, memo } from "react";

const PokemonCard = memo(({ poke, isSelected, toggleSelect, gridSize, fetchType, typesMap, typeColors, onOpenTcg }) => {
    const colClass = gridSize === 9 ? "col-4" : "col-3";

    const [imgUrl, setImgUrl] = useState(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`);

    useEffect(() => {
        if (poke.id > 20000) {
            const baseName = poke.name.replace("mega-", "").split("-")[0];
            fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`)
                .then(res => res.json())
                .then(data => {
                    setImgUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`);
                })
                .catch(() => {
                    setImgUrl("/placeholder.png");
                });
        } else {
            setImgUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`);
        }
    }, [poke.id, poke.name]);

    const formatName = (name) => {
        return name
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const displayName = formatName(poke.name);

    useEffect(() => {
        fetchType(poke);
    }, [poke, fetchType]);

    return (
        <div className={colClass}>
            <div
                className="banner-card h-100 d-flex flex-column align-items-center justify-content-center"
                style={{
                    backgroundColor: typeColors[typesMap[poke.id]] || "#ccc",
                    border: isSelected ? "3px solid white" : "none",
                    position: "relative"
                }}
                onClick={() => toggleSelect(poke)}
                title={poke.name}
            >
                <span style={{ position: "absolute", top: "5px", left: "8px", fontSize: "0.75rem" }}>
                    #{poke.id}
                </span>

                <button
                    type="button"
                    className="btn btn-sm btn-dark p-0 d-flex justify-content-center align-items-center bg-dark bg-opacity-50 border-0"
                    style={{ position: "absolute", top: "5px", right: "8px", width: "24px", height: "24px", fontSize: "0.80rem", zIndex: 10 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenTcg) onOpenTcg(poke);
                    }}
                    title="Ver cartas TCG"
                >
                    🎴
                </button>

                <img
                    src={imgUrl}
                    onError={(e) => {
                        if (poke.id <= 20000) {
                            e.target.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
                        } else {
                            e.target.src = "/placeholder.png";
                        }
                    }}
                    style={{
                        width: "85px",
                        height: "85px",
                        objectFit: "contain"
                    }}
                    alt={displayName}
                />

                <div className="text-capitalize text-truncate w-100 mt-1">
                    {displayName}
                </div>
            </div>
        </div>
    );
});

export default PokemonCard;