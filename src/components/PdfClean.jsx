import { useState, useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker using local package
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

/**
 * Clean PDF viewer that renders pages directly to canvas
 * No browser controls, just the PDF content
 */
const PdfClean = ({ url, isPrinting }) => {
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const canvasRefs = useRef([]);

    // Load PDF document
    useEffect(() => {
        if (!url) return;

        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument(url);
        
        loadingTask.promise
            .then((pdf) => {
                setPdfDocument(pdf);
                setNumPages(pdf.numPages);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Error loading PDF:', err);
                setError('Impossibile caricare il PDF');
                setIsLoading(false);
            });

        return () => {
            if (pdfDocument) {
                pdfDocument.destroy();
            }
        };
    }, [url]);

    // Render PDF pages to canvas
    useEffect(() => {
        if (!pdfDocument || !numPages) return;

        const renderPages = async () => {
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                try {
                    const page = await pdfDocument.getPage(pageNum);
                    const canvas = canvasRefs.current[pageNum - 1];
                    
                    if (!canvas) continue;

                    const context = canvas.getContext('2d');
                    const viewport = page.getViewport({ scale: isPrinting ? 1.5 : 1.8 });

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    await page.render(renderContext).promise;
                } catch (err) {
                    console.error(`Error rendering page ${pageNum}:`, err);
                }
            }
        };

        renderPages();
    }, [pdfDocument, numPages, isPrinting]);

    if (isLoading) {
        return (
            <div className="text-center py-4">
                <div className="custom-loader"></div>
                <p className="mt-2">Caricamento PDF...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 py-4">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
        }}>
            {numPages && Array.from({ length: numPages }, (_, index) => (
                <canvas
                    key={`page_${index + 1}`}
                    ref={(el) => (canvasRefs.current[index] = el)}
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block'
                    }}
                />
            ))}
        </div>
    );
};

export default PdfClean;
