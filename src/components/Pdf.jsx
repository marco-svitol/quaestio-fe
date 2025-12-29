import { useState } from "react";
import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react';

const Pdf = ({ url, isPrinting }) => {
    
    const [totalPages, setTotalPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDocumentLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
    };

    return (
        <RPConfig>
            <RPProvider src={url} onDocumentLoadSuccess={handleDocumentLoadSuccess}>
                <div className={`${isPrinting ? 'w-[700px]' : 'w-96'}`}>
                    <RPDefaultLayout style={{ height: '100%' }}>
                        <RPPages onPageChange={handlePageChange} />
                    </RPDefaultLayout>
                    {totalPages !== null && (
                        <div>
                            <p>Page {currentPage + 1} of {totalPages}</p>
                        </div>
                    )}
                </div>
            </RPProvider>
        </RPConfig>
    )
}

export default Pdf;