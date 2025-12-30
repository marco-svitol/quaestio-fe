import { useState } from "react";

/**
 * Alternative PDF viewer using iframe
 * This approach is more reliable in modals and with blob URLs
 */
const PdfAlternative = ({ url, isPrinting }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        console.error('PDF iframe failed to load');
    };

    return (
        <div style={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {isLoading && (
                <div className="text-center py-4">
                    <div className="custom-loader"></div>
                    <p className="mt-2">Caricamento PDF...</p>
                </div>
            )}
            
            {hasError && (
                <div className="text-center text-red-600 py-4">
                    <p>Impossibile caricare il PDF</p>
                </div>
            )}
            
            <iframe
                src={url}
                style={{
                    width: isPrinting ? '700px' : '800px',
                    height: isPrinting ? '900px' : '1000px',
                    border: 'none',
                    display: isLoading || hasError ? 'none' : 'block'
                }}
                title="PDF Viewer"
                onLoad={handleLoad}
                onError={handleError}
            />
        </div>
    );
};

export default PdfAlternative;
