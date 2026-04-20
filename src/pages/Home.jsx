import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container mt-5 text-center text-light pb-5">
      <h1 className="display-3 fw-bold text-white mb-4" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.9)" }}>
        🌟 MultiTCG Hub
      </h1>
      <p className="lead mb-5 mx-auto text-light" style={{ maxWidth: "600px", textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}>
        Explora las bases de datos de tus juegos de cartas favoritos. Crea PDFs, imágenes de tus colecciones y comparte tu inventario fácilmente.
      </p>

      {/* Inventario Principal */}
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-md-6 col-lg-4">
          <Link to="/inventory" className="text-decoration-none">
            <div className="card bg-dark text-light border-success shadow-lg hover-effect bg-gradient" style={{ borderRadius: "20px" }}>
              <div className="card-body d-flex align-items-center justify-content-center py-4 gap-3">
                <span className="display-4">🎒</span>
                <div className="text-start">
                  <h3 className="text-success fw-bold mb-0">Mi Inventario</h3>
                  <p className="text-light mb-0 small">Tus cartas guardadas y compartidas</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <h4 className="text-secondary fw-bold mb-4">Selecciona un TCG</h4>

      <div className="row justify-content-center gap-4 px-3">
        {/* Pokémon */}
        <div className="col-12 col-md-5 col-lg-3 p-0">
          <Link to="/pokemon" className="text-decoration-none h-100 d-block">
            <div className="card text-white border-0 shadow-lg h-100 hover-effect tcg-card" 
                 style={{ 
                   backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?q=80&w=1000&auto=format&fit=crop')",
                   backgroundSize: "cover",
                   backgroundPosition: "center",
                   borderRadius: "20px"
                 }}>
              <div className="card-body d-flex flex-column justify-content-end align-items-center p-4 min-vh-25">
                <span className="display-4 mb-2">⚡</span>
                <h3 className="fw-bold text-warning" style={{ textShadow: "1px 1px 5px #000" }}>Pokémon</h3>
                <p className="text-light mb-0" style={{ textShadow: "1px 1px 5px #000" }}>Pokédex & TCG</p>
              </div>
            </div>
          </Link>
        </div>

        {/* One Piece */}
        <div className="col-12 col-md-5 col-lg-3 p-0">
          <Link to="/one-piece" className="text-decoration-none h-100 d-block">
            <div className="card text-white border-0 shadow-lg h-100 hover-effect tcg-card" 
                 style={{ 
                   backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1578351567104-583d7fc8ad72?q=80&w=1000&auto=format&fit=crop')",
                   backgroundSize: "cover",
                   backgroundPosition: "center",
                   borderRadius: "20px"
                 }}>
              <div className="card-body d-flex flex-column justify-content-end align-items-center p-4 min-vh-25">
                <span className="display-4 mb-2">🏴‍☠️</span>
                <h3 className="fw-bold text-danger" style={{ textShadow: "1px 1px 5px #000" }}>One Piece</h3>
                <p className="text-light mb-0" style={{ textShadow: "1px 1px 5px #000" }}>Trading Card Game</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Rift Bound */}
        <div className="col-12 col-md-5 col-lg-3 p-0">
          <Link to="/rift-bound" className="text-decoration-none h-100 d-block">
            <div className="card text-white border-0 shadow-lg h-100 hover-effect tcg-card" 
                 style={{ 
                   backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1629851600115-4673fb117baf?q=80&w=1000&auto=format&fit=crop')",
                   backgroundSize: "cover",
                   backgroundPosition: "center",
                   borderRadius: "20px"
                 }}>
              <div className="card-body d-flex flex-column justify-content-end align-items-center p-4 min-vh-25">
                <span className="display-4 mb-2">🌀</span>
                <h3 className="fw-bold text-info" style={{ textShadow: "1px 1px 5px #000" }}>Rift Bound</h3>
                <p className="text-light mb-0" style={{ textShadow: "1px 1px 5px #000" }}>Trading Card Game</p>
              </div>
            </div>
          </Link>
        </div>

      </div>

      <style>{`
        .hover-effect {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.6) !important;
          cursor: pointer;
        }
        .min-vh-25 {
          min-height: 280px;
        }
        .tcg-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          pointer-events: none;
        }
        .tcg-card:hover::before {
          border-color: rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
}

export default Home;
