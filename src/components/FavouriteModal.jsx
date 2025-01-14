import { useEffect, useState } from "react";
import { MiniDisabledButton, MiniPrimaryButton, MiniSecondaryButton } from "./Buttons";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../redux/userProfileSlice";
import MiniLoader from "./MiniLoader";


const FavouriteModal = ({ close, isBookmark, setFavouriteFetch }) => {
    // Itero le categorie esistenti per menu a tendina
    const { bmfolders } = useSelector(state => state.userProfile);

    // Gestisco la UX di selezione metodo categoria
    const [selectedField, setSelectedField] = useState(1);
    const handleSelectField = (event) => {
        const { id, checked } = event.target;
        if (id === "field_0") {
            setSelectedCategory({ id: null, name: null });
            if (checked) {
                setSelectedField(0)
            } else {
                setSelectedField(1)
            }
        }
        if (id === 'field_1') {
            setCategoryInput('');
            setSelectedCategory({
                id: "00000000-917E-4162-99CF-9DBF336F308F",
                name: "Predefinita"
            })
            if (checked) {
                setSelectedField(1)
            } else {
                setSelectedField(0)
            }
        }
    }
    // debug
    useEffect(() => {
        console.log('selectedField: ', selectedField)
    }, [selectedField])

    // Gestisco inserimento nuova categoria
    const [categoryInput, setCategoryInput] = useState(null);
    const handleCategoryInput = (event) => {
        const { value } = event.target;
        setCategoryInput(value);
    }
    useEffect(() => {
        console.log('categoryInput: ', categoryInput)
    }, [categoryInput])
    
    // Gestisco elezione categoria
    const [selectedCategory, setSelectedCategory] = useState({
        id: "00000000-917E-4162-99CF-9DBF336F308F",
        name: "Predefinita"
    })
    // debug
    useEffect(() => {
        console.log('selectedCategory: ', selectedCategory)
    }, [selectedCategory])
    const handleCategorySelect = (event) => {
        const { value } = event.target;
        const selectedOption = event.target.options[event.target.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        setSelectedCategory({
            id: value,
            name: name
        })
    }
    useEffect(() => {
        console.log('selectedCategory: ', selectedCategory)
    }, [selectedCategory])

    // Creo nuova categoria
    const token = useSelector((state) => state.login.token);
    const dispatch = useDispatch();
    const [categoryFetchStatus, setCategoryFetchStatus] = useState('idle');
    const [categoryFetchError, setCategoryFetchError] = useState(null)
    const createCategory = async (isNewCategory) => {
        setCategoryFetchStatus('loading');
        let url;
        url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/bmfolder?name=${categoryInput}`;
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
                // Seleziono in automatico la nuova categoria nel menu a tendina sotto
                setSelectedCategory({
                    id: result.bmfolderid,
                    name: categoryInput
                });
                //
                setCategoryFetchStatus('succeeded');
                dispatch(getUserProfile({ token }));
                setSelectedField(1);
                setCategoryInput('');
            } else {
                const error = await response.json();
                setCategoryFetchError(error);
                setCategoryFetchStatus('failed');
                console.log('Fetch error: ', error)
            }
        } catch (error) {
            setCategoryFetchError(error);
            setCategoryFetchStatus('failed');
            console.log('Catch error: ', error)
        }
    }

    // Invio dei dati
    const sendData = () => {
        console.log('selectedCategory.id: ', selectedCategory.id)
        setFavouriteFetch(selectedCategory.id);
        close(false);
    }

    return (
        <div className="absolute right-[-20px] top-[-20px] shadow-2xl rounded-xl border bg-white z-10 flex flex-col items-start gap-4 p-4 text-[12pt] min-w-[500px]">
            <i className="fi fi-sr-circle-xmark cursor-pointer text-xl text-red-800 absolute top-3 right-3" onClick={() => close(false)}></i>
            {!isBookmark && <h4>Aggiungi a preferiti</h4>}
            {isBookmark && <h4>Modifica elemento preferito</h4>}

            <div className="flex flex-col gap-2 w-full">

                {/* Aggiungi nuova categoria */}
                {
                    categoryFetchStatus === 'loading' && <MiniLoader />
                }
                {
                    (categoryFetchStatus === 'idle' || categoryFetchStatus === 'succeeded') &&
                    <div className="flex gap-2">
                        <input type="checkbox" onChange={handleSelectField} id="field_0" checked={selectedField === 0 ? true : false} />
                        <div className={`flex flex-col gap-2 items-start border p-2 w-full ${selectedField === 1 ? 'opacity-20' : ''}`}>
                            <label htmlFor="name">Crea nuova categoria:</label>
                            <div className="flex gap-2">
                                <input type="text" id="name" onChange={handleCategoryInput} value={categoryInput} className="w-[300px]" />
                            </div>
                        </div>
                    </div>
                }
                <div className="flex self-end mb-[-10px]">
                    {
                        !categoryFetchError && categoryInput &&
                        <div className="flex items-center">
                            <MiniSecondaryButton text={`Crea nuova categoria: '${categoryInput}'`} click={createCategory} />
                        </div>
                    }
                    {
                        categoryFetchError &&
                        <h3>Qualcosa è andato storto, riprova</h3>
                    }
                </div>

                {/* Seleziona categoria */}
                <div className="flex gap-2">
                    <input type="checkbox" onChange={handleSelectField} id="field_1" checked={selectedField === 1 ? true : false} />
                    <div className={`flex flex-col gap-2 items-start border p-2 w-full ${selectedField === 0 ? 'opacity-20' : ''}`}>
                        <label htmlFor="categoryId">Seleziona una categoria:</label>
                        <select id="categoryId" onChange={handleCategorySelect} value={selectedCategory.id} className={`${selectedField === 0 ? 'pointer-events-none' : ''}`} >
                            {
                                bmfolders && bmfolders.map((element, index) => (
                                    <option key={index} data-name={element.name} value={element.id} >{element.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex self-end mb-[-10px]">
                {
                    !categoryFetchError && selectedCategory.id &&
                    <MiniPrimaryButton text={`Salva preferito in '${selectedCategory.name}'`} click={sendData} />
                }
            </div>
        </div>
    )
}

export default FavouriteModal;