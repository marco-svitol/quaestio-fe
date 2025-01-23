import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ImageBox from '../components/ImageBox';
import { MiniPrimaryButton } from '../components/Buttons';

const PrintPage = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const componentRef = useRef();
    const { data, openData, formattedDate, showedImage } = location.state;

    // Avvio la stampa solo quando anche ImageBox ha caricato l'Immagine
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    useEffect(() => {
        if (isImageLoaded && data && openData && formattedDate && showedImage) {
            setTimeout(() => {
                window.print()
            }, 1000)
        }
    }, [isImageLoaded, data, openData, formattedDate, showedImage])

    return (
        <div ref={componentRef} className="fixed inset-0 bg-white p-8 flex flex-col gap-3">
            <div className="w-48" onClick={() => navigate(-1)}><MiniPrimaryButton text="Torna indietro" /></div>
            <h3 className="text-black mr-8">{data.invention_title}</h3>
            {openData && <p className="font-bold text-sm">Numero di pubblicazione: <Link to={openData.ops_link} target="_blank"><i class="fi fi-rs-link text-red-800"></i> <span className="hover:underline text-red-800">{data.doc_num}</span></Link></p>}
            <div className="flex flex-col border-2 rounded-xl p-3">
                <p className="text-sm">Data di pubblicazione: {formattedDate}</p>
                <p className="text-sm">Richiedente/i: {data.applicant}</p>
                <p className="text-sm">Inventore/i: {data.inventor_name}</p>
            </div>
            {data.abstract && <div className="flex flex-col 2xl:flex-row border-2 rounded-xl p-3 gap-4">
                <div className="w-[500px]">
                    <h4>Riassunto:</h4>
                    <p className="text-sm">{data.abstract}</p>
                </div>
                <div className="w-[500px] text-center">
                    {
                        showedImage &&
                        <ImageBox image={showedImage} setIsImageLoaded={setIsImageLoaded} />
                    }
                </div>
            </div>}
        </div>
    )
}

export default PrintPage