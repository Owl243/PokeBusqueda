import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { fetchOnePieceCards } from "../../services/mockTcgApi";
import { saveToInventory } from "../../services/inventoryService";
import GenericSelectedPanel from "../../components/GenericSelectedPanel";

function OnePieceApp() {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchOnePieceCards().then(setCards);
  }, []);

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
      id: `op-${c.id}`,
      name: c.name,
      img: c.img,
      tcg: "OnePiece"
    }));
    saveToInventory(cardsToSave, "OnePiece");
    alert("¡Cartas de One Piece añadidas a Mi Inventario!");
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
           // Si el MOCK da CORS o 404 proxy
           const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(card.img)}&output=png`;
           try {
             const res = await fetch(proxyUrl);
             const blob = await res.blob();
             return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
             });
           } catch {
             return null;
           }
        })
      );

      for (let i = 0; i < selected.length; i++) {
        const imgData = imagesData[i];
        if (imgData) {
            doc.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);
        } else {
            doc.setFillColor(200, 200, 200);
            doc.rect(x, y, cardWidth, cardHeight, "F");
        }

        x += cardWidth + spaceX;
        if (x + cardWidth > 200) {
          x = 10;
          y += cardHeight + spaceY;
          if (y + cardHeight > 285) {
            doc.addPage();
            y = 10;
          }
        }
      }
      doc.save("onepiece-collection.pdf");
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
      const spacingX = 20;
      const spacingY = 20;

      canvas.width = margin * 2 + cols * cardWidth + (cols - 1) * spacingX;
      canvas.height = margin * 2 + rows * cardHeight + (rows - 1) * spacingY;

      ctx.fillStyle = "#1e1e1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imagesData = await Promise.all(
        selected.map(async (card) => {
           const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(card.img)}&output=png`;
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
        const col = i % cols;
        const row = Math.floor(i / cols);

        const x = margin + col * (cardWidth + spacingX);
        const y = margin + row * (cardHeight + spacingY);

        if (imgData) {
            const img = new Image();
            img.src = imgData;
            await new Promise(r => { img.onload = r; });
            ctx.drawImage(img, x, y, cardWidth, cardHeight);
        } else {
            ctx.fillStyle = "#555";
            ctx.fillRect(x, y, cardWidth, cardHeight);
        }
      }

      const link = document.createElement('a');
      link.download = 'onepiece-collection.png';
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
        <h1 className="display-4 text-danger fw-bold" style={{ textShadow: "2px 2px 5px #000" }}>🏴‍☠️ One Piece TCG</h1>
        <p className="lead border-bottom border-danger pb-3">Generador de Decklist (Simulado mediante Mock API)</p>
      </div>

      {!cards.length ? (
        <div className="text-center"><div className="spinner-border text-danger"></div></div>
      ) : (
        <div className="row g-3">
          {cards.map(card => {
            const isSelected = selected.some(c => c.id === card.id);
            return (
              <div key={card.id} className="col-6 col-md-3 col-lg-2" onClick={() => toggleSelect(card)} style={{ cursor: "pointer" }}>
                <div className={`card bg-dark ${isSelected ? 'border-success shadow-lg' : 'border-secondary'} position-relative h-100 p-1`}>
                    {isSelected && <div className="position-absolute top-0 end-0 bg-success text-white px-2 py-1 m-1 fs-5 rounded-circle" style={{ zIndex: 10 }}>✓</div>}
                    <img src={card.img} className="card-img-top rounded" alt={card.name} style={{ objectFit: 'contain' }} />
                    <div className="card-body p-2 text-center">
                        <small className="fw-bold text-light d-block text-truncate border-bottom border-secondary pb-1">{card.name}</small>
                        <span className={`badge ${card.color === 'Blue' ? 'bg-primary' : 'bg-danger'} mt-1`}>{card.color}</span>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GenericSelectedPanel 
        selected={selected}
        toggleSelect={toggleSelect}
        generatePDF={generatePDF}
        generateIMG={generateIMG}
        onSaveInventory={handleSaveInventory}
        tcgName="One Piece"
      />

      {isGenerating && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75" style={{ zIndex: 2000 }}>
          <div className="bg-white p-4 rounded shadow text-center text-dark">
            <div className="spinner-border mb-3 text-danger"></div>
            <p className="fw-bold">Generando archivo One Piece...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnePieceApp;
