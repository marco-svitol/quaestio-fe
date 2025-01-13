import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FavPageSelect from "./FavPageSelect.jsx";
import DetailsModal from "./DetailsModal.jsx";
import DataCard from "./DataCard.jsx";
import { getCategory, setFavPage, setCategory } from "../redux/favouritesSlice";
import PageBlock from "./PageBlock.jsx";
import SortPanel from "./SortPanel.jsx";
import { Link } from "react-router-dom";

// FavouritePanel gestisce le card allo stesso modo di DataPanel, i dati vengono gestiti da favouritesSlice invece che searchSlice
// Esso è attivato sempre da Navbar in base alla sezione selezionata in sectionSlice
// Viene effettuata una chiamata ad ogni approdo, in modo che che le card siano sempre aggiornate in base alle modifiche effettuate dalla section 0 (DataPanel)
const FavDataPanel = () => {
    const { favPagedData, favCategorizedPagedData, favError, favPage, favFetchStatus } = useSelector((state) => state.favourites);
    const token = useSelector((state) => state.login.token);

    // Handle pagination
    const dispatch = useDispatch();
    const handleSelectFavPage = (pageNumber) => {
        dispatch(setFavPage(pageNumber))
    }

    // Select object
    const [selectedFavObject, setSelectedFavObject] = useState(null)
    const handleSelectFavObject = (object) => {
        setSelectedFavObject(object)
    }
    const resetSelectedFavObject = () => {
        setSelectedFavObject(null)
    }

    // Gestisco la selezione in base alla categoria
    const { bmfolders } = useSelector(state => state.userProfile);
    const { pageSize } = useSelector(state => state.search)
    /* const [category, setCategory] = useState({
        id: null,
        name: null
    }) */
    const {favCategory} = useSelector(state => state.favourites);
    // debug
    useEffect(() => {
        console.log('favCategory: ', favCategory)
    }, [favCategory])
    const handleCategorySelect = (event) => {
        const { value } = event.target;
        const selectedOption = event.target.options[event.target.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        if (!name) {
            dispatch(setCategory({
                id: null,
                name: null
            }))
            /* setCategory({
                id: null,
                name: null
            }) */
        } else {
            dispatch(setCategory({
                id: value,
                name: name
            }))
            /* setCategory({
                id: value,
                name: name
            }) */
        }
    }
    useEffect(() => {
        console.log('favCategory ', favCategory)
        if (favCategory.id) {
            console.log('pageSize: ', pageSize)
            dispatch(getCategory({ categoryId: favCategory.id, pageSize: pageSize }))
        } else {
            dispatch(getCategory({categoryId: null, pageSize: pageSize}))
        }
    }, [favCategory])

    return (
        <PageBlock width="full" items="center" relative>
            {favFetchStatus === 'pending' && <div className="absolute top-0 right-0 bottom-0 left-0 z-10 bg-white bg-opacity-80"></div>}
            {
                favError ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>

                        {/* Seleziona categoria */}
                        {bmfolders && favPagedData && favPagedData.length > 0 && <div className="flex flex-col gap-2 items-start self-start">
                            <label htmlFor="">Scegli una categoria di preferiti</label>
                            <select onChange={handleCategorySelect} >
                                <option key={0} value={null}>Tutti</option>
                                {
                                    bmfolders && bmfolders.map((element, index) => {
                                        return <option key={index + 1} value={element.id} data-name={element.name}>{element.name}</option>
                                    })
                                }
                            </select>
                        </div>}

                        {

                            favPagedData && favPagedData[0] === '{ }' ? (
                                <h4>0 elementi trovati</h4>
                            ) : (
                                !favCategory.id ? (
                                    favPagedData && favPagedData.length > 0 && <h4>{(pageSize * (favPagedData.length - 1)) + (favPagedData[favPagedData.length - 1].length)} elementi trovati.</h4>
                                ) : (
                                    favCategorizedPagedData && favCategorizedPagedData.length > 0 && <h4>{(pageSize * (favCategorizedPagedData.length - 1)) + (favCategorizedPagedData[favCategorizedPagedData.length - 1].length)} elementi trovati.</h4>
                                )
                            )
                        }

                        {/* Page select */}
                        {!favCategory.id && favPagedData && favPagedData.length > 0 && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}
                        {favCategory.id && favCategorizedPagedData && favCategorizedPagedData.length > 0 && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}

                        {/* Elementi per pagina */}
                        {!favCategory.id && favPagedData && favPagedData.length > 0 && <Link to="/settings"><div className="border rounded border-red-400 py-1 px-2">Elementi per pagina: <span className="font-bold text-red-800">{pageSize}</span></div></Link>}
                        {favCategory.id && favCategorizedPagedData && favCategorizedPagedData.length > 0 && <Link to="/settings"><div className="border rounded border-red-400 py-1 px-2">Elementi per pagina: <span className="font-bold text-red-800">{pageSize}</span></div></Link>}

                        {/* Sort panel */}
                        {!favCategory.id && favPagedData && favPagedData.length > 0 && <SortPanel isFavourite category={favCategory.id} />}
                        {favCategory.id && favCategorizedPagedData && favCategorizedPagedData.length > 0 && <SortPanel isFavourite category={favCategory.id} />}

                        {
                            !favCategory.id &&
                            favPagedData && Array.isArray(favPagedData[favPage - 1]) && favPagedData[favPage - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */ /* E' comunque già tolta dallo slice a monte, snellire */
                                    return <DataCard key={index} panel="fav" data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectFavObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }
                        {
                            favCategory.id &&
                            favCategorizedPagedData && Array.isArray(favCategorizedPagedData[favPage - 1]) && favCategorizedPagedData[favPage - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */ /* E' comunque già tolta dallo slice a monte, snellire */
                                    return <DataCard key={index} panel="fav" index={index + ((favPage - 1) * 8)} data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectFavObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }


                        {/* Page select */}
                        {!favCategory.id && favPagedData && favPagedData.length > 0 && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}
                        {favCategory.id && favCategorizedPagedData && favCategorizedPagedData.length > 0 && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}


                        {favPagedData && favPagedData.length === 0 && <h3>Nessun elemento preferito trovato.</h3>}
                        {selectedFavObject && <DetailsModal data={selectedFavObject} close={resetSelectedFavObject} />}
                    </>
                )
            }
        </PageBlock>
    )
}

export default FavDataPanel;