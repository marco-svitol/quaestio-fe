import { useState, useEffect } from "react";
import { DisabledButton, MiniSecondaryButton, PrimaryButton } from './Buttons.js';
import { useDispatch, useSelector } from "react-redux";
import { getSearch, setPage } from "../redux/searchSlice.js";
import PageBlock from "./PageBlock.jsx";
import { setLastCall, setNeedFalse, setNeedTrue } from "../redux/lastCallSlice.js";

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
        dispatch(setPage(1));
        dispatch(setLastCall(inputData)); // A last call non passo l'inputData formattato, perché la data in frontend viene gestita in modo canonico
        dispatch(getSearch({ searchData: inputData, token: token, sort: sortStatus }));
    }

    return (
        <PageBlock width="fit" items="center">

            <h3>Ricerca brevetti</h3>
            <label htmlFor="pa">Richiedente (obbligatorio)</label>
            <select id="pa" onChange={handleInputData} value={inputData.pa}>
                <option value="">---</option>
                {
                    searchValues && searchValues.applicants.map((element, index) => (
                        <option key={index} value={element.id}>{element.name}</option>
                    ))
                }
            </select>


            <label htmlFor="tecarea">Area tecnica (opzionale)</label>
            <select id="tecarea" onChange={handleInputData} value={inputData.tecarea}>
                <option value="">---</option>
                {
                    searchValues && searchValues.tecareas.map((element, index) => (
                        <option key={index} value={element.id}>{element.name}</option>
                    ))
                }
            </select>

            {/* Data da */}
            <label htmlFor="data">Da:</label>
            <input type="date" id="pdfrom" value={inputData.pdfrom} onChange={handleInputData} />

            {/* Data a */}
            <label htmlFor="data">A:</label>
            <input type="date" id="pdto" value={inputData.pdto} onChange={handleInputData} />
            <div className="flex xs-custom text-sm gap-1">
                <MiniSecondaryButton text="Ultimo mese" click={() => handleLast(30)} />
                <MiniSecondaryButton text="Ultimo trimestre" click={() => handleLast(90)} />
                <MiniSecondaryButton text="Ultimo anno" click={() => handleLast(365)} />
            </div>

            <label htmlFor="doc_num">Numero di pubblicazione</label>
            <input type="text" id="doc_num" onChange={handleInputData} value={inputData.doc_num} />

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

        </PageBlock>
    )
}

export default SearchBar;