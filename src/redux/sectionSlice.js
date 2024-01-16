import { createSlice } from "@reduxjs/toolkit";

const sectionSlice = createSlice({
    name: 'section',
    initialState: {
        sectionNumber: 0
    },
    reducers: {
        setSection: (state, action) => {
            state.sectionNumber = action.payload;
        }
    }
})

export const { setSection } = sectionSlice.actions;
export default sectionSlice.reducer;