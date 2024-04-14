import { createSlice } from '@reduxjs/toolkit'

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
            console.log('action.payload: ', action.payload)
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