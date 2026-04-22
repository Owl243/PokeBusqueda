import { memo, useEffect } from "react";

const formatName = (name) => {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const SelectedPanel = memo(({ 
    selected, toggleSelect, generatePDF, generateIMG,
    selectedTcg, toggleSelectTcg, generateTCGPdf, generateTCGIMG, onSaveTcgInventory,
    isListMinimized, setIsListMinimized, activeTab 
}) => {

    const totalSelected = (selected?.length || 0) + (selectedTcg?.length || 0);

    // Auto-minimizar si no hay nada (opcional)
    useEffect(() => {
        if (totalSelected === 0 && !isListMinimized) {
            setIsListMinimized(true);
        }
    }, [totalSelected, isListMinimized, setIsListMinimized]);

    if (totalSelected === 0) return null;

    return (
        <>
            {/* Backdrop oscuro cuando está abierto */}
            {!isListMinimized && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-black" 
                    style={{ zIndex: 1040, opacity: 0.6 }} 
                    onClick={() => setIsListMinimized(true)}
                ></div>
            )}

            {/* Sidebar Desplegable */}
            <div 
                className="position-fixed top-0 end-0 h-100 shadow-lg bg-dark text-light border-start border-secondary d-flex flex-column" 
                style={{ 
                    zIndex: 1050, 
                    width: "320px", 
                    maxWidth: "100vw",
                    transform: isListMinimized ? "translateX(100%)" : "translateX(0)",
                    transition: "transform 0.3s ease-in-out",
                }}
            >
                {/* Cabecera del Sidebar */}
                <div className="d-flex justify-content-between align-items-center border-bottom p-3 border-secondary">
                    <h5 className="mb-0 text-warning fw-bold">🎒 Selección ({totalSelected})</h5>
                    <button
                        className="btn-close btn-close-white"
                        aria-label="Cerrar"
                        onClick={() => setIsListMinimized(true)}
                    ></button>
                </div>

                {/* Contenido (Scrollable) */}
                <div className="p-3 flex-grow-1" style={{ overflowY: "auto", overflowX: "hidden" }}>
                    
                    {/* SECCIÓN POKÉDEX */}
                    {activeTab === 'pokedex' && selected?.length > 0 && (
                        <div className="mb-4">
                            <h6 className="text-light small border-bottom border-secondary pb-1">Pokédex ({selected.length})</h6>
                            <div className="d-flex flex-wrap gap-1 mb-3 mt-2">
                                {selected.map((poke, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-secondary text-capitalize"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => toggleSelect(poke)}
                                        title="Click para remover"
                                    >
                                        {formatName(poke.name)}
                                    </span>
                                ))}
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm w-100" onClick={generatePDF}>
                                    Generar PDF
                                </button>
                                <button className="btn btn-info btn-sm w-100 text-white fw-bold" onClick={generateIMG}>
                                    Generar IMG (Máx 16)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN TCG */}
                    {activeTab === 'tcg' && selectedTcg?.length > 0 && (
                        <div>
                            <h6 className="text-light small border-bottom border-secondary pb-1">Cartas TCG ({selectedTcg.length})</h6>
                            <div className="d-flex flex-wrap gap-1 mb-3 mt-2">
                                {selectedTcg.map((card, index) => (
                                    <span
                                        key={index}
                                        className="badge bg-primary px-2 py-1 text-truncate"
                                        style={{ cursor: "pointer", maxWidth: "120px" }}
                                        onClick={() => toggleSelectTcg(card)}
                                        title="Click para remover"
                                    >
                                        TCG: {formatName(card.name)}
                                    </span>
                                ))}
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm w-100 fw-bold" onClick={generateTCGPdf}>
                                    Generar PDF Cartas
                                </button>
                                <button className="btn btn-info btn-sm w-100 text-white fw-bold" onClick={generateTCGIMG}>
                                    Generar IMG (Máx 16)
                                </button>
                            </div>
                            <button className="btn btn-outline-warning btn-sm w-100 fw-bold mt-3" onClick={onSaveTcgInventory}>
                                🎒 Guardar en Inventario
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) para abrir */}
            {isListMinimized && (
                <button 
                    className="btn btn-warning position-fixed rounded-circle shadow-lg d-flex align-items-center justify-content-center border border-2 border-dark"
                    style={{ bottom: "80px", right: "20px", zIndex: 1030, width: "60px", height: "60px" }}
                    onClick={() => setIsListMinimized(false)}
                    title="Ver Selección"
                >
                    <span className="fs-4">🎒</span>
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                        {totalSelected}
                    </span>
                </button>
            )}
        </>
    );
});

export default SelectedPanel;