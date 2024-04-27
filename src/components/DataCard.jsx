import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateFavouriteElement } from "../redux/searchSlice";
import { updateFavourite } from "../redux/favouritesSlice";
import NoteModal from "./notes/NoteModal";
import { setNeedTrue } from "../redux/lastCallSlice";
import MiniLoader from "./MiniLoader";

const DataCard = ({ panel, data, token, isEven, click }) => {
    const [formattedDate, setFormattedDate] = useState(null);
    useEffect(() => {
        if (data.date) {
            const y = data.date[0] + data.date[1] + data.date[2] + data.date[3];
            const m = data.date[4] + data.date[5];
            const d = data.date[6] + data.date[7];
            setFormattedDate(`${y} - ${m} - ${d}`);
        }
    }, [data.date])

    // SISTEMARE QUESTO PASSAGGIO, RIFACENDO LA CHIAMATA E ELIMINANDO LA CACHATA IN REDUX DI VIEW
    // handle state and rehydratation
    const [readHistory, setReadHistory] = useState(data.read_history);
    const clickAndReturnState = () => {
        setReadHistory('viewed');
        click();
    }
    useEffect(() => {
        setReadHistory(data.read_history)
    }, [data.read_history])

    // favourite fetch
    const [favouriteFetchStatus, setFavouriteFetchStatus] = useState('idle');
    const [favouriteError, setFavouriteError] = useState(null)
    const dispatch = useDispatch();
    const setOrRemoveFavourite = async () => {
        try {
            setFavouriteFetchStatus('loading');
            console.log('data.bookmark: ', data.bookmark);
            const bookmark = data.bookmark ? 0 : 1;
            console.log('bookmark: ', bookmark)
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/bookmark?doc_num=${data.doc_num}&bookmark=${bookmark}`
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result)
                dispatch(setNeedTrue());
                // Non viene impostato 'idle' nello stato, esso verrà impostato dopo la chiamata di aggiornamento
            } else {
                const resultError = await response.json();
                setFavouriteError(resultError);
                setFavouriteFetchStatus('error');
                console.log('Fetch error: ', resultError)
            }
        } catch (error) {
            console.log('Catch error: ', error)
            setFavouriteError(error);
            setFavouriteFetchStatus('error');
        }
    }

    // Gestisco apertura e chiusura Note per ogni card
    const [isNoteVisible, setIsNoteVisible] = useState(false);

    // Risetto lo status 'idle' dopo la chiamata di aggiornamento
    useEffect(() => {
        setFavouriteFetchStatus('idle')
    }, [data])


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
                        {favouriteFetchStatus === 'idle' && !data.bookmark && <i className="fi fi-rr-star text-red-800 text-lg rounded-lg p-2"></i>}
                        {favouriteFetchStatus === 'idle' && data.bookmark && <i className="fi fi-sr-star text-red-800 text-lg rounded-lg p-2"></i>}
                        {favouriteFetchStatus === 'loading' && <MiniLoader />}
                    </div>
                </div>
                <div>
                    <h4 className="text-xs md:text-left text-stone-400">Note</h4>
                    <div className="flex justify-center items-center h-11 cursor-pointer" onClick={() => setIsNoteVisible(true)}>
                        {data.notes === "" && <i className="fi fi-rr-note-sticky text-red-800 text-lg rounded-lg p-2"></i>}
                        {data.notes !== "" && <i className="fi fi-sr-note-sticky text-red-800 text-lg rounded-lg p-2"></i>}
                    </div>
                </div>
                {isNoteVisible && <NoteModal close={setIsNoteVisible} docNum={data.doc_num} note={data.notes} />}
            </div>
        </div>
    )
}

export default DataCard;
