import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokemonApp from "./apps/Pokemon/PokemonApp";
import OnePieceApp from "./apps/OnePiece/OnePieceApp";
import RiftBoundApp from "./apps/RiftBound/RiftBoundApp";
import Inventory from "./pages/Inventory";

const globalFooterStyle = {
  textAlign: "center",
  padding: "12px 16px",
  fontSize: "0.75rem",
  color: "#6c757d",
  letterSpacing: "0.03em",
  userSelect: "none",
  background: "transparent",
};

function GlobalFooter() {
  return (
    <footer style={globalFooterStyle}>
      © 2026{" "}
      <span style={{ color: "#a890f0", fontWeight: 600 }}>MultiTCG System</span>
      {" — "}
      Hecho por{" "}
      <span style={{ color: "#ffc107", fontWeight: 600 }}>Vaiu</span>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pokemon" element={<PokemonApp />} />
            <Route path="/one-piece" element={<OnePieceApp />} />
            <Route path="/rift-bound" element={<RiftBoundApp />} />
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
        </div>
        <GlobalFooter />
      </div>
    </BrowserRouter>
  );
}

export default App;
