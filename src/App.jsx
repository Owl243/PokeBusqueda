import { useEffect, useState } from "react";
import { getPokemons } from "./services/pokeApi";
import jsPDF from "jspdf";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState(16);
  const [isListMinimized, setIsListMinimized] = useState(false);

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

  const toggleSelect = (pokemon) => {
    const exists = selected.find((p) => p.name === pokemon.name);

    if (exists) {
      setSelected(selected.filter((p) => p.name !== pokemon.name));
    } else {
      setSelected([...selected, pokemon]);
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    let x = 10;
    let y = 10;

    for (let i = 0; i < selected.length; i++) {
      const poke = selected[i];

      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;

      const img = await fetch(imageUrl)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );

      doc.rect(x, y, 45, 45); // Caja sin relleno más compacta
      doc.setFontSize(9);
      doc.text(`#${poke.id}`, x + 3, y + 6);

      // Imágen en medio
      doc.addImage(img, "PNG", x + 10, y + 8, 25, 25);

      const displayName = poke.name.split("-")[0];
      const capName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      doc.setFontSize(10);
      doc.text(capName, x + 22.5, y + 40, { align: "center" });

      x += 50; // Nos movemos 50 a la derecha

      if (x > 160) {
        x = 10;
        y += 50; // Siguiente fila
        
        // Si alcanzamos el final de la página (aprox 297mm en A4 estándar), creamos una nueva
        if (y > 250) {
          doc.addPage();
          y = 10;
        }
      }
    }

    doc.save("pokemon-checklist.pdf");
  };

  // 🔍 filtro
  // 🔍 filtro
  const filteredPokemons = pokemons.filter((p) => {
    const terms = search.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (terms.length === 0) return true;

    return terms.some((term) =>
      p.id.toString() === term || p.name.toLowerCase().includes(term)
    );
  });

  // 📄 paginación
  const itemsPerPage = gridSize * 2; // 2 páginas por vista (libro)
  const totalPages = Math.ceil(filteredPokemons.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSpread = filteredPokemons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const leftPagePokemons = currentSpread.slice(0, gridSize);
  const rightPagePokemons = currentSpread.slice(gridSize, itemsPerPage);

  const renderCard = (poke, index) => {
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`;
    const isSelected = selected.some((p) => p.name === poke.name);
    const colClass = gridSize === 9 ? "col-4" : "col-3"; // 3x3 o 4x4

    // Obtener el nombre base del pokemon quitando cualquier sufijo después del guión '-'
    const displayName = poke.name.split("-")[0];

    return (
      <div className={colClass} key={poke.name || index}>
        <div
          className={`banner-card h-100 d-flex flex-column align-items-center justify-content-center`}
          style={{
            backgroundColor: typeColors[poke.type] || "gray",
            cursor: "pointer",
            border: isSelected ? "3px solid white" : "none"
          }}
          onClick={() => toggleSelect(poke)}
          title={poke.name} /* el tooltip aún muestra el nombre completo técnico */
        >
          <span style={{ position: "absolute", top: "5px", left: "8px", fontSize: "0.75rem", fontWeight: "bold", opacity: 0.85 }}>
            #{poke.id}
          </span>
          <img
            src={image}
            style={{
              width: "100%",
              minWidth: "85px",
              maxWidth: "85px",
              minHeight: "85px",
              objectFit: "contain",
              imageRendering: "pixelated"
            }}
            alt={displayName}
          />
          <div className="text-capitalize text-truncate w-100 mt-0" style={{ fontSize: "0.80rem" }}>
            {displayName}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h1 className="fw-bold mb-2" style={{ background: "linear-gradient(45deg, #FFD700, #FF8C00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        Poke Búsqueda
      </h1>

      <p className="text-secondary mb-4" style={{ maxWidth: "800px" }}>
        Bienvenido a Poke Búsqueda. Aquí puedes armar tu propia colección. Busca Pokémon por su nombre o ingresando múltiples identificadores separados por comas (por ejemplo: <code>1, 4, 7, pikachu</code>). Selecciona tus favoritos haciendo clic en sus cartas para finalmente generar un PDF interactivo.
      </p>

      <h5 className="mb-4">Seleccionados: <span className="badge bg-primary rounded-pill">{selected.length}</span></h5>

      {/* 🔍 Buscador */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar Pokémon..."
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

      {/* 🧩 GRID TIPO LIBRO */}
      <div className="row mt-4 mb-5">
        {/* Lado Izquierdo */}
        <div className="col-12 col-xl-6 mb-4 pe-xl-4 border-xl-end">
          <div className="row g-2">
            {leftPagePokemons.map(renderCard)}
          </div>
        </div>

        {/* Lado Derecho */}
        <div className="col-12 col-xl-6 mb-4 ps-xl-4">
          <div className="row g-2">
            {rightPagePokemons.map(renderCard)}
          </div>
        </div>
      </div>

      {/* 📄 PAGINACIÓN */}
      <div className="d-flex justify-content-center mt-4 gap-2">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ←
        </button>

        <span className="align-self-center">
          Página {currentPage} de {totalPages}
        </span>

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          →
        </button>
      </div>

      {/* 📦 Seleccionados Superpuesto */}
      {selected.length > 0 && (
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 1050, maxWidth: "300px", opacity: 0.85, transition: "opacity 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0.85}
        >
          <div className="card shadow-lg bg-dark text-light border-secondary p-3">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 border-secondary">
              <h6 className="mb-0">Seleccionados ({selected.length})</h6>
              <button
                className="btn btn-sm btn-outline-light border-0 py-0"
                onClick={() => setIsListMinimized(!isListMinimized)}
                title={isListMinimized ? "Expandir" : "Minimizar"}
              >
                {isListMinimized ? '▲' : '▼'}
              </button>
            </div>

            {!isListMinimized && (
              <>
                <div className="d-flex flex-wrap gap-1 mt-3 mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {selected.map((poke, index) => (
                    <span
                      key={index}
                      className="badge bg-secondary text-capitalize"
                      style={{ cursor: "pointer" }}
                      title={`Clic para remover a ${poke.name.split("-")[0]}`}
                      onClick={() => toggleSelect(poke)}
                    >
                      {poke.name.split("-")[0]} &times;
                    </span>
                  ))}
                </div>

                <button className="btn btn-success fw-bold w-100" onClick={generatePDF}>
                  Generar PDF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;