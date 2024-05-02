import PageBlock from "../components/PageBlock";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { setSection } from "../redux/sectionSlice";
import { MiniPrimaryButton, PrimaryButton } from "../components/Buttons";
import { useNavigate } from 'react-router-dom';
import { setPageSize } from "../redux/searchSlice";
import { setNeedTrue } from "../redux/lastCallSlice";
import MiniLoader from '../components/MiniLoader';

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
        navigate("/");
    }

    //
    //

    // Gestione input nuova password
    const [passwordInput, setPasswordInput] = useState({
        oldPassword: '',
        password1: '',
        password2: ''
    })
    const handleInputPasswords = (event) => {
        const { id, value } = event.target
        console.log('id: ', id)
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
        isChecksDone: false,
        errorMessage: []
    })
    const checkPasswordMatch = () => {
        // Check password match
        setPasswordError({
            isError: false,
            isChecksDone: false,
            errorMessage: []
        });
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
            };
            if (!checkLower(passwordInput.password1)) {
                setPasswordError(prevState => ({
                    isError: true,
                    errorMessage: [...prevState.errorMessage, 'Devi inserire almeno una lettera minuscola']
                }))
            };
            if (!checkUpper(passwordInput.password1)) {
                setPasswordError(prevState => ({
                    isError: true,
                    errorMessage: [...prevState.errorMessage, 'Devi inserire almeno una lettera maiuscola']
                }))
            };
            if (!checkSpecial(passwordInput.password1)) {
                setPasswordError(prevState => ({
                    isError: true,
                    errorMessage: [...prevState.errorMessage, 'Devi inserire almeno un carattere speciale']
                }))
            };
            if (!checkNumber(passwordInput.password1)) {
                setPasswordError(prevState => ({
                    isError: true,
                    errorMessage: [...prevState.errorMessage, 'Devi inserire almeno un numero']
                }))
            };
            setPasswordError(prevState => ({
                ...prevState,
                isChecksDone: true
            }))
        }
    }
    useEffect(() => {
        console.log('passwordError: ', passwordError)
        if (passwordError.isChecksDone && !passwordError.isError) {
            sendFetch();
        }
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

    // Gestisco l'invio dei dati password
    const { token } = useSelector(state => state.login);
    const [passwordFetchStatus, setPasswordFetchStatus] = useState('idle');
    const [passwordFetchError, setPasswordFetchError] = useState(null);
    const sendFetch = async () => {
        let oldpassword = encodeURIComponent(passwordInput.oldPassword);
        let newpassword = encodeURIComponent(passwordInput.password1);
        try {
            setPasswordFetchStatus('loading');;
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/changepassword?oldpassword=${oldpassword}&newpassword=${newpassword}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // questa parte funziona, sistema la gestione di result e del messaggio a video
                console.log('here 1');
                console.log('response: ', response);
                console.log('response.status: ', response.status)
                const result = await response.json();
                console.log('result: ', result);
                setPasswordFetchStatus('succeeded');
                dispatch(setSection(0));
                navigate("/");
            } else {
                console.log('here 2');
                const error = await response.json();
                setPasswordFetchStatus('failed');
                setPasswordFetchError(error);
                console.log('Fetch error: ', error)
                resetPasswordInput();
            }
        } catch (error) {
            setPasswordFetchStatus('failed');
            setPasswordFetchError(error);
            console.log('Catch error: ', error)
            resetPasswordInput();
        }
    }

    function resetPasswordInput() {
        setPasswordError({
            isError: false,
            isChecksDone: false,
            errorMessage: []
        })
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
                            <label htmlFor="oldPassword">Vecchia password</label>
                            <input type="password" id="oldPassword" onChange={handleInputPasswords} value={passwordInput.oldPassword} />
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
                            passwordFetchStatus === 'idle' &&
                            <div className="flex flex-col items-start self-end mb-[-8px] ml-4">
                                <MiniPrimaryButton text="Salva nuova password" click={checkPasswordMatch} />
                            </div>
                        }
                        {passwordFetchStatus === 'loading' && <MiniLoader />}
                        {passwordFetchStatus === 'failed' && <div>Qualcosa è andato storto, ricarica la pagina e riprova.</div>}
                        {passwordFetchStatus === 'succeeded' && <div>Password modificata con successo.</div>}

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