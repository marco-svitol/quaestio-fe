import { useState, useEffect } from "react";
import { DisabledButton, MiniSecondaryButton, PrimaryButton } from './Buttons.js';
import { useDispatch, useSelector } from "react-redux";
import { getSearch, setPage } from "../redux/searchSlice.js";
import PageBlock from "./PageBlock.jsx";
import { setLastCall, setNeedFalse } from "../redux/lastCallSlice.js";
import { removeAllDocuments } from '../redux/selectedSlice.js';
import ExportModal from "./ExportModal.jsx";

const SearchBar = () => {
    const { fetchStatus } = useSelector((state) => state.search);

    // Gestione inputData
    const searchValues = useSelector((state) => state.userProfile.searchValues);
    const [inputData, setInputData] = useState({
        pa: '',
        tecarea: '',
        doc_num: '',
        pdfrom: '', //YYYY-MM-DD
        pdto: ''
    })

    const handleInputData = (event) => {
        const { id, value } = event.target;
        setInputData(prevInputData => ({
            ...prevInputData,
            [id]: value
        }))
    }

    // debug
    /* useEffect(() => {
        console.log('inputData: ', inputData)
    }, [inputData]) */

    // Check di lastCall per vedere se c'è una chiamata in memoria da rilanciare
    // Questo passaggio viene effettuato ad ogni montaggio di SearchBar
    const token = useSelector(state => state.login.token);
    const { needLastCall, pa, tecarea, doc_num, pdfrom, pdto } = useSelector(state => state.lastCall);
    const sortStatus = useSelector(state => state.sortStatus);
    useEffect(() => {
        // ricompilo semplicemente i campi uguali all'ultima chiamata
        setInputData({ pa, tecarea, doc_num, pdfrom, pdto });
        if (needLastCall && token && sortStatus) { // getLastSearch fa effettuare l'ultima chiamata
            dispatch(getSearch({ searchData: { pa, tecarea, doc_num, pdfrom, pdto }, token: token, sort: sortStatus }));
            dispatch(setNeedFalse());
        }
    }, [needLastCall, token, sortStatus])

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
    const getReduxSearch = () => {
        dispatch(removeAllDocuments()); // Svuoto la lista di documenti eventualmente selezionati per l'esportazione in selectedSlice
        dispatch(setPage(1));
        dispatch(setLastCall(inputData)); // A last call non passo l'inputData formattato, perché la data in frontend viene gestita in modo canonico
        dispatch(getSearch({ searchData: inputData, token: token, sort: sortStatus }));
    }

    return (
        <PageBlock width="fit" items="center">
            
            {/* Main Layout - Two Columns */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Column - Main Search Fields */}
                <div className="flex-1 space-y-3">
                    <div>
                        <label htmlFor="pa" className="block text-sm font-medium text-slate-700 mb-1">Richiedente (obbligatorio)</label>
                        <select id="pa" onChange={handleInputData} value={inputData.pa} className="w-full">
                            <option value="">---</option>
                            {
                                searchValues && searchValues.applicants.map((element, index) => (
                                    <option key={index} value={element.id}>{element.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div>
                        <label htmlFor="tecarea" className="block text-sm font-medium text-slate-700 mb-1">Area tecnica (opzionale)</label>
                        <select id="tecarea" onChange={handleInputData} value={inputData.tecarea} className="w-full">
                            <option value="">---</option>
                            {
                                searchValues && searchValues.tecareas.map((element, index) => (
                                    <option key={index} value={element.id}>{element.name}</option>
                                ))
                            }
                        </select>
                    </div>

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
                            fetchStatus === 'pending' ? (
                                <div className="custom-loader my-4"></div>
                            ) : (
                                (
                                    inputData.pa !== '' || inputData.doc_num !== '' // capire se rende non obbligatori gli altri
                                ) ? (
                                    <PrimaryButton text="Cerca" click={getReduxSearch} />
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

export default SearchBar;