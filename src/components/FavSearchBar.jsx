import { useState, useEffect } from "react";
import { DisabledButton, MiniSecondaryButton, PrimaryButton } from './Buttons.js';
import { useDispatch, useSelector } from "react-redux";
import { getFavourites, setFavPage } from "../redux/favouritesSlice.js";
import PageBlock from "./PageBlock.jsx";
import { setFavLastCall, setFavNeedFalse } from "../redux/favLastCallSlice.js";

const FavSearchBar = () => {
    const { favFetchStatus } = useSelector((state) => state.favourites);

    // Handle input data
    const token = useSelector(state => state.login.token);
    const searchValues = useSelector((state) => state.userProfile.searchValues);
    const [inputData, setInputData] = useState({
        doc_num: '',
        pdfrom: '',
        pdto: ''
    })

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

            <i className="fi fi-sr-star text-red-800 text-3xl"></i>
            <h3>Ricerca tra i preferiti</h3>

            <label htmlFor="data">Da:</label>
            <input type="date" id="pdfrom" value={inputData.pdfrom} onChange={handleInputData} />
            <label htmlFor="data">A:</label>
            <input type="date" id="pdto" value={inputData.pdto} onChange={handleInputData} />
            <div className="flex xs-custom text-sm gap-1">
                <MiniSecondaryButton text="Ultimo mese" click={() => handleLast(30)} />
                <MiniSecondaryButton text="Ultimo trimestre" click={() => handleLast(90)} />
                <MiniSecondaryButton text="Ultimo anno" click={() => handleLast(365)} />
            </div>

            <label htmlFor="doc_num">Numero di pubblicazione</label>
            <input type="text" id="doc_num" onChange={handleInputData} />

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

        </PageBlock>
    )
}

export default FavSearchBar;