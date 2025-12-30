import { useSelector } from "react-redux";
import DataPanel from "../components/DataPanel.jsx";
import FavDataPanel from "../components/FavDataPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FavSearchBar from "../components/FavSearchBar.jsx";
import ExportModal from "../components/ExportModal.jsx";
import { setIsShiftPressed } from "../redux/selectedSlice.js";
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const Homepage = () => {
    const { sectionNumber } = useSelector(state => state.section)
    const { selectedDocuments } = useSelector(state => state.selected)

    // Search panel pin state
    const [isSearchPanelPinned, setIsSearchPanelPinned] = useState(false);
    const toggleSearchPanelPin = () => setIsSearchPanelPinned(!isSearchPanelPinned);

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
            {selectedDocuments.length > 0 && <ExportModal />}
            
            <div className="w-full">
                {sectionNumber === 0 && (
                    <div className="flex flex-col relative -mx-8">
                        {/* Search Panel */}
                        <div className={`w-full px-8 ${isSearchPanelPinned ? 'sticky top-[60px] z-20 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50' : 'relative'}`}>
                            {/* Pin Button */}
                            <button
                                onClick={toggleSearchPanelPin}
                                className="absolute top-4 right-12 z-10 flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                                title={isSearchPanelPinned ? 'Sblocca filtri' : 'Blocca filtri'}
                            >
                                <i className={`fi ${isSearchPanelPinned ? 'fi-sr-thumbtack' : 'fi-rr-thumbtack'} text-sm transition-transform duration-300`}></i>
                            </button>
                            <SearchBar />
                        </div>
                        
                        {/* Results Panel */}
                        <div className="w-full px-8 relative mt-2">
                            <DataPanel />
                        </div>
                    </div>
                )}
                
                {sectionNumber === 1 && (
                    <div className="flex flex-col relative -mx-8">
                        {/* Search Panel */}
                        <div className={`w-full px-8 ${isSearchPanelPinned ? 'sticky top-[60px] z-20 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50' : 'relative'}`}>
                            {/* Pin Button */}
                            <button
                                onClick={toggleSearchPanelPin}
                                className="absolute top-4 right-12 z-10 flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
                                title={isSearchPanelPinned ? 'Sblocca filtri' : 'Blocca filtri'}
                            >
                                <i className={`fi ${isSearchPanelPinned ? 'fi-sr-thumbtack' : 'fi-rr-thumbtack'} text-sm transition-transform duration-300`}></i>
                            </button>
                            <FavSearchBar />
                        </div>
                        
                        {/* Results Panel */}
                        <div className="w-full px-8 relative mt-2">
                            <FavDataPanel />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Homepage;