import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import getFormattedDate from './utils/getFormattedDate';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ExportModal = () => {
    const { selectedDocuments } = useSelector(state => state.selected)
    const { sectionNumber } = useSelector(state => state.section)
    const { pagedData } = useSelector(state => state.search)
    const { favPagedData } = useSelector(state => state.favourites)

    // Memorizza i formati di file selezionati
    const [filesFormat, setFilesFormat] = useState({
        csv: true,
        pdf: false
    })

    // Imposto il nome del richiedente
    // Esso indicato da un numero in lastCall e col valore in searchValues di userProfile
    const { pa } = useSelector(state => state.lastCall);
    const searchValues = useSelector((state) => state.userProfile.searchValues);
    const [applicant, setApplicant] = useState(null);
    useEffect(() => {
        if (pa && searchValues) {
            setApplicant(searchValues.applicants[pa - 1].name)
        }
    }, [pa, searchValues])

    // Funzione per generare i dati
    const getDataToExport = () => {
        const referenceData = sectionNumber === 0 ? [...pagedData] : [...favPagedData];
        const flatReferenceData = referenceData.map(page => page.map(document => {
            return [
                document.familyid,
                document.doc_num,
                applicant,
                document.invention_title,
                getFormattedDocDate(document.date)
            ]
        })).flat();
        return flatReferenceData
            .filter(document => selectedDocuments.includes(document[0]))
            .map((element, index) => {
                const dataRow = [...element];
                dataRow[0] = index + 1
                return dataRow;
            })
    }

    // Gestisco l'esportazione in csv
    const handleCsvExport = () => {
        const dataToExport = getDataToExport();
        const headers = ['Id', 'N. documento', 'Richiedente', 'Titolo', 'Data'];
        const csvContent = [
            headers,
            ...dataToExport
        ].map(row => row.map(value => `"${value}"`) // la trasformazione del value viene introdotta per evitare problemi coi caratteri speciali
            .join(',')) // Il primo join crea le righe come stringa degli elementi uniti
            .join('\n'); // Il secondo join unisce le righe in una unica stringa andando a capo

        // Creazione del blob e download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        // Genero il nome del file con la data
        const timestamp = getFormattedDate();
        link.download = `pat-to-date-export_${timestamp}.csv`;
        document.body.appendChild(link);
        link.click(); // Simula il click sull'elemento creato
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Rilascia l'oggetto blob dall'url
    }

    // Gestisco l'esportazione in pdf
    const handlePdfExport = () => {
        const dataToExport = getDataToExport();
        const headers = ['Id', 'N. documento', 'Richiedente', 'Titolo', 'Data'];
        const doc = new jsPDF({ orientation: 'landscape' }); // Utilizzo la libreria jspdf per l'esportazione in pdf

        // Titolo PDF
        doc.setFontSize(18);
        doc.text('Documenti Selezionati', 20, 20);
        console.log('dataToExport: ', dataToExport)

        // Genero la tabella con la libreria jsodf-autotable
        doc.autoTable({
            head: [headers],
            body: dataToExport,
            startY: 30, // Posizione iniziale della tabella
            theme: 'grid', // Stile della tabella ('striped', 'grid', 'plain')
            headStyles: { fillColor: [115, 115, 115] }, // colore intestazioni
            styles: { fontSize: 7 }
        })

        // Scarico pdf
        const timestamp = getFormattedDate();
        doc.save(`pat-to-date-export_${timestamp}.pdf`);
    };

    // Funzion principale per richiamare quelle delle esportazioni
    const handleExport = () => {
        if (filesFormat.pdf) handlePdfExport();
        if (filesFormat.csv) handleCsvExport();
    }

    // Funzione per generare il timestamp per nominare il file
    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Mesi da 0 a 11
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}_${hours}${minutes}`;
    }

    // Funzione per formattare la data del documento
    function getFormattedDocDate(docDate) {
        if (!docDate || !/^\d{8}$/.test(docDate)) {
            return "-";
        }
        const year = docDate.substring(0, 4);
        const month = docDate.substring(4, 6);
        const day = docDate.substring(6, 8);
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="fixed bottom-4 right-8 flex items-center gap-2 bg-red-800 w-fit py-2 px-4 rounded-xl z-10">
            <div className="flex flex-col gap-3 items-center">

                {/* Formato */}
                <div className="flex gap-2 items-center">
                    <div className="text-white text-sm">Formato:</div>
                    <div className="flex text-sm">
                        <div className="flex gap-2 py-1 px-2 rounded">
                            <input type="checkbox" id="csv" defaultChecked onChange={(e) => setFilesFormat({ ...filesFormat, csv: e.target.checked })} />
                            <label htmlFor="csv" className="text-white">csv</label>
                        </div>
                        <div className="flex gap-2 py-1 px-2 rounded">
                            <input type="checkbox" id="pdf" onChange={(e) => setFilesFormat({ ...filesFormat, pdf: e.target.checked })} />
                            <label htmlFor="pdf" className="text-white">pdf</label>
                        </div>
                    </div>
                </div>
                {/* Esporta */}
                <div className="flex gap-2 items-center">
                    {(filesFormat.pdf || filesFormat.csv) && <button className="bg-white py-2 px-4 rounded-xl hover:bg-red-50 w-fit" onClick={handleExport} >Esporta</button>}
                    {(!filesFormat.pdf && !filesFormat.csv) && <button className="bg-white text-stone-300 py-2 px-4 rounded-xl w-fit cursor-auto" >Esporta</button>}
                    <div className="text-white fon">n. <span className="font-bold">{selectedDocuments.length}</span> element<span>{selectedDocuments.length === 1 ? 'o' : 'i'}</span></div>
                </div>

            </div>
        </div>
    )
}

export default ExportModal