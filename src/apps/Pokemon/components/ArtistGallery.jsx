import { useState, useCallback, useMemo } from "react";
import Pagination from "../../../components/Pagination";

const TCG_ARTISTS = [
  {
    name: "Ken Sugimori",
    style: "Estilo acuarela original",
    emoji: "🖌️",
    accent: "#6890a8",
    bg: "linear-gradient(135deg, #2c4a5a 0%, #1a2f3a 100%)",
  },
  {
    name: "Mitsuhiro Arita",
    style: "Creador del Charizard original",
    emoji: "🔥",
    accent: "#f08030",
    bg: "linear-gradient(135deg, #5a2010 0%, #3a1008 100%)",
  },
  {
    name: "Asako Ito",
    style: "Especialista en Pokémon de crochet/hilo",
    emoji: "🧶",
    accent: "#f8b8d0",
    bg: "linear-gradient(135deg, #5a2a40 0%, #3a1828 100%)",
  },
  {
    name: "Atsuko Nishida",
    style: "Diseñadora de Pikachu",
    emoji: "⚡",
    accent: "#f8d030",
    bg: "linear-gradient(135deg, #5a4a10 0%, #3a3008 100%)",
  },
  {
    name: "Tomokazu Komiya",
    style: "Estilo abstracto y colorido",
    emoji: "🎨",
    accent: "#78c8b8",
    bg: "linear-gradient(135deg, #1a4a48 0%, #102e2c 100%)",
  },
  {
    name: "Yuka Morii",
    style: "Figuras de arcilla/plastilina",
    emoji: "🏺",
    accent: "#d8a870",
    bg: "linear-gradient(135deg, #4a3020 0%, #2e1e10 100%)",
  },
  {
    name: "Kouki Saitou",
    style: "Estilo anime dinámico",
    emoji: "✨",
    accent: "#a890f0",
    bg: "linear-gradient(135deg, #2a1a5a 0%, #180e38 100%)",
  },
  {
    name: "Akira Egawa",
    style: "Arte digital detallado y épico",
    emoji: "🌌",
    accent: "#8060e8",
    bg: "linear-gradient(135deg, #1c1048 0%, #100830 100%)",
  },
  {
    name: "Shinji Kanda",
    style: "Estilo artístico denso y surrealista",
    emoji: "🌀",
    accent: "#a07860",
    bg: "linear-gradient(135deg, #3a2818 0%, #221808 100%)",
  },
  {
    name: "Naoki Saito",
    style: "Referente en cartas de Entrenadores",
    emoji: "🏆",
    accent: "#e8c840",
    bg: "linear-gradient(135deg, #4a3c08 0%, #2c2404 100%)",
  },
];


// ─── Main component ─────────────────────────────────────────────────────────
function ArtistGallery({ selectedTcg, toggleSelectTcg }) {
  const [activeArtist, setActiveArtist] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCard, setSearchCard] = useState("");

  const CARDS_PER_PAGE = 24;

  const selectArtist = useCallback(async (artist) => {
    setActiveArtist(artist);
    setCards([]);
    setCurrentPage(1);
    setSearchCard("");
    setLoading(true);
    try {
      // La API de pokemontcg soporta artist:"Name" en la query
      const query = `artist:"${artist.name}"`;
      const res = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}&pageSize=250&orderBy=set.releaseDate`
      );
      const data = await res.json();
      setCards(data.data || []);
    } catch (e) {
      console.error("Error fetching artist cards:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const goBack = () => {
    setActiveArtist(null);
    setCards([]);
    setCurrentPage(1);
    setSearchCard("");
  };

  // Filtro por nombre de carta
  const filteredCards = useMemo(() => {
    if (!searchCard.trim()) return cards;
    return cards.filter((c) =>
      c.name.toLowerCase().includes(searchCard.trim().toLowerCase())
    );
  }, [cards, searchCard]);

  const totalPages = Math.ceil(filteredCards.length / CARDS_PER_PAGE);
  const displayedCards = filteredCards.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  // Select-all: afecta TODAS las cartas filtradas (no solo la página visible)
  const allArtistSelected = filteredCards.length > 0 &&
    filteredCards.every(c => selectedTcg.some(s => s.id === c.id));

  const toggleSelectAllArtist = useCallback(() => {
    if (allArtistSelected) {
      // Quitar todas las del artista
      const ids = new Set(filteredCards.map(c => c.id));
      // setSelectedTcg no está disponible por prop, usamos toggleSelectTcg en bucle
      filteredCards
        .filter(c => selectedTcg.some(s => s.id === c.id))
        .forEach(c => toggleSelectTcg(c));
    } else {
      // Añadir las que faltan (usando toggleSelectTcg)
      filteredCards
        .filter(c => !selectedTcg.some(s => s.id === c.id))
        .forEach(c => toggleSelectTcg(c));
    }
  }, [allArtistSelected, filteredCards, selectedTcg, toggleSelectTcg]);

  // ── Vista: Grid de artistas ─────────────────────────────────────────────
  if (!activeArtist) {
    return (
      <div>
        <div className="text-center mb-4">
          <h5 className="text-warning fw-bold mb-1">🎨 Galería de Artistas TCG</h5>
          <p className="text-secondary small mb-0">
            Selecciona un artista para explorar todas sus cartas
          </p>
        </div>

        <div className="row g-3">
          {TCG_ARTISTS.map((artist) => (
            <div key={artist.name} className="col-6 col-sm-4 col-md-3 col-xl-2">
              <div
                className="h-100 rounded-3 p-3 d-flex flex-column align-items-center text-center"
                style={{
                  background: artist.bg,
                  border: `2px solid ${artist.accent}55`,
                  cursor: "pointer",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                }}
                onClick={() => selectArtist(artist)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${artist.accent}44`;
                  e.currentTarget.style.borderColor = artist.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.borderColor = `${artist.accent}55`;
                }}
              >
                <span style={{ fontSize: "2.2rem", lineHeight: 1 }}>{artist.emoji}</span>
                <span
                  className="fw-bold mt-2"
                  style={{ color: artist.accent, fontSize: "0.85rem", lineHeight: 1.3 }}
                >
                  {artist.name}
                </span>
                <span className="text-secondary mt-1" style={{ fontSize: "0.72rem", lineHeight: 1.3 }}>
                  {artist.style}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Vista: Cartas del artista ─────────────────────────────────────────────
  return (
    <div>
      {/* Header del artista */}
      <div
        className="rounded-3 p-3 mb-4 d-flex align-items-center gap-3"
        style={{
          background: activeArtist.bg,
          border: `2px solid ${activeArtist.accent}66`,
        }}
      >
        <button
          className="btn btn-sm btn-outline-light flex-shrink-0"
          onClick={goBack}
          title="Volver a artistas"
        >
          ← Artistas
        </button>

        <div className="d-flex align-items-center gap-2 flex-grow-1 min-w-0">
          <span style={{ fontSize: "1.8rem", lineHeight: 1 }}>{activeArtist.emoji}</span>
          <div className="min-w-0">
            <div className="fw-bold" style={{ color: activeArtist.accent, fontSize: "1.05rem" }}>
              {activeArtist.name}
            </div>
            <div className="text-secondary small">{activeArtist.style}</div>
          </div>
        </div>

        {!loading && (
          <span
            className="badge rounded-pill flex-shrink-0"
            style={{ background: activeArtist.accent, color: "#111", fontSize: "0.8rem" }}
          >
            {filteredCards.length} carta{filteredCards.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Buscador de cartas */}
      {!loading && cards.length > 0 && (
        <input
          type="text"
          className="form-control mb-3 bg-dark text-light border-secondary"
          placeholder="Buscar carta por nombre..."
          value={searchCard}
          onChange={(e) => {
            setSearchCard(e.target.value);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border me-3" style={{ color: activeArtist.accent }} role="status" />
          <span className="text-light">Cargando cartas de {activeArtist.name}...</span>
        </div>
      )}

      {/* Sin resultados */}
      {!loading && filteredCards.length === 0 && (
        <p className="text-center text-secondary py-5">
          {searchCard
            ? `No hay cartas de "${activeArtist.name}" que coincidan con "${searchCard}".`
            : `No se encontraron cartas de "${activeArtist.name}" en la API.`}
        </p>
      )}

      {/* ✅ Seleccionar todo del artista */}
      {!loading && filteredCards.length > 0 && (
        <div className="d-flex align-items-center gap-2 mb-3 px-1">
          <div
            className="form-check form-switch d-flex align-items-center gap-2 m-0"
            style={{ cursor: "pointer" }}
            onClick={toggleSelectAllArtist}
          >
            <input
              className="form-check-input"
              type="checkbox"
              id="selectAllArtistCheck"
              role="switch"
              readOnly
              checked={allArtistSelected}
              style={{ width: "2.5em", height: "1.3em", cursor: "pointer", pointerEvents: "none" }}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="selectAllArtistCheck"
              style={{
                cursor: "pointer",
                color: allArtistSelected ? activeArtist.accent : "#adb5bd",
                transition: "color 0.2s",
                pointerEvents: "none",
              }}
            >
              {allArtistSelected ? "✅ Todo seleccionado" : "Seleccionar todo"}
            </label>
          </div>
          <span className="badge bg-secondary ms-1" style={{ fontSize: "0.8rem" }}>
            {filteredCards.filter(c => selectedTcg.some(s => s.id === c.id)).length} / {filteredCards.length}
          </span>
        </div>
      )}

      {/* Grid de cartas */}
      {!loading && displayedCards.length > 0 && (
        <>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            {displayedCards.map((card) => {
              const isSelected = selectedTcg.some((c) => c.id === card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => toggleSelectTcg(card)}
                  style={{
                    cursor: "pointer",
                    width: "155px",
                    borderRadius: "12px",
                    position: "relative",
                    border: isSelected
                      ? `4px solid ${activeArtist.accent}`
                      : "4px solid transparent",
                    transition: "0.2s all",
                    boxShadow: isSelected ? `0 0 14px ${activeArtist.accent}88` : "none",
                  }}
                >
                  <img
                    src={card.images.small}
                    alt={card.name}
                    className="w-100 rounded"
                    style={{
                      filter: isSelected ? "brightness(1.05)" : "brightness(0.88)",
                    }}
                  />
                  <div
                    className="text-center mt-1"
                    style={{ fontSize: "0.7rem", lineHeight: 1.3 }}
                  >
                    <span
                      className="badge bg-secondary text-truncate d-block"
                      style={{ maxWidth: "100%" }}
                      title={card.name}
                    >
                      {card.name}
                    </span>
                    <span
                      className="text-secondary d-block text-truncate"
                      style={{ fontSize: "0.65rem" }}
                      title={card.set?.name}
                    >
                      {card.set?.name || "—"}
                    </span>
                  </div>
                  {isSelected && (
                    <div
                      className="position-absolute top-0 end-0 fw-bold rounded-circle d-flex justify-content-center align-items-center"
                      style={{
                        width: "28px",
                        height: "28px",
                        transform: "translate(30%, -30%)",
                        zIndex: 5,
                        background: activeArtist.accent,
                        color: "#111",
                        fontSize: "0.85rem",
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
}

export default ArtistGallery;
