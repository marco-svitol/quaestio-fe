import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataPagination } from "./paginationFunction";
import ConsoleLog from "../components/ConsoleLog";

export const getFavourites = createAsyncThunk(
    'favourites/favSearch',
    async ({ favouritesData, token }) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/searchbookmark?doc_num=${favouritesData.doc_num}&pdfrom=${favouritesData.pdfrom}&pdto=${favouritesData.pdto}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const favourites = await response.json();
                return favourites;
            } else {
                const favError = await response.json();
                console.log('Fetch error: ', favError)
                throw favError;
            }
        } catch (error) {
            console.log('Catch error: ', error)
            throw error;
        }
    }
)

const favouritesSlice = createSlice({
    name: 'favourites',
    initialState: {
        favFetchStatus: 'idle',
        favError: null,
        favPagedData: null,
        favPage: null
    },
    reducers: {
        setFavPage: (state, action) => {
            state.favPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFavourites.pending, (state) => {
                state.favFetchStatus = 'pending'
            })
            .addCase(getFavourites.fulfilled, (state, action) => {
                console.log('favourites: ', action.payload)
                state.favError = null;
                state.favPagedData = dataPagination(action.payload, 8);
                state.favPage = 1;
                state.favFetchStatus = 'succeeded';
                console.log('favPagedData: ', state.favPagedData);
            })
            .addCase(getFavourites.rejected, (state, action) => {
                state.error = action.error.message;
                state.favFetchStatus = 'error';
            })
    }
})

export const { setFavPage, updateFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;