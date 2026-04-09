import { memo } from "react";

const formatName = (name) => {
    return name
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const SelectedPanel = memo(({ 
    selected, toggleSelect, generatePDF, 
    selectedTcg, toggleSelectTcg, generateTCGPdf,
    isListMinimized, setIsListMinimized 
}) => {

    const totalSelected = (selected?.length || 0) + (selectedTcg?.length || 0);

    if (totalSelected === 0) return null;

    return (
        <div className="position-fixed bottom-0 end-0 p-1" style={{ zIndex: 1050, maxWidth: "320px", width: "100%" }}>
            <div className="card shadow-lg bg-dark text-light border-secondary p-2">

                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2 border-secondary">
                    <h6 className="mb-0 text-warning">Selección Total: {totalSelected}</h6>
                    <button
                        className="btn btn-sm btn-outline-light border-0"
                        onClick={() => setIsListMinimized(!isListMinimized)}
                    >
                        {isListMinimized ? "▲" : "▼"}
                    </button>
                </div>

                {!isListMinimized && (
                    <div style={{ maxHeight: "300px", overflowY: "auto", overflowX: "hidden" }}>
                        
                        {/* SECCIÓN POKÉDEX */}
                        {selected?.length > 0 && (
                            <div className="mb-3">
                                <h6 className="text-light small border-bottom border-secondary pb-1">Pokédex ({selected.length})</h6>
                                <div className="d-flex flex-wrap gap-1 mb-2">
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
                                <button className="btn btn-success btn-sm w-100" onClick={generatePDF}>
                                    Generar PDF Pokédex
                                </button>
                            </div>
                        )}

                        {/* SECCIÓN TCG */}
                        {selectedTcg?.length > 0 && (
                            <div>
                                <h6 className="text-light small border-bottom border-secondary pb-1">Cartas TCG ({selectedTcg.length})</h6>
                                <div className="d-flex flex-wrap gap-1 mb-2">
                                    {selectedTcg.map((card, index) => (
                                        <span
                                            key={index}
                                            className="badge bg-primary px-2 py-1 text-truncate"
                                            style={{ cursor: "pointer", maxWidth: "100px" }}
                                            onClick={() => toggleSelectTcg(card)}
                                            title="Click para remover"
                                        >
                                            TCG: {formatName(card.name)}
                                        </span>
                                    ))}
                                </div>
                                <button className="btn btn-primary btn-sm w-100 fw-bold" onClick={generateTCGPdf}>
                                    Generar PDF Cartas (4x4)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

export default SelectedPanel;