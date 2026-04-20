import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PokemonApp from "./apps/Pokemon/PokemonApp";
import OnePieceApp from "./apps/OnePiece/OnePieceApp";
import RiftBoundApp from "./apps/RiftBound/RiftBoundApp";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon" element={<PokemonApp />} />
        <Route path="/one-piece" element={<OnePieceApp />} />
        <Route path="/rift-bound" element={<RiftBoundApp />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
