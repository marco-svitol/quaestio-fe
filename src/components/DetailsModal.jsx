import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ImageBox from "./ImageBox.jsx";

const DetailsModal = ({ data, close }) => {
    const y = (data.date).slice(0, 4);
    const m = (data.date).slice(4, 6);
    const d = (data.date).slice(6, 8);
    const formattedDate = `${d}-${m}-${y}`;

    const token = useSelector(state => state.login.token)

    // Opendoc fetch
    const [openData, setOpenData] = useState(null);
    const getOpenDoc = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/opendoc?doc_num=${data.doc_num}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const openData = await response.json();
                setOpenData(openData);
            } else {
                const errorData = await response.json();
                console.log('opendoc error: ', errorData);
            }
        } catch (error) {
            console.log('Catch error: '.error)
        }
    }

    // Fetchs start
    useEffect(() => {
        console.log(data);
        getOpenDoc();
    }, [])

    // Image showed selection
    const [showedImage, setShowedImage] = useState(null);
    useEffect(() => {
        if (openData) {
            console.log('openData.images_links: ', openData)
            if (Array.isArray(openData.images_links)) {
                console.log('HERE')
                const first = openData.images_links.find(element => element.desc.includes('FirstPageClipping'));
                if (first) {
                    setShowedImage(first)
                } else {
                    const second = openData.images_links.find(element => element.desc.includes('Drawing'));
                    if (second) {
                        setShowedImage(second)
                    }
                }
            }
        }
    }, [openData])
    useEffect(() => {
        console.log('showedImage: ', showedImage);
    }, [showedImage])

    return (
        <>
            <div className="overlay" onClick={close}>
            </div>
            <div className="modal relative">
                <i className="fi fi-sr-circle-xmark cursor-pointer text-3xl text-red-800 absolute top-5 right-5" onClick={close}></i>
                <h3 className="text-black mr-8">{data.invention_title}</h3>
                {openData && <p className="font-bold">Numero di pubblicazione: <Link to={openData.ops_link} target="_blank"><i class="fi fi-rs-link text-red-800"></i> <span className="hover:underline text-red-800">{data.doc_num}</span></Link></p>}
                <div className="flex flex-col border-2 rounded-xl p-3">
                    <p className="text-sm">Data di pubblicazione: {formattedDate}</p>
                    <p className="text-sm">Richiedente/i: {data.applicant}</p>
                    <p className="text-sm">Inventore/i: {data.inventor_name}</p>
                </div>
                {data.abstract && <div className="flex flex-col 2xl:flex-row border-2 rounded-xl p-3 gap-4">
                    <div className="w-[500px]">
                        <h4>Riassunto:</h4>
                        <p>{data.abstract}</p>
                    </div>
                    <div className="w-[500px] text-center">
                        {
                            showedImage &&
                            <ImageBox image={showedImage} />
                        }
                    </div>
                </div>}
            </div>
        </>
    )
}

export default DetailsModal;