import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FavPageSelect from "./FavPageSelect.jsx";
import DetailsModal from "./DetailsModal.jsx";
import DataCard from "./DataCard.jsx";
import { setFavPage } from "../redux/favouritesSlice";
import { getFavourites } from "../redux/favouritesSlice";

const DataPanel = () => {
    const { favPagedData, favError, favPage } = useSelector((state) => state.favourites);
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
    return (
        <div className="box w-full">
            {
                favError ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>
                        {favPagedData && <h4>{(8 * (favPagedData.length - 1)) + (favPagedData[favPagedData.length - 1].length)} elementi trovati.</h4>} {/* -1 finale per togliere userinfo */}
                        {favPagedData && <FavPageSelect page={favPage} selectPage={handleSelectFavPage} />}

                        {
                            favPagedData && Array.isArray(favPagedData[favPage - 1]) && favPagedData[favPage - 1].map((element, index) => {
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
        </div>
    )
}

export default DataPanel;