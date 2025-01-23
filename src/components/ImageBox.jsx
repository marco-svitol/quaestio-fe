import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Pdf from "./Pdf";

const ImageBox = ({ image, setIsImageLoaded }) => {
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
    }, [fileData])

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
        <div className="flex flex-col items-center">
            {
                fetchStatus === 'pending' ? (
                    <div className="custom-loader my-4"></div>
                ) : (
                    fetchStatus === 'succeeded' &&
                        fileData &&
                        fileType.includes('image/') ? (
                        <div className="flex flex-col items-center mb-16 w-full border-2 border-red-100 py-8 rounded-3xl">
                            <h4 className="mb-4">Immagine:</h4>
                            <img src={fileData} alt="image" className="w-96 rounded-2xl" />
                        </div>
                    ) : (
                        fetchStatus === 'succeeded' &&
                        fileData &&
                        fileType === 'application/pdf' &&
                        <div className="flex flex-col items-center mb-16 w-full border-2 border-red-100 py-8 rounded-3xl">
                            <h4 className="mb-4">Immagine:</h4>
                            <Pdf url={fileData} />
                        </div>
                    )
                )
            }
        </div>
    )
}

export default ImageBox;