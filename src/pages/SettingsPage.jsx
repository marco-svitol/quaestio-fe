import PageBlock from "../components/PageBlock";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { setSection } from "../redux/sectionSlice";
import { PrimaryButton } from "../components/Buttons";
import { useNavigate } from 'react-router-dom';
import { setPageSize } from "../redux/searchSlice";
import { setNeedTrue } from "../redux/lastCallSlice";

const SettingsPage = () => {
    const dispatch = useDispatch();
    // set settings
    const { pageSize } = useSelector(state => state.search);
    const [isError, setIsError] = useState(false);
    const [inputData, setInputData] = useState({
        pageSize: pageSize
    })
    const handleInputData = (event) => {
        const { id, value } = event.target;
        let fixedValue;
        if (id === "pageSize") {
            let valueNumber = parseInt(value);
            fixedValue = valueNumber;
            if (valueNumber < 0) {
                fixedValue = 1
            }
        }
        setInputData(prevData => ({
            ...prevData,
            [id]: fixedValue
        }))
    }

    // Send new settings
    const navigate = useNavigate();
    const sendNewSettings = () => {
        if (inputData.pageSize) {
            dispatch(setPageSize(inputData.pageSize))
        } else {
            setIsError(true);
        }
        dispatch(setSection(0));
        dispatch(setNeedTrue);
        navigate("/");
    }

    useEffect(() => {
        console.log('inputData: ', inputData)
    }, [inputData])

    return (
        <div className="main-container settings">
            <PageBlock width="full" items="start">
                <div><i class="fi fi-rr-settings-sliders text-3xl"></i></div>
                <h3>Gestione utente</h3>

                {/* Page size */}
                <div className="flex items-center gap-2">
                    <label htmlFor="pageSize">Quantità di elementi per pagina:</label>
                    {pageSize && <input type="number" id="pageSize" placeholder={inputData.pageSize} className="w-16" onChange={handleInputData} />}
                </div>
                
                {/* Cambio password */}
                <div className="flex items-center gap-2">
                    <label htmlFor="changePassword">Modifica password (disabled):</label>
                    {pageSize && <input type="password" id="changePassword" />}
                </div>


                {/* Save settings */}
                <PrimaryButton text="Salva impostazioni" click={sendNewSettings} />
            </PageBlock>
        </div>
    )
}

export default SettingsPage;