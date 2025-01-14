import { createSlice } from "@reduxjs/toolkit";
import sectionSlice from "./sectionSlice";

const selectedSlice = createSlice({
    name: 'selected',
    initialState: {
        selectedDocuments: []
    },
    reducers: {
        addDocument: (state, action) => {
            if (!state.selectedDocuments.includes(action.payload)) {
                state.selectedDocuments.push(action.payload)
            }
        },
        removeDocument: (state, action) => {
            state.selectedDocuments = state.selectedDocuments.filter(element => element !== action.payload)
        }
    }
})

export const {addDocument, removeDocument} = selectedSlice.actions;
export default selectedSlice.reducer;