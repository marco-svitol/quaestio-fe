import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { sortDocuments } from "../redux/searchSlice";
import { sortFavourites } from "../redux/favouritesSlice";

const SortPanel = ({ isFavourite }) => {
    const [selectedKey, setSelectedKey] = useState({
        key: null,
        reverse: false
    })
    const handleSelectSort = (event) => {
        const { id } = event.target;
        setSelectedKey(prevState => ({
            key: id,
            reverse: prevState.key === id ? !prevState.reverse : prevState.reverse // Questa condizione imposta il reverse solo al secondo click sullo stesso elemento
        }))
    }
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedKey.key) {
            if (isFavourite) {
                dispatch(sortFavourites({ key: selectedKey.key, reverse: selectedKey.reverse }))
            } else {
                dispatch(sortDocuments({ key: selectedKey.key, reverse: selectedKey.reverse }))
            }
        }
    }, [selectedKey])
    return (
        <div className="flex gap-4 text-xs text-stone-400 font-bold">
            <div className="w-full sm:w-[200px] xl:w-[160px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="doc_num" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> N.documento</div>
            <div className="w-full xl:w-[300px] 2xl:w-[500px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="invention_title" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> Titolo</div>
            <div className="flex sm:flex-row justify-start xl:justify-end gap-1 w-full xl:w-[240px]">
                <div className="w-[95px] text-left border-r p-1 rounded flex gap-1 cursor-pointer" id="date" onClick={handleSelectSort}><div className="pt-[2px]"><i className="fi fi-rr-sort-alt"></i></div> Data</div>
                <div className="w-[50px] text-left border-r p-1 rounded flex gap-1 cursor-pointer">Stato</div>
                <div className="w-[34px] p-1 rounded flex gap-1 cursor-pointer">Pref.</div>
                <div className="w-[34px] border-l p-1 rounded flex gap-1 cursor-pointer">Note</div>
            </div>
        </div>
    )
}

export default SortPanel;