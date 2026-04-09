import { useEffect, useState, useMemo, useCallback } from "react";
import { getPokemons } from "./services/pokeApi";
import jsPDF from "jspdf";
import "./App.css";

// 🧩 COMPONENTES
import PokemonGrid from "./components/PokemonGrid";
import Pagination from "./components/Pagination";
import SelectedPanel from "./components/SelectedPanel";
import TcgModal from "./components/TcgModal";

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

const generations = [
  { id: 1, name: "Gen 1 (Kanto)", start: 1, end: 151 },
  { id: 2, name: "Gen 2 (Johto)", start: 152, end: 251 },
  { id: 3, name: "Gen 3 (Hoenn)", start: 252, end: 386 },
  { id: 4, name: "Gen 4 (Sinnoh)", start: 387, end: 493 },
  { id: 5, name: "Gen 5 (Unova)", start: 494, end: 649 },
  { id: 6, name: "Gen 6 (Kalos)", start: 650, end: 721 },
  { id: 7, name: "Gen 7 (Alola)", start: 722, end: 809 },
  { id: 8, name: "Gen 8 (Galar)", start: 810, end: 905 },
  { id: 9, name: "Gen 9 (Paldea)", start: 906, end: 1025 },
];

const formatName = (name) => {
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedTcg, setSelectedTcg] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState(16);
  const [isListMinimized, setIsListMinimized] = useState(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [typesMap, setTypesMap] = useState({});

  const [showMegas, setShowMegas] = useState(false);
  const [selectedGen, setSelectedGen] = useState(1);
  const [tcgPokemon, setTcgPokemon] = useState(null);

  const fetchType = useCallback(async (poke) => {
    setTypesMap((prev) => {
      if (prev[poke.id]) return prev;
      
      let fetchUrl = `https://pokeapi.co/api/v2/pokemon/${poke.id}`;
      // Las megas falsas ZA (ID > 20000) fallan por ID, buscar por nombre base
      if (poke.id > 20000) {
        const baseName = poke.name.replace("mega-", "").split("-")[0];
        fetchUrl = `https://pokeapi.co/api/v2/pokemon/${baseName}`;
      }
      
      fetch(fetchUrl)
        .then(res => res.json())
        .then(data => {
            const type = data.types[0].type.name;
            setTypesMap(p => ({ ...p, [poke.id]: type }));
        }).catch(() => {});
        
      return { ...prev, [poke.id]: 'fetching' };
    });
  }, []);

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
    
    const savedTcg = localStorage.getItem("selectedTcg");
    if (savedTcg) {
      setSelectedTcg(JSON.parse(savedTcg));
    }

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedPokemons", JSON.stringify(selected));
  }, [selected]);

  useEffect(() => {
    localStorage.setItem("selectedTcg", JSON.stringify(selectedTcg));
  }, [selectedTcg]);

  // 🧠 Selección
  const toggleSelect = useCallback((pokemon) => {
    setSelected((prevSelected) => {
      const exists = prevSelected.some((p) => p.name === pokemon.name);
      if (exists) {
        return prevSelected.filter((p) => p.name !== pokemon.name);
      } else {
        return [...prevSelected, pokemon];
      }
    });
  }, []);

  const toggleSelectTcg = useCallback((card) => {
    setSelectedTcg((prevSelected) => {
      const exists = prevSelected.some((c) => c.id === card.id);
      if (exists) {
        return prevSelected.filter((c) => c.id !== card.id);
      } else {
        return [...prevSelected, card];
      }
    });
  }, []);

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

        let displayId = poke.id;
        // Si no tiene imagen propia (Megas fakes ZA con ID altas), usamos la imagen del base
        if (poke.id > 20000) {
           let baseName = poke.name.replace("mega-", "").replace("-mega", "").split("-")[0];
           const basePoke = pokemons.find(p => p.name === baseName);
           if (basePoke) {
              displayId = basePoke.id;
           }
        }

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${displayId}.png`;

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

        // 🖼️ Imagen con resiliencia a crashes (404 Not Found)
        try {
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error("Image not found");
            const blob = await res.blob();
            const imgData = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            doc.addImage(imgData, "PNG", x + 5, y + 15, 35, 30);
        } catch (error) {
            doc.setFillColor(200, 200, 200);
            doc.rect(x + 5, y + 15, 35, 30, "F");
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text("Sin Foto", x + cardWidth / 2, y + 30, { align: "center" });
        }


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

      // 🧹 limpiar selección
      setSelected([]);

      // opcional (extra seguro)
      localStorage.removeItem("selectedPokemons");

    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 📄 PDF TCG
  const generateTCGPdf = async () => {
    if (selectedTcg.length === 0) return;
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();
      let x = 10;
      let y = 10;
      
      // Tamaño más pequeño para caber 16 (4x4) en A4
      const cardWidth = 42;
      const cardHeight = 58;
      const spaceX = 6;
      const spaceY = 8;

      // Cargar todas las imágenes en paralelo usando WSRV para evitar CORS y 522
      const imagesData = await Promise.all(
        selectedTcg.map(async (card) => {
          const imageUrl = card.images.small; 
          // wsrv.nl actúa como un CDN caché y proxy de imágenes muy rápido, y entrega las cabeceras CORS de forma segura
          const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&output=png`;
          const res = await fetch(proxyUrl);
          const blob = await res.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
      );

      for (let i = 0; i < selectedTcg.length; i++) {
        const card = selectedTcg[i];
        const imgData = imagesData[i];

        doc.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);

        // Añadir texto de la expansión
        const setName = card.set?.name || "Desconocida";
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.text(setName, x + cardWidth / 2, y + cardHeight + 4, { align: "center", maxWidth: cardWidth });

        x += cardWidth + spaceX;

        // Limite horizontal
        if (x + cardWidth > 200) {
          x = 10;
          y += cardHeight + spaceY;

          // Limite vertical
          if (y + cardHeight > 285) {
            doc.addPage();
            y = 10;
          }
        }
      }

      doc.save("pokemon-tcg-collection.pdf");
      setSelectedTcg([]);
      localStorage.removeItem("selectedTcg");
    } catch (e) {
      console.error(e);
      alert("Error al generar PDF de TCG");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 🔍 FILTRO (multi búsqueda)
  const filteredPokemons = useMemo(() => {
    let filtered = pokemons;
    
    // Identificar el rango de la generación seleccionada
    const gen = generations.find(g => g.id === selectedGen);

    // Separar lista para no mezclar normales y megas (megas tienen ID > 10000)
    if (showMegas) {
      filtered = filtered.filter(p => p.id > 10000);
    } else {
      filtered = filtered.filter(p => p.id <= 10000);
    }

    // Filtrar por generación
    if (gen) {
        filtered = filtered.filter(p => {
             // Si es normal, validamos su ID directamente
             if (p.id <= 10000) {
                 return p.id >= gen.start && p.id <= gen.end;
             } else {
                 // Si es Mega, obtenemos el nombre base y buscamos el ID base
                 let baseName = p.name.replace("mega-", "").replace("-mega", "").split("-")[0];
                 const basePoke = pokemons.find(bp => bp.name === baseName && bp.id <= 10000);
                 if (basePoke) {
                     return basePoke.id >= gen.start && basePoke.id <= gen.end;
                 }
                 // Excepciones donde base no aplica perfecto (ej. "mega-mewtwo-x", base="mewtwo")
                 // "mewtwo" se detectará bien gracias a .split("-")[0].
                 return false;
             }
        });
    }

    // 🔍 búsqueda
    const terms = search
      .split(",")
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    if (terms.length > 0) {
      filtered = filtered.filter(p =>
        terms.some(term =>
          p.id.toString() === term ||
          p.name.toLowerCase().includes(term)
        )
      );
    }

    return filtered;
  }, [pokemons, showMegas, search, selectedGen]);

  // 📖 PAGINACIÓN TIPO LIBRO
  const { totalPages, leftPagePokemons, rightPagePokemons } = useMemo(() => {
    const itemsPerPage = gridSize * 2;
    const total = Math.ceil(filteredPokemons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSpread = filteredPokemons.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return {
      totalPages: total,
      leftPagePokemons: currentSpread.slice(0, gridSize),
      rightPagePokemons: currentSpread.slice(gridSize, itemsPerPage)
    };
  }, [filteredPokemons, currentPage, gridSize]);

  // ⏳ Loading simple
  if (!pokemons.length) {
    return <p className="text-center mt-5">Cargando Pokémon...</p>;
  }

  return (

    <div className="container mt-0 pb-5" style={{ paddingBottom: "120px" }}>      {/* 🧠 Header */}
      <div className="text-center my-4 mb-5">
        <h1 className="display-4 fw-bold text-warning mb-3" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}>
          🌟 Poké Búsqueda
        </h1>
        <p className="lead text-light mb-0" style={{ maxWidth: "750px", margin: "0 auto" }}>
          Busca, filtra y selecciona tus Pokémon favoritos de diversas generaciones. 
          Incluye soporte para Mega Evoluciones y su integración directa con Cartas TCG. 
          Configura ambas listas a tu gusto y expórtalas rápidamente a documentos PDF de alta calidad listos para imprimir.
        </p>
      </div>


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

      {/* 🎛️ Grid selector y Generación */}
      <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
        <select 
          className="form-select w-auto d-inline-block bg-dark text-light border-secondary" 
          value={selectedGen} 
          disabled={!search.toLowerCase().includes("litwick")}
          title={!search.toLowerCase().includes("litwick") ? "Parece bloqueado... Busca la pequeña luz en la oscuridad." : "¡Secreto revelado!"}
          style={{
            cursor: !search.toLowerCase().includes("litwick") ? "not-allowed" : "pointer",
            opacity: !search.toLowerCase().includes("litwick") ? 0.6 : 1
          }}
          onChange={(e) => {
            setSelectedGen(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {generations.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <button
          className={showMegas ? "btn btn-warning" : "btn btn-outline-warning"}
          onClick={() => {
            setShowMegas(!showMegas);
            setCurrentPage(1);
          }}
        >
          {showMegas ? "Ver Normales" : "Ver Megas"}
        </button>

        <div className="ms-auto">
          <button
            className="btn btn-outline-primary me-2"
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
            onOpenTcg={setTcgPokemon}
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
            onOpenTcg={setTcgPokemon}
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
        selectedTcg={selectedTcg}
        toggleSelectTcg={toggleSelectTcg}
        generatePDF={generatePDF}
        generateTCGPdf={generateTCGPdf}
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

      {tcgPokemon && (
        <TcgModal 
          pokemon={tcgPokemon} 
          onClose={() => setTcgPokemon(null)} 
          selectedTcg={selectedTcg}
          toggleSelectTcg={toggleSelectTcg}
        />
      )}

    </div>
  );
}

export default App;