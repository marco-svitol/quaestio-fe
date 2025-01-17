import { createSlice } from "@reduxjs/toolkit";
import sectionSlice from "./sectionSlice";

const selectedSlice = createSlice({
    name: 'selected',
    initialState: {
        selectedDocuments: [],
        lastChecked: null, // Questo stato serve per rilevare il click di partenza per le selezioni multiple (con tasto shift),
        isShiftPressed: false, // Indica se il tasto SHIFT è premuto
    },
    reducers: {
        addDocuments: (state, action) => { // Riceve sempre un array. Per aggiungere un solo elemento deve arrivare un array contenente l'elemento (non un elemento singolo)
            const newArray = action.payload;
            newArray.forEach(element => {
                if (!state.selectedDocuments.includes(element)) {
                    state.selectedDocuments.push(element)
                }
            });
        },
        removeDocument: (state, action) => {
            state.selectedDocuments = state.selectedDocuments.filter(element => element !== action.payload)
        },
        removeAllDocuments: (state) => { // Questo reducers viene chiamato da: approdo in DataPanel, approdo in FavDataPanel e avvio di ogni ricerca
            state.selectedDocuments = [];
            state.lastChecked = null; // Questo serve ad eliminare il documento di partenza per la selezione multipla (shift)
        },
        setLastChecked: (state, action) => {
            state.lastChecked = action.payload
        },
        setIsShiftPressed: (state, action) => { // Questo reducer viene chiamato da Homepage (tasto SHIFT)
            state.isShiftPressed = action.payload
        }
    }
})

export const { addDocuments, removeDocument, removeAllDocuments, setLastChecked, setIsShiftPressed } = selectedSlice.actions;
export default selectedSlice.reducer;