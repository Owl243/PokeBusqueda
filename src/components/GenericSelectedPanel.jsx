import { memo } from "react";

const GenericSelectedPanel = memo(({ selected, toggleSelect, generatePDF, generateIMG, onSaveInventory, tcgName }) => {
    if (!selected || selected.length === 0) return null;

    return (
        <div className="position-fixed bottom-0 end-0 p-1" style={{ zIndex: 1050, maxWidth: "320px", width: "100%" }}>
            <div className="card shadow-lg bg-dark text-light border-secondary p-2">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2 border-secondary">
                    <h6 className="mb-0 text-warning">Selección {tcgName}: {selected.length}</h6>
                </div>
                
                <div style={{ maxHeight: "300px", overflowY: "auto", overflowX: "hidden" }}>
                    <div className="mb-3">
                        <div className="d-flex flex-wrap gap-1 mb-2">
                            {selected.map((card, index) => (
                                <span
                                    key={index}
                                    className="badge bg-secondary"
                                    style={{ cursor: "pointer" }}
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
                        <button className="btn btn-outline-warning btn-sm w-100 fw-bold mt-2" onClick={onSaveInventory}>
                            🎒 Guardar En Inventario
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GenericSelectedPanel;
