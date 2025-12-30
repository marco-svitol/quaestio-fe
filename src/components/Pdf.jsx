import { useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Pdf = ({ url, isPrinting }) => {
    const [numPages, setNumPages] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div style={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Document 
                file={{ url: url }}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => console.error('PDF Load Error:', error)}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page 
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={isPrinting ? 700 : 800}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                ))}
            </Document>
        </div>
    )
}

export default Pdf;