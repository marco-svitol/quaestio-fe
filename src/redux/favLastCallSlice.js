import { createSlice } from "@reduxjs/toolkit";

const favLastCallSlice = createSlice({
    name: 'favLastCall',
    initialState: {
        needFavLastCall: false,
        doc_num: '',
        pdfrom: '',
        pdto: ''
    },
    reducers: {
        setFavLastCall:(state, action) => {
            state.doc_num = action.payload.doc_num;
            state.pdfrom = action.payload.pdfrmo;
            state.pdto = action.payload.pdto;
        },
        setFavNeedTrue: state => {
            state.needFavLastCall = true;
        },
        setFavNeedFalse: state => {
            state.needFavLastCall = false;
        }
    }
})

export const {setFavLastCall} = favLastCallSlice.actions;
export default favLastCallSlice.reducer;