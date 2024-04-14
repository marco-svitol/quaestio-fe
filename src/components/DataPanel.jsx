import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageSelect from "./PageSelect";
import DetailsModal from "./DetailsModal";
import DataCard from "./DataCard";
import { setPage } from "../redux/searchSlice";
import { setFavPage } from "../redux/favouritesSlice";
import PageBlock from './PageBlock'
import { Link } from "react-router-dom";

const DataPanel = () => {
    const { pagedData, error, page, fetchStatus } = useSelector((state) => state.search);
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

    // Redux: elementi per pagina
    const { pageSize } = useSelector(state => state.search)

    return (
        <PageBlock width="full" items="center" relative>
            {fetchStatus === 'idle' && <div className="flex gap-2 lg:self-start"><div className="hidden lg:block"><i className="fi fi-sr-angle-circle-left text-2xl text-red-800"></i></div><h4 className="text-black">Seleziona un Richiedente per iniziare la ricerca</h4></div>}
            {
                error ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>
                        {fetchStatus === 'pending' && <div className="absolute top-0 right-0 bottom-0 left-0 bg-white bg-opacity-80"></div>}
                        {pagedData && <h4>{(8 * (pagedData.length - 1)) + (pagedData[pagedData.length - 1].length - 1)} elementi trovati.</h4>} {/* -1 finale per togliere userinfo */}
                        {pagedData && !pagedData[0][0].userinfo && <PageSelect page={page} selectPage={HandleSelectPage} />}

                        {pagedData && <Link to="/settings"><div className="border rounded border-red-400 p-1">Elementi per pagina: <span className="font-bold text-red-800">{pageSize}</span></div></Link>}

                        {
                            pagedData && Array.isArray(pagedData[page - 1]) && pagedData[page - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */
                                    /* index viene passato per poter aggiornare il Redux di ogni card singolarmente */
                                    return <DataCard key={index} panel="search" index={index + ((page - 1) * 8)} data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }

                        {pagedData && <h4 className="mt-8">{(8 * (pagedData.length - 1)) + (pagedData[pagedData.length - 1].length - 1)} elementi trovati.</h4>} {/* -1 finale per togliere userinfo */}
                        {pagedData && !pagedData[0][0].userinfo && <PageSelect page={page} selectPage={HandleSelectPage} />}

                        {selectedObject && <DetailsModal data={selectedObject} close={resetSelectedObject} />}
                    </>
                )
            }
        </PageBlock>
    )
}

export default DataPanel;