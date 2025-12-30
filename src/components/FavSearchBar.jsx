import { useState, useEffect } from "react";
import { DisabledButton, MiniSecondaryButton, PrimaryButton } from './Buttons.js';
import { useDispatch, useSelector } from "react-redux";
import { getCategory, getFavourites, setFavPage, setCategory } from "../redux/favouritesSlice.js";
import PageBlock from "./PageBlock.jsx";
import { setFavLastCall, setFavNeedFalse } from "../redux/favLastCallSlice.js";

const FavSearchBar = () => {
    const { favFetchStatus } = useSelector((state) => state.favourites);

    // Handle input data
    const token = useSelector(state => state.login.token);
    const searchValues = useSelector((state) => state.userProfile.searchValues);
    const { bmfolders } = useSelector((state) => state.userProfile);
    const { favCategory } = useSelector((state) => state.favourites);
    const [inputData, setInputData] = useState({
        doc_num: '',
        pdfrom: '',
        pdto: ''
    })

    // Handle category selection
    const handleCategorySelect = (event) => {
        const value = event.target.value === 'null' ? null : event.target.value;
        const name = event.target.options[event.target.selectedIndex].getAttribute('data-name');
        if (value === null) {
            dispatch(setCategory({
                id: null,
                name: null
            }))
        } else {
            dispatch(setCategory({
                id: value,
                name: name
            }))
        }
    }

    // debug
    /* useEffect(() => {
        console.log('inputData: ', inputData)
    }, [inputData]) */

    // Check di favLastCall. Se è true rieffettua la chiamata.
    // I dati dell'ultima call sono già memorizzati in Redux (si memorizzano ad ogni chiamata)
    const { favNeedLastCall, doc_num, pdfrom, pdto } = useSelector(state => state.favLastCall);
    const sortStatus = useSelector(state => state.sortStatus);
    const { pageSize } = useSelector(state => state.search);
        
    useEffect(() => {
        // Ricompilo i campi uguali all'ultima chiamata
        setInputData({ doc_num, pdfrom, pdto });
        if (favNeedLastCall && token && sortStatus) { // Fa effetturare l'ultima chiamata
            dispatch(getFavourites({ favouritesData: { doc_num, pdfrom, pdto }, token: token, sort: sortStatus, pageSize: pageSize }));
            dispatch(setFavNeedFalse());
        }
        // Eventuale logica per rieffettuare una chiamata
    }, [favNeedLastCall, token, sortStatus])

    const handleInputData = (event) => {
        const { id, value } = event.target;
        setInputData(prevInputData => ({
            ...prevInputData,
            [id]: value
        }))
    }

    // Preset date 
    const handleLast = (days) => {
        const todayDate = new Date();
        const pastDate = new Date();
        pastDate.setDate(todayDate.getDate() - days);
        setInputData(prevInputData => ({
            ...prevInputData,
            pdfrom: formatDate(pastDate),
            pdto: formatDate(todayDate)
        }))

    }

    const formatDate = (date) => {
        const year = (date.getFullYear().toString());
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = (date.getDate()).toString().padStart(2, '0');
        const formattedDate = year + "-" + month + "-" + day;
        return formattedDate;
    }

    // GET SEARCH FETCH
    const dispatch = useDispatch();
    const getReduxFavourites = () => {
        dispatch(setFavPage(1));
        dispatch(setFavLastCall(inputData)); // A last call non passo l'inputData formattato, perché la data in frontend viene gestita in modo canonico
        dispatch(getFavourites({ favouritesData: inputData, token: token, sort: sortStatus, pageSize: pageSize }));
    }

    return (
        <PageBlock width="fit" items="center">

            <div className="flex items-center gap-2 mb-4">
                <i className="fi fi-sr-star text-red-800 text-3xl"></i>
                <h3>Ricerca tra i preferiti</h3>
            </div>

            {/* Main Layout - Two Columns */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Column - Category and Document Number */}
                <div className="flex-1 space-y-3">
                    {/* Category Selection */}
                    {bmfolders && (
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Categoria di preferiti</label>
                            <select id="category" onChange={handleCategorySelect} className="w-full">
                                <option key={0} value={null}>Tutti</option>
                                {
                                    bmfolders && bmfolders.map((element, index) => {
                                        return <option key={index + 1} value={element.id} data-name={element.name}>{element.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="doc_num" className="block text-sm font-medium text-slate-700 mb-1">Numero di pubblicazione</label>
                        <input type="text" id="doc_num" onChange={handleInputData} value={inputData.doc_num} className="w-full" />
                    </div>
                </div>

                {/* Visual Separator */}
                <div className="hidden lg:block w-px bg-slate-200"></div>

                {/* Right Column - Date Range and Search Button */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex gap-3 items-center">
                            <div className="flex-1">
                                <label htmlFor="pdfrom" className="block text-sm font-medium text-slate-700 mb-1">Da:</label>
                                <input type="date" id="pdfrom" value={inputData.pdfrom} onChange={handleInputData} className="w-full" />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="pdto" className="block text-sm font-medium text-slate-700 mb-1">A:</label>
                                <input type="date" id="pdto" value={inputData.pdto} onChange={handleInputData} className="w-full" />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">Ultimo:</span>
                            <div className="flex flex-wrap gap-2">
                                <MiniSecondaryButton text="mese" click={() => handleLast(30)} />
                                <MiniSecondaryButton text="trimestre" click={() => handleLast(90)} />
                                <MiniSecondaryButton text="anno" click={() => handleLast(365)} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Search Button - Bottom Right */}
                    <div className="flex justify-end mt-3">
                        {
                            favFetchStatus === 'pending' ? (
                                <div className="custom-loader my-4"></div>
                            ) : (
                                (
                                    inputData.pa !== '' || inputData.doc_num !== '' // capire se rende non obbligatori gli altri
                                ) ? (
                                    <PrimaryButton text="Cerca" click={getReduxFavourites} />
                                ) : (
                                    <DisabledButton text="Cerca" />
                                )
                            )
                        }
                    </div>
                </div>
            </div>

        </PageBlock>
    )
}

export default FavSearchBar;