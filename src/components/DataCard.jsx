import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateFavouriteElement } from "../redux/searchSlice";
import { updateFavourite } from "../redux/favouritesSlice";
import NoteModal from "./notes/NoteModal";

const DataCard = ({ panel, index, data, token, isEven, click }) => {
    const [formattedDate, setFormattedDate] = useState(null);
    useEffect(() => {
        if (data.date) {
            const y = data.date[0] + data.date[1] + data.date[2] + data.date[3];
            const m = data.date[4] + data.date[5];
            const d = data.date[6] + data.date[7];
            setFormattedDate(`${y} - ${m} - ${d}`);
        }
    }, [data.date])

    // handle state and rehydratation
    const [readHistory, setReadHistory] = useState(data.read_history);
    const clickAndReturnState = () => {
        setReadHistory('viewed');
        click();
    }
    useEffect(() => {
        setReadHistory(data.read_history)
    }, [data.read_history])

    // handle favourite icon rehydratation
    const [localBookmark, setLocalBookmark] = useState(data.bookmark);

    useEffect(() => {
        setLocalBookmark(data.bookmark);
    }, [data.bookmark])

    // favourite fetch
    const dispatch = useDispatch();
    const setOrRemoveFavourite = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/bookmark?doc_num=${data.doc_num}&bookmark=${!localBookmark ? 1 : 0}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result) // DA QUESTO PUNTO IN GIù E' BENE ESEGUIRE LA RICERCA DELL'ELEMENTO DA AGGIORNARE IN REDUX NON CON L'ATTRIBUZIONE DI INDEX MA COL NUMERO DOCUMENTO
                const reduxUpdate = { index: index, bookmark: !localBookmark } // Si passa a Redux l'indice assoluto per l'oggetto e il bookmark aggiornato
                if (panel === "search") {
                    console.log('search-panel');
                    dispatch(updateFavouriteElement(reduxUpdate));
                    // Aggiorna anche il redux dei favourites
                } else if (panel === "fav") {
                    console.log('fav-panel');
                    dispatch(updateFavourite(reduxUpdate))
                }
                setLocalBookmark(!localBookmark);
            } else {
                const resultError = await response.json();
                console.log('Fetch error: ', resultError)
            }
        } catch (error) {
            console.log('Catch error: ', error)
        }
    }

    // Gestisco la visualizzazione della nota per ogni card
    const [isNoteShow, setIsNoteShow] = useState(false);
    useEffect(() => {
        console.log(isNoteShow)
    }, [isNoteShow])
    return (
        <div className={`flex flex-col md:flex-col xl:flex-row text-[8pt] border ${isEven ? 'bg-stone-50 border-red-50' : 'bg-stone-100 border-red-100'} hover:border-red-800 w-full p-4 gap-4 rounded-3xl relative`}>

            {/* Numero documento */}
            <div className="w-full sm:w-[200px]">
                {/* <h6>{index}</h6> */}
                <h4 className="text-xs md:text-left text-stone-400">Numero</h4>
                <div className="border rounded-lg border-stone-300 p-2 h-11 flex gap-2 items-center">
                    <i className="fi fi-rr-file-circle-info text-red-800 text-lg cursor-pointer" onClick={clickAndReturnState}></i> {data.doc_num}
                </div>
            </div>

            {/* Other data */}
            <div className="w-full flex xs-custom sm:flex-row justify-between gap-4">
                <div className="w-full sm:w-[300px] md:w-[500px] lg:w-[250px] xl:w-[300px] 2xl:w-[500px]">
                    <h4 className="text-xs text-center md:text-left lg:text-center xl:text-left ml-2 text-stone-400">Titolo</h4>
                    <div className="border rounded-lg border-stone-300 p-2 text-center md:text-left lg:text-center xl:text-left h-11 overflow-hidden flex items-start">{data.invention_title}</div>
                </div>
                <div>
                    <h4 className="text-xs md:text-left text-stone-400">Data</h4>
                    {data.date && <div className="border rounded-lg border-stone-300 p-2 h-11 flex items-center">{formattedDate}</div>}
                </div>
                <div>
                    <h4 className="text-xs md:text-left text-stone-400">Stato</h4>
                    <div className="border rounded-lg border-stone-300 p-2 h-11 flex items-center">{readHistory}</div>
                </div>
                <div>
                    <h4 className="text-xs md:text-left text-stone-400">Preferiti</h4>
                    <div className="flex justify-center items-center h-11 cursor-pointer" onClick={setOrRemoveFavourite}>
                        {!localBookmark && <i className="fi fi-rr-star text-red-800 text-lg rounded-lg p-2"></i>}
                        {localBookmark && <i className="fi fi-sr-star text-red-800 text-lg rounded-lg p-2"></i>}
                    </div>
                </div>
                {<div>
                    <h4 className="text-xs md:text-left text-stone-400">Note</h4>
                    <div className="flex justify-center items-center h-11 cursor-pointer" onClick={() => setIsNoteShow(true)}>
                        <i className="fi fi-rr-note-sticky text-red-800 text-lg rounded-lg p-2"></i>
                        {isNoteShow && <NoteModal docNum={data.doc_num} setIsNoteShow={setIsNoteShow} />}
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default DataCard;
