import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageSelect from "./PageSelect";
import DetailsModal from "./DetailsModal";
import DataCard from "./DataCard";
import { setPage } from "../redux/searchSlice";
import { setFavPage } from "../redux/favouritesSlice";
import ConsoleLog from '../components/ConsoleLog.jsx';

const DataPanel = () => {
    const { pagedData, error, page } = useSelector((state) => state.search);
    const token = useSelector((state) => state.login.token);

    // Handle pagination
    const dispatch = useDispatch();
    const HandleSelectPage = (pageNumber) => {
        dispatch(setPage(pageNumber))
    }
    // Select object
    const [selectedObject, setSelectedObject] = useState(null)
    const handleSelectObject = (object) => {
        setSelectedObject(object)
    }
    const resetSelectedObject = () => {
        setSelectedObject(null)
    }

    return (
        <div className="box w-full">

            {
                error ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>
                        {pagedData && <h4>{(8 * (pagedData.length - 1)) + (pagedData[pagedData.length - 1].length - 1)} elementi trovati.</h4>} {/* -1 finale per togliere userinfo */}
                        {pagedData && !pagedData[0][0].userinfo && <PageSelect page={page} selectPage={HandleSelectPage} />}

                        {
                            pagedData && Array.isArray(pagedData[page - 1]) && pagedData[page - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */
                                    /* index viene passato per poter aggiornare il Redux di ogni card singolarmente */
                                    return <DataCard key={index} index={index + ((page - 1) * 8)} data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }

                        {selectedObject && <DetailsModal data={selectedObject} close={resetSelectedObject} />}
                    </>
                )
            }
        </div>
    )
}

export default DataPanel;