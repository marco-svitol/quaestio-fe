import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        isLogged: false,
        user: null,
        token: null
    },
    reducers: {
        getLoggedByAuth0: (state, action) => {
            state.isLogged = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        getUnloggedByAuth0: (state) => {
            state.isLogged = false;
            state.user = null;
            state.token = null;
        }
    },
    extraReducers: {}
})

export const { getLoggedByAuth0, getUnloggedByAuth0} = loginSlice.actions;
export default loginSlice.reducer;