import { createSlice } from '@reduxjs/toolkit'

// Questo slice, gestito dalla SearchBar, memorizza i parametri dell'ultima chiamata, permettendo di averli a disposizione nel ritorno in homepage
// ad ogni ritorno in hompage, se needLastCall è true, la SearchBar rieffettua la chiamata.
const lastCallSlice = createSlice({
    name: 'lastCall',
    initialState: {
        needLastCall: false,
        pa: '',
        tecarea: '',
        doc_num: '',
        pdfrom: '',
        pdto: ''
    },
    reducers: {
        setLastCall: (state, action) => {
            state.pa = action.payload.pa;
            state.tecarea = action.payload.tecarea;
            state.doc_num = action.payload.doc_num;
            state.pdfrom = action.payload.pdfrom;
            state.pdto = action.payload.pdto;
        },
        setNeedTrue: (state) => {
            state.needLastCall = true;
        },
        setNeedFalse: (state) => {
            state.needLastCall = false;
        }
    }
})

export const { setLastCall, setNeedTrue, setNeedFalse } = lastCallSlice.actions;
export default lastCallSlice.reducer;