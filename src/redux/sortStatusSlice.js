import { createSlice } from "@reduxjs/toolkit";

const sortStatusSlice = createSlice({
    name: 'sort',
    initialState: {
        key: null,
        reverse: false
    },
    reducers: {
        setSort: (state, action) => {
            state.key = action.payload.key;
            state.reverse = action.payload.reverse;
        }
    }
})

export const { setSort } = sortStatusSlice.actions;
export default sortStatusSlice.reducer;