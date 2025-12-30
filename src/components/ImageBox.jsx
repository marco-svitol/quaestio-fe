import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PdfClean from "./PdfClean";
// Alternative PDF viewers (with browser controls):
// import Pdf from "./Pdf";
// import PdfAlternative from "./PdfAlternative";
// import PdfEmbed from "./PdfEmbed";


const ImageBox = ({ image, setIsImageLoaded, isPrinting }) => {
    const { desc, format, link, nofpages } = image;
    const token = useSelector(state => state.login.token);
    const [fileType, setFileType] = useState(null);
    const [fileData, setFileData] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('idle');
    const getFileData = async () => {
        try {
            setFetchStatus('pending');
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/firstpageClipping?fpcImage=${link}&fpcImageFormat=${format}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const contentType = response.headers.get("Content-Type");
                setFileType(contentType);
                const result = await response.blob();
                const imageUrl = URL.createObjectURL(result);
                setFileData(imageUrl);
                setFetchStatus('succeeded');
            } else {
                const error = await response.json();
                console.log('no: ', error)
                setFetchStatus('rejected');
            }
        } catch (error) {
            console.log('Catch error: ', error)
            setFetchStatus('rejected');
        }
    }

    // Imposto setImagLoaded quando l'immagine è effettivamente visualizzata
    useEffect(() => {
        if (fileData) {
            setIsImageLoaded(true);
        }
        // Also set loaded if fetch failed and we're printing (to avoid infinite loading)
        if (fetchStatus === 'rejected' && isPrinting) {
            setIsImageLoaded(true);
        }
    }, [fileData, fetchStatus, isPrinting, setIsImageLoaded])

    // Fetch at start
    useEffect(() => {
        if (image) {
            console.log('image: ', image)
            getFileData();
        }
    }, [image])

    useEffect(() => {
        console.log("Passing setIsImageLoaded: ", setIsImageLoaded);
    }, [setIsImageLoaded])
    return (
        <div className={`flex flex-col items-center w-fit`}>
            {
                fetchStatus === 'pending' ? (
                    isPrinting ? 
                        <div className="text-center text-gray-500">Caricamento immagine...</div> :
                        <div className={`custom-loader ${isPrinting ? 'my-0' : 'my-4'}`}></div>
                ) : fetchStatus === 'rejected' ? (
                    <div className="text-center text-gray-500 p-4">
                        {!isPrinting && <h4 className="mb-4">Immagine:</h4>}
                        <p>Impossibile caricare l'immagine</p>
                    </div>
                ) : (
                    fetchStatus === 'succeeded' &&
                        fileData &&
                        fileType.includes('image/') ? (
                        <div className={`flex flex-col items-center w-full ${isPrinting ? 'border-0' : 'border-2 border-red-100 py-8'} rounded-3xl`}>
                            {!isPrinting && <h4 className="mb-4">Immagine:</h4>}
                            <img src={fileData} alt="image" className={`${isPrinting ? 'max-h-[800px]' : 'max-w-full h-auto'} rounded-2xl`} />

                        </div>
                    ) : (
                        fetchStatus === 'succeeded' &&
                        fileData &&
                        fileType === 'application/pdf' &&
                        <div className={`flex flex-col items-center ${isPrinting ? 'border-0' : 'border-2 border-red-100 py-8'} rounded-3xl`} style={{ width: '100%', maxWidth: '100%' }}>
                            {!isPrinting && <h4 className="mb-4">Immagine:</h4>}
                            <PdfClean url={fileData} isPrinting={isPrinting} />
                        </div>
                    )
                )
            }
        </div>
    )
}

export default ImageBox;