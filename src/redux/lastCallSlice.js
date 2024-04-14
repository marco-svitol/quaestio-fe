import { createSlice } from '@reduxjs/toolkit'

// Questo slice gestisce il ritorno in homepage, memorizzando i parametri dell'ultima chiamata,
// reimpostandoli in SearchBar e, se richiesto, rieffettuando la chiamata
const lastCallSlice = createSlice({
    name: 'lastCall',
    initialState: {
        needLastCall: false,
        getLastSearch: false,
        pa: '',
        tecarea: '',
        doc_num: '',
        pdfrom: '',
        pdto: ''
    },
    reducers: {
        setLastCall: (state, action) => {
            console.log('action.payload: ', action.payload)
            state.pa = action.payload.pa;
            state.tecarea = action.payload.tecarea;
            state.doc_num = action.payload.doc_num;
            state.pdfrom = action.payload.pdfrom;
            state.pdto = action.payload.pdto;
        },
        setNeedTrue: (state, action) => {
            state.needLastCall = true;
            state.getLastSearch = action.payload;
        },
        setNeedFalse: (state, action) => {
            state.needLastCall = false;
            state.getLastSearch = false;
        }
    }
})

export const { setLastCall, setNeedTrue, setNeedFalse } = lastCallSlice.actions;
export default lastCallSlice.reducer;