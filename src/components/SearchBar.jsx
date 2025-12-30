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

    // Track timeframe selection
    const [selectedTimeframe, setSelectedTimeframe] = useState('');

    // Track advanced search visibility
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    const handleInputData = (event) => {
        const { id, value } = event.target;
        setInputData(prevInputData => ({
            ...prevInputData,
            [id]: value
        }))
        
        // If date is manually changed, set timeframe to "Personalizzata"
        if (id === 'pdfrom' || id === 'pdto') {
            setSelectedTimeframe('custom');
        }
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
        // Only repopulate fields if needLastCall is true (meaning we need to restore a previous search)
        if (needLastCall) {
            setInputData({ pa, tecarea, doc_num, pdfrom, pdto });
            if (token && sortStatus) {
                dispatch(getSearch({ searchData: { pa, tecarea, doc_num, pdfrom, pdto }, token: token, sort: sortStatus }));
                dispatch(setNeedFalse());
            }
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
        
        // If advanced search is open, only send doc_num
        const searchData = isAdvancedOpen 
            ? { pa: '', tecarea: '', doc_num: inputData.doc_num, pdfrom: '', pdto: '' }
            : inputData;
        
        dispatch(setLastCall(searchData)); // A last call non passo l'inputData formattato, perché la data in frontend viene gestita in modo canonico
        dispatch(getSearch({ searchData: searchData, token: token, sort: sortStatus }));
    }

    return (
        <PageBlock width="fit" items="center">
            
            {/* Main Layout - Two Columns */}
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left Column - Main Search Fields */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor="pa" className={`text-sm font-medium whitespace-nowrap w-[180px] ${isAdvancedOpen ? 'text-slate-400' : 'text-slate-700'}`}>Richiedente:</label>
                        <select id="pa" onChange={handleInputData} value={inputData.pa} className={`flex-1 h-10 leading-tight ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }} disabled={isAdvancedOpen}>
                            <option value="">---</option>
                            {
                                searchValues && searchValues.applicants.map((element, index) => (
                                    <option key={index} value={element.id}>{element.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label htmlFor="tecarea" className={`text-sm font-medium whitespace-nowrap w-[180px] ${isAdvancedOpen ? 'text-slate-400' : 'text-slate-700'}`}>Area tecnica:</label>
                        <select id="tecarea" onChange={handleInputData} value={inputData.tecarea} className={`flex-1 h-10 leading-tight ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }} disabled={isAdvancedOpen}>
                            <option value="">---</option>
                            {
                                searchValues && searchValues.tecareas.map((element, index) => (
                                    <option key={index} value={element.id}>{element.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Advanced Search Toggle */}
                    {isAdvancedOpen && (
                        <div className="flex items-center gap-2">
                            <label htmlFor="doc_num" className="text-sm font-medium text-slate-700 whitespace-nowrap w-[180px]">Numero di pubblicazione:</label>
                            <input type="text" id="doc_num" onChange={handleInputData} value={inputData.doc_num} className="flex-1 h-10" />
                        </div>
                    )}
                    
                    <button
                        type="button"
                        onClick={() => {
                            if (isAdvancedOpen) {
                                // Clear doc_num when closing advanced search
                                setInputData(prevInputData => ({
                                    ...prevInputData,
                                    doc_num: ''
                                }));
                            }
                            setIsAdvancedOpen(!isAdvancedOpen);
                        }}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-2"
                    >
                        <i className={`fi ${isAdvancedOpen ? 'fi-rr-angle-small-up' : 'fi-rr-angle-small-down'} text-lg`}></i>
                        <span>{isAdvancedOpen ? 'Nascondi' : 'Ricerca per numero di pubblicazione'}</span>
                    </button>
                </div>

                {/* Visual Separator */}
                <div className="hidden lg:block w-px bg-slate-200"></div>

                {/* Right Column - Date Range and Search Button */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                        <div className="flex gap-3 items-center">
                            <div className="flex items-center gap-2 flex-1">
                                <label htmlFor="pdfrom" className={`text-sm font-medium whitespace-nowrap ${isAdvancedOpen ? 'text-slate-400' : 'text-slate-700'}`}>Da:</label>
                                <input type="date" id="pdfrom" value={inputData.pdfrom} onChange={handleInputData} className={`w-full h-10 ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} disabled={isAdvancedOpen} />
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                                <label htmlFor="pdto" className={`text-sm font-medium whitespace-nowrap ${isAdvancedOpen ? 'text-slate-400' : 'text-slate-700'}`}>A:</label>
                                <input type="date" id="pdto" value={inputData.pdto} onChange={handleInputData} className={`w-full h-10 ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`} disabled={isAdvancedOpen} />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <label htmlFor="timeframe" className={`text-sm font-medium ${isAdvancedOpen ? 'text-slate-400' : 'text-slate-700'}`}>Periodo:</label>
                            <select 
                                id="timeframe" 
                                value={selectedTimeframe}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedTimeframe(value);
                                    const days = parseInt(value);
                                    if (days) handleLast(days);
                                }} 
                                className={`px-3 h-10 border border-slate-300 rounded-lg text-sm leading-tight ${isAdvancedOpen ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
                                style={{ width: 'auto', minWidth: '0', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                                disabled={isAdvancedOpen}
                            >
                                <option value="">Seleziona periodo</option>
                                <option value="30">ultimo mese</option>
                                <option value="90">ultimo trimestre</option>
                                <option value="365">ultimo anno</option>
                                <option value="custom">Personalizzata</option>
                            </select>
                            
                            {/* Search Button - Aligned with Timeframe */}
                            <div className="ml-auto">
                                {
                                    fetchStatus === 'pending' ? (
                                        <div className="custom-loader"></div>
                                    ) : (
                                        // If advanced search is open, only check doc_num; otherwise check pa or doc_num
                                        (isAdvancedOpen ? inputData.doc_num !== '' : (inputData.pa !== '' || inputData.doc_num !== ''))
                                        ? (
                                            <PrimaryButton text="Cerca" click={getReduxSearch} />
                                        ) : (
                                            <DisabledButton text="Cerca" />
                                        )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </PageBlock>
    )
}

export default SearchBar;