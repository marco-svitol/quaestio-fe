import { useSelector } from "react-redux";
import DataPanel from "../components/DataPanel.jsx";
import FavDataPanel from "../components/FavDataPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FavSearchBar from "../components/FavSearchBar.jsx";
import ExportModal from "../components/ExportModal.jsx";
import { setIsShiftPressed } from "../redux/selectedSlice.js";
import { useDispatch } from 'react-redux';

const Homepage = () => {
    const { sectionNumber } = useSelector(state => state.section)
    const { selectedDocuments } = useSelector(state => state.selected)

    // Gestisco il rilevamento della pressione del tasto SHIFT per la selezione multipla
    const dispatch = useDispatch();
    const handleKeyDown = (event) => {
        if (event.key === 'Shift') {
            dispatch(setIsShiftPressed(true))
        }
    }
    const handleKeyUp = (event) => {
        if (event.key === 'Shift') {
            dispatch(setIsShiftPressed(false))
        }
    }

    return (
        <div className="main-container" tabIndex="0" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            {
                selectedDocuments.length > 0 &&
                <ExportModal />
            }
            {sectionNumber === 0 && <SearchBar />}
            {sectionNumber === 0 && <DataPanel />}
            {sectionNumber === 1 && <FavSearchBar />}
            {sectionNumber === 1 && <FavDataPanel />}
        </div>
    )
}

export default Homepage;