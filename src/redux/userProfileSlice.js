import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUserProfile = createAsyncThunk(
    'user/Profiler',
    async ({ token }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/userprofile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const userProfile = await response.json();
                return userProfile;
            } else {
                const loginError = await response.json();
                console.log('redux loginError: ', loginError);
                throw new Error(loginError.message);
            }
        } catch (error) {
            console.error('Catch error: ', error)
            throw error;
        }
    }
)

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState: {
        fetchStatus: 'idle',
        error: null,
        userInfo: null,
        searchValues: null,
        bmfolders: null
    },
    reducers: {},
    extraReducers: {
        [getUserProfile.pending]: (state) => {
            state.fetchStatus = 'pending';
        },
        [getUserProfile.fulfilled]: (state, action) => {
            state.userInfo = action.payload[0].userinfo;
            state.searchValues = action.payload[0].searchvalues;
            state.bmfolders = action.payload[0].bmfolders;
            state.fetchStatus = 'succeeded'
        },
        [getUserProfile.rejected]: (state, action) => {
            state.error = action.error.message;
            state.fetchStatus = 'error'
        }
    }

})

export default userProfileSlice.reducer;