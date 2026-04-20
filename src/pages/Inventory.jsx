import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { getInventory, removeFromInventory, generateShareLink, decodeShareLink } from "../services/inventoryService";

// Services for hydration
import { fetchAllOnePieceCards } from "../services/onePieceService";
import { fetchAllRiftboundCards } from "../services/riftboundService";
import { getPokemons } from "../apps/Pokemon/services/pokeApi";

function Inventory() {
  const [searchParams] = useSearchParams();
  const shareData = searchParams.get("share");

  const [cards, setCards] = useState([]);
  const [isShared, setIsShared] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);

  useEffect(() => {
    if (shareData) {
      const decoded = decodeShareLink(shareData);
      if (decoded) {
        setIsShared(true);
        // Check if hydration is needed (look for non-hydrated items)
        const needsHydration = decoded.some(c => !c.hydrated);
        
        if (needsHydration) {
          setCards(decoded); // Show skeletal cards initially
          hydrateCards(decoded);
        } else {
          setCards(decoded);
        }
      }
    } else {
      setCards(getInventory());
    }
  }, [shareData]);

  const hydrateCards = async (minimalCards) => {
    setIsHydrating(true);
    console.log("Hydration logic v3.1 active. Cards to hydrate:", minimalCards.length);
    
    try {
      const results = await Promise.allSettled([
        fetchAllOnePieceCards(),
        fetchAllRiftboundCards(),
        getPokemons()
      ]);

      const opCards = results[0].status === 'fulfilled' ? results[0].value : [];
      const rbCards = results[1].status === 'fulfilled' ? results[1].value : [];
      const pkmList = results[2].status === 'fulfilled' ? results[2].value : [];

      console.log(`Sources: OP(${opCards.length}), RB(${rbCards.length}), Pkm(${pkmList.length})`);

      const hydrated = minimalCards.map(skeletal => {
        if (skeletal.hydrated) return skeletal;

        let found = null;
        const rawId = String(skeletal.id).trim();
        // Expanded prefixes for all games
        const cleanId = rawId.replace(/^(op-|pkm-|tcg-|rb-|riftbound-)/i, "");

        if (skeletal.tcg === "OnePiece") {
          found = opCards.find(c => 
            String(c.id).trim().toLowerCase() === rawId.toLowerCase() ||
            String(c.id).trim().toLowerCase() === cleanId.toLowerCase()
          );
          // Fallback reconstruction if name/img missing
          if (!found && cleanId.includes("-")) {
            found = { id: cleanId, name: `OP Card ${cleanId}`, img: `https://wsrv.nl/?url=https://en.onepiece-cardgame.com/images/cardlist/card/${cleanId}.png`, tcg: "OnePiece" };
          }
        } else if (skeletal.tcg === "RiftBound") {
          found = rbCards.find(c => 
            String(c.id).trim().toLowerCase() === rawId.toLowerCase() || 
            String(c.id).trim().toLowerCase() === cleanId.toLowerCase()
          );
        } else if (skeletal.tcg === "Pokemon") {
          const pkm = pkmList.find(p => String(p.id).trim() === cleanId || String(p.name).trim().toLowerCase() === cleanId.toLowerCase());
          
          if (pkm) {
            found = {
              id: pkm.id,
              name: pkm.name,
              img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pkm.id}.png`,
              tcg: "Pokemon"
            };
          } else if (cleanId.includes("-")) {
             found = {
               id: cleanId,
               name: `Card ${cleanId}`,
               img: `https://images.pokemontcg.io/${cleanId.split("-")[0]}/${cleanId.split("-")[1]}.png`,
               tcg: "Pokemon"
             };
          }
        }

        if (found) {
          return { ...found, hydrated: true, tcg: skeletal.tcg };
        } else {
          console.warn(`[HYDRATE] Not found: [${skeletal.tcg}] ${rawId}`);
          return skeletal;
        }
      });

      setCards(hydrated);
    } catch (err) {
      console.error("Hydration Critical Error:", err);
    } finally {
      setIsHydrating(false);
    }
  };

  const handleRemove = (id, tcg) => {
    if (isShared) return;
    removeFromInventory(id, tcg);
    setCards(getInventory());
  };

  const getTcgBadgeColor = (tcg) => {
    switch(tcg) {
      case "Pokemon": return "bg-warning text-dark";
      case "OnePiece": return "bg-danger";
      case "RiftBound": return "bg-info text-dark";
      default: return "bg-secondary";
    }
  };

  const shareUrl = isShared ? window.location.href : generateShareLink(cards);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("¡Enlace copiado al portapapeles!");
  };

  return (
    <div className="container mt-4 text-light pb-5">
      <Link to="/" className="btn btn-outline-light mb-4">
        ⬅️ Volver a Inicio
      </Link>

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">
          {isShared ? "📦 Inventario Compartido" : "🎒 Mi Inventario"}
        </h1>
        <p className="lead">
          {isShared 
            ? "Estás viendo una colección compartida por otro usuario." 
            : "Aquí se guardan todas las cartas TCG que has seleccionado como favoritas."}
        </p>
        
        {cards.length > 0 && !isShared && (
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="btn btn-primary fw-bold" onClick={() => setShowQR(!showQR)}>
              {showQR ? "Ocultar Compartir" : "🔗 Compartir Inventario"}
            </button>
          </div>
        )}
      </div>

      {showQR && (
        <div className="card bg-light text-dark mx-auto mb-5 p-4 shadow-lg text-center" style={{ maxWidth: "400px", borderRadius: "20px" }}>
          <h4 className="fw-bold mb-3">Escanea para Ver</h4>
          <div className="bg-white p-3 rounded mx-auto" style={{ width: "fit-content" }}>
            <QRCodeSVG value={shareUrl} size={200} />
          </div>
          <button className="btn btn-outline-dark mt-4 fw-bold" onClick={copyToClipboard}>
            Copiar Enlace
          </button>
        </div>
      )}

      {isHydrating && (
        <div className="text-center py-5">
          <div className="spinner-border text-info mb-3" role="status"></div>
          <h4>Cargando colección...</h4>
          <p className="text-secondary">Estamos recuperando los detalles de las cartas compartidas.</p>
        </div>
      )}

      {!isHydrating && cards.length === 0 ? (
        <div className="text-center text-secondary py-5">
          <h1>📭</h1>
          <h4>Tu inventario está vacío</h4>
          <p>Ve a las secciones de TCG y añade algunas cartas.</p>
        </div>
      ) : (
        <div className={`row g-4 ${isHydrating ? 'opacity-25' : ''}`}>
          {cards.map((card, index) => (
            <div key={`${card.id}-${card.tcg}-${index}`} className="col-6 col-md-3 col-lg-2">
              <div className="card bg-dark border-secondary h-100 shadow position-relative">
                {!isShared && (
                  <button 
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle z-1"
                    style={{ width: "30px", height: "30px", padding: 0 }}
                    onClick={() => handleRemove(card.id, card.tcg)}
                  >
                    ×
                  </button>
                )}
                <div className="position-absolute top-0 start-0 m-1 z-1">
                  <span className={`badge ${getTcgBadgeColor(card.tcg)} shadow`}>
                    {card.tcg}
                  </span>
                </div>
                
                {card.img ? (
                  <img 
                    src={
                      card.tcg === "RiftBound" 
                        ? `https://i0.wp.com/${card.img.replace(/^https?:\/\//, "")}`
                        : card.tcg === "OnePiece"
                          ? `https://wsrv.nl/?url=${encodeURIComponent(card.img)}`
                          : card.img
                    } 
                    className="card-img-top p-2" 
                    alt={card.name} 
                    style={{ objectFit: "contain", height: "200px" }} 
                  />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ height: "200px" }}>
                    <div className="spinner-border spinner-border-sm text-light"></div>
                  </div>
                )}
                <div className="card-body p-2 text-center">
                  <p className="card-text small text-white text-truncate fw-bold mb-0">
                    {card.name || "Cargando..."}
                  </p>
                  <p className="card-text text-secondary" style={{ fontSize: "0.7rem" }}>
                    ID: {card.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
