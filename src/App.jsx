import { useEffect, useState } from "react";
import { getPokemons } from "./services/pokeApi";
import jsPDF from "jspdf";
import "./App.css";

// 🧩 COMPONENTES
import PokemonGrid from "./components/PokemonGrid";
import Pagination from "./components/Pagination";
import SelectedPanel from "./components/SelectedPanel";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState(16);
  const [isListMinimized, setIsListMinimized] = useState(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [typesMap, setTypesMap] = useState({});

  const fetchType = async (id) => {
    if (typesMap[id]) return;

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const type = data.types[0].type.name;

    setTypesMap(prev => ({ ...prev, [id]: type }));
  };

  const typeColors = {
    fire: "#f08030",
    water: "#6890f0",
    grass: "#78c850",
    electric: "#f8d030",
    psychic: "#f85888",
    ice: "#98d8d8",
    dragon: "#7038f8",
    dark: "#705848",
    fairy: "#ee99ac",
    normal: "#a8a878",
    fighting: "#c03028",
    flying: "#a890f0",
    poison: "#a040a0",
    ground: "#e0c068",
    rock: "#b8a038",
    bug: "#a8b820",
    ghost: "#705898",
    steel: "#b8b8d0",
  };

  // 🔄 Cargar datos + localStorage
  useEffect(() => {
    const fetchData = async () => {
      const data = await getPokemons();
      setPokemons(data);
    };

    const saved = localStorage.getItem("selectedPokemons");
    if (saved) {
      setSelected(JSON.parse(saved));
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPokemons", JSON.stringify(selected));
  }, [selected]);

  // 🧠 Selección
  const toggleSelect = (pokemon) => {
    const exists = selected.find((p) => p.name === pokemon.name);

    if (exists) {
      setSelected(selected.filter((p) => p.name !== pokemon.name));
    } else {
      setSelected([...selected, pokemon]);
    }
  };

  const formatName = (name) => {
    return name
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // 📄 PDF
  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();

      const cardWidth = 45;
      const cardHeight = 55;

      let x = 10;
      let y = 10;

      for (let i = 0; i < selected.length; i++) {
        const poke = selected[i];

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`;

        const img = await fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          }));

        // 🟨 Fondo carta
        doc.setFillColor(245, 245, 245);
        doc.rect(x, y, cardWidth, cardHeight, "F");

        // 🖤 Borde
        doc.setDrawColor(0);
        doc.rect(x, y, cardWidth, cardHeight);

        // 🔢 ID
        doc.setFontSize(8);
        doc.setTextColor(80);
        doc.text(`#${poke.id}`, x + 2, y + 5);

        // 🧾 Nombre
        const capName = formatName(poke.name);
        doc.setFontSize(13);
        doc.setTextColor(0);
        doc.text(capName, x + cardWidth / 2, y + 12, { align: "center" });

        // 🖼️ Imagen (mejor centrada)
        doc.addImage(img, "PNG", x + 5, y + 15, 35, 30);


        // 🔄 Posición siguiente carta
        x += 50;

        if (x > 160) {
          x = 10;
          y += 65;

          if (y > 250) {
            doc.addPage();
            y = 10;
          }
        }
      }

      doc.save("pokemon-cards.pdf");

    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 🔍 FILTRO (multi búsqueda)
  const filteredPokemons = pokemons.filter((p) => {
    const terms = search
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    if (terms.length === 0) return true;

    return terms.some(
      (term) =>
        p.id.toString() === term ||
        p.name.toLowerCase().includes(term)
    );
  });

  // 📖 PAGINACIÓN TIPO LIBRO
  const itemsPerPage = gridSize * 2;
  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpread = filteredPokemons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const leftPagePokemons = currentSpread.slice(0, gridSize);
  const rightPagePokemons = currentSpread.slice(gridSize, itemsPerPage);

  // ⏳ Loading simple
  if (!pokemons.length) {
    return <p className="text-center mt-5">Cargando Pokémon...</p>;
  }

  const getColorById = (id) => {
    const colors = [
      "#f08030", // rojo
      "#6890f0", // azul
      "#78c850", // verde
      "#f8d030", // amarillo
      "#a040a0", // morado
      "#705848", // café
    ];

    return colors[id % colors.length];
  };

  return (

    <div className="container mt-0 pb-5" style={{ paddingBottom: "120px" }}>      {/* 🧠 Header */}
      <h1 className="fw-bold mb-2 text-warning">
        Poke Búsqueda
      </h1>

      <h5 className="mb-3">
        Seleccionados:{" "}
        <span className="badge bg-primary">
          {selected.length}
        </span>
      </h5>

      {/* 🔍 Buscador */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Ej: 1, 4, pikachu"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {/* 🎛️ Grid selector */}
      <div className="mb-3 d-flex gap-2">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setGridSize(9);
            setCurrentPage(1);
          }}
        >
          3x3
        </button>

        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setGridSize(16);
            setCurrentPage(1);
          }}
        >
          4x4
        </button>
      </div>

      {/* 📖 GRID TIPO LIBRO */}
      <div className="row mt-0 mb-0">
        <div className="col-12 col-xl-6 mb-0 pe-xl-4 border-xl-end">
          <PokemonGrid
            pokemons={leftPagePokemons}
            selected={selected}
            toggleSelect={toggleSelect}
            typeColors={typeColors}
            gridSize={gridSize}
            fetchType={fetchType}
            typesMap={typesMap}
          />
        </div>

        <div className="col-12 col-xl-6 mb-4 ps-xl-4">
          <PokemonGrid
            pokemons={rightPagePokemons}
            selected={selected}
            toggleSelect={toggleSelect}
            typeColors={typeColors}
            gridSize={gridSize}
            fetchType={fetchType}
            typesMap={typesMap}
          />
        </div>
      </div>
      {/* 📄 Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* 📦 Panel flotante */}
      <SelectedPanel
        selected={selected}
        toggleSelect={toggleSelect}
        generatePDF={generatePDF}
        isListMinimized={isListMinimized}
        setIsListMinimized={setIsListMinimized}
      />

      {isGeneratingPDF && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          style={{ zIndex: 2000 }}
        >
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="spinner-border mb-3"></div>
            <p>Generando PDF...</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;