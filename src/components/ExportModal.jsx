import { useSelector } from 'react-redux';

const ExportModal = () => {
    const { selectedDocuments } = useSelector(state => state.selected)
    return (
        <div className="fixed bottom-4 right-8 flex items-center gap-2 bg-red-800 w-fit py-2 px-4 rounded-xl z-10">
                    <div className="flex flex-col gap-3 items-center">

                        {/* Formato */}
                        <div className="flex gap-2 items-center">
                            <div className="text-white text-sm">Formato:</div>
                            <div className="flex text-sm">
                                <div className="flex gap-2 py-1 px-2 rounded">
                                    <input type="checkbox" id="pdf" defaultChecked />
                                    <label htmlFor="pdf" className="text-white">pdf</label>
                                </div>
                                <div className="flex gap-2 py-1 px-2 rounded">
                                    <input type="checkbox" id="csv" />
                                    <label htmlFor="csv" className="text-white">csv</label>
                                </div>
                            </div>
                        </div>
                        {/* Esporta */}
                        <div className="flex gap-2 items-center">
                            <button className="bg-white py-2 px-4 rounded-xl hover:bg-red-50 w-fit">Esporta</button>
                            <div className="text-white fon">n. <span className="font-bold">{selectedDocuments.length}</span> document<span>{selectedDocuments.length === 1 ? 'o' : 'i'}</span></div>
                        </div>

                    </div>
                </div>
    )
}

export default ExportModal