import { createSlice } from "@reduxjs/toolkit";
import sectionSlice from "./sectionSlice";

const selectedSlice = createSlice({
    name: 'selected',
    initialState: {
        selectedDocuments: []
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
            state.selectedDocuments = []
        }
    }
})

export const { addDocuments, removeDocument, removeAllDocuments } = selectedSlice.actions;
export default selectedSlice.reducer;