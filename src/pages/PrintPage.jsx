import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ImageBox from '../components/ImageBox';
import { MiniPrimaryButton } from '../components/Buttons';

const PrintPage = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const componentRef = useRef();
    const { data, openData, formattedDate, showedImage, isNotImage } = location.state;

    // Evito che si possa tornare indietro quando la pagina sta caricando la stampa
    const [isCanBack, setIsCanBack] = useState(false);


    // Avvio la stampa solo quando anche ImageBox ha caricato l'Immagine
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [shouldPrint, setShouldPrint] = useState(false);
    const [printTriggered, setPrintTriggered] = useState(false);

    useEffect(() => {
        // Check if we should trigger print
        if ((isImageLoaded && data && openData && formattedDate && showedImage) || isNotImage) {
            setShouldPrint(true);
        }
    }, [isImageLoaded, data, openData, formattedDate, showedImage, isNotImage]);

    // Add a fallback timer in case image never loads
    useEffect(() => {
        if (showedImage && !isNotImage) {
            const fallbackTimer = setTimeout(() => {
                if (!shouldPrint) {
                    console.log('Image taking too long to load, printing anyway...');
                    setShouldPrint(true);
                }
            }, 5000); // Wait max 5 seconds for image

            return () => clearTimeout(fallbackTimer);
        }
    }, [showedImage, isNotImage, shouldPrint]);

    useEffect(() => {
        if (shouldPrint && !printTriggered) {
            setPrintTriggered(true);
            // Use requestAnimationFrame to ensure DOM is fully rendered
            requestAnimationFrame(() => {
                setTimeout(() => {
                    window.print();
                    setIsCanBack(true);
                }, 500); // Reduced timeout
            });
        }
    }, [shouldPrint, printTriggered]);


    return (
        <div ref={componentRef} className="min-h-screen bg-white p-2 flex flex-col gap-2 overflow-y-auto print:p-0">
            {/* PAGE 1 */}
            <div className="page flex flex-col gap-2">
                <div className="w-48" onClick={() => isCanBack ? navigate(-1) : null}><MiniPrimaryButton text="Torna indietro" /></div>
                <h4 className="text-black mr-8">{data.invention_title}</h4>
                {openData && <p className="font-bold text-sm">Numero di pubblicazione: <Link to={openData.ops_link} target="_blank"><i class="fi fi-rs-link text-red-800"></i> <span className="hover:underline text-red-800">{data.doc_num}</span></Link></p>}
                <div className="flex flex-col border-2 rounded-xl p-3 text-xs">
                    <p>Data di pubblicazione: {formattedDate}</p>
                    <p>Richiedente/i: {data.applicant}</p>
                    <p>Inventore/i: {data.inventor_name}</p>
                </div>
                {data.abstract && <div className="flex flex-col border-2 rounded-xl p-3">
                    <h4>Riassunto:</h4>
                    <p className="text-xs">{data.abstract}</p>
                </div>}
            </div>
            {/* PAGE 2 */}
            <div className="page">
                {
                    showedImage &&
                    <ImageBox image={showedImage} setIsImageLoaded={setIsImageLoaded} isPrinting />
                }
            </div>
        </div>
    )
}

export default PrintPage