import PageBlock from "../components/PageBlock";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { setSection } from "../redux/sectionSlice";
import { MiniPrimaryButton, PrimaryButton } from "../components/Buttons";
import { useNavigate } from 'react-router-dom';
import { setPageSize } from "../redux/searchSlice";
import { setNeedTrue } from "../redux/lastCallSlice";

const SettingsPage = () => {
    const dispatch = useDispatch();
    // Handle pageSizeInput
    const [pageSizeInput, setPageSizeInput] = useState(null)
    const handlePageSizeInput = (event) => {
        const { id, value } = event.target;
        let fixedValue;
        if (id === "pageSize") {
            let valueNumber = parseInt(value);
            fixedValue = valueNumber;
            if (valueNumber < 0) {
                fixedValue = 1
            }
        }
        setPageSizeInput(fixedValue)
    }

    useEffect(() => {
        console.log('pageSizeInput: ', pageSizeInput)
    }, [pageSizeInput])

    // Set new pageSize settings
    const { pageSize } = useSelector(state => state.search);
    const [isPageSizeEmpty, setIsPageSizeEmpty] = useState(false);
    const navigate = useNavigate();
    const sendPageSizeSettings = () => {
        if (pageSizeInput) {
            dispatch(setPageSize(pageSizeInput));
            dispatch(setNeedTrue());
        } else {
            setIsPageSizeEmpty(true);
        }
        dispatch(setSection(0));
        dispatch(setNeedTrue);
        navigate("/");
    }

    // Gestione input nuova password
    const [passwordInput, setPasswordInput] = useState({
        password1: '',
        password2: ''
    })
    const handleInputPasswords = (event) => {
        const { id, value } = event.target
        setPasswordInput(prevData => ({
            ...prevData,
            [id]: value
        }))
    }
    useEffect(() => {
        console.log('passwordInput; ', passwordInput)
    }, [passwordInput])

    // Eseguo i controlli al click del button prima di chiamare la funzione di fetch
    const [passwordError, setPasswordError] = useState({
        isError: false,
        errorMessage: []
    })
    const checkPasswordMatch = () => {
        // Check password match
        if (passwordInput.password1 !== passwordInput.password2) {
            setPasswordError(prevState => ({
                isError: true,
                errorMessage: [...prevState.errorMessage, 'Le password non corrispondono']
            }))
        } else {
            // Check password length
            if (passwordInput.password1.length < 8) {
                setPasswordError(prevState => ({
                    isError: true,
                    errorMessage: [...prevState.errorMessage, 'La password deve avere almeno 8 caratteri']
                }))
                // Inserisci gli altri controlli
            } else {
                console.log('FETCH!')
            }
        }
    }
    useEffect(() => {
        console.log('passwordError: ', passwordError)
    }, [passwordError])

    // Funzioni di controllo strength password
    function checkLower(string) {
        return [...string].some(letter => letter >= 'a' && letter <= 'z');
    }
    function checkUpper(string) {
        return [...string].some(letter => letter >= 'A' && letter <= 'Z');
    }
    function checkNumber(string) {
        return /\d/.test(string);
    }
    function checkSpecial(string) {
        return /[^\w\s]/.test(string);
    }
    function checkLength(string) {
        return string.length >= 8;
    }


    return (
        <div className="main-container settings">
            <PageBlock width="full" items="start">
                <div><i class="fi fi-rr-settings-sliders text-3xl"></i></div>
                <h3>Gestione utente</h3>

                {/* Page size */}
                <div className="flex items-center gap-2">
                    <label htmlFor="pageSize">Quantità di elementi per pagina:</label>
                    {pageSize && <input type="number" id="pageSize" placeholder={pageSize} className="w-16" onChange={handlePageSizeInput} />}
                    {pageSizeInput && <div className="ml-4"><MiniPrimaryButton text="Salva elementi per pagina" click={sendPageSizeSettings} /></div>}
                </div>

                {/* Cambio password */}
                <div className="flex items-center gap-2">
                    <label>Modifica password:</label>
                    <div className="flex flex-col lg:flex-row items-center gap-2 border p-4">
                        <div className="flex flex-col items-start">
                            <label htmlFor="oldpassword">Vecchia password</label>
                            <input type="password" id="oldPassword" />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password1">Nuova password</label>
                            <input type="password" id="password1" onChange={handleInputPasswords} value={passwordInput.password1} />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password2">Ripeti nuova password</label>
                            <input type="password" id="password2" onChange={handleInputPasswords} value={passwordInput.password2} />
                        </div>
                        {
                            !passwordError.isError &&
                            <div className="flex flex-col items-start self-end mb-[-8px] ml-4">
                                <MiniPrimaryButton text="Salva nuova password" click={checkPasswordMatch} />
                            </div>
                        }
                        {
                            passwordError.isError &&
                            <div className="ml-4 flex flex-col items-start text-xs self-end">
                                {passwordError.errorMessage.map((element, index) => {
                                    return <div key={index}>{element}</div>
                                })}
                            </div>
                        }

                    </div>
                </div>
                {/* Save settings */}

            </PageBlock>
        </div>
    )
}

export default SettingsPage;