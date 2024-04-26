const NoteModal = ({ docNum, setIsNoteShow }) => {
    return (
        <div className="bg-yellow-100 absolute right-[-20px] rounded-xl border w-96 h-96 z-10 cursor-default">
            <i className="fi fi-sr-circle-xmark cursor-pointer text-xl text-red-800 absolute top-3 right-3" onClick={setIsNoteShow(false)}></i>
        </div>
    )
}

export default NoteModal;