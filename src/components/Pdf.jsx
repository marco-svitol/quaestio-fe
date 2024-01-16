import { useState, useEffect } from "react";
import { Worker, Viewer, PageIndicator } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';

const Pdf = ({ url }) => {
    
    const [totalPages, setTotalPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const handleLoadSuccess = ({ numPages }) => {
        setTotalPages(numPages);
    };


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div className="w-96">
                <Viewer fileUrl={url} onPageChange={(e) => handlePageChange(e.pageIndex)}/>
                {totalPages !== null && (
                    <div>
                        <p>Page {currentPage + 1} of {totalPages}</p>
                    </div>
                )}
            </div>
        </Worker>
    )
}

export default Pdf;