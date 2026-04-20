import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { fetchRiftboundCards, fetchRiftboundSets, fetchAllRiftboundCards } from "../../services/riftboundService";
import { saveToInventory } from "../../services/inventoryService";
import GenericSelectedPanel from "../../components/GenericSelectedPanel";
import Pagination from "../../components/Pagination";

function RiftBoundApp() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState("origins");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [allCards, setAllCards] = useState([]); // Cache for global search
  const cardsPerPage = 12;

  useEffect(() => {
    fetchRiftboundSets().then(setSets);
  }, []);

  useEffect(() => {
    if (search.trim()) {
      setLoading(true);
      setCurrentPage(1);
      
      const performGlobalSearch = async () => {
        let baseList = allCards;
        if (baseList.length === 0) {
          baseList = await fetchAllRiftboundCards();
          setAllCards(baseList);
        }
        
        const filtered = baseList.filter(c => 
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.id.toLowerCase().includes(search.toLowerCase())
        );
        setCards(filtered);
        setLoading(false);
      };
      
      performGlobalSearch();
    } else if (selectedSet) {
      setLoading(true);
      setCurrentPage(1);
      fetchRiftboundCards(selectedSet).then((data) => {
        setCards(data);
        setLoading(false);
      });
    }
  }, [selectedSet, search, allCards]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const toggleSelect = useCallback((card) => {
    setSelected(prev => {
      if (prev.some(c => c.id === card.id)) {
        return prev.filter(c => c.id !== card.id);
      }
      return [...prev, card];
    });
  }, []);

  const handleSaveInventory = () => {
    const cardsToSave = selected.map(c => ({
      id: `rb-${c.id}`,
      name: c.name,
      img: c.img,
      tcg: "RiftBound"
    }));
    saveToInventory(cardsToSave, "RiftBound");
    alert("¡Cartas de Rift Bound añadidas a Mi Inventario!");
  };

  const generatePDF = async () => {
    if (selected.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      let x = 10;
      let y = 10;
      const cardWidth = 42;
      const cardHeight = 58;
      const spaceX = 6;
      const spaceY = 8;

      const imagesData = await Promise.all(
        selected.map(async (card) => {
           const proxyUrl = `https://i0.wp.com/${card.img.replace(/^https?:\/\//, "")}`;
           try {
             const res = await fetch(proxyUrl);
             const blob = await res.blob();
             return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
             });
           } catch { return null; }
        })
      );

      for (let i = 0; i < selected.length; i++) {
        const imgData = imagesData[i];
        if (imgData) doc.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
        
        // Credit footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("archivo generado en https://multi-tcg-docs.vercel.app/ - Hecho por Vaiu", 105, 290, { align: "center" });

        x += cardWidth + spaceX;
        if (x + cardWidth > 200) {
          x = 10;
          y += cardHeight + spaceY;
          if (y + cardHeight > 285) { doc.addPage(); y = 10; }
        }
      }
      doc.save("riftbound-collection.pdf");
      setSelected([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateIMG = async () => {
    if (selected.length === 0) return;
    if (selected.length > 16) {
      alert("Límite de 16 cartas para generar la imagen.");
      return;
    }
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const cols = 4;
      const rows = Math.ceil(selected.length / cols);
      const cardWidth = 240;
      const cardHeight = 330;
      const margin = 20;

      canvas.width = margin * 2 + cols * cardWidth + (cols - 1) * margin;
      canvas.height = margin * 2 + rows * cardHeight + (rows - 1) * margin;

      ctx.fillStyle = "#112233";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imagesData = await Promise.all(
        selected.map(async (card) => {
           const proxyUrl = `https://i0.wp.com/${card.img.replace(/^https?:\/\//, "")}`;
           try {
             const res = await fetch(proxyUrl);
             const blob = await res.blob();
             return new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
             });
           } catch { return null; }
        })
      );

      for (let i = 0; i < selected.length; i++) {
        const imgData = imagesData[i];
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = margin + col * (cardWidth + margin);
        const y = margin + row * (cardHeight + margin);

        if (imgData) {
            const img = new Image();
            img.src = imgData;
            await new Promise(r => { img.onload = r; });
            ctx.drawImage(img, x, y, cardWidth, cardHeight);
        }
      }

      // Final Credit Footer for Image
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.textAlign = "center";
      ctx.fillText("archivo generado en https://multi-tcg-docs.vercel.app/ - Hecho por Vaiu", canvas.width / 2, canvas.height - 10);
      ctx.textAlign = "left";

      const link = document.createElement('a');
      link.download = 'riftbound-collection.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setSelected([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mt-4 text-light pb-5">
      <Link to="/" className="btn btn-outline-light mb-4">⬅️ Volver a Inicio</Link>
      
      <div className="text-center mb-5">
        <h1 className="display-4 text-info fw-bold" style={{ textShadow: "2px 2px 5px #000" }}>🌀 Rift Bound TCG</h1>
        <p className="lead border-bottom border-info pb-3">Domina el místico mundo de Rift Bound</p>

        <div className="d-flex flex-column align-items-center mb-4">
          <div className="col-md-8 mb-3">
             <input
                type="text"
                className="form-control bg-dark text-light border-info shadow-sm py-2"
                placeholder="🔍 Buscar Champion, Spell, Unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
          <div className="col-md-6 text-center">
            <select 
              className="form-select bg-dark text-light border-info" 
              value={selectedSet} 
              onChange={(e) => {
                setSelectedSet(e.target.value);
                setSearch(""); // Clear search when selecting set
              }}
            >
              {sets.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center"><div className="spinner-border text-info"></div></div>
      ) : (
        <div className="row g-3">
          {currentCards.map(card => {
            const isSelected = selected.some(c => c.id === card.id);
            return (
              <div key={card.id} className="col-6 col-md-3 col-lg-2" onClick={() => toggleSelect(card)} style={{ cursor: "pointer" }}>
                <div className={`card bg-dark ${isSelected ? 'border-success shadow-lg' : 'border-secondary'} position-relative h-100 p-1`}>
                    {isSelected && <div className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 m-1 fs-5 rounded-circle" style={{ zIndex: 10 }}>✓</div>}
                    <img 
                      src={`https://i0.wp.com/${card.img.replace(/^https?:\/\//, "")}`} 
                      className="card-img-top rounded" 
                      alt={card.name} 
                      style={{ objectFit: 'contain' }} 
                    />
                    <div className="card-body p-2 text-center">
                        <small className="fw-bold text-light d-block text-truncate border-bottom border-secondary pb-1">{card.name}</small>
                        <div className="text-center mt-2">
                          <span className={`badge ${
                            card.color?.toLowerCase().includes('fire') ? 'bg-danger' : 
                            card.color?.toLowerCase().includes('water') ? 'bg-primary' : 
                            card.color?.toLowerCase().includes('earth') ? 'bg-success' : 
                            card.color?.toLowerCase().includes('aether') ? 'bg-info text-dark' : 
                            'bg-secondary'
                          } mt-1`}>
                            {card.color}
                          </span>
                        </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <GenericSelectedPanel 
        selected={selected}
        toggleSelect={toggleSelect}
        generatePDF={generatePDF}
        generateIMG={generateIMG}
        onSaveInventory={handleSaveInventory}
        tcgName="Rift Bound"
      />

      {isGenerating && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 2000 }}>
          <div className="bg-white p-4 rounded shadow text-center text-dark">
            <div className="spinner-border mb-3 text-info"></div>
            <p className="fw-bold">Procesando conjunto...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiftBoundApp;
