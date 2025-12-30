import { useState, useEffect } from "react";

/**
 * Alternative PDF viewer using embed and object tags as fallback
 * More compatible across different browsers
 */
const PdfEmbed = ({ url, isPrinting }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // Set a timeout to hide loading after a reasonable time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [url]);

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const containerWidth = isPrinting ? '700px' : '800px';
    const containerHeight = isPrinting ? '900px' : '1000px';

    return (
        <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
        }}>
            {isLoading && (
                <div className="text-center py-4 absolute top-0 left-0 right-0">
                    <div className="custom-loader"></div>
                    <p className="mt-2">Caricamento PDF...</p>
                </div>
            )}
            
            {hasError ? (
                <div className="text-center text-red-600 py-4">
                    <p>Impossibile caricare il PDF</p>
                    <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-2 inline-block"
                    >
                        Apri PDF in una nuova scheda
                    </a>
                </div>
            ) : (
                <object
                    data={url}
                    type="application/pdf"
                    width={containerWidth}
                    height={containerHeight}
                    style={{ border: 'none' }}
                    onError={handleError}
                >
                    <embed
                        src={url}
                        type="application/pdf"
                        width={containerWidth}
                        height={containerHeight}
                        style={{ border: 'none' }}
                        onError={handleError}
                    />
                </object>
            )}
        </div>
    );
};

export default PdfEmbed;
