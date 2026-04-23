import { useEffect, useState, useMemo, useCallback } from "react";

function TcgModal({ pokemon, onClose, selectedTcg, toggleSelectTcg }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pokemon) return;

    const name = pokemon.name;
    const isMega = name.startsWith("mega-") || name.includes("-mega");
    const isGmax = name.includes("-gmax");

    let baseName = name
      .replace("mega-", "").replace("-mega", "")
      .replace("-gmax", "")
      .split("-")[0];

    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=name:"${baseName}"&pageSize=200`
        );
        const data = await res.json();
        let fetched = data.data || [];

        if (isGmax) {
          fetched = fetched.filter((c) => {
            const n = c.name.toLowerCase();
            return n.includes(`${baseName} vmax`) || n.includes(`vmax ${baseName}`);
          });
        } else if (isMega) {
          fetched = fetched.filter((c) => {
            const n = c.name.toLowerCase();
            return n.includes(`m ${baseName}`) || n.includes(`mega ${baseName}`);
          });
        }

        setCards(fetched);
      } catch (error) {
        console.error("Error fetching TCG cards:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [pokemon]);

  // ✅ Seleccionar todo
  const allSelected = useMemo(
    () => cards.length > 0 && cards.every((c) => selectedTcg.some((s) => s.id === c.id)),
    [cards, selectedTcg]
  );

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      cards.filter((c) => selectedTcg.some((s) => s.id === c.id)).forEach((c) => toggleSelectTcg(c));
    } else {
      cards.filter((c) => !selectedTcg.some((s) => s.id === c.id)).forEach((c) => toggleSelectTcg(c));
    }
  }, [allSelected, cards, selectedTcg, toggleSelectTcg]);

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
      style={{ zIndex: 3000 }}
    >
      <div
        className="bg-dark text-light rounded shadow p-3 d-flex flex-column border border-secondary"
        style={{ width: "95%", maxWidth: "1000px", height: "90vh" }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
          <h4 className="mb-0 text-capitalize text-warning">
            Cartas TCG: {pokemon.name.replace(/-/g, " ")}
          </h4>
          <button className="btn btn-close btn-close-white" onClick={onClose} />
        </div>

        {/* Seleccionar todo */}
        {!loading && cards.length > 0 && (
          <div className="d-flex align-items-center gap-2 mb-2 px-1">
            <div
              className="form-check form-switch d-flex align-items-center gap-2 m-0"
              style={{ cursor: "pointer" }}
              onClick={toggleSelectAll}
            >
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAllTcgModalCheck"
                role="switch"
                readOnly
                checked={allSelected}
                style={{ width: "2.5em", height: "1.3em", cursor: "pointer", pointerEvents: "none" }}
              />
              <label
                className="form-check-label fw-semibold"
                htmlFor="selectAllTcgModalCheck"
                style={{
                  cursor: "pointer",
                  color: allSelected ? "#ffc107" : "#adb5bd",
                  transition: "color 0.2s",
                  pointerEvents: "none",
                }}
              >
                {allSelected ? "✅ Todo seleccionado" : "Seleccionar todo"}
              </label>
            </div>
            <span className="badge bg-secondary ms-1" style={{ fontSize: "0.8rem" }}>
              {cards.filter((c) => selectedTcg.some((s) => s.id === c.id)).length} / {cards.length}
            </span>
          </div>
        )}

        {/* Body */}
        <div className="flex-grow-1 overflow-auto bg-dark p-3 rounded border border-secondary">
          {loading ? (
            <div className="d-flex w-100 h-100 justify-content-center align-items-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : cards.length === 0 ? (
            <p className="text-center text-muted mt-5">
              No se encontraron cartas para este Pokémon.
            </p>
          ) : (
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {cards.map((card) => {
                const isSelected = selectedTcg.some((c) => c.id === card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleSelectTcg(card)}
                    style={{
                      cursor: "pointer",
                      width: "180px",
                      borderRadius: "12px",
                      position: "relative",
                      border: isSelected
                        ? "4px solid #ffcc00"
                        : "4px solid transparent",
                      transition: "0.2s all",
                    }}
                  >
                    <img
                      src={card.images.small}
                      alt={card.name}
                      className="w-100 rounded"
                      style={{
                        filter: isSelected
                          ? "brightness(1) drop-shadow(0px 0px 8px #ffcc00)"
                          : "brightness(0.9)",
                      }}
                    />
                    <div className="text-center mt-2" style={{ fontSize: "0.75rem", lineHeight: "1" }}>
                      <span className="badge bg-secondary text-truncate" style={{ maxWidth: "100%" }}>
                        {card.set?.name || "Desconocida"}
                      </span>
                    </div>
                    {isSelected && (
                      <div
                        className="position-absolute top-0 end-0 bg-warning text-dark fw-bold rounded-circle d-flex justify-content-center align-items-center"
                        style={{
                          width: "30px",
                          height: "30px",
                          transform: "translate(30%, -30%)",
                          zIndex: 5,
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
          <span className="text-secondary small fw-bold">
            {cards.length} carta{cards.length !== 1 ? "s" : ""}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TcgModal;
