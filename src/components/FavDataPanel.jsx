import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FavPageSelect from "./FavPageSelect.jsx";
import DetailsModal from "./DetailsModal.jsx";
import DataCard from "./DataCard.jsx";
import { getCategory, setFavPage } from "../redux/favouritesSlice";
import PageBlock from "./PageBlock.jsx";
import SortPanel from "./SortPanel.jsx";

const FavDataPanel = () => {
    const { favPagedData, favCategorizedPagedData, favError, favPage } = useSelector((state) => state.favourites);
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
    const [category, setCategory] = useState({
        id: null,
        name: null
    })
    const handleCategorySelect = (event) => {
        const { value } = event.target;
        const selectedOption = event.target.options[event.target.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        console.log('value: ', value);
            console.log('name: ', name)
        if (!name) {
            setCategory({
                id: null,
                name: null
            })
        } else {
            setCategory({
                id: value,
                name: name
            })
        }
    }
    useEffect(() => {
        if (category.id) {
            dispatch(getCategory(category.id))
        }
    }, [category])

    return (
        <PageBlock width="full" items="center">
            {
                favError ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>

                        {/* Seleziona categoria */}
                        {bmfolders && <div className="flex flex-col gap-2 items-start self-start">
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
                                favPagedData && favPagedData.length > 0 && <h4>{(8 * (favPagedData.length - 1)) + (favPagedData[favPagedData.length - 1].length)} elementi trovati.</h4> /* -1 finale per togliere userinfo */
                            )
                        }
                        {favPagedData && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}

                        {favPagedData && <SortPanel isFavourite category={category.id} />}

                        {
                            !category.id &&
                            favPagedData && Array.isArray(favPagedData[favPage - 1]) && favPagedData[favPage - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */
                                    return <DataCard key={index} panel="fav" index={index + ((favPage - 1) * 8)} data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectFavObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }
                        {
                            category.id &&
                            favCategorizedPagedData && Array.isArray(favCategorizedPagedData[favPage - 1]) && favCategorizedPagedData[favPage - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */
                                    return <DataCard key={index} panel="fav" index={index + ((favPage - 1) * 8)} data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectFavObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }

                        {selectedFavObject && <DetailsModal data={selectedFavObject} close={resetSelectedFavObject} />}
                    </>
                )
            }
        </PageBlock>
    )
}

export default FavDataPanel;