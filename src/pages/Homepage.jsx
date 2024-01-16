import { useSelector } from "react-redux";
import DataPanel from "../components/DataPanel.jsx";
import FavDataPanel from "../components/FavDataPanel.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FavSearchBar from "../components/FavSearchBar.jsx";

const Homepage = () => {
    const { sectionNumber } = useSelector(state => state.section)
    return (
        <div className="main-container">
            {sectionNumber === 0 && <SearchBar />}
            {sectionNumber === 0 && <DataPanel />}
            {sectionNumber === 1 && <FavSearchBar />}
            {sectionNumber === 1 && <FavDataPanel />}
        </div>
    )
}

export default Homepage;