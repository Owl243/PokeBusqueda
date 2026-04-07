function Pagination({ currentPage, totalPages, setCurrentPage }) {
    return (
        <div className="d-flex justify-content-center mb-3 gap-2">
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
    );
}

export default Pagination;