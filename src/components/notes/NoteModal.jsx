import { useEffect, useState } from "react";
import { DisabledButton, MiniDisabledButton, MiniPrimaryButton, PrimaryButton } from "../Buttons";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNeedTrue } from "../../redux/lastCallSlice";
import MiniLoader from "../MiniLoader";
import { setFavNeedTrue } from "../../redux/favLastCallSlice";

const NoteModal = ({ close, docNum, note, setLoading }) => {

    // Gestisco l'input della nota
    const [inputData, setInputData] = useState(null);
    useEffect(() => {
        if (note !== "") {
            setInputData(note);
        }
    }, [note])
    const handleInputData = (event) => {
        const { id, value } = event.target;
        setInputData(value);
    }

    // Gestisco l'invio della nota
    const { sectionNumber } = useSelector(state => state.section);
    const [fetchStatus, setFetchStatus] = useState('idle');
    const [error, setError] = useState(null);
    const { needLastCall } = useSelector(state => state.lastCall)
    const { token } = useSelector(state => state.login);
    const dispatch = useDispatch();
    const sendNote = async () => {
        setFetchStatus('loading');
        const url = `${process.env.REACT_APP_SERVER_BASE_URL}/v2/notes?doc_num=${docNum}&notes=${inputData}`;
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const options = {
            method: 'PATCH',
            headers
        }
        try {
            const response = await fetch(url, options)
            if (response.ok) {
                /* setLoading(true); */
                dispatch(setNeedTrue());
                dispatch(setFavNeedTrue())
                close(false);
            } else {
                const error = await response.json();
                console.log('Fetch error: ', error)
                setError(error);
            }
        } catch (error) {
            console.log('Catch error: ', error)
            setFetchStatus(error);
            setError(error);
        }
    }
    useEffect(() => {
        console.log(inputData)
    }, [inputData])
    return (
        <div className="bg-yellow-100 absolute right-[-20px] top-[-20px] shadow-2xl rounded-xl border w-96 z-10 cursor-default flex flex-col items-start gap-2 px-2 py-1 text-[12pt]">
            <i className="fi fi-sr-circle-xmark cursor-pointer text-xl text-red-800 absolute top-3 right-3" onClick={() => close(false)}></i>
            <h4 className="text-xs"><span className="text-stone-400">Nota documento n.</span> {docNum}</h4>
            <textarea id="noteInput" className="mt-4 w-full h-[240px] resize-none bg-transparent p-2 border border-stone-300" onChange={handleInputData} value={inputData} ></textarea>
            <div className="flex p-1 border-b border-r border-l rounded-b-lg hover:bg-neutral-100 cursor-pointer" onClick={() => setInputData('')}>
                Elimina testo
            </div>
            <div className="flex self-end">
                {fetchStatus === 'loading' && <MiniLoader />}
                {fetchStatus === 'idle' && <MiniPrimaryButton text="Salva nota" click={sendNote} />}
            </div>

        </div>
    )
}

export default NoteModal;