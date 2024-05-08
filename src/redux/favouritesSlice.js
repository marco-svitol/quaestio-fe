import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dataPagination } from "./paginationFunction";
import { sortArray } from "./paginationFunction";

export const getFavourites = createAsyncThunk(
    'favourites/favSearch',
    async ({ favouritesData, token, sort }) => {
        console.log('sort: ', sort);
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/v2/searchbookmark?doc_num=${favouritesData.doc_num}&pdfrom=${favouritesData.pdfrom}&pdto=${favouritesData.pdto}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const favourites = await response.json();
                return {favourites, sort};
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
        favCategorizedPagedData: null,
        favPage: null
    },
    reducers: {
        setFavPage: (state, action) => {
            state.favPage = action.payload;
        },
        sortFavourites: (state, action) => {
            let flatData;
            if (action.payload.category) {
                flatData = state.favCategorizedPagedData.flat();
            } else {
                flatData = state.favPagedData.flat();
            }
            const sortedData = sortArray(flatData, action.payload.key, action.payload.reverse);
            // impagino
            const favPagedData = dataPagination(sortedData, 8);
            if (action.payload.category) {
                state.favCategorizedPagedData = favPagedData
            } else {
                state.favPagedData = favPagedData;
            }
            state.page = 1;
        },
        getCategory: (state, action) => {
            const flatData = state.favPagedData.flat();
            const categoryFavourites = flatData.filter(element => element.bmfolderid === action.payload);

            // Impagino
            const favCategorizedPagedData = dataPagination(categoryFavourites, 8);
            state.favCategorizedPagedData = favCategorizedPagedData;
            state.page = 1;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFavourites.pending, (state) => {
                state.favFetchStatus = 'pending'
            })
            .addCase(getFavourites.fulfilled, (state, action) => {
                state.favError = null;
                const favourites = action.payload.favourites;
                const sort = action.payload.sort;
                // Sorto solo se il sortStatus è settato
                let sortedFavourites = favourites;
                if(sort.key) {
                    sortedFavourites = sortArray(favourites, sort.key, sort.reverse)
                }
                // Impagino
                if(favourites !== '{}') {
                    state.favPagedData = dataPagination(sortedFavourites, 8);
                    state.favPage = 1;
                }
                state.favFetchStatus = 'idle';
            })
            .addCase(getFavourites.rejected, (state, action) => {
                state.error = action.error.message;
                state.favFetchStatus = 'error';
            })
    }
})

export const { setFavPage, updateFavourite, sortFavourites, getCategory } = favouritesSlice.actions;
export default favouritesSlice.reducer;