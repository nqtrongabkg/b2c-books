import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const renderPageNumbers = () => {
        let pages = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageClick(i)}>
                            {i}
                        </button>
                    </li>
                );
            }
        } else {
            pages.push(
                <li key={1} className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageClick(1)}>
                        1
                    </button>
                </li>
            );

            if (currentPage > 3) {
                pages.push(
                    <li key="start-ellipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageClick(i)}>
                            {i}
                        </button>
                    </li>
                );
            }

            if (currentPage < totalPages - 2) {
                pages.push(
                    <li key="end-ellipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                    </li>
                );
            }

            pages.push(
                <li key={totalPages} className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageClick(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }
        return pages;
    };

    return (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handlePrevPage} disabled={currentPage === 1}>Trang trước</button>
                </li>
                {renderPageNumbers()}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={handleNextPage} disabled={currentPage === totalPages}>Trang tiếp theo</button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
