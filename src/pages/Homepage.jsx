import { useSelector } from "react-redux";
import DataPanel from "../components/DataPanel.jsx";
import FavDataPanel from "../components/FavDataPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FavSearchBar from "../components/FavSearchBar.jsx";
import ExportModal from "../components/ExportModal.jsx";

const Homepage = () => {
    const { sectionNumber } = useSelector(state => state.section)
    const {selectedDocuments} = useSelector(state => state.selected)
    return (
        <div className="main-container">
            {sectionNumber === 0 && <SearchBar />}
            {sectionNumber === 0 && <DataPanel />}
            {sectionNumber === 1 && <FavSearchBar />}
            {sectionNumber === 1 && <FavDataPanel />}
            {
                selectedDocuments.length > 0 &&
                <ExportModal />
            }
        </div>
    )
}

export default Homepage;