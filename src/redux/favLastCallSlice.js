import { createSlice } from "@reduxjs/toolkit";

const favLastCallSlice = createSlice({
    name: 'favLastCall',
    initialState: {
        favNeedLastCall: false,
        doc_num: '',
        pdfrom: '',
        pdto: ''
    },
    reducers: {
        setFavLastCall:(state, action) => {
            state.doc_num = action.payload.doc_num;
            state.pdfrom = action.payload.pdfrom;
            state.pdto = action.payload.pdto;
        },
        setFavNeedTrue: state => {
            state.favNeedLastCall = true;
        },
        setFavNeedFalse: state => {
            state.favNeedLastCall = false;
        }
    }
})

export const {setFavLastCall} = favLastCallSlice.actions;
export default favLastCallSlice.reducer;