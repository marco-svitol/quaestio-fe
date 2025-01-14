import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sortDocuments } from "../redux/searchSlice";
import { sortFavourites } from "../redux/favouritesSlice";
import { setSort } from "../redux/sortStatusSlice";

const SortPanel = ({ isFavourite, category }) => {
    const [selectedKey, setSelectedKey] = useState({
        key: null,
        reverse: false
    })
    const handleSelectSort = (event) => {
        const { id } = event.target;
        setSelectedKey(prevState => ({
            key: id,
            reverse: !prevState.reverse
        }))
    }
    const dispatch = useDispatch();
    const { pageSize } = useSelector(state => state.search)
    useEffect(() => {
        if (selectedKey.key) {
            dispatch(setSort({key: selectedKey.key, reverse: selectedKey.reverse }))
            if (isFavourite) {
                dispatch(sortFavourites({ key: selectedKey.key, reverse: selectedKey.reverse, category, pageSize: pageSize }))
            } else {
                dispatch(sortDocuments({ key: selectedKey.key, reverse: selectedKey.reverse }))
            }
        }
    }, [selectedKey])
    return (
        <div className="flex gap-4 text-xs text-stone-400 font-bold pl-16">
            <div className="w-full sm:w-[200px] xl:w-[160px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="doc_num" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> N.documento</div>
            <div className="w-full xl:w-[300px] 2xl:w-[500px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="invention_title" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> Titolo</div>
            <div className="flex sm:flex-row justify-start xl:justify-end gap-1 w-full xl:w-[240px]">
                <div className="w-[95px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="date" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> Data</div>
                <div className="w-[40px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="read_history" onClick={handleSelectSort}>Stato</div>
                <div className="w-[40px] p-1 rounded flex gap-1 cursor-pointer" id="bookmark" onClick={handleSelectSort}>Pref.</div>
                <div className="w-[40px] border-l p-1 rounded flex gap-1 cursor-pointer" id="notes" onClick={handleSelectSort}>Note</div>
            </div>
        </div>
    )
}

export default SortPanel;