/**
 * Reusable Pagination component for all TCG apps.
 */
function Pagination({ currentPage, totalPages, setCurrentPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
            <button
                className="btn btn-secondary border-light-subtle shadow-sm"
                disabled={currentPage === 1}
                onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            >
                ← Anterior
            </button>

            <span className="fw-bold text-light bg-dark px-3 py-1 rounded border border-secondary shadow-sm">
                Página <span className="text-warning">{currentPage}</span> de {totalPages}
            </span>

            <button
                className="btn btn-secondary border-light-subtle shadow-sm"
                disabled={currentPage === totalPages}
                onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            >
                Siguiente →
            </button>
        </div>
    );
}

export default Pagination;
