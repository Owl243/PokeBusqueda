function SelectedPanel({ selected, toggleSelect, generatePDF, isListMinimized, setIsListMinimized }) {

    const formatName = (name) => {
        return name
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (selected.length === 0) return null;

    return (
        <div className="position-fixed bottom-0 end-0 p-1" style={{ zIndex: 1050, maxWidth: "300px" }}>
            <div className="card shadow-lg bg-dark text-light border-secondary p-1">

                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 border-secondary">
                    <h6 className="mb-0">Seleccionados ({selected.length})</h6>
                    <button
                        className="btn btn-sm btn-outline-light border-0"
                        onClick={() => setIsListMinimized(!isListMinimized)}
                    >
                        {isListMinimized ? "▲" : "▼"}
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
                                    onClick={() => toggleSelect(poke)}
                                >
                                    {formatName(poke.name)}
                                </span>
                            ))}
                        </div>

                        <button className="btn btn-success w-100" onClick={generatePDF}>
                            Generar PDF
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default SelectedPanel;