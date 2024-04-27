import { useState, useEffect } from "react";
import { DisabledButton, MiniSecondaryButton, PrimaryButton } from './Buttons.js';
import { useDispatch, useSelector } from "react-redux";
import { getFavourites } from "../redux/favouritesSlice.js";
import PageBlock from "./PageBlock.jsx";
import { setFavLastCall } from "../redux/favLastCallSlice.js";

const FavSearchBar = () => {
    const { favFetchStatus } = useSelector((state) => state.favourites);

    // Handle input data
    const token = useSelector(state => state.login.token);
    const searchValues = useSelector((state) => state.userProfile.searchValues);
    const [inputData, setInputData] = useState({
        doc_num: '',
        pdfrom: '', //YYYYMMDD
        pdto: ''
    })

    // Check di favLastCall. Se è true rieffettua la chiamata.
    // I dati dell'ultima call sono già memorizzati in Redux (si memorizzano ad ogni chiamata)

    const handleInputData = (event) => {
        const { id, value } = event.target;
        if (id === 'pdfrom' || id === 'pdto') {
            const dateValue = value.replace(/-/g, '');
            setInputData(prevInputData => ({
                ...prevInputData,
                [id]: dateValue
            }))
        } else {
            setInputData(prevInputData => ({
                ...prevInputData,
                [id]: value
            }))
        }
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
        const formattedDate = year + month + day;
        return formattedDate;
    }

    // Update date input value
    const [fromValue, setFromValue] = useState(inputData.pdfrom);
    const [toValue, setToValue] = useState(inputData.pdto);
    useEffect(() => {
        const y = (inputData.pdfrom).slice(0, 4);
        const m = (inputData.pdfrom).slice(4, 6);
        const d = (inputData.pdfrom).slice(6, 8);
        const value = `${y}-${m}-${d}`;
        setFromValue(value);
    }, [inputData.pdfrom]);
    useEffect(() => {
        const y = (inputData.pdto).slice(0, 4);
        const m = (inputData.pdto).slice(4, 6);
        const d = (inputData.pdto).slice(6, 8);
        const value = `${y}-${m}-${d}`;
        setToValue(value);
    }, [inputData.pdto]);

    // GET SEARCH FETCH
    const dispatch = useDispatch();
    const getReduxFavourites = () => {
        dispatch(setFavLastCall(inputData))
        dispatch(getFavourites({ favouritesData: inputData, token: token }))
    }

    return (
        <PageBlock width="fit" items="center">

            <i className="fi fi-sr-star text-red-800 text-3xl"></i>
            <h3>Ricerca tra i preferiti</h3>

            <label htmlFor="data">Da:</label>
            <input type="date" id="pdfrom" value={fromValue} onChange={handleInputData} />
            <label htmlFor="data">A:</label>
            <input type="date" id="pdto" value={toValue} onChange={handleInputData} />
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