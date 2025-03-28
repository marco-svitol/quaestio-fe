import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toggleDocumentStatus } from "../redux/searchSlice";
import NoteModal from "./notes/NoteModal";
import FavouriteModal from "./FavouriteModal";
import FavouriteSettingModal from "./FavouriteSettingModal";
import { addDocuments, removeDocument, setLastChecked } from "../redux/selectedSlice";
import getFormattedDate from "./utils/getFormattedDate";

const DataCard = ({ data, token, isEven, click }) => {
    const { sectionNumber } = useSelector(state => state.section);
    const [formattedDate, setFormattedDate] = useState(null);
    const { pagedData } = useSelector(state => state.search);
    const { favPagedData } = useSelector(state => state.favourites);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data.date) {
            setFormattedDate(getFormattedDate(data.date));
        }
    }, [data.date]);

    // Manage the opening and closing of the "Favourite" modal
    const [isFavModal, setIsFavModal] = useState(false);

    // Manage the opening and closing of the "Favourite Settings" modal
    const [isFavSettingModal, setIsFavSettingModal] = useState(false);

    // Manage the opening and closing of the "Notes" modal
    const [isNoteVisible, setIsNoteVisible] = useState(false);

    // Handle document status change
    const setStatus = (newStatus) => {
        dispatch(toggleDocumentStatus({ token, familyId: data.familyid, newStatus }));
    };

    // Handle card selection and update Redux
    const { selectedDocuments, lastChecked, isShiftPressed } = useSelector(state => state.selected);
    const handleSelect = (event) => {
        const { checked } = event.target;
        if (checked) {
            if (isShiftPressed && lastChecked) { // Multi-selection
                const totalDocuments = sectionNumber === 0 ? [...pagedData] : [...favPagedData];
                const flatData = totalDocuments.map(page => page.map(document => document.familyid)).flat();
                const firstIndex = flatData.indexOf(lastChecked);
                const secondIndex = flatData.indexOf(data.familyid);
                const ascendingOrderIndex = firstIndex < secondIndex ? [firstIndex, secondIndex] : [secondIndex, firstIndex];
                const selection = flatData.slice(ascendingOrderIndex[0], ascendingOrderIndex[1] + 1);
                dispatch(addDocuments(selection));
            } else { // Single selection
                dispatch(addDocuments([data.familyid]));
                dispatch(setLastChecked(data.familyid));
            }
        } else {
            dispatch(removeDocument(data.familyid));
            dispatch(setLastChecked(null));
        }
    };

    return (
        <div className="group w-full flex justify-center items-center gap-4 p-2">
            {/* Select */}
            <div className="relative group">
                <input
                    type="checkbox"
                    value={data.familyid}
                    className="accent-red-800"
                    onChange={handleSelect}
                    checked={selectedDocuments.includes(data.familyid)}
                />
                <div
                    className={
                        !selectedDocuments.length > 0
                        ? 'absolute inset-0 bg-white hidden xl:block xl:group-hover:hidden'
                        : undefined
                    }
                ></div>
            </div>

            {/* Card data */}
            <div className={`flex flex-col md:flex-col xl:flex-row text-[8pt] border ${selectedDocuments.includes(data.familyid) ? 'border-red-800 border bg-red-50' : (isEven ? 'bg-stone-50 border-red-50' : 'bg-stone-100 border-red-100')} hover:border-red-800 w-full xl:w-fit px-4 py-2 gap-4 rounded-3xl relative ${data.read_history === "new" && 'font-bold'}`}>
                {/* Document number */}
                <div className="w-full sm:w-[200px] xl:w-[160px]">
                    <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Numero</h4>
                    <div className="p-2 h-11 flex gap-2 items-center">
                        <div className="border rounded-lg border-stone-300 p-2 w-[40px] h-11 flex justify-center cursor-pointer hover:bg-stone-200" onClick={click}>
                            <i className="fi fi-rr-file-circle-info text-red-800 text-lg pt-0.5"></i>
                        </div>
                        <div>{data.doc_num}</div>
                    </div>
                </div>

                {/* Document title */}
                <div className="w-full xl:w-[300px] 2xl:w-[500px]">
                    <h4 className="block xl:hidden text-xs text-left xl:text-center ml-2 text-stone-400">Titolo</h4>
                    <div className="p-2 text-left h-11 overflow-hidden flex items-start">{data.invention_title}</div>
                </div>

                {/* Other data */}
                <div className="flex xs-customjustify-start xl:justify-end gap-1 w-full xl:w-[240px]">
                    <div className="w-full">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Data</h4>
                        {data.date && <div className="p-2 h-11 flex items-center w-full">{formattedDate}</div>}
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Stato</h4>
                        <div className="border rounded-lg border-stone-300 p-2 h-11 flex justify-center items-center cursor-pointer w-[40px] hover:bg-stone-200">
                            {data.read_history === "viewed" ? (
                                <i className="fi fi-rr-envelope-open-text text-red-800 text-lg rounded-lg pt-1" onClick={() => setStatus("new")}></i>
                            ) : (
                                <i className="fi fi-rr-envelope text-red-800 text-lg rounded-lg pt-1" onClick={() => setStatus("viewed")}></i>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Preferiti</h4>
                        <div className="border rounded-lg border-stone-300 flex justify-center items-center h-11 cursor-pointer w-[40px] hover:bg-stone-200">
                            {!data.bookmark && <i className="fi fi-rr-star text-red-800 text-lg rounded-lg pt-1" onClick={() => setIsFavModal(true)}></i>}
                            {data.bookmark && <i className="fi fi-sr-star text-red-800 text-lg rounded-lg pt-1" onClick={() => setIsFavSettingModal(true)}></i>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h4 className="block xl:hidden text-xs md:text-left text-stone-400">Note</h4>
                        <div className="border rounded-lg border-stone-300 flex justify-center items-center h-11 cursor-pointer w-[40px] hover:bg-stone-200" onClick={() => setIsNoteVisible(true)}>
                            {!data.notes && <i className="fi fi-rr-note-sticky text-red-800 text-lg rounded-lg pt-1"></i>}
                            {data.notes && <i className="fi fi-sr-note-sticky text-red-800 text-lg rounded-lg pt-1"></i>}
                        </div>
                    </div>
                    {isFavModal && <FavouriteModal close={setIsFavModal} isBookmark={data.bookmark} />}
                    {isFavSettingModal && <FavouriteSettingModal close={setIsFavSettingModal} categoryId={data.bmfolderid} />}
                    {isNoteVisible && <NoteModal close={setIsNoteVisible} docNum={data.doc_num} familyId={data.familyid} note={data.notes} />}
                </div>
            </div>
        </div>
    );
};

export default DataCard;