import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageSelect from "./PageSelect";
import DetailsModal from "./DetailsModal";
import DataCard from "./DataCard";
import { setPage } from "../redux/searchSlice";
import { setFavPage } from "../redux/favouritesSlice";
import PageBlock from './PageBlock'
import { Link } from "react-router-dom";
import { setStoredPage } from "../redux/lastCallSlice";
import NoteModal from "./notes/NoteModal";
import SortPanel from "./SortPanel";
import {removeAllDocuments} from '../redux/selectedSlice.js';

// DataPanel riceve i dati da searchSlice, al quale effettua chiamate la navbar quando la sezione selezionata in sectioNumber è 0 (1 è per i favourites)
// I dati delle singole card, se modificati, vengono memorizzati direttamente in searchSlice senza bisogno di effettuare un'altra chiamata
const DataPanel = () => {
    const { pagedData, error, page, fetchStatus, pageSize } = useSelector((state) => state.search);
    const token = useSelector((state) => state.login.token);

    // Handle pagination
    const dispatch = useDispatch();
    const HandleSelectPage = (pageNumber) => {
        dispatch(setPage(pageNumber));
    }
    // Select object
    const [selectedObject, setSelectedObject] = useState(null)
    const handleSelectObject = (object) => {
        setSelectedObject(object)
    }
    const resetSelectedObject = () => {
        setSelectedObject(null)
    }

    // Svuoto la lista di documenti eventualmente selezionati in selectedSlice
        useEffect(() => {
            dispatch(removeAllDocuments())
        }, [])

    return (
        <PageBlock width="full" items="center" relative>
            {fetchStatus === 'idle' && <div className="flex gap-2 lg:self-start"><div className="hidden lg:block"><i className="fi fi-sr-angle-circle-left text-2xl text-red-800"></i></div><h4 className="text-black">Seleziona un Richiedente per iniziare la ricerca</h4></div>}
            {
                error ? (
                    <h3>Qualcosa è andato storto, ricarica la pagina e riprova</h3>
                ) : (
                    <>
                        {fetchStatus === 'pending' && <div className="absolute top-0 right-0 bottom-0 left-0 z-10 bg-white bg-opacity-80"></div>}
                        {pagedData && pagedData.length > 0 && <h4>{(pageSize * (pagedData.length - 1)) + (pagedData[pagedData.length - 1].length)} elementi trovati.</h4>}
                        {pagedData && pagedData.length > 0 && <PageSelect page={page} selectPage={HandleSelectPage} />}

                        {pagedData && pagedData.length > 0 && <Link to="/settings"><div className="border rounded border-red-400 py-1 px-2">Elementi per pagina: <span className="font-bold text-red-800">{pageSize}</span></div></Link>}

                        {/* Sort Panel */}
                        {pagedData && pagedData.length > 0 && <SortPanel />}

                        <div>
                            {
                            pagedData && Array.isArray(pagedData[page - 1]) && pagedData[page - 1].map((element, index) => {
                                if (!element.userinfo) { /* questo toglie la card per userinfo */
                                    return <DataCard key={index} panel="search" data={element} token={token} isEven={index % 2 === 0 ? true : false} click={() => handleSelectObject(element)} />
                                } else {
                                    console.log('userInfo; ', element.userInfo);
                                }
                            })
                        }
                        </div>
                        

                        {/* {pagedData && pagedData.length > 0 && <h4>{(pageSize * (pagedData.length - 1)) + (pagedData[pagedData.length - 1].length)} elementi trovati.</h4>} */}
                        {pagedData && pagedData.length > 0 && <PageSelect page={page} selectPage={HandleSelectPage} />}
                        {pagedData && pagedData.length === 0 && <h3>Nessun elemento trovato.</h3>}
                        {selectedObject && <DetailsModal data={selectedObject} close={resetSelectedObject} />}
                    </>
                )
            }
        </PageBlock>
    )
}

export default DataPanel;