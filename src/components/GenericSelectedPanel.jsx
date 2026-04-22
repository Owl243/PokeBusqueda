import { memo, useState, useEffect } from "react";

const GenericSelectedPanel = memo(({ selected, toggleSelect, generatePDF, generateIMG, onSaveInventory, tcgName }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-minimizar si no hay elementos seleccionados
    useEffect(() => {
        if (!selected || selected.length === 0) {
            setIsOpen(false);
        }
    }, [selected]);

    if (!selected || selected.length === 0) return null;

    return (
        <>
            {/* Backdrop oscuro */}
            {isOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-black" 
                    style={{ zIndex: 1040, opacity: 0.6 }} 
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Sidebar Desplegable */}
            <div 
                className="position-fixed top-0 end-0 h-100 shadow-lg bg-dark text-light border-start border-secondary d-flex flex-column" 
                style={{ 
                    zIndex: 1050, 
                    width: "320px",
                    maxWidth: "100vw",
                    transform: isOpen ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.3s ease-in-out"
                }}
            >
                <div className="d-flex justify-content-between align-items-center border-bottom p-3 border-secondary">
                    <h5 className="mb-0 text-warning fw-bold">🎒 {tcgName} ({selected.length})</h5>
                    <button
                        className="btn-close btn-close-white"
                        aria-label="Cerrar"
                        onClick={() => setIsOpen(false)}
                    ></button>
                </div>
                
                <div className="p-3 flex-grow-1" style={{ overflowY: "auto", overflowX: "hidden" }}>
                    <div className="mb-3">
                        <div className="d-flex flex-wrap gap-1 mb-3 mt-2">
                            {selected.map((card, index) => (
                                <span
                                    key={index}
                                    className="badge bg-secondary text-truncate"
                                    style={{ cursor: "pointer", maxWidth: "120px" }}
                                    onClick={() => toggleSelect(card)}
                                    title="Click para remover"
                                >
                                    {card.name}
                                </span>
                            ))}
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-success btn-sm w-100 fw-bold" onClick={generatePDF}>
                                PDF
                            </button>
                            <button className="btn btn-info btn-sm w-100 text-white fw-bold" onClick={generateIMG}>
                                IMG (Máx 16)
                            </button>
                        </div>
                        <button className="btn btn-outline-warning btn-sm w-100 fw-bold mt-3" onClick={onSaveInventory}>
                            🎒 Guardar En Inventario
                        </button>
                    </div>
                </div>
            </div>

            {/* Botón flotante FAB para abrir cuando está cerrado */}
            {!isOpen && (
                <button 
                    className="btn btn-warning position-fixed rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-2 border-dark"
                    style={{ bottom: "80px", right: "20px", zIndex: 1030, width: "60px", height: "60px" }}
                    onClick={() => setIsOpen(true)}
                    title="Ver Selección"
                >
                    <span className="fs-4">🎒</span>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                        {selected.length}
                    </span>
                </button>
            )}
        </>
    );
});

export default GenericSelectedPanel;
