import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleDocumentStatus, updateFavouriteElement } from "../redux/searchSlice";
import { getFavourites, updateDocumentStatus, updateFavourite } from "../redux/favouritesSlice";
import NoteModal from "./notes/NoteModal";
import { setNeedTrue } from "../redux/lastCallSlice";
import { setFavNeedTrue } from '../redux/favLastCallSlice';
import MiniLoader from "./MiniLoader";
import FavouriteModal from "./FavouriteModal";
import FavouriteSettingModal from "./FavouriteSettingModal";
import { addDocuments, removeDocument, setLastChecked } from "../redux/selectedSlice";
import ExportModal from "./ExportModal";
import getFormattedDate from "./utils/getFormattedDate";

const DataCard = ({ data, token, isEven, click, panel }) => {
    const { sectionNumber } = useSelector(state => state.section);
    const [formattedDate, setFormattedDate] = useState(null);
    useEffect(() => {
        if (data.date) {
            setFormattedDate(getFormattedDate(data.date));
        }
    }, [data.date])

    // Gestisco l'apertura della modale di favourite
    const [isFavModal, setIsFavModal] = useState(false);
    // favourite fetch
    const [favouriteFetchStatus, setFavouriteFetchStatus] = useState('idle');
    const [favouriteError, setFavouriteError] = useState(null)
    const { pagedData } = useSelector(state => state.search)
    const { favPagedData } = useSelector(state => state.favourites)
    const dispatch = useDispatch();
    const setOrChangeOrRemoveFavourite = async (categoryId) => {
        // la seguente condizione imposta un aggiunta, una edit o una delete
        let bookmark = data.bookmark === false ? categoryId : categoryId || 0;
        try {
            setFavouriteFetchStatus('loading');
            const url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/bookmark?doc_num=${data.doc_num}&bookmark=${bookmark}`
            console.log('here url: ', url);
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
                if (pagedData) {
                    dispatch(setNeedTrue());
                }
                dispatch(setFavNeedTrue());
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

    // Gestisco l'apertura della modale di favourite in sezione Preferiti
    const [isFavSettingModal, setIsFavSettingModal] = useState(false);

    // Gestisco il cambio di stato (aggiornando il documento singolo in Redux: sia 'search' sia 'favourites' se presente)
    const { isDocumentStatusStatus, pageSize } = useSelector(state => state.search);
    const sortStatus = useSelector(state => state.sortStatus);

    useEffect(() => {
        if (isDocumentStatusStatus === 'succeeded') {
            // Se sono nella sezione preferiti
            if (sectionNumber === 1) {
                dispatch(getFavourites({
                    favouritesData: {
                        doc_num: '',
                        pdfrom: '',
                        pdto: ''
                    }, token, sort: sortStatus, pageSize: pageSize
                }))
            }
        }
    }, [isDocumentStatusStatus])
    const setStatus = (newStatus) => {
        dispatch(toggleDocumentStatus({ token, familyId: data.familyid, newStatus }))
    }

    // Gestisco la selezione della card, aggiornando Redux
    // Gestisco anche la selezione multipla alla pressione del tasto SHIFT
    const { selectedDocuments, lastChecked, isShiftPressed } = useSelector(state => state.selected);
    const handleSelect = (event) => {
        const { checked } = event.target
        if (checked) {
            if (isShiftPressed && lastChecked) { // Selezione multipla
                const totalDocuments = sectionNumber === 0 ? [...pagedData] : [...favPagedData];
                const flatData = totalDocuments.map(page => page.map(document => document.familyid)).flat(); // familyid totali della ricerca
                const firstIndex = flatData.indexOf(lastChecked);
                const secondIndex = flatData.indexOf(data.familyid);
                const ascendingOrderIndex = firstIndex < secondIndex ? [firstIndex, secondIndex] : [secondIndex, firstIndex];
                const selection = flatData.slice(ascendingOrderIndex[0], ascendingOrderIndex[1] + 1);
                dispatch(addDocuments(selection));
            } else { // Selezione singola
                dispatch(addDocuments([data.familyid]));
                dispatch(setLastChecked(data.familyid));
            }
        } else {
            dispatch(removeDocument(data.familyid));
            dispatch(setLastChecked(null));
        }
    }

    return (
        <div className="group w-full flex justify-center items-center gap-4 p-2">

            {/* Select */}
            <div className="relative group">
                <input type="checkbox" value={data.familyid} className="accent-red-800" onClick={handleSelect} checked={selectedDocuments.includes(data.familyid) ? true : false} />
                <div className={!selectedDocuments.length > 0 && 'absolute inset-0 bg-white hidden xl:block xl:group-hover:hidden'}></div>
            </div>
            {/* Card data */}
            <div className={`flex flex-col md:flex-col xl:flex-row text-[8pt] border ${selectedDocuments.includes(data.familyid) ? 'border-red-800 border bg-red-50' : (isEven ? 'bg-stone-50 border-red-50' : 'bg-stone-100 border-red-100')} hover:border-red-800 w-full xl:w-fit px-4 py-2 gap-4 rounded-3xl relative ${data.read_history === "new" && 'font-bold'}`}>
                {/* Numero documento */}
                <div className="w-full sm:w-[200px] xl:w-[160px]">
                    {/* <h6>{index}</h6> */}
                    <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Numero</h4>
                    <div className="p-2 h-11 flex gap-2 items-center">
                        <div className="border rounded-lg border-stone-300 p-2 w-[40px] h-11 flex justify-center cursor-pointer hover:bg-stone-200" onClick={click}><i className="fi fi-rr-file-circle-info text-red-800 text-lg pt-0.5"></i></div>
                        <div>{data.doc_num}</div>
                    </div>
                </div>

                {/* Titolo documento */}
                <div className="w-full xl:w-[300px] 2xl:w-[500px]">
                    <h4 className="block xl:hidden text-xs text-left xl:text-center ml-2 text-stone-400">Titolo</h4>
                    <div className="p-2 text-left h-11 overflow-hidden flex items-start">{data.invention_title}</div>
                </div>

                {/* Other data */}
                <div className="flex xs-customjustify-start xl:justify-end gap-1 w-full xl:w-[240px]">
                    <div className="w-full">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Data</h4>
                        {data.date && <div className="p-2 h-11 flex items-center w-full">{formattedDate}</div>}
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Stato</h4>
                        <div className="border rounded-lg border-stone-300 p-2 h-11 flex justify-center items-center cursor-pointer w-[40px] hover:bg-stone-200">
                            {
                                data && data.read_history === "viewed" ? (
                                    <i class="fi fi-rr-envelope-open-text text-red-800 text-lg rounded-lg pt-1" onClick={() => setStatus("new")}></i>
                                ) : (
                                    <i class="fi fi-rr-envelope text-red-800 text-lg rounded-lg pt-1" onClick={() => setStatus("viewed")}></i>
                                )
                            }
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Preferiti</h4>
                        <div className="border rounded-lg border-stone-300 flex justify-center items-center h-11 cursor-pointer w-[40px] hover:bg-stone-200">
                            {!data.bookmark && <i className="fi fi-rr-star text-red-800 text-lg rounded-lg pt-1" onClick={sectionNumber === 0 ? setIsFavModal : setIsFavSettingModal}></i>}
                            {data.bookmark && <i className="fi fi-sr-star text-red-800 text-lg rounded-lg pt-1" onClick={sectionNumber === 0 ? () => setOrChangeOrRemoveFavourite(null) : setIsFavSettingModal}></i>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Note</h4>
                        <div className="border rounded-lg border-stone-300 flex justify-center items-center h-11 cursor-pointer w-[40px] hover:bg-stone-200" onClick={() => setIsNoteVisible(true)}>
                            {!data.notes && <i className="fi fi-rr-note-sticky text-red-800 text-lg rounded-lg pt-1"></i>}
                            {data.notes && <i className="fi fi-sr-note-sticky text-red-800 text-lg rounded-lg pt-1"></i>}
                        </div>
                    </div>
                    {isFavModal && <FavouriteModal close={setIsFavModal} isBookmark={data.bookmark} setFavouriteFetch={setOrChangeOrRemoveFavourite} />}
                    {isFavSettingModal && <FavouriteSettingModal close={setIsFavSettingModal} categoryId={data.bmfolderid} setFavouriteFetch={setOrChangeOrRemoveFavourite} />}
                    {isNoteVisible && <NoteModal close={setIsNoteVisible} docNum={data.doc_num} familyId={data.familyid} note={data.notes} />}
                </div>
            </div>
        </div>

    )
}

export default DataCard;