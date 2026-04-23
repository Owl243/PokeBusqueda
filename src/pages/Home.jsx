import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid min-vh-100 bg-dark text-light p-0 d-flex flex-column align-items-center" style={{ background: "#0f172a" }}>

      {/* Header Minimalista */}
      <div className="text-center py-5 px-3 mb-4 w-100 position-relative" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(30, 41, 59, 0.5)" }}>
        <div className="position-absolute top-0 end-0 m-3">
          <span className="badge rounded-pill bg-info text-dark fw-bold px-3 py-2 shadow-sm" style={{ fontSize: "0.7rem" }}>
            🚀 EN DESARROLLO (BETA)
          </span>
        </div>
        <h1 className="display-4 fw-bold mb-1 text-white">
          Multi<span className="text-info">TCG</span> Hub
        </h1>
        <p className="text-secondary small mb-0">La herramienta definitiva para coleccionistas de cartas</p>
      </div>

      <div className="container" style={{ maxWidth: "850px" }}>

        {/* Guía de Uso Rápida */}
        <div className="row g-3 mb-5 px-2">
           <div className="col-12">
              <div className="p-4 rounded-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <h6 className="text-info fw-bold mb-3">¿Cómo funciona?</h6>
                <div className="row text-center g-3">
                  <div className="col-4">
                    <div className="h3 mb-1">🔍</div>
                    <div className="small fw-bold">Busca</div>
                    <div className="text-muted" style={{ fontSize: "0.65rem" }}>Encuentra cualquier carta</div>
                  </div>
                  <div className="col-4 border-start border-end border-secondary border-opacity-25">
                    <div className="h3 mb-1">🎒</div>
                    <div className="small fw-bold">Colecciona</div>
                    <div className="text-muted" style={{ fontSize: "0.65rem" }}>Añádelas a tu inventario</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 mb-1">📄</div>
                    <div className="small fw-bold">Exporta</div>
                    <div className="text-muted" style={{ fontSize: "0.65rem" }}>Genera PDF o Imagen</div>
                  </div>
                </div>
              </div>
           </div>
        </div>

        <div className="row g-4 mb-5 px-2">
          {/* Dashboard Card - Inventory */}
          <div className="col-12">
            <Link to="/inventory" className="text-decoration-none">
              <div className="card border-0 shadow-lg"
                style={{
                  background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}>
                <div className="card-body d-flex align-items-center justify-content-between p-4">
                  <div>
                    <h4 className="fw-bold mb-1 text-info">🎒 Mi Inventario</h4>
                    <p className="mb-0 text-secondary small">Gestiona y comparte tu colección personal con códigos QR</p>
                  </div>
                  <div className="h1 mb-0 opacity-25">📋</div>
                </div>
              </div>
            </Link>
          </div>

          {/* TCG Sections */}
          <div className="col-12 mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <h6 className="text-uppercase text-secondary ls-wide fw-bold mb-0" style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
                Juegos Disponibles
              </h6>
              <span className="badge bg-secondary-subtle text-secondary small" style={{ fontSize: "0.6rem" }}>3 ACTIVOS</span>
            </div>
            
            <div className="row g-3">
              {/* Pokemon */}
              <div className="col-12 col-md-4">
                <Link to="/pokemon" className="text-decoration-none text-center">
                  <div className="card border-0 bg-slate-800 h-100 shadow-sm py-4" style={{ borderRadius: "16px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="display-5 mb-2">⚡</div>
                    <h5 className="fw-bold mb-1 text-white">Pokémon</h5>
                    <p className="text-secondary small mb-0">Pokédex & TCG</p>
                  </div>
                </Link>
              </div>

              {/* One Piece */}
              <div className="col-12 col-md-4">
                <Link to="/one-piece" className="text-decoration-none text-center">
                  <div className="card border-0 bg-slate-800 h-100 shadow-sm py-4" style={{ borderRadius: "16px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="display-5 mb-2">🏴‍☠️</div>
                    <h5 className="fw-bold mb-1 text-white">One Piece</h5>
                    <p className="text-secondary small mb-0">Colecciona desde Romance Dawn hasta las leyendas del Nuevo Mundo. Filtra por color y rareza.</p>
                  </div>
                </Link>
              </div>

              {/* Rift Bound */}
              <div className="col-12 col-md-4">
                <Link to="/rift-bound" className="text-decoration-none text-center">
                  <div className="card border-0 bg-slate-800 h-100 shadow-sm py-4" style={{ borderRadius: "16px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="display-5 mb-2">🌀</div>
                    <h5 className="fw-bold mb-1 text-white">Rift Bound</h5>
                    <p className="text-secondary small mb-0">Domina los elementos y las grietas místicas. Busca cartas en todos los sets disponibles.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Proximamente */}
        <div className="text-center mb-5 opacity-50">
           <h6 className="text-uppercase small fw-bold mb-3" style={{ letterSpacing: "1px" }}>Próximamente</h6>
           <div className="d-flex justify-content-center gap-4 text-secondary small">
              <span>Magic: The Gathering</span>
              <span>Lorcana</span>
              <span>Star Wars: Unlimited</span>
           </div>
        </div>



      </div>

      <style>{`
        .bg-slate-800 { background: #1e293b !important; }
        .card { transition: transform 0.2s ease; }
        .card:hover { transform: translateY(-5px); background: #334155 !important; }
        .ls-wide { letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
}

export default Home;
