import PageBlock from "../components/PageBlock";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { setSection } from "../redux/sectionSlice";
import { MiniPrimaryButton, PrimaryButton } from "../components/Buttons";
import { useNavigate } from 'react-router-dom';
import { setPageSize } from "../redux/searchSlice";
import { setNeedTrue } from "../redux/lastCallSlice";
import MiniLoader from '../components/MiniLoader';
import { getUserProfile } from '../redux/userProfileSlice.js'

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
    const { pageData } = useSelector(state => state.search);
    const [isPageSizeEmpty, setIsPageSizeEmpty] = useState(false);
    const navigate = useNavigate();
    const sendPageSizeSettings = () => {
        if (pageSizeInput) {
            dispatch(setPageSize(pageSizeInput));
            if (pageData) {
                dispatch(setNeedTrue());
            }
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

        let bodyData = {
            oldpassword: encodeURIComponent(passwordInput.oldPassword),
            newpassword: encodeURIComponent(passwordInput.password1)
        }
        try {
            setPasswordFetchStatus('loading');;
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/changepassword`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData)
            });
            if (response.ok) {
                // questa parte funziona, sistema la gestione di result e del messaggio a video
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

    // Gestisco icona showPassword
    const [showPassword, setShowPassword] = useState({
        isShowOld: false,
        isShowNew1: false,
        isShowNew2: false,
    });
    const handleShowPassword = (inputId, boo) => {
        console.log('inputId: ', inputId);
        console.log('boo: ', boo)
        setShowPassword(prevState => ({
            ...prevState,
            [inputId]: boo
        }))
    }
    useEffect(() => {
        console.log('showPassword: ', showPassword)
    }, [showPassword])

    // Gestisco il rename delle categorie
    const { bmfolders } = useSelector(state => state.userProfile);
    const [categoryToEdit, setCategoryToEdit] = useState({
        id: bmfolders[1].id,
        name: bmfolders[1].name
    });
    const handleSelectCategory = (event) => {
        const { value } = event.target;
        const selectedOption = event.target.options[event.target.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        setNewCategoryName('');
        setCategoryToEdit({
            id: value,
            name: name
        })
    }

    // Gestisco l'input del nuovo nome categoria
    const [newCategoryName, setNewCategoryName] = useState(null);
    const handleNameInput = (event) => {
        const { value } = event.target;
        setNewCategoryName(value);
    }

    // Invio i dati per il rename
    const [categoryRenameFetchStatus, setCategoryRenameFetchStatus] = useState('idle');
    const [categoryRenameError, setCategoryRenameError] = useState(null)
    const sendCategoryRename = async () => {
        setCategoryRenameFetchStatus('loading');
        console.log('categoryToEdit: ', categoryToEdit);
        let url;
        url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/bmfolder?id=${categoryToEdit.id}&name=${newCategoryName}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
        const options = {
            method: 'POST',
            headers
        }
        try {

            const response = await fetch(url, options);
            if (response.ok) {
                const result = await response.json();
                console.log('Fetch done: ', result);
                setCategoryRenameFetchStatus('succeeded');
                dispatch(getUserProfile({ token }));
                setNewCategoryName('');
                setTimeout(() => {
                    dispatch(setSection(0));
                    navigate("/");
                }, 3000)
            } else {
                const error = await response.json();
                setCategoryRenameError(error);
                setCategoryRenameFetchStatus('failed');
                console.log('Fetch error: ', error)
            }
        } catch (error) {
            setCategoryRenameError(error);
            setCategoryRenameFetchStatus('failed');
            console.log('Catch error: ', error)
        }
    }


    return (
        <div className="main-container settings">
            <PageBlock width="full" items="start">
                <div><i class="fi fi-rr-settings-sliders text-3xl"></i></div>
                <h3>Gestione utente</h3>

                {/* Page size */}
                <div className="flex items-center gap-2 border border-red-800 rounded p-4">
                    <label htmlFor="pageSize">Quantità di elementi per pagina:</label>
                    {pageSize && <input type="number" id="pageSize" placeholder={pageSize} className="w-16" onChange={handlePageSizeInput} />}
                    {pageSizeInput && <div className="ml-4"><MiniPrimaryButton text="Salva elementi per pagina" click={sendPageSizeSettings} /></div>}
                </div>

                {/* Cambio password */}
                <div className="flex flex-col items-start gap-2 border border-red-800 rounded p-4">
                    <label>Modifica password:</label>
                    <div className="flex flex-col lg:flex-row items-center gap-8 border p-4">
                        <div className="flex flex-col items-start">
                            <label htmlFor="oldPassword">Vecchia password</label>
                            <div className="flex gap-1 items-center relative">
                                {!showPassword.isShowOld && <i className="fi fi-rr-eye absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowOld', true)}></i>}
                                {showPassword.isShowOld && <i className="fi fi-rr-eye-crossed absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowOld', false)}></i>}
                                <input type={showPassword.isShowOld ? 'text' : 'password'} className="w-[300px]" id="oldPassword" onChange={handleInputPasswords} value={passwordInput.oldPassword} />
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password1">Nuova password</label>
                            <div className="flex gap-1 items-center relative">
                                {!showPassword.isShowNew1 && <i className="fi fi-rr-eye absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowNew1', true)}></i>}
                                {showPassword.isShowNew1 && <i className="fi fi-rr-eye-crossed absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowNew1', false)}></i>}
                                <input type={showPassword.isShowNew1 ? 'text' : 'password'} id="password1" className="w-[300px]" onChange={handleInputPasswords} value={passwordInput.password1} />
                            </div>
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="password2">Ripeti nuova password</label>
                            <div className="flex gap-1 items-center relative">
                                {!showPassword.isShowNew2 && <i className="fi fi-rr-eye absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowNew2', true)}></i>}
                                {showPassword.isShowNew2 && <i className="fi fi-rr-eye-crossed absolute right-3 top-4 cursor-pointer text-xl text-neutral-400" onClick={() => handleShowPassword('isShowNew2', false)}></i>}
                                <input type={showPassword.isShowNew2 ? 'text' : 'password'} id="password2" className="w-[300px]" onChange={handleInputPasswords} value={passwordInput.password2} />
                            </div>
                        </div>


                    </div>
                    {
                        passwordFetchStatus === 'idle' &&
                        <div className="flex flex-col items-start mb-[-8px] ml-4">
                            <MiniPrimaryButton text="Salva nuova password" click={checkPasswordMatch} />
                        </div>
                    }
                    {passwordFetchStatus === 'loading' && <MiniLoader />}
                    {passwordFetchStatus === 'failed' && <div>Qualcosa è andato storto, ricarica la pagina e riprova.</div>}
                    {passwordFetchStatus === 'succeeded' && <div>Password modificata con successo.</div>}

                    {
                        passwordError.isError &&
                        <div className="ml-4 flex flex-col items-start text-xs">
                            {passwordError.errorMessage.map((element, index) => {
                                return <div key={index}>{element}</div>
                            })}
                        </div>
                    }
                </div>

                {/* Categorie preferiti */}
                {
                    bmfolders && bmfolders.length > 1 &&
                    <div className="flex gap-4 items-center border border-red-800 rounded p-4">
                        <label htmlFor="">Rinomina categorie preferiti</label>
                        <div className="flex flex-col items-start">
                            <label htmlFor="">Categoria da rinominare</label>
                            <select onChange={handleSelectCategory} value={categoryToEdit.name} >
                                {
                                    bmfolders.map((element, index) => {
                                        if (index > 0) {
                                            return <option key={index - 1} value={element.id} data-name={element.name}>{element.name}</option>
                                        }
                                    })
                                }
                            </select>
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="">Nuovo nome categoria</label>
                            <input type="text" onChange={handleNameInput} value={newCategoryName} />
                        </div>

                        <div className="flex flex-col items-start self-end mb-[-8px] ml-4">
                            {categoryRenameFetchStatus === 'idle' && <MiniPrimaryButton text="Rinomina categoria" click={sendCategoryRename} />}
                            {categoryRenameFetchStatus === 'loading' && <MiniLoader />}
                            {categoryRenameFetchStatus === 'succeeded' && <h4>Categoria rinominata con successo, attendi il refresh della pagina.</h4>}
                            {categoryRenameFetchStatus === 'failed' && <h4>Qualcosa è andato storto. Ricarica la pagina e riprova.</h4>}
                        </div>


                    </div>
                }

            </PageBlock>
        </div>
    )
}

export default SettingsPage;