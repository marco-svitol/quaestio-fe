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
    useEffect(() => {
        if (isImageLoaded && data && openData && formattedDate && showedImage) {
            setTimeout(() => {
                window.print();
                setIsCanBack(true);
            }, 1000)
        } else {
            if (isNotImage) {
                window.print();
                setIsCanBack(true);
            }
        }

    }, [isImageLoaded, data, openData, formattedDate, showedImage, isNotImage])


    return (
        <div ref={componentRef} className="fixed inset-0 bg-white p-2 flex flex-col gap-2 overflow-y-auto">
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